import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	
  users: User[] = [];

  constructor(private http: HttpClient) { 
  	this.http.get('assets/users.json').subscribe((res: User[]) => this.users = res);
  }
  
  login(login: string, password: string) {
	  if (!login || !password) {
		  return '';
	  }
	  const user = this.users.find(u => u.login === login && u.password === password);
	  if (user) {
		  return 'TOKEN';
	  } else {
		  return '';
	  }
  }
}
