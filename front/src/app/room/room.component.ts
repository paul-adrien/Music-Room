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
import {
  ModalController,
  NavController,
  PopoverController,
} from '@ionic/angular';
import { AuthService } from '../_services/auth_service';
import { Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import { SettingsRoomComponent } from '../settings-room/settings-room.component';
import { WebsocketService } from '../_services/websocketService';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-room',
  template: `
    <img
      class="back-img"
      (click)="this.quitRoom()"
      src="./assets/chevron-back-outline.svg"
    />
    <div class="room-container" *ngIf="this.room">
      <div class="title">
        {{ this.room?.name }}
      </div>
      <div *ngIf="this.trackPlaying" class="player-container">
        <div class="player-info">
          <img
            class="img-track"
            [src]="this.trackPlaying?.album?.images[0]?.url"
          />
          <div class="player-text">
            <div class="player-name">{{ this.trackPlaying?.name }}</div>
            <div class="player-artist">
              {{ this.trackPlaying?.artists[0]?.name }}
            </div>
          </div>
        </div>
        <div
          *ngIf="this.room?.created_by === this.user?.id"
          class="buttons-controller"
        >
          <div class="circle">
            <img
              *ngIf="this.playerInfo?.is_playing === false"
              (click)="!this.wait && this.play()"
              class="play"
              src="./assets/play-black.svg"
            />

            <img
              *ngIf="this.playerInfo?.is_playing"
              (click)="!this.wait && this.pause()"
              class="pause"
              src="./assets/pause-black.svg"
            />
          </div>
          <img
            (click)="this.nextTrack()"
            class="next-previous"
            src="./assets/next-green.svg"
          />
        </div>
        <mat-progress-bar
          *ngIf="this.playerInfo !== undefined"
          mode="determinate"
          [value]="
            (this.playerInfo?.progress_ms * 100) /
            this.playerInfo?.item?.duration_ms
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
      <div class="buttons-middle">
        <div
          *ngIf="
            (!(this.room.onlyInvited && !this.isInvited) &&
              this.zone !== false) ||
            this.room?.created_by === this.user?.id ||
            this.zone
          "
          class="primary-button suggestion"
          (click)="this.presentModalSuggestion()"
        >
          Suggérer un titre
        </div>
        <div class="buttons-right">
          <img
            *ngIf="
              !this.room.onlyInvited || this.room.created_by === this.user.id
            "
            class="add"
            (click)="this.presentModalInvite()"
            src="./assets/person-add-outline.svg"
          />
          <img
            *ngIf="this.room?.created_by === this.user?.id"
            class="add"
            (click)="this.presentPopoverSettings($event)"
            src="./assets/settings-white.svg"
          />
        </div>
      </div>
      <div class="sub-title">Prochains titres</div>
      <div *ngFor="let track of this.tracks; let isFirst = first">
        <div class="tracks-container">
          <img class="logo" [src]="track?.album?.images[0]?.url" />
          <div class="track-info">
            <div class="info-top">{{ track?.name }}</div>
            <div class="info-bottom">{{ track?.artists[0]?.name }}</div>
          </div>
          <div class="buttons-vote">
            <!-- <img
              class="down"
              [src]="
                this.isVoteTrack(track.id)
                  ? './assets/thumbs-down-green.svg'
                  : './assets/thumbs-down.svg'
              "
            /> -->
            <div>{{ this.track?.nb_vote }}</div>
            <img
              *ngIf="
                (!(this.room.onlyInvited && !this.isInvited) &&
                  this.zone !== false) ||
                this.room?.created_by === this.user?.id ||
                this.zone
              "
              class="up"
              (click)="this.voteTrack(track?.id)"
              [src]="
                this.isVoteTrack(track?.id)
                  ? './assets/thumbs-up-green.svg'
                  : './assets/thumbs-up.svg'
              "
            />
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
    public modalController: ModalController,
    private popoverCtrl: PopoverController,
    private socketService: WebsocketService,
    private geolocation: Geolocation
  ) {
    this.socketService
      .listenToServer(`room update ${this.roomId}`)
      .subscribe((data) => {
        console.log(data);
        this.room = data;
        console.log(this.room.progress_ms);

        this.isInvited =
          this.room.invited.indexOf(this.user.id) >= 0 ||
          this.room.created_by === this.user.id
            ? true
            : false;
        if (this.isInvited === false && this.room.type === 'private')
          this.quitRoom();

        if (this.room?.limits) {
          this.geolocation
            .getCurrentPosition()
            .then((resp) => {
              this.roomService
                .checkLimit(
                  this.room._id,
                  resp.coords.latitude,
                  resp.coords.longitude
                )
                .subscribe((res) => {
                  if (res.status) {
                    this.zone = res.isIn;
                  }
                  this.cd.detectChanges();
                });
            })
            .catch((error) => {
              console.log('Error getting location', error);
            });
        } else {
          this.zone = undefined;
        }

        if (data?.musics?.length > 0) {
          this.getTracksInfo(data.musics);
        } else {
          this.tracks = [];
        }
        this.cd.detectChanges();
      });
    this.socketService
      .listenToServer(`room delete ${this.roomId}`)
      .subscribe((data) => {
        this.location.historyGo(-1);
      });
  }

  public roomId: string = this.route.snapshot.paramMap.get('id');
  public room: Room;
  public user: User;
  public tracks = [];
  public trackPlaying: any;
  public isInvited = false;
  public zone = undefined;

  public playerInfo: { is_playing: boolean; item: any; progress_ms: number } =
    undefined;

  public interval;

  public wait = false;

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.roomService.getRoom(this.roomId).subscribe((res) => {
      this.room = res.room;
      this.isInvited =
        this.room.invited.indexOf(this.user.id) >= 0 ||
        this.room.created_by === this.user.id
          ? true
          : false;

      if (this.isInvited === false && this.room.type === 'private') {
        this.quitRoom();
      }

      // this.getPlayerInfo();

      if (res.room.musics.length > 0) {
        this.spotifyService
          .getTracksInfo(this.room.musics.map((music) => music.trackId))
          .pipe(
            map((res: any) =>
              res.tracks.map((track) => {
                const tmp = this.room.musics.find(
                  (music) => music.trackId === track.id
                );
                return { ...track, nb_vote: tmp.nb_vote };
              })
            )
          )
          .subscribe((res) => {
            this.trackPlaying = res.find(
              (track) => track.id === this.room.track_playing
            );
            this.tracks = res?.filter(
              (music) => music.id !== this.trackPlaying?.id
            );
            console.log('celui la10101');

            this.spotifyService
              .playTrack(
                this.trackPlaying?.uri,
                this.trackPlaying?.id,
                undefined,
                this.room?.progress_ms
              )
              .subscribe((res) => {
                console.log('celui la');
              });

            this.cd.detectChanges();
          });
      }

      this.cd.detectChanges();
    });
  }

  ngAfterContentInit() {
    this.interval = setInterval(() => this.getPlayerInfo(), 1500);
  }

  getPlayerInfo() {
    this.spotifyService
      .getPlayerInfo()
      .toPromise()
      .then((res) => {
        this.tracks = this.tracks?.filter(
          (music) => music?.id !== this.trackPlaying?.id
        );
        if (typeof res !== 'string' && res !== null) {
          if (
            res.progress_ms === 0 &&
            !res.is_playing &&
            this.tracks.length >= 0 &&
            this.trackPlaying
          ) {
            console.log('wesh');

            if (
              this.room.created_by === this.user.id ||
              this.room.users[0].id === this.user.id
            ) {
              this.socketService.emitToServer('room del music', {
                roomId: this.roomId,
                trackId: this.trackPlaying.id,
              });
              this.trackPlaying = undefined;
            }

            if (this.tracks[0]) {
              this.trackPlaying = this.tracks[0];
              console.log('celui la');

              this.spotifyService
                .playTrack(this.tracks[0]?.uri, this.tracks[0]?.id)
                .subscribe((res) => {
                  console.log('celui la');
                });
            }
          } else if (
            res.progress_ms >= 0 &&
            !res.is_playing &&
            this.trackPlaying
          ) {
            // this.spotifyService.playTrack(this.trackPlaying?.uri).subscribe();
          }

          this.playerInfo = {
            is_playing: res.is_playing,
            item: res.item as any,
            progress_ms: res.progress_ms,
          };

          if (this.room.users[0].id === this.user.id) {
            this.roomService
              .stockPositionTrack(this.roomId, res.progress_ms, res.item.id)
              .subscribe();
          }
        }
        this.cd.detectChanges();
      });
  }

  getTracksInfo(musics: any[]) {
    this.spotifyService
      .getTracksInfo(musics.map((music) => music.trackId))
      .pipe(
        map((res: any) =>
          res.tracks.map((track) => {
            const tmp = this.room.musics.find(
              (music) => music.trackId === track.id
            );
            return { ...track, nb_vote: tmp.nb_vote };
          })
        )
      )
      .subscribe((res) => {
        this.trackPlaying = res.find(
          (track) => track.id === this.room.track_playing
        );
        this.tracks = res?.filter(
          (music) => music?.id !== this.trackPlaying?.id
        );

        if (this.trackPlaying === undefined && this.room?.musics?.length > 0) {
          console.log('celui la1');

          this.spotifyService
            .playTrack(this.tracks[0]?.uri, this.tracks[0]?.id)
            .subscribe((res) => {
              console.log('celui la');
            });
          this.trackPlaying = this.tracks[0];
        }

        this.cd.detectChanges();
      });
  }

  quitRoom() {
    this.socketService.emitToServer('room quit', {
      userId: this.user.id,
      roomId: this.roomId,
    });
    //this.location.back();
    this.location.historyGo(-1);
    //this.navCtrl.navigateBack('');
    //this.navCtrl.navigateBack('/tabs/home');
  }

  async presentModalSuggestion() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: ['my-custom-class', 'my-custom-modal'],
      swipeToClose: true,
      componentProps: {
        isModal: true,
      },
    });
    modal.onWillDismiss().then((res) => {
      if (res?.data?.track) {
        const track = res.data.track;
        console.log(track);
        if (!this.tracks.find((res) => res.id === track.id)) {
          this.socketService.emitToServer('room add music', {
            userId: this.user.id,
            roomId: this.roomId,
            trackId: track.id,
          });

          if (this.trackPlaying === undefined) {
            console.log('celui la');

            this.spotifyService
              .playTrack(track.uri, track.id)
              .subscribe((res) => {
                console.log('celui la');
              });
            this.trackPlaying = track;
          }
        } else {
          this.voteTrack(track.id);
        }
      }
    });
    return await modal.present();
  }

  async presentModalInvite() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: ['my-custom-class', 'my-custom-modal'],
      swipeToClose: true,
      componentProps: {
        isModal: true,
        isUser: true,
      },
    });
    modal.onWillDismiss().then((res) => {
      if (res?.data?.user) {
        const user = res.data.user;
        console.log(user);
        this.socketService.emitToServer('room invite', {
          userId: this.user.id,
          roomId: this.roomId,
          friendId: user.id,
        });
      }
    });
    return await modal.present();
  }

  async presentPopoverSettings(event) {
    const popover = await this.popoverCtrl.create({
      event,
      component: SettingsRoomComponent,
      cssClass: 'my-custom-popover',
      componentProps: {
        room: this.room,
        userId: this.user.id,
        type: 'room',
      },
    });
    popover.onWillDismiss().then((res) => {});
    return await popover.present();
  }

  play() {
    console.log(this.wait);

    if (!this.wait && !this.playerInfo.is_playing) {
      console.log(this.wait);
      this.wait = true;
      this.cd.detectChanges();

      forkJoin(
        this.room.users.map((user) => this.spotifyService.play(user.deviceId))
      )
        .toPromise()
        .then((data) => {
          console.log("pourauoi c'est luo");
          this.playerInfo.is_playing = true;
          this.wait = false;
          this.cd.detectChanges();
        })
        .catch((err) => (this.wait = false));
    }
  }

  pause() {
    console.log(this.wait);

    if (!this.wait && this.playerInfo.is_playing) {
      console.log(this.wait);
      this.wait = true;

      this.cd.detectChanges();
      forkJoin(
        this.room.users.map((user) => this.spotifyService.pause(user.deviceId))
      )
        .toPromise()
        .then((data) => {
          this.playerInfo.is_playing = false;
          this.wait = false;
          this.cd.detectChanges();
        })
        .catch((err) => (this.wait = false));
    }
  }

  nextTrack() {
    if (this.trackPlaying) {
      this.socketService.emitToServer('room del music', {
        roomId: this.roomId,
        trackId: this.trackPlaying.id,
      });
      this.trackPlaying = undefined;
    }
    if (this.tracks[0]) {
      forkJoin(
        this.room.users.map((user) =>
          this.spotifyService.playTrack(
            this.tracks[0]?.uri,
            this.tracks[0]?.id,
            user.deviceId
          )
        )
      ).subscribe((data) => {
        this.trackPlaying = this.tracks[0];
        this.tracks = this.tracks.filter(
          (track) => track.id !== this.trackPlaying.id
        );
        this.playerInfo.is_playing = true;
        this.cd.detectChanges();
      });
    } else {
      this.pause();
    }
  }

  voteTrack(trackId: string) {
    if (
      this.room?.musics?.find(
        (music) =>
          music.trackId === trackId &&
          music.vote.find((user) => user === this.user.id) === undefined
      )
    ) {
      this.socketService.emitToServer('room vote music', {
        userId: this.user.id,
        roomId: this.roomId,
        trackId: trackId,
      });
    }
  }

  isVoteTrack(trackId: string) {
    const music = this.room?.musics?.find((music) => music.trackId === trackId);
    return !!music?.vote?.find((user) => user === this.user.id);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
      this.socketService.emitToServer('room quit', {
        userId: this.user.id,
        roomId: this.roomId,
      });
    }
  }
}
