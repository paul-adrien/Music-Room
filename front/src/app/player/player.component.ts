import { async } from '@angular/core/testing';
import { Observable } from 'rxjs';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Options } from '@angular-slider/ngx-slider';
import { SpotifyService } from '../_services/spotify_service';

@Component({
  selector: 'app-player',
  template: `
    <div *ngIf="this.isModal === false; else modal">
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
    </div>
    <ng-template #modal>
      <div *ngIf="this.playerInfo" class="player-container">
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
  public playerInfo: { is_playing: boolean; item: any; progress_ms: number } =
    undefined;

  constructor(
    private spotifyService: SpotifyService,
    private cd: ChangeDetectorRef,
    public modalController: ModalController
  ) {}

  ngAfterContentInit() {
    //setInterval(() => this.getPlayerInfo(), 1500);
  }

  getPlayerInfo() {
    this.spotifyService
      .getPlayerInfo()
      .toPromise()
      .then((res) => {
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
      cssClass: 'my-custom-class',
      componentProps: {
        isModal: true,
      },
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
    this.spotifyService.seek(position.value * 1000).subscribe();
  }

  nextTrack() {
    this.spotifyService.next().subscribe();
  }

  previousTrack() {
    this.spotifyService.previous().subscribe();
  }
  ngOnDestroy() {
    if (!this.isModal) {
      this.pause();
    }
  }
}
