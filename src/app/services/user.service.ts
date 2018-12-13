import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	
  state: BehaviorSubject<User[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {
	this.http.get('assets/users.json').subscribe((res: User[]) => this.state.next(res));
  }
  
}
