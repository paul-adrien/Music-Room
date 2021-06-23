import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Track } from 'spotify-web-api-ts/types/types/SpotifyObjects';
import { PlayerComponent } from '../player/player.component';
import { SpotifyService } from '../_services/spotify_service';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <mat-progress-bar
        *ngIf="this.playerInfo !== undefined"
        mode="determinate"
        [value]="
          (this.playerInfo?.progress_ms * 100) /
          this.playerInfo?.item.duration_ms
        "
        [color]="'warn'"
      ></mat-progress-bar>
      <div *ngIf="this.playerInfo !== undefined" class="control-bar">
        <img
          (click)="this.presentModal()"
          class="logo"
          [src]="this.playerInfo?.item?.album.images[0].url"
        />
        <div (click)="this.presentModal()" class="item-info">
          <div class="info-top">{{ this.playerInfo?.item?.name }}</div>
          <div class="info-bottom">
            {{ this.playerInfo?.item?.artists[0].name }}
          </div>
        </div>
        <img
          *ngIf="this.playerInfo?.is_playing === false"
          (click)="this.play()"
          class="play-pause"
          src="./assets/play.svg"
        />
        <img
          *ngIf="this.playerInfo?.is_playing"
          (click)="this.pause()"
          class="play-pause"
          src="./assets/pause.svg"
        />
      </div>
      <ion-tab-bar color="dark" slot="bottom">
        <ion-tab-button tab="tab1">
          <ion-icon name="triangle"></ion-icon>
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="search">
          <ion-icon name="search-outline"></ion-icon>
          <ion-label>Search</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile">
          <ion-icon name="albums-outline"></ion-icon>
          <ion-label>Découvrir</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,

  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  public playerInfo: { is_playing: boolean; item: Track; progress_ms: number } =
    undefined;

  constructor(
    private spotifyService: SpotifyService,
    private cd: ChangeDetectorRef,
    public modalController: ModalController
  ) {}

  ngAfterContentInit() {
    setInterval(() => this.getPlayerInfo(), 500);
  }

  getPlayerInfo() {
    this.spotifyService.getPlayerInfo().subscribe((res) => {
      if (typeof res !== 'string' && res !== null) {
        this.playerInfo = {
          is_playing: res.is_playing,
          item: res.item as Track,
          progress_ms: res.progress_ms,
        };
      }
      this.cd.detectChanges();
    });
  }

  play() {
    this.spotifyService.play().subscribe((data) => {
      this.playerInfo.is_playing = true;
      this.cd.detectChanges();
    });
  }

  pause() {
    this.spotifyService.pause().subscribe((data) => {
      this.playerInfo.is_playing = false;
      this.cd.detectChanges();
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: PlayerComponent,
      cssClass: 'my-custom-class',
    });
    return await modal.present();
  }
}
