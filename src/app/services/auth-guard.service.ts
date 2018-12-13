import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { map, tap } from 'rxjs/operators';

import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router, private stateService: StateService) { }

  canActivate() {
	  return this.stateService.auth.pipe(
		tap(auth => {
			if (!auth.authorized) {
				this.router.navigate(['']);
			}
		}),
		map(auth => auth.authorized)
	  );
  }
  
}
