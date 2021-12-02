import { NavController } from '@ionic/angular';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { mapUserBackToUserFront, User } from 'libs/user';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private route: Router,
    public navCtrl: NavController
  ) {}

  login(user: Partial<User>, model, platform, version): Observable<any> {
    return this.http
      .post(
        environment.AUTH_API + 'user/authenticate',
        {
          userName: user.userName,
          password: user.password,
          model: model,
          platform: platform,
          version: version,
        },
        httpOptions
      )
      .pipe(
        map((res: any) => {
          if (res.status) {
            return {
              user: mapUserBackToUserFront(res),
              token: res.accessToken,
            };
          } else return res;
        })
      );
  }

  loginOauth(strategy: string): Observable<any> {
    return this.http.get(
      environment.AUTH_API + `user/authenticate/${strategy}`,
      httpOptions
    );
  }

  logOut() {
    localStorage.clear();
    this.navCtrl.navigateRoot('/login');
  }

  register(user: Partial<User>, model, platform, version): Observable<any> {
    return this.http
      .post(
        environment.AUTH_API + 'user/register',
        {
          userName: user.userName,
          email: user.email,
          password: user.password,
          lastName: user.lastName,
          firstName: user.firstName,
          model: model,
          platform: platform,
          version: version,
        },
        httpOptions
      )
      .pipe(
        map((res: any) => {
          if (res.status) {
            return {
              user: mapUserBackToUserFront(res),
              token: res.accessToken,
            };
          } else return res;
        })
      );
  }

  saveToken(token: string): void {
    window.localStorage.removeItem('auth-token');
    window.localStorage.setItem('auth-token', token);
  }

  getToken(): string | null {
    return window.localStorage.getItem('auth-token');
  }

  saveUser(user: any): void {
    user.picture = undefined;
    user.password = undefined;

    window.localStorage.removeItem('auth-user');

    window.localStorage.setItem('auth-user', JSON.stringify(user));
  }

  saveDelegation(token: string, userId: string, userName: string): void {
    const tmp = JSON.parse(window.localStorage.getItem('delegation'));
    if (tmp === null) {
      window.localStorage.setItem(
        'delegation',
        JSON.stringify([{ token, userId, userName }])
      );
    } else {
      tmp.push({ token, userId, userName });
      window.localStorage.setItem('delegation', JSON.stringify(tmp));
    }
  }

  getDelegation(): string | null {
    return window.localStorage.getItem('delegation');
  }

  savePlayerId(device?: any): void {
    if (device) {
      window.localStorage.setItem('playerId', JSON.stringify(device));
    } else {
      window.localStorage.removeItem('playerId');
    }
  }

  getPlayerId(): any | null {
    return JSON.parse(window.localStorage.getItem('playerId'));
  }

  getUser(): User {
    const user = window.localStorage.getItem('auth-user');
    if (user) {
      return JSON.parse(user);
    }

    return undefined;
  }

  checkIfUserCo(): Observable<any> {
    return this.http.get(environment.AUTH_API + 'token', {
      responseType: 'text',
    });
  }

  forgotPass_s(email: string): Observable<any> {
    return this.http.post(
      environment.AUTH_API + 'forgotPass',
      {
        email: email,
      },
      httpOptions
    );
  }

  forgotPass_c(email: String, password: String, rand: Number): Observable<any> {
    return this.http.put(
      environment.AUTH_API + 'changePass',
      {
        email: email,
        password: password,
        rand: rand,
      },
      httpOptions
    );
  }

  sendMailVerify(email: string): Observable<any> {
    return this.http.post(
      environment.AUTH_API + 'verify-email',
      {
        email: email,
      },
      httpOptions
    );
  }

  deleteAccount(userId: string) {
    return this.http.delete(
      environment.AUTH_API + `user/${userId}`,
      httpOptions
    );
  }
}
