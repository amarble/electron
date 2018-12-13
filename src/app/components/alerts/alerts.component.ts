import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { switchMap, take, filter } from 'rxjs/operators';

import { StateService } from '../../services/state.service';
import { AlertSeverity, AlertType } from '../../models/alert-type';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
})
export class AlertsComponent implements OnInit {
	
  tableSource = [];
  alerts = [];
  columns = ['name', 'username', 'issued', 'resolved', 'actions'];

  constructor(private router: Router, private stateService: StateService) { }

  ngOnInit() {
	  combineLatest(
		this.stateService.read('user'),
		this.stateService.read('location'),
		this.stateService.read('userLocation'),
		this.stateService.read('alert'),
		this.stateService.read('alertType').pipe(filter(l => l.length > 0))
	  ).subscribe(([
		users,
		locations,
		userLocations,
		alerts,
		alertTypes
	  ]) => {
		this.alerts = alerts;
		this.tableSource = alerts.map(a => {
			return {
				id: a.id,
				type: alertTypes.find(type => type.id === a.typeId),
				name: alertTypes.find(type => type.id === a.typeId).name,
				userId: a.userId,
				user: users.find(u => u.id === a.userId),
				issued: a.issued,
				resolved: a.resolved
			};
		});  
	  });
  }
  
  isUrgent(type: AlertType) {
	  return type.severity === AlertSeverity.Urgent;
  }
  
  markAsResolved(id: number) {
	  const item = this.alerts.find(a => a.id === id);
	  item.resolved = new Date();
	  this.stateService.update('alert', item).subscribe(res => {
		  console.log('Update', res);
	  });
  }
  
  showOnMap(id: number) {
	const alertMatch = this.alerts.find(a => a.id === id);
	this.stateService.deleteAll('mapHighlights', {});
	this.stateService.create('mapHighlights', {show: 'user', id: alertMatch.userId}).pipe(
		take(1)
	 ).subscribe(res => {
		this.router.navigate(['dashboard/map']);
	});
  }

}
