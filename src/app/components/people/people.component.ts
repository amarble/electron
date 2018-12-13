import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { StateService } from '../../services/state.service';

import { User } from '../../models/user';
import { Location } from '../../models/location';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html'
})
export class PeopleComponent implements OnInit {
	
  people: User[] = [];
  locations: Location[] = [];
  unassignedLocationIds: number[] = [];
  tableSource = [];
  columns = ['name', 'location', 'actions'];

  constructor(private router: Router, private stateService: StateService) { }

  ngOnInit() {
	  combineLatest(
		this.stateService.read('user'),
		this.stateService.read('location'),
		this.stateService.read('userLocation')
	  ).subscribe(([
		users,
		locations,
		userLocations
	  ]) => {
		this.people = users;
		this.locations = locations;
		const assignedIds = userLocations.map(location => location.location);
		this.unassignedLocationIds = this.locations
			.map(location => location.id)
			.filter(id => !assignedIds.includes(id));
		this.tableSource = users.map(user => {
			const locationMatch = userLocations.find(loc => loc.user === user.id);
			const locationId = locationMatch ? locationMatch.location : 0;
			return {
				id: user.id,
				name: user.name,
				location: locationId
			};
		});
	  });
  }
  
  assignLocation(selectChange, userId: number) {
	  const locationId = selectChange.value;
	  this.stateService.delete('userLocation', {user: userId}).pipe(
		take(1),
		switchMap(res => {
			if (locationId) {
				return this.stateService.create('userLocation', {user: userId, location: locationId});
			} else {
				return of(res);
			}
		})
	  ).subscribe(res => {
		  console.log('Assign', res);
	  });
  }
  
  getAvailableLocationsForUser(userEntry) {
	  const ids = userEntry.location ? this.unassignedLocationIds.concat(userEntry.location) : this.unassignedLocationIds;
	  return this.locations.filter(location => ids.includes(location.id));
  }
  
  showOnMap(userId: number) {
	  this.stateService.deleteAll('mapHighlights', {});
	  this.stateService.create('mapHighlights', {show: 'user', id: userId}).pipe(
		take(1)
	  ).subscribe(res => {
		 this.router.navigate(['dashboard/map']);
	  });
  }

}
