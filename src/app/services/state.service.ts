import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, NEVER, of, timer } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AlertType, AlertSeverity } from '../models/alert-type';

import { AlertTypeService } from './alert-type.service';
import { LocationService } from './location.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class StateService {
	
  private internalState: any = {			
	alertType: [],
	alert: [],
	location: [],
	user: [],
	userLocation: [],
	mapHighlights: []
  };
  state: BehaviorSubject<any> = new BehaviorSubject(this.internalState);
  
  private internalAuth = {token: null, authorized: false, expire: 0};
  auth: BehaviorSubject<any> = new BehaviorSubject(this.internalAuth);

  constructor(
	private alertTypeService: AlertTypeService,
	private locationService: LocationService,
	private userService: UserService,
	private router: Router
  ) { 
	this.auth.pipe(
		switchMap(auth => {
			if (auth.expire) {
				return timer(auth.expire);
			} else {
				return NEVER;
			}
		})
	).subscribe(() => {
		console.log('REVOKE');
		this.revokeAuth();
	});
	combineLatest(
		this.alertTypeService.state.pipe(filter(i => i.length > 0)),
		this.locationService.state.pipe(filter(i => i.length > 0)),
		this.userService.state.pipe(filter(i => i.length > 0))
	).subscribe(([
		alertType,
		location,
		user
	]) => {
		// Randomly assign some users to locations for purpose of demonstration
		const randUsers = this.randArray(user.length).slice(0, 5).map(i => user[i]);
		const randLocs = this.randArray(location.length).slice(0, 5).map(i => location[i]);
		const userLocation = randUsers.map((randUser, i) => ({user: randUser.id, location: randLocs[i]['id']}));
		
		// Randomly generate low level alerts for purpose of demonstration
		const lowLevelAlertTypes = alertType.filter(at => at.severity < AlertSeverity.Urgent);
		const randAlertTypes = this.randArray(lowLevelAlertTypes.length).slice(0, 2).map(i => lowLevelAlertTypes[i]);
		const randAlerts = randAlertTypes.map((randType, i) => {
			const date = new Date();
			date.setHours(date.getHours() - i);
			return {id: i + 1, typeId: randType.id, userId: randUsers[i]['id'], issued: date , resolved: null};
		});		
		
		// Add an urgent alert at a random point between 100 and 200 seconds
		timer(100000 + Math.floor(Math.random() * 100000)).subscribe(() => {
			const validUsers = user.filter(u => this.internalState.userLocation.map(ul => ul.user).includes(u.id));
			const randUser = validUsers[Math.floor(Math.random() * validUsers.length)];
			const urgentType = alertType.find(at => at.severity === AlertSeverity.Urgent);
			const urgent = {id: this.internalState.alert.length + 1, typeId: urgentType.id, userId: randUser.id, issued: new Date(), resolved: null};
			this.internalState.alert.push(urgent);
			this.state.next(this.internalState);
		});
		
		this.internalState = {
			alertType: alertType,
			alert: randAlerts,
			location: location,
			user: user,
			userLocation: userLocation,
			mapHighlights: []
		};
		this.state.next(this.internalState);
	})
  }
  
  create(from: string, item) {
	  this.internalState[from].push(item);
	  this.state.next(this.internalState);
	  return of(true);
  }
  
  delete(from: string, match) {
	  const target = this.internalState[from];
	  if (!target) {
		  return of(false);
	  }
	  const idx = target.findIndex(item => {
		  return Object.keys(match).reduce((result, key) => {
			  return match[key] === item[key];
		  }, true);
	  });
	  if (idx < 0) {
		  return of(false);
	  }
	  target.splice(idx, 1);
	  this.state.next(this.internalState);
	  return of (true);
  }
  
  deleteAll(from: string, match) {
	  const target = this.internalState[from];
	  if (!target) {
		  return of(false);
	  }
	  const filtered = target.filter(item => {
		  return !Object.keys(match).reduce((result, key) => {
			  return match[key] === item[key];
		  }, true);
	  });
	  this.internalState[from] = filtered;
	  this.state.next(this.internalState);
	  return of (true);
  }
  
  read(from: string, match = {}) {
	  return this.state.pipe(
		map(state => state[from].filter(item => {
			return Object.keys(match).reduce((result, key) => {
				return match[key] === item[key];
			}, true);
		})),
	  );
  }
  
  refreshAuth() {
	this.auth.next(this.internalAuth);
  }
  
  revokeAuth() {
	this.internalAuth = {token: null, authorized: false, expire: 0};
	this.auth.next(this.internalAuth);
	this.router.navigate(['']);
  }
  
  setAuth(token: string) {
	this.internalAuth = {token: token, authorized: true, expire: 6000000};
	this.auth.next(this.internalAuth);
  }
  
  update(from: string, match) {
	  const target = this.internalState[from];
	  if (!target) {
		  return of(false);
	  }
	  const idx = target.findIndex(item => {
		  return item.id === match.id;
	  });
	  if (idx < 0) {
		  return of(false);
	  }
	  target[idx] = match;
	  this.state.next(this.internalState);
	  return of (true);
  }
  
  private randArray(size: number) {
	  const arr = Array.from(Array(size).keys());
	  let curIdx = arr.length;
	  let tempVal, randIdx;
	  
	  while (0 !== curIdx) {
		  randIdx = Math.floor(Math.random() * curIdx);
		  curIdx -= 1;
		  
		  tempVal = arr[curIdx];
		  arr[curIdx] = arr[randIdx];
		  arr[randIdx] = tempVal;
	  }
	  
	  return arr;
  }
}
