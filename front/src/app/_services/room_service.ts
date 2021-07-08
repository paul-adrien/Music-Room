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
export class RoomService {
  constructor(
    private http: HttpClient,
    private route: Router,
    public navCtrl: NavController
  ) {}

  createRoom(user: Partial<User>, name: string): Observable<any> {
    return this.http.post(
      environment.AUTH_API + `room`,
      {
        name: name,
      },
      httpOptions
    );
  }

  getRoom(roomId: string): Observable<any> {
    return this.http.get(environment.AUTH_API + `room/${roomId}`, httpOptions);
  }

  getAllRoom(): Observable<any> {
    return this.http.get(environment.AUTH_API + `room`, httpOptions);
  }
}
