import { SpotifyService } from './../_services/spotify_service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { ModalController } from '@ionic/angular';

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
      <div *ngIf="this.searchRes?.items?.length > 0">
        <div
          class="result-item"
          (click)="this.isModal ? this.dismiss(item) : this.play(item?.uri)"
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
    <!-- <div class="primary-button" (click)="this.testMusic()">test</div>
    <div class="primary-button" (click)="this.testRequestAutho()">
      test auth
    </div> -->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() public isModal = false;
  public searchRes: any;
  public progressTime = 0;
  public playerInfo: { is_playing: boolean; item: any; progress_ms: number };

  constructor(
    private spotifyService: SpotifyService,
    private cd: ChangeDetectorRef,
    public modalController: ModalController
  ) {}

  play(uri: string) {
    this.spotifyService.playTrack(uri).subscribe();
  }

  search(event: any) {
    console.log(event);
    this.spotifyService.searchMusic(event.target.value).subscribe((data) => {
      console.log(data);
      this.searchRes = data.tracks;
      this.cd.detectChanges();
    });
  }

  testMusic() {
    this.spotifyService.getAuthorizationToken().subscribe();
  }

  testRequestAutho() {
    this.spotifyService.requestAuthorization();
  }

  dismiss(track?: any) {
    this.modalController.dismiss({
      dismissed: true,
      track: track,
    });
  }
}
