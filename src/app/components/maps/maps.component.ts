import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest } from 'rxjs';

import { AlertSeverity } from '../../models/alert-type';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html'
})
export class MapsComponent implements OnInit {

  lat = 47.4425;
  lon = -122.301;
  zoom = 16;
  userLocations = [];
  alertTypes = [];

  constructor(private stateService: StateService) { }

  ngOnInit() {
	  combineLatest(
	    this.stateService.read('user'),
		this.stateService.read('location'),
		this.stateService.read('userLocation'),
		this.stateService.read('mapHighlights'),
		this.stateService.read('alert'),
		this.stateService.read('alertType')
	  ).subscribe(([user, location, userLocation, highlights, alerts, alertTypes]) => {
		  this.alertTypes = alertTypes;
		  this.userLocations = userLocation.map(ul => {
			  return {
				  user: user.find(u => u.id === ul.user),
				  location: location.find(l => l.id === ul.location),
				  alerts: alerts.filter(a => a.userId === ul.user),
				  open: !!highlights.find(highlight => {
					switch (highlight.show) {
					  case 'user':
					  default:
						return ul.user === highlight.id;
					}
				  })
			  };
		  });
	  });
  }
  
  activeAlerts(alerts) {
	  return alerts.filter(a => !a.resolved);
  }
  
  ngOnDestroy() {
	  this.stateService.deleteAll('mapHighlights', {}).subscribe(() => {
		  console.log('Deleted');
	  });
  }
  
  getAlertColor(typeId: number) {
	  const severity = this.alertTypes.find(at => at.id === typeId).severity;
	  return severity === AlertSeverity.Urgent ? 'crimson' : 'darkorange';
  }
  
  getAlertType(typeId: number) {
	  return this.alertTypes.find(at => at.id === typeId).name;
  }

}
