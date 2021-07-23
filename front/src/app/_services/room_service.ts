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

  enterRoom(userId: string, roomId: string, deviceId: string) {
    return this.http.post<any>(
      environment.AUTH_API + `room/${roomId}/enterRoom`,
      {
        userId: userId,
        deviceId: deviceId,
      },
      httpOptions
    );
  }

  quitRoom(userId: string, roomId: string) {
    return this.http.delete<any>(
      environment.AUTH_API + `room/${roomId}/quitRoom?userId=${userId}`,
      httpOptions
    );
  }

  addTrack(trackId: string, roomId: string) {
    return this.http.post<any>(
      environment.AUTH_API + `room/${roomId}/music/${trackId}`,
      {
        trackId: trackId,
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
