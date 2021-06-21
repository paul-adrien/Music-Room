import { ChangeDetectorRef, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as querystring from 'querystring';
import { map, tap } from 'rxjs/operators';
import { SpotifyWebApi } from 'spotify-web-api-ts';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

const httpApiSpotifyOptions = {
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
  public spotifyApi: SpotifyWebApi;

  constructor(private http: HttpClient, private route: Router) {
    this.spotifyApi = new SpotifyWebApi();
    if (localStorage.getItem('access_token')) {
      this.spotifyApi.setAccessToken(localStorage.getItem('access_token'));
    }
  }

  searchMusic(search: string): Promise<any> {
    // return this.http.get(
    //   'http://localhost:8080/' + 'spotify/:search',
    //   httpOptions
    // );
    return this.spotifyApi.search.searchTracks(search).then((data) => {
      console.log(data);
      return data;
    });
  }

  play(uri: string) {
    this.spotifyApi.player.play({ uris: [uri] });
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
    let url = 'https://accounts.spotify.com/authorize';
    url += '?client_id=' + clientId;
    url += '&response_type=code';
    url += '&redirect_uri=' + encodeURI('http://localhost:8100/tabs/search');
    url += '&show_dialog=true';
    url +=
      '&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private';
    window.location.href = url; // Show Spotify's authorization screen
  }

  getAuthorizationToken() {
    const code = this.getCode();
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

    return this.http
      .post(
        `https://accounts.spotify.com/api/token`,
        querystring.stringify({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'http://localhost:8100/tabs/search',
        }),
        httpSpotifyOptions
      )
      .pipe(tap((res) => this.saveToken(res)));
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

    return this.http
      .post(
        `https://accounts.spotify.com/api/token`,
        querystring.stringify({
          grant_type: 'refresh_token',
          refresh_token: localStorage.getItem('refresh_token'),
        }),
        httpSpotifyOptions
      )
      .pipe(tap((res) => this.saveToken(res)));
  }

  saveToken(res: any) {
    if (res.access_token != undefined || res.refresh_token != undefined) {
      // var res = JSON.parse(res);
      console.log(res);
      // var res = JSON.parse(res);
      if (res.access_token != undefined) {
        const access_token = res.access_token;
        localStorage.setItem('access_token', access_token);
        this.spotifyApi.setAccessToken(access_token);
      }
      if (res.refresh_token != undefined) {
        const refresh_token = res.refresh_token;
        localStorage.setItem('refresh_token', refresh_token);
        //this.spotifyApi.getRefreshedAccessToken(refresh_token);
      }
    } else {
      console.log(res);
    }
  }

  getDevices() {
    // return this.http.get(
    //   'https://api.spotify.com/v1/me/player/devices',
    //   httpApiSpotifyOptions
    // );
    return this.spotifyApi.player
      .getMyDevices()
      .then((res) => console.log(res));
  }
}
