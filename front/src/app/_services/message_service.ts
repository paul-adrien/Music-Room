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
export class MessageService {
  constructor(private http: HttpClient) {}

  connection() {
    //this.socket.emit('chat message', 'test');
    // this.socket.on('chat message', function (msg) {
    // });
  }

  getConvList(userId: string): Observable<any> {
    return this.http.get(
      environment.AUTH_API + `user/${userId}/conversation`,
      httpOptions
    );
  }

  getConvDetail(userId: string, convId: string): Observable<any> {
    return this.http.get(
      environment.AUTH_API + `user/${userId}/conversation/${convId}`,
      httpOptions
    );
  }

  createConv(userId: string, name: string, users): Observable<any> {
    return this.http.post(
      environment.AUTH_API + `user/${userId}/conversation`,
      {
        name: name,
        users: users,
      },
      httpOptions
    );
  }

  sendMessage(
    userId: string,
    conversationId: string,
    message: string
  ): Observable<any> {
    return this.http.post(
      environment.AUTH_API +
        `user/${userId}/conversation/${conversationId}/message`,
      {
        message: message,
      },
      httpOptions
    );
  }
}
