import { SearchComponent } from './../search/search.component';
import { async } from '@angular/core/testing';
import { map } from 'rxjs/operators';
import { Room } from './../../../libs/room';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { RoomService } from '../_services/room_service';
import { SpotifyService } from '../_services/spotify_service';
import { User } from 'libs/user';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from '../_services/auth_service';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-room',
  template: `
    <ion-icon
      (click)="this.quitRoom()"
      class="back-img"
      name="chevron-back-outline"
    ></ion-icon>
    <div class="room-container" *ngIf="this.room">
      <div class="title">
        {{ this.room.name }}
      </div>
      <div *ngIf="this.tracks[0]" class="player-container">
        <div class="player-info">
          <img
            class="img-track"
            [src]="this.tracks[0]?.album?.images[0]?.url"
          />
          <div class="player-text">
            <div class="player-name">{{ this.tracks[0]?.name }}</div>
            <div class="player-artist">
              {{ this.tracks[0].artists[0].name }}
            </div>
          </div>
        </div>
        <mat-progress-bar
          *ngIf="this.playerInfo !== undefined"
          mode="determinate"
          [value]="
            (this.playerInfo?.progress_ms * 100) /
            this.playerInfo?.item.duration_ms
          "
          [color]="'warn'"
        ></mat-progress-bar>
        <div class="timer-container">
          <div>{{ this.playerInfo?.progress_ms | date: 'm:ss' }}</div>
          <div>
            -{{
              this.playerInfo?.item?.duration_ms - this.playerInfo?.progress_ms
                | date: 'm:ss'
            }}
          </div>
        </div>
      </div>
      <div class="primary-button suggestion" (click)="this.presentModal()">
        Suggérer un titre
      </div>
      <div></div>
      <div class="sub-title">Prochains titres</div>
      <div *ngFor="let track of this.tracks; let isFirst = first">
        <div class="tracks-container" *ngIf="!this.isFirst">
          <img class="logo" [src]="track.album.images[0].url" />
          <div class="track-info">
            <div class="info-top">{{ track.name }}</div>
            <div class="info-bottom">{{ track.artists[0].name }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private cd: ChangeDetectorRef,
    private spotifyService: SpotifyService,
    private location: Location,
    private authService: AuthService,
    public modalController: ModalController
  ) {}

  public room: Room;
  public user: User;
  public roomId: string = this.route.snapshot.paramMap.get('id');
  public tracks = [];

  public playerInfo: { is_playing: boolean; item: any; progress_ms: number } =
    undefined;

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.roomService.getRoom(this.roomId).subscribe((res) => {
      this.room = res.room;
      if (res.room.musics.length > 0) {
        this.spotifyService
          .getTracksInfo(this.room.musics.map((music) => music.trackId))
          .pipe(map((res: any) => res.tracks))
          .subscribe((res) => {
            this.tracks = res;
            if (
              this.room.users.length === 1 &&
              this.user.id === this.room.users[0].id
            ) {
              //this.spotifyService.playTrack(this.tracks[0].uri).subscribe();
            }
            this.cd.detectChanges();
          });
      }
      this.cd.detectChanges();
    });
  }

  ngAfterContentInit() {
    setInterval(() => this.getPlayerInfo(), 1500);
  }

  getPlayerInfo() {
    this.spotifyService
      .getPlayerInfo()
      .toPromise()
      .then((res) => {
        if (typeof res !== 'string' && res !== null) {
          if (
            res.progress_ms === 0 &&
            !res.is_playing &&
            this.tracks.length > 0
          ) {
            if (this.tracks[1]) {
              this.spotifyService.playTrack(this.tracks[1]?.uri).subscribe();
            }
            this.roomService
              .delTrack(this.tracks[0].id, this.roomId)
              .subscribe();
          }
          this.playerInfo = {
            is_playing: res.is_playing,
            item: res.item as any,
            progress_ms: res.progress_ms,
          };
          this.roomService.getRoom(this.roomId).subscribe((res) => {
            this.room = res.room;
            if (res.room.musics.length > 0) {
              this.getTracksInfo(res.room.musics);
            } else {
              this.tracks = [];
            }
          });
        }
        this.cd.detectChanges();
      });
  }

  getTracksInfo(musics: any) {
    this.spotifyService
      .getTracksInfo(musics.map((music) => music.trackId))
      .pipe(map((res: any) => res.tracks))
      .subscribe((res) => {
        this.tracks = res;
        this.cd.detectChanges();
      });
  }

  quitRoom() {
    this.roomService.quitRoom(this.user.id, this.roomId).subscribe((res) => {
      if (res.status) {
        this.location.back();
        //this.navCtrl.navigateBack('/tabs/home');
      }
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: {
        isModal: true,
      },
    });
    modal.onWillDismiss().then((res) => {
      if (res?.data?.track) {
        const track = res.data.track;
        console.log(track);
        this.roomService.addTrack(track.id, this.roomId).subscribe((res) => {
          this.roomService.getRoom(this.roomId).subscribe((res) => {
            this.room = res.room;

            if (this.tracks.length === 0) {
              this.spotifyService.playTrack(track.uri).subscribe();
            }
          });
          this.cd.detectChanges();
        });
      }
    });
    return await modal.present();
  }

  ngOnDestroy() {
    this.quitRoom();
  }
}
