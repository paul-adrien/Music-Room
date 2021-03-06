import { AuthService } from './../_services/auth_service';
import { User } from 'libs/user';
import { WebsocketService } from './../_services/websocketService';
import { ActivatedRoute, Router } from '@angular/router';
import { async } from '@angular/core/testing';
import { Observable, forkJoin } from 'rxjs';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Options } from '@angular-slider/ngx-slider';
import { SpotifyService } from '../_services/spotify_service';
import { DelegationComponent } from '../delegation/delegation.component';

@Component({
  selector: 'app-player',
  template: `
    <div *ngIf="this.isModal === false && !this.isRoom; else modal">
      <mat-progress-bar
        *ngIf="this.playerInfo !== undefined"
        mode="determinate"
        [value]="
          (this.playerInfo?.progress_ms * 100) /
          this.playerInfo?.item?.duration_ms
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
          (click)="this.openDelegation()"
          class="play-pause"
          src="./assets/volume-medium-white.svg"
        />
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
    </div>
    <ng-template #modal>
      <div *ngIf="this.playerInfo && !this.isRoom" class="player-container">
        <div class="top-container">
          <img (click)="this.dismiss()" src="./assets/chevron-down.svg" />
        </div>
        <img class="cover" [src]="this.playerInfo?.item?.album.images[0].url" />
        <div class="title">{{ this.playerInfo?.item?.name }}</div>
        <div class="album">{{ this.playerInfo?.item?.album.name }}</div>
        <ngx-slider
          *ngIf="this.playerInfo !== undefined"
          (userChange)="seekTrack($event)"
          [value]="this.playerInfo?.progress_ms / 1000"
          [options]="{
            floor: 0,
            ceil: this.playerInfo?.item?.duration_ms / 1000,
            hideLimitLabels: true,
            hidePointerLabels: true
          }"
        ></ngx-slider>
        <div class="timer-container">
          <div>{{ this.playerInfo?.progress_ms | date: 'm:ss' }}</div>
          <div>
            -{{
              this.playerInfo?.item?.duration_ms - this.playerInfo?.progress_ms
                | date: 'm:ss'
            }}
          </div>
        </div>
        <div class="control-buttons-container">
          <img
            (click)="this.previousTrack()"
            class="next-previous"
            src="./assets/previous.svg"
          />
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
          <img
            (click)="this.nextTrack()"
            class="next-previous"
            src="./assets/next.svg"
          />
        </div>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,

  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Input() public isModal = false;
  public isRoom = false;
  public interval;

  public playerInfo: {
    device: any;
    is_playing: boolean;
    item: any;
    progress_ms: number;
  } = undefined;

  constructor(
    private spotifyService: SpotifyService,
    private cd: ChangeDetectorRef,
    public modalController: ModalController,
    private router: Router,
    private socketService: WebsocketService,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    const user = this.authService.getUser();
    this.socketService
      .listenToServer(`user update ${user?.id}`)
      .subscribe((data) => {
        if (
          JSON.stringify(data) !== JSON.stringify(this.authService.getUser())
        ) {
          this.authService.saveUser(data);
        }
        this.cd.detectChanges();
      });
    this.socketService
      .listenToServer(`give delegation permission to ${user?.id}`)
      .subscribe((data) => {
        if ((data?.token, data?.userId, data?.userName)) {
          this.authService.saveDelegation(
            data.token,
            data.userId,
            data.userName
          );
        }
        this.cd.detectChanges();
      });
    this.socketService
      .listenToServer(`action delegation ${user?.id}`)
      .subscribe((data) => {
        if (data?.action === 'PLAY') {
          this.play();
        } else if (data?.action === 'PAUSE') {
          this.pause();
        } else if (data?.action === 'NEXT') {
          this.nextTrack();
        } else if (data?.action === 'PREVIOUS') {
          this.previousTrack();
        } else if (data?.action === 'MUSIC' && data?.trackId) {
          this.playTrack(data?.trackId, data?.uri);
        }

        this.cd.detectChanges();
      });
  }

  ngAfterContentInit() {
    this.interval = setInterval(() => this.getPlayerInfo(), 1500);
  }

  getPlayerInfo() {
    this.isRoom = !!this.router.url.includes('/room');
    this.spotifyService
      .getPlayerInfo()
      .toPromise()
      .then((res) => {
        if (typeof res !== 'string' && res !== null) {
          this.playerInfo = {
            is_playing: res.is_playing,
            item: res.item as any,
            progress_ms: res.progress_ms,
            device: res?.device,
          };
        }
        this.cd.detectChanges();
      });
  }

  play() {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      if (res === null || res?.device === null) {
        await this.presentAlert();
      } else if (res !== null && res.device) {
        this.spotifyService.play().subscribe((data) => {
          this.playerInfo.is_playing = true;
          this.cd.detectChanges();
        });
      }
    });
  }

  playTrack(trackId: string, uri: string) {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      if (res === null || res?.device === null) {
        await this.presentAlert();
      } else if (res !== null && res.device) {
        this.spotifyService.playTrack(uri, trackId).subscribe((data) => {
          this.playerInfo.is_playing = true;
          this.cd.detectChanges();
        });
      }
    });
  }

  pause() {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      if (res === null || res?.device === null) {
        await this.presentAlert();
      } else if (res !== null && res.device) {
        this.spotifyService.pause().subscribe((data) => {
          this.playerInfo.is_playing = false;
          this.cd.detectChanges();
        });
      }
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Attention',
      message: 'Ouvrez Spotify avant et lancez une musique.',
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: PlayerComponent,
      swipeToClose: true,
      cssClass: 'my-custom-class',
      componentProps: {
        isModal: true,
      },
    });
    return await modal.present();
  }

  async openDelegation() {
    const modal = await this.modalController.create({
      component: DelegationComponent,
      cssClass: ['my-custom-class', 'my-custom-modal'],
      swipeToClose: true,
      componentProps: {
        deviceId: this.playerInfo?.device?.id,
        deviceName: this.playerInfo?.device?.name,
      },
    });

    modal.onWillDismiss().then((res: any) => {
      if (res?.data?.device) {
        this.authService.savePlayerId(res?.data?.device);
      } else {
        this.authService.savePlayerId();
      }
    });
    return await modal.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  seekTrack(position: any) {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      if (res === null || res?.device === null) {
        await this.presentAlert();
      } else if (res !== null && res.device) {
      }
    });
    this.spotifyService.seek(position.value * 1000).subscribe();
  }

  nextTrack() {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      if (res === null || res?.device === null) {
        await this.presentAlert();
      } else if (res !== null && res.device) {
        this.spotifyService.next().subscribe();
      }
    });
  }

  previousTrack() {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      if (res === null || res?.device === null) {
        await this.presentAlert();
      } else if (res !== null && res.device) {
        this.spotifyService.previous().subscribe();
      }
    });
  }
  ngOnDestroy() {
    // if (!this.isModal) {
    //   this.pause();
    // }
    if (this.interval) clearInterval(this.interval);
  }
}
