import { Routes } from '@angular/router';

import { DashboardComponent } from './views/dashboard/dashboard.component';
import { LoginComponent } from './views/login/login.component';

import { AuthGuardService } from './services/auth-guard.service';

export const routes: Routes = [
	{
		path: '',
		component: LoginComponent
	},
	{
		path: 'dashboard',
		canActivate: [AuthGuardService],
		children: [
			{ path: '', component: DashboardComponent },
			{ path: 'map', component: DashboardComponent, data: {view: 'map'} },
			{ path: 'people', component: DashboardComponent, data: {view: 'people'} },
			{ path: 'stations', component: DashboardComponent, data: {view: 'stations'} },
			{ path: 'alerts', component: DashboardComponent, data: {view: 'alerts'} },
		]
	}
];