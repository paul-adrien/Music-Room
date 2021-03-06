import { NavController } from '@ionic/angular';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { mapUserBackToUserFront, User } from 'libs/user';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { WebsocketService } from './websocketService';

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
    public navCtrl: NavController,
    private socketService: WebsocketService
  ) {}

  createRoom(user: Partial<User>, name: string): Observable<any> {
    return this.http.post(
      environment.AUTH_API + `room`,
      {
        userId: user.id,
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

  stockPositionTrack(roomId: string, progress_ms: number, trackId: string) {
    return this.http.post<any>(
      environment.AUTH_API + `room/${roomId}/progress-track`,
      {
        progress_ms,
        trackId,
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

  checkNameRoom(name: string) {
    return this.http.get<any>(
      environment.AUTH_API + `room/${name}/check-name`,
      httpOptions
    );
  }

  addTrack(trackId: string, roomId: string, userId: string) {
    return this.http.post<any>(
      environment.AUTH_API + `room/${roomId}/music/${trackId}`,
      {
        trackId: trackId,
        userId: userId,
      },
      httpOptions
    );
  }

  delTrack(trackId: string, roomId: string) {
    return this.http.delete<any>(
      environment.AUTH_API + `room/${roomId}/music/${trackId}`,

      httpOptions
    );
  }

  voteTrack(trackId: string, roomId: string, userId: string) {
    return this.http.post<any>(
      environment.AUTH_API + `room/${roomId}/music/${trackId}/vote`,
      {
        trackId: trackId,
        userId: userId,
      },
      httpOptions
    );
  }

  getRoom(roomId: string): Observable<any> {
    return this.http.get(environment.AUTH_API + `room/${roomId}`, httpOptions);
  }

  getAllRoom(userId?: string): Observable<any> {
    return this.http
      .get<any>(environment.AUTH_API + `room?userId=${userId}`, httpOptions)
      .pipe(
        map((res) => {
          if (res.status) {
            return res.rooms;
          } else return undefined;
        })
      );
  }

  inviteUserToRoom(roomId: string, userId: string, friendId: string) {
    return this.http.post<any>(
      environment.AUTH_API + `room/${roomId}/invite/${friendId}`,
      {
        userId: userId,
      },
      httpOptions
    );
  }

  acceptInviteRoom(roomId: string, userId: string) {
    return this.http.post<any>(
      environment.AUTH_API + `room/${roomId}/acceptInvite`,
      {
        userId: userId,
      },
      httpOptions
    );
  }

  changeType(roomId: string, userId: string, type: 'public' | 'private') {
    return this.http.post<any>(
      environment.AUTH_API + `room/${roomId}/change-type`,
      {
        userId: userId,
        type: type,
      },
      httpOptions
    );
  }

  addGeoAndHoursLimit(form, circleData, roomId, userId) {
    this.socketService.emitToServer('add geo/hours limit', {
      roomId,
      userId,
      radius: form.radius,
      center: circleData.center,
      start: form.start,
      end: form.end,
    });
  }

  checkLimit(roomId: string, lat, long) {
    return this.http.get<any>(
      environment.AUTH_API +
        `room/${roomId}/check-limit?lat=${lat}&long=${long}`,
      httpOptions
    );
  }
}
