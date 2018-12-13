import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatTableModule } from '@angular/material';

import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';

import { routes } from './routes';

import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { MapsComponent } from './components/maps/maps.component';
import { PeopleComponent } from './components/people/people.component';
import { LocationsComponent } from './components/locations/locations.component';
import { AlertsComponent } from './components/alerts/alerts.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    MapsComponent,
    PeopleComponent,
    LocationsComponent,
    AlertsComponent
  ],
  imports: [
    BrowserModule,
	FormsModule,
	HttpClientModule,
	RouterModule.forRoot(routes),
	AgmCoreModule.forRoot({apiKey: 'AIzaSyDnHpBaf0BaMSDB6dLsALhKYpZFhXFUlFQ'}),
	BrowserAnimationsModule,
	MatButtonModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatSelectModule,
	MatSnackBarModule,
	MatTableModule,
  ],
  exports: [
	MatButtonModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatSelectModule,
	MatSnackBarModule,
	MatTableModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
