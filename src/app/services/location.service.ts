import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Location } from '../models/location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
	
  state: BehaviorSubject<Location[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
	this.http.get('assets/locations.json').subscribe((res: Location[]) => this.state.next(res));
  }
  
}
