import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service'; 
import { StateService } from '../../services/state.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
	
  user = new User();
  error: string;

  constructor(private authService: AuthService, private router: Router, private stateService: StateService) {}

  ngOnInit() {
  }

  login() {
	  const token = this.authService.login(this.user.login, this.user.password);
	  console.log('token', token);
	  if (token) {
		this.stateService.setAuth(token);
		this.router.navigate(['dashboard']);
	  } else {
		this.error = 'Incorrect login/password';  
	  }
  } 
  
}
