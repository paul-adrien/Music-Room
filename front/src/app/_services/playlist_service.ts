import { NavController } from '@ionic/angular';
import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { mapUserBackToUserFront, User } from 'libs/user';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Playlist } from 'libs/playlist';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  constructor(
    private http: HttpClient,
    private route: Router,
    public navCtrl: NavController
  ) { }

  // createPlaylist(user: Partial<User>, name: string): Observable<any> {
  //   return this.http.post(
  //     environment.AUTH_API + `playlist`,
  //     {
  //       userId: user.id,
  //       name: name,
  //     },
  //     httpOptions
  //   );
  // }

  enterPlaylist(userId: string, playlistId: string, deviceId: string) {
    return this.http.post<any>(
      environment.AUTH_API + `playlist/${playlistId}/enterPlaylist`,
      {
        userId: userId,
        deviceId: deviceId,
      },
      httpOptions
    );
  }

  quitPlaylist(userId: string, PlaylistId: string) {
    return this.http.delete<any>(
      environment.AUTH_API +
      `playlist/${PlaylistId}/quitPlaylist?userId=${userId}`,
      httpOptions
    );
  }

  checkNamePlaylist(name: string) {
    return this.http.get<any>(
      environment.AUTH_API + `playlist/${name}/check-name`,
      httpOptions
    );
  }

  addTrack(trackId: string, playlistId: string, userId: string) {
    return this.http.post<any>(
      environment.AUTH_API + `playlist/${playlistId}/music/${trackId}`,
      {
        trackId: trackId,
        userId: userId,
      },
      httpOptions
    );
  }

  delTrack(trackId: string, playlistId: string) {
    return this.http.delete<any>(
      environment.AUTH_API + `playlist/${playlistId}/music/${trackId}`,

      httpOptions
    );
  }

  getPlaylist(playlistId: string): Observable<any> {
    return this.http.get(
      environment.AUTH_API + `playlist/${playlistId}`,
      httpOptions
    );
  }

  getAllPlaylist(userId?: string): Observable<any> {
    return this.http
      .get<any>(environment.AUTH_API + `playlist?userId=${userId}`, httpOptions)
      .pipe(
        map((res) => {
          if (res.status) {
            return res.playlists;
          } else return undefined;
        })
      );
  }

  inviteUserToPlaylist(playlistId: string, userId: string, friendId: string) {
    return this.http.post<any>(
      environment.AUTH_API + `playlist/${playlistId}/invite/${friendId}`,
      {
        userId: userId,
      },
      httpOptions
    );
  }

  editPlaylist(playlist: Playlist, playlistId: string) {
    return this.http.put<any>(
      environment.AUTH_API + `playlist/${playlistId}`,
      {
        playlist: playlist,
      },
      httpOptions
    );
  }

  acceptInvitePlaylist(playlistId: string, userId: string) {
    return this.http.post<any>(
      environment.AUTH_API + `playlist/${playlistId}/acceptInvite`,
      {
        userId: userId,
      },
      httpOptions
    );
  }

  changeType(playlistId: string, userId: string, type: 'public' | 'private') {
    return this.http.post<any>(
      environment.AUTH_API + `playlist/${playlistId}/change-type`,
      {
        userId: userId,
        type: type,
      },
      httpOptions
    );
  }
}
