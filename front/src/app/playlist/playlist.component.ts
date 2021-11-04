import { PlaylistService } from './../_services/playlist_service';
import { Playlist } from './../../../libs/playlist';
import { ModalController, PopoverController } from '@ionic/angular';
import { AuthService } from './../_services/auth_service';
import { SpotifyService } from './../_services/spotify_service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'libs/user';
import { forkJoin } from 'rxjs';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { SearchComponent } from '../search/search.component';
import { ItemReorderEventDetail } from '@ionic/core';
import { SettingsRoomComponent } from '../settings-room/settings-room.component';
import { WebsocketService } from '../_services/websocketService';

@Component({
  selector: 'app-playlist',
  template: ` <div class="top-container">
      <img
        class="back-img"
        (click)="this.quitPlaylist()"
        src="./assets/chevron-back-outline.svg"
      />
      <div *ngIf="this.playlist" class="title">
        {{ this.playlist.name }}
      </div>
    </div>
    <div class="playlist-container" *ngIf="this.playlist">
      <div *ngIf="this.tracks[0]" class="player-container">
        <div class="player-info">
          <img
            class="img-track"
            [src]="this.tracks[0]?.album?.images[0]?.url"
          />
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
      <div class="buttons-middle" *ngIf="this.checkRight()">
        <div
          class="primary-button suggestion"
          (click)="this.presentModalSuggestion()"
        >
          Suggérer un titre
        </div>
        <div class="buttons-right">
          <img
            class="add"
            (click)="this.presentModalInvite()"
            src="./assets/person-add-outline.svg"
          />
          <img
            *ngIf="this.playlist.created_by === this.user.id"
            class="add"
            (click)="this.presentPopoverSettings($event)"
            src="./assets/settings-white.svg"
          />
        </div>
      </div>
      <div></div>
      <div class="sub-title">Prochains titres</div>
      <ion-reorder-group (ionItemReorder)="doReorder($event)" disabled="false">
        <div
          *ngFor="let track of this.tracks; let i = index"
          class="tracks-container"
        >
          <img
            (click)="this.play(i)"
            class="logo"
            [src]="track.album.images[0].url"
          />
          <div (click)="this.play(i)" class="track-info">
            <div class="info-top" [class.green]="this.indexTrack === i">
              {{ track.name }}
            </div>
            <div class="info-bottom">{{ track.artists[0].name }}</div>
          </div>
          <ion-reorder
            *ngIf="this.checkRight()"
            style="height: 2.5rem;"
            slot="end"
          >
            <img class="logo" src="./assets/reorder-three-outline.svg" />
          </ion-reorder>
          <!-- <div class="buttons-vote">
            <img
              class="down"
              [src]="
                this.isVoteTrack(track.id)
                  ? './assets/thumbs-down-green.svg'
                  : './assets/thumbs-down.svg'
              "
            />
          </div> -->
        </div>
      </ion-reorder-group>
    </div>`,
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  public playlistId: string = this.route.snapshot.paramMap.get('id');
  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private cd: ChangeDetectorRef,
    private spotifyService: SpotifyService,
    private location: Location,
    private authService: AuthService,
    public modalController: ModalController,
    private popoverCtrl: PopoverController,
    private socketService: WebsocketService
  ) {
    this.socketService.setupSocketConnection();
    this.socketService
      .listenToServer(`playlist update ${this.playlistId}`)
      .subscribe((data) => {
        console.log(data);
        if (JSON.stringify(this.playlist) !== JSON.stringify(data)) {
          this.playlist = data;
        }

        this.indexTrack = this.playlist.musics.findIndex(
          (music) => music.trackId === this.playerInfo.item.id
        );

        if (data?.musics?.length > 0) {
          this.getTracksInfo(data.musics);
        } else {
          this.tracks = [];
        }
        this.cd.detectChanges();
      });
  }

  public playlist: Playlist;
  public user: User;
  public tracks = [];

  public isPublic = true;

  public playerInfo: { is_playing: boolean; item: any; progress_ms: number } =
    undefined;

  public interval;

  public wait = false;

  public indexTrack = undefined;

  ngOnInit() {
    this.user = this.authService.getUser();

    this.playlistService.getPlaylist(this.playlistId).subscribe((res) => {
      this.playlist = res.playlist;
      this.isPublic = this.playlist.type === 'public' ? true : false;
      if (res.playlist.musics.length > 0) {
        this.spotifyService
          .getTracksInfo(this.playlist.musics.map((music) => music.trackId))
          .pipe(map((res: any) => res.tracks))
          .subscribe((res) => {
            this.tracks = res;
            if (
              this.playlist.users.length === 1 &&
              this.user.id === this.playlist.users[0].id
            ) {
              //this.spotifyService.playTrack(this.tracks[0].uri).subscribe();
            }
            this.cd.detectChanges();
          });
      }
      this.cd.detectChanges();
    });
  }

  doReorder(ev: any) {
    // Before complete is called with the items they will remain in the
    // order before the drag
    console.log('Before complete', ev);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. Update the items variable to the
    // new order of items
    this.tracks = ev.detail.complete(this.tracks);

    this.socketService.emitToServer('playlist edit', {
      playlistId: this.playlistId,
      playlistBody: {
        ...this.playlist,
        musics: this.tracks.map((track) => ({ trackId: track.id })),
      },
    });

    // After complete is called the items will be in the new order
    console.log('After complete', this.tracks);
    this.indexTrack = this.tracks.findIndex(
      (track) => track.id === this.playerInfo.item.id
    );
    this.cd.detectChanges();
  }

  ngAfterContentInit() {
    this.interval = setInterval(() => this.getPlayerInfo(), 1500);
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
            if (this.tracks[this.indexTrack + 1]) {
              this.spotifyService
                .playTrack(this.tracks[this.indexTrack + 1]?.uri)
                .subscribe();
              this.indexTrack++;
            }
          }
          this.playerInfo = {
            is_playing: res.is_playing,
            item: res.item as any,
            progress_ms: res.progress_ms,
          };

          this.indexTrack = this.playlist.musics.findIndex(
            (music) => music.trackId === this.playerInfo.item.id
          );
        }
        this.cd.detectChanges();
      });
  }

  getTracksInfo(musics: any) {
    this.spotifyService
      .getTracksInfo(musics.map((music) => music.trackId))
      .pipe(map((res: any) => res.tracks))
      .subscribe((res) => {
        if (JSON.stringify(this.tracks) !== JSON.stringify(res)) {
          this.tracks = res;
        }
        this.cd.detectChanges();
      });
  }

  quitPlaylist() {
    this.location.historyGo(-1);
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
          this.socketService.emitToServer('playlist add music', {
            userId: this.user.id,
            playlistId: this.playlistId,
            trackId: track.id,
          });
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
        this.socketService.emitToServer('playlist invite', {
          userId: this.user.id,
          playlistId: this.playlistId,
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
        playlist: this.playlist,
        userId: this.user.id,
        type: 'playlist',
      },
    });
    popover.onWillDismiss().then((res) => {});
    return await popover.present();
  }

  play(index: number) {
    this.indexTrack = index;
    this.spotifyService.playTrack(this.tracks[index]?.uri).subscribe();
  }

  pause() {
    // console.log(this.wait);
    // if (
    //   !this.wait &&
    //   this.playerInfo.is_playing &&
    //   this.playlist.users.find((user) => user.id === this.user.id && user.right)
    // ) {
    //   console.log(this.wait);
    //   this.wait = true;
    //   this.cd.detectChanges();
    //   forkJoin(
    //     this.playlist.users.map((user) =>
    //       this.spotifyService.pause(user.deviceId)
    //     )
    //   )
    //     .toPromise()
    //     .then((data) => {
    //       this.playerInfo.is_playing = false;
    //       this.wait = false;
    //       this.cd.detectChanges();
    //     })
    //     .catch((err) => (this.wait = false));
    // }
  }

  nextTrack() {
    // if (this.tracks[1]) {
    //   forkJoin(
    //     this.playlist.users.map((user) =>
    //       this.spotifyService.playTrack(this.tracks[1]?.uri, user.deviceId)
    //     )
    //   ).subscribe((data) => {
    //     this.playerInfo.is_playing = true;
    //     this.cd.detectChanges();
    //   });
    // } else {
    //   this.pause();
    // }
    // if (
    //   this.playlist.users.find(
    //     (user) => user.id === this.user.id && user.right
    //   ) &&
    //   this.tracks[0]
    // ) {
    //   this.playlistService.delTrack(this.tracks[0].id, this.playlistId).subscribe();
    // }
  }

  checkRight() {
    return (
      this.isPublic ||
      this.playlist.invited.find((userId) => userId === this.user.id) ||
      this.playlist.created_by === this.user.id
    );
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.quitPlaylist();
  }
}
