import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth_service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authenticationService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let res: boolean;

    return this.authenticationService
      .checkIfUserCo()
      .toPromise()
      .then(
        (data) => {
          const user = this.authenticationService.getUser();
          if (JSON.parse(data)['status'] === true && user) {
            if (user.validEmail) {
              return true;
            } else {
              this.router.navigate(['/verify-email']);
            }
          } else {
            this.authenticationService.logOut();
            return false;
          }
        },
        (err) => {
          this.authenticationService.logOut();
          return false;
        }
      );
  }
}
