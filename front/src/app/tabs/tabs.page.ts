import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlayerComponent } from '../player/player.component';
import { SpotifyService } from '../_services/spotify_service';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-header class="header"> </ion-header>
      <app-player></app-player>
      <ion-tab-bar color="dark" slot="bottom">
        <ion-tab-button tab="tab-home">
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
  public playerInfo: { is_playing: boolean; item: any; progress_ms: number } =
    undefined;

  constructor(
    private spotifyService: SpotifyService,
    private cd: ChangeDetectorRef,
    public modalController: ModalController
  ) {}

  ngAfterContentInit() {
    // setInterval(() => this.getPlayerInfo(), 500);
  }

  getPlayerInfo() {
    this.spotifyService.getPlayerInfo().subscribe((res) => {
      if (typeof res !== 'string' && res !== null) {
        this.playerInfo = {
          is_playing: res.is_playing,
          item: res.item as any,
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
      cssClass: ['my-custom-class', 'my-custom-modal'],
      swipeToClose: true,
      componentProps: {
        playerInfo: this.spotifyService.getPlayerInfo(),
      },
    });
    return await modal.present();
  }
}
