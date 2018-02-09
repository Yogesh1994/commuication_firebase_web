import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { LocalStorageService } from 'angular-2-local-storage';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public router: Router, public storage: LocalStorageService, public fireAuth: AngularFireAuth) { }
  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.storage.get('loggedIn')) {
      return true;
    }else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
