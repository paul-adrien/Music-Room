import { SpotifyService } from './../_services/spotify_service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

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

    <div class="primary-button" (click)="this.testDevices()">devices</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public searchRes: any;

  constructor(
    private spotifyService: SpotifyService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

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

  testDevices() {
    this.spotifyService.getDevices();
  }
}
