import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { AlertSeverity } from '../../models/alert-type';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
	
  views = ['alerts', 'people', 'stations', 'map'];
  selectedView = 'map';
  alertCount = 0;
  urgentAlertCount = 0;

  constructor(private snackBar: MatSnackBar, private stateService: StateService, private route: ActivatedRoute) { }

  ngOnInit() {
	  this.route.data.subscribe(data => {
		  console.log('DATA', data);
		  if (data.view) {
			  this.selectedView = data.view;
		  }
	  });
	  
	  this.stateService.read('alert').subscribe(alerts => {
		  this.alertCount = alerts.filter(a => !a.resolved).length;
		  const urgentAlerts = alerts.filter(a => !a.resolved && a.severity === AlertSeverity.Urgent);
		  // Should trigger when a new urgent alert is issued
		  if (urgentAlerts.count > this.urgentAlertCount) {
		    urgentAlerts.sort((a, b) => {
				return a.issued > b.issued;
			});
			const newAlert = urgentAlerts[0];
			this.snackBar.open('New urgent alert reported', 'View', { duration: 5000 });
		  }
		  this.urgentAlertCount = urgentAlerts.length;
	  });
	  
  }
  
  selectView(view: string) {
	  this.selectedView = view;
  }

}
