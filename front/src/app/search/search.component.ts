import { SpotifyService } from './../_services/spotify_service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import {
  CurrentlyPlaying,
  Track,
} from 'spotify-web-api-ts/types/types/SpotifyObjects';

@Component({
  selector: 'app-search',
  template: `
    <div class="header">
      <div class="search-container">
        <img src="./assets/search-outline.svg" />
        <input (change)="this.search($event)" />
      </div>
    </div>
    <div class="result">
      <div *ngIf="this.searchRes?.items.length > 0">
        <div
          class="result-item"
          (click)="this.play(item?.uri)"
          *ngFor="let item of this.searchRes.items"
        >
          <img class="logo" [src]="item.album.images[0].url" />
          <div class="item-info">
            <div class="info-top">{{ item.name }}</div>
            <div class="info-bottom">{{ item.artists[0].name }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="primary-button" (click)="this.testMusic()">test</div>
    <div class="primary-button" (click)="this.testRequestAutho()">
      test auth
    </div>

    <mat-progress-bar mode="determinate" [value]="((this.playerInfo?.progress_ms * 100)/this.playerInfo?.item.duration_ms)" [color]="'warn'"></mat-progress-bar>
    <div class="control-bar">
      <img class="logo" [src]="this.playerInfo?.item?.album.images[0].url" />
      <div class="item-info">
        <div class="info-top">{{ this.playerInfo?.item?.name }}</div>
        <div class="info-bottom">
          {{ this.playerInfo?.item?.artists[0].name }}
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  public searchRes: any;
  public progressTime = 0;
  public playerInfo: { is_playing: boolean; item: Track; progress_ms: number };

  constructor(
    private spotifyService: SpotifyService,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterContentInit() {
    setInterval(() => this.getPlayerInfo(), 500);
  }

  play(uri: string) {
    this.spotifyService.play(uri);
  }

  search(event: any) {
    console.log(event);
    this.spotifyService.searchMusic(event.target.value).then((data) => {
      console.log(data);
      this.searchRes = data;
      this.cd.detectChanges();
    });
  }

  testMusic() {
    this.spotifyService.getAuthorizationToken().subscribe();
  }

  testRequestAutho() {
    this.spotifyService.requestAuthorization();
  }

  getPlayerInfo() {
    this.spotifyService.getPlayerInfo().then((res) => {
      if (typeof res !== 'string') {
        this.progressTime = (res as CurrentlyPlaying).progress_ms;
        this.playerInfo = {
          is_playing: res.is_playing,
          item: res.item as Track,
          progress_ms: res.progress_ms,
        };
      }
      this.cd.detectChanges();
    });
  }
}
