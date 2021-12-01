import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  constructor(private http: HttpClient, private route: Router) {}

  getFriends(userId: string): Observable<any> {
    return this.http.get(environment.AUTH_API + `user/${userId}/friends`, httpOptions);
  }

  deleteFriends(userId: string, friendId: string) {
    return this.http.delete<any>(
      environment.AUTH_API + `user/${userId}/friends/${friendId}`,
      httpOptions
    );
  }

  inviteFriends(userId: string, friendId: string) {
    return this.http.post(
      environment.AUTH_API + `user/${userId}/friends/${friendId}/invite`,
      {
        userId: userId,
        friendId: friendId,
      },
      httpOptions
    );
  }

  acceptFriends(userId: string, friendId: string) {
    return this.http.post(
      environment.AUTH_API + `user/${userId}/friends/${friendId}/acceptInvitation`,
      {
        userId: userId,
        friendId: friendId,
      },
      httpOptions
    );
  }
}
