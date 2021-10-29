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
export class UserService {
  constructor(private http: HttpClient, private route: Router) {}

  getUser(userId: string): Observable<any> {
    return this.http.get(environment.AUTH_API + `user/${userId}`, httpOptions);
  }

  searchUser(name: string): Observable<any> {
    return this.http.get(
      environment.AUTH_API + `user?search=${name}`,
      httpOptions
    );
  }

  checkUsername(userId: string, userName: string): Observable<any> {
    return this.http.get(
      environment.AUTH_API +
        `user/${userId}/check-username?userName=${userName}`,
      httpOptions
    );
  }

  updateUser(user: User) {
    console.log(user.id);
    return this.http.put(
      environment.AUTH_API + `user/${user.id}`,
      { user },
      httpOptions
    );
  }

  updatePicture(picture: FormData, userId: string) {
    const httpOptionsPicture = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        Accept: 'application/x-www-form-urlencoded',
      }),
    };

    return this.http.post(
      environment.AUTH_API + `user/${userId}/update-picture`,
      picture
    );
  }

  updateUserAccount(userId: string) {

  }
}
