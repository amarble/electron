import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { StateService } from '../../services/state.service';

import { User } from '../../models/user';
import { Location } from '../../models/location';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html'
})
export class LocationsComponent implements OnInit {
	
  people: User[] = [];
  locations: Location[] = [];
  unassignedUserIds: number[] = [];
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
		const assignedIds = userLocations.map(location => location.user);
		this.unassignedUserIds = this.people
			.map(user => user.id)
			.filter(id => !assignedIds.includes(id));
		this.tableSource = locations.map(location => {
			const userMatch = userLocations.find(loc => loc.location === location.id);
			const userId = userMatch ? userMatch.user : 0;
			return {
				id: location.id,
				name: location.name,
				user: userId
			};
		});
	  });
  }
  
  assignStaff(selectChange, locationId: number) {
	  const userId = selectChange.value;
	  this.stateService.delete('userLocation', {location: locationId}).pipe(
		take(1),
		switchMap(res => {
			if (userId) {
				return this.stateService.create('userLocation', {user: userId, location: locationId});
			} else {
				return of(res);
			}
		})
	  ).subscribe(res => {
		  console.log('Assign', res);
	  });
  }
  
  getAvailableUsersForLocation(locationEntry) {
	  const ids = locationEntry.user ? this.unassignedUserIds.concat(locationEntry.user) : this.unassignedUserIds;
	  return this.people.filter(user => ids.includes(user.id));
  }

}
