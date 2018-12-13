import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { AlertType } from '../models/alert-type';

@Injectable({
  providedIn: 'root'
})
export class AlertTypeService {

  state: BehaviorSubject<AlertType[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
	this.http.get('assets/alert-types.json').subscribe((res: AlertType[]) => this.state.next(res));
  }
}
