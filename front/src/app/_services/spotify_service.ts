import { AuthService } from './auth_service';
import { WebsocketService } from './websocketService';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import * as querystring from 'querystring';
import { catchError, tap } from 'rxjs/operators';
import { Device } from '@ionic-native/device/ngx';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

let httpApiSpotifyOptions = {
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + localStorage.getItem('access_token'),
    'Content-Type': 'application/json',
  }),
};

const clientId = 'fe5ad0d35eb34ee3a60234973d3b1346';
const clientSecret = '9bbe1deebd4045ef9b0eb3f7bab09daa';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  constructor(
    private http: HttpClient,
    private route: Router,
    private router: ActivatedRoute,
    private iab: InAppBrowser,
    private ngZone: NgZone,
    private device: Device,
    private socketService: WebsocketService,
    private authService: AuthService
  ) {}

  searchMusic(search: string) {
    return this.http
      .get<any>(
        `https://api.spotify.com/v1/search?q=${encodeURI(search)}&type=track`,
        httpApiSpotifyOptions
      )
      .pipe(
        catchError((err) => {
          if (err?.status === 401) {
            return this.getRefreshToken();
          } else {
            return;
          }
        })
      );
    // return this.spotifyApi.search.searchTracks(search).then((data) => {
    //   console.log(data);
    //   return data;
    // });
  }

  getTracksInfo(trackIds: string[]) {
    return this.http
      .get<any>(
        `https://api.spotify.com/v1/tracks?ids=${encodeURI(
          trackIds.join(',')
        )}`,
        httpApiSpotifyOptions
      )
      .pipe(
        catchError((err) => {
          if (err?.status === 401) {
            return this.getRefreshToken();
          } else {
            return;
          }
        })
      );
  }

  playTrack(
    uri: string,
    trackId: string,
    deviceId?: string,
    position_ms?: number
  ) {
    const user = this.authService.getUser();
    this.socketService.emitToServer('user update history', {
      userId: user.id,
      trackId: trackId,
    });
    console.log(deviceId);
    const payload = { uris: [uri], position_ms };
    console.log(payload);
    return this.http
      .put<any>(
        deviceId
          ? `https://api.spotify.com/v1/me/player/play?device_id=${encodeURI(
              deviceId
            )}`
          : `https://api.spotify.com/v1/me/player/play`,
        { uris: [uri], position_ms },
        httpApiSpotifyOptions
      )
      .pipe(
        catchError((err) => {
          if (err?.status === 401) {
            return this.getRefreshToken();
          } else {
            return;
          }
        })
      );
  }

  getCode() {
    let code = null;
    const queryString = window.location.search;
    if (queryString.length > 0) {
      const urlParams = new URLSearchParams(queryString);
      code = urlParams.get('code');
    }
    return code;
  }

  requestAuthorization() {
    let code;
    let url = 'https://accounts.spotify.com/authorize';
    url += '?client_id=' + clientId;
    url += '&response_type=code';
    url += '&redirect_uri=' + encodeURI('http://localhost:8100/login');
    url += '&show_dialog=true';
    url +=
      '&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private';
    if (this.device?.platform === null) {
      window.location.href = url;
    } else {
      setTimeout(() => {
        const browser = this.iab.create(url, 'defaults');
        browser.on('loadstart').subscribe((event) => {
          console.log('start spotify', event);
          if (
            event.url.indexOf('localhost') !== -1 &&
            event.url.indexOf('?code=') !== -1
          ) {
            code = event.url.slice(
              event.url.indexOf('?code=') + '?code='.length
            );
            console.log(code);
            this.ngZone.run(() => {
              this.route.navigate([`/login`], { queryParams: { code: code } });
            });
            console.log('close spotify');
            browser.close();
          }
        });
      }, 2000);
    }

    // Show Spotify's authorization screen
  }

  getAuthorizationToken() {
    const code = this.getCode();
    if (code !== null) {
      let token =
        'Basic ' +
        btoa(
          'fe5ad0d35eb34ee3a60234973d3b1346:9bbe1deebd4045ef9b0eb3f7bab09daa'
        );
      const httpSpotifyOptions = {
        headers: new HttpHeaders({
          Authorization: token,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        }),
      };

      return this.http
        .post(
          `https://accounts.spotify.com/api/token`,
          querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: 'http://localhost:8100/login',
          }),
          httpSpotifyOptions
        )
        .pipe(
          tap((res) => {
            this.saveToken(res);
            this.route.navigate(['/tabs/search']);
          })
        );
    } else return;
  }

  getRefreshToken() {
    let token =
      'Basic ' +
      btoa('fe5ad0d35eb34ee3a60234973d3b1346:9bbe1deebd4045ef9b0eb3f7bab09daa');
    const httpSpotifyOptions = {
      headers: new HttpHeaders({
        Authorization: token,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      }),
    };

    if (localStorage.getItem('refresh_token')) {
      return this.http
        .post(
          `https://accounts.spotify.com/api/token`,
          querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: localStorage.getItem('refresh_token'),
            clientId: clientId,
          }),
          httpSpotifyOptions
        )
        .pipe(
          tap((res) => {
            this.saveToken(res);
            this.route.navigate(['/tabs/search']);
          })
        );
    }
  }

  saveToken(res: any) {
    if (res.access_token !== undefined || res.refresh_token !== undefined) {
      // var res = JSON.parse(res);
      console.log('save token', res);
      // var res = JSON.parse(res);
      if (res.access_token !== undefined) {
        const access_token = res.access_token;
        localStorage.setItem('access_token', access_token);
        httpApiSpotifyOptions = {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + localStorage.getItem('access_token'),
            'Content-Type': 'application/json',
          }),
        };
      }
      if (res.refresh_token !== undefined) {
        const refresh_token = res.refresh_token;
        localStorage.setItem('refresh_token', refresh_token);
        //this.spotifyApi.getRefreshedAccessToken(refresh_token);
      }
    } else {
      console.log(res);
      httpApiSpotifyOptions = {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + localStorage.getItem('access_token'),
          'Content-Type': 'application/json',
        }),
      };
    }
  }

  getDevices() {
    return this.http
      .get(
        'https://api.spotify.com/v1/me/player/devices',
        httpApiSpotifyOptions
      )
      .pipe(
        catchError((err) => {
          if (err?.status === 401) {
            return this.getRefreshToken();
          } else {
            return;
          }
        })
      );
    // return this.spotifyApi.player
    //   .getMyDevices()
    //   .then((res) => console.log(res));
  }

  getPlayerInfo() {
    return this.http
      .get<any>(`https://api.spotify.com/v1/me/player`, httpApiSpotifyOptions)
      .pipe(
        catchError((err) => {
          if (err?.status === 401) {
            return this.getRefreshToken();
          } else {
            return;
          }
        })
      );
    // return this.spotifyApi.player.getCurrentlyPlayingTrack().then((res) => {
    //   console.log(res);
    //   return res;
    // });
  }

  play(deviceId?: string) {
    return this.http
      .put<any>(
        deviceId
          ? `https://api.spotify.com/v1/me/player/play?device_id=${encodeURI(
              deviceId
            )}`
          : `https://api.spotify.com/v1/me/player/play`,
        {},
        httpApiSpotifyOptions
      )
      .pipe(
        catchError((err) => {
          if (err?.status === 401) {
            return this.getRefreshToken();
          } else {
            return;
          }
        })
      );
  }

  pause(deviceId?: string) {
    return this.http
      .put<any>(
        deviceId
          ? `https://api.spotify.com/v1/me/player/pause?device_id=${encodeURI(
              deviceId
            )}`
          : `https://api.spotify.com/v1/me/player/pause`,
        {},
        httpApiSpotifyOptions
      )
      .pipe(
        catchError((err) => {
          console.log('ici petit cul');
          if (err?.status === 401) {
            return this.getRefreshToken();
          } else {
            return;
          }
        })
      );
  }

  changeDevice(deviceId: string) {
    return this.http
      .put<any>(
        `https://api.spotify.com/v1/me/player`,
        { device_ids: [deviceId], play: true },
        httpApiSpotifyOptions
      )
      .pipe(
        catchError((err) => {
          if (err?.status === 401) {
            return this.getRefreshToken();
          } else {
            return;
          }
        })
      );
  }

  seek(position: number) {
    return this.http
      .put<any>(
        `https://api.spotify.com/v1/me/player/seek?position_ms=${position.toString()}`,
        {},
        httpApiSpotifyOptions
      )
      .pipe(
        catchError((err) => {
          if (err?.status === 401) {
            return this.getRefreshToken();
          } else {
            return;
          }
        })
      );
  }

  next() {
    return this.http
      .post<any>(
        `https://api.spotify.com/v1/me/player/next`,
        {},
        httpApiSpotifyOptions
      )
      .pipe(
        catchError((err) => {
          if (err?.status === 401) {
            return this.getRefreshToken();
          } else {
            return;
          }
        })
      );
  }

  previous() {
    return this.http
      .post<any>(
        `https://api.spotify.com/v1/me/player/previous`,
        {},
        httpApiSpotifyOptions
      )
      .pipe(
        catchError((err) => {
          if (err?.status === 401) {
            return this.getRefreshToken();
          } else {
            return;
          }
        })
      );
  }
}
