import { WebsocketService } from './../_services/websocketService';
import { UserService } from './../_services/user_service';
import { FriendsService } from '../_services/friends_service';
import { AuthService } from '../_services/auth_service';
import { RoomService } from './../_services/room_service';
import { Room } from './../../../libs/room';
import { SpotifyService } from './../_services/spotify_service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from 'libs/user';
import { PlaylistService } from '../_services/playlist_service';
import { Playlist } from 'libs/playlist';
import { Observable } from 'rxjs-compat/Observable';
import { Device } from '@ionic-native/device/ngx';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-profile',
  template: `
    <div class="top-container" *ngIf="this.user">
      <img
        class="back-img"
        src="./assets/chevron-back-outline.svg"
        (click)="this.quitUserProfile()"
      />
      <img
        class="picture"
        [src]="this.user?.picture ? this.user.picture : './assets/person.svg'"
      />
      <div class="name">{{ this.user.userName }}</div>
      <div
        *ngIf="
          this.isFriends == false &&
          this.invitSended == false &&
          this.invitToAccept == false
        "
        class="primary-button"
        (click)="this.inviteFriend()"
      >
        Ajouter en ami
      </div>
      <div
        *ngIf="this.isFriends == true"
        class="primary-button"
        (click)="this.deleteFriend()"
      >
        Enlever des amis
      </div>
      <div
        *ngIf="this.isFriends == false && this.invitSended == true"
        class="primary-button"
      >
        Demande d'ami envoyée
      </div>
      <div
        *ngIf="this.isFriends == false && this.invitToAccept == true"
        class="primary-button"
        (click)="this.acceptFriend()"
      >
        Accepter l'invitation
      </div>
    </div>
    <div class="bottom-container">
      <div
        *ngIf="this.musicsHistory?.length > 0 && this.isFriends"
        class="title-category"
      >
        Écoutés récemment
      </div>
      <div
        class="playlists"
        *ngIf="this.musicsHistory?.length > 0 && this.isFriends"
      >
        <div class="result-item" *ngFor="let music of this.musicsHistory">
          <img
            (click)="this.play(music)"
            class="logo "
            [src]="music.album.images[0].url"
          />
          <div (click)="this.play(music)" class="item-info">
            <div class="info-top">{{ music.name }}</div>
            <div class="info-bottom">{{ music.artists[0].name }}</div>
          </div>
        </div>
      </div>
      <div *ngIf="this.playlists?.length > 0" class="title-category">
        Playlists
      </div>
      <div
        class="playlists"
        *ngIf="this.playlists?.length > 0; else noPlaylist"
      >
        <div class="result-item" *ngFor="let playlist of this.playlists">
          <img
            (click)="this.openPlaylist(playlist._id)"
            class="logo no-img"
            src="./assets/musical-notes.svg"
          />
          <div (click)="this.openPlaylist(playlist._id)" class="item-info">
            <div class="info-top">{{ playlist.name }}</div>
            <!-- <div class="info-bottom">{{ item.artists[0].name }}</div> -->
          </div>
        </div>
      </div>
      <ng-template #noPlaylist>
        <div class="no-playlist">Aucune playlist à afficher pour l'instant</div>
      </ng-template>
    </div>
  `,
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  public user: User;
  public loggedUser: User;
  public playlists: Playlist[];
  public rooms: Room[];
  public isFriends: boolean;
  public invitSended: boolean;
  public invitToAccept: boolean;
  public musicsHistory: any[];

  constructor(
    private userService: UserService,
    private friendsService: FriendsService,
    private spotifyService: SpotifyService,
    private playlistService: PlaylistService,
    private roomService: RoomService,
    private device: Device,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private authService: AuthService,
    private socketService: WebsocketService,
    private cd: ChangeDetectorRef,
    private location: Location,
    private route: ActivatedRoute
  ) {
    const userId = this.route.snapshot.params.id;
    const loggedUser = this.authService.getUser();

    this.socketService
      .listenToServer(`user update ${loggedUser?.id}`)
      .subscribe((data) => {
        this.loggedUser = data;
        this.isFriends =
          this.loggedUser.friends
            ?.map((f) => {
              return f.id;
            })
            .indexOf(userId) != -1
            ? true
            : false;
        this.invitToAccept =
          this.loggedUser.notifs?.friends
            ?.map((f) => {
              return f.id;
            })
            .indexOf(userId) != -1
            ? true
            : false;

        this.cd.detectChanges();
      });

    this.socketService
      .listenToServer(`user update ${userId}`)
      .subscribe((data) => {
        this.user = data;
        this.isFriends =
          this.user?.friends
            ?.map((f) => {
              return f.id;
            })
            .indexOf(userId) != -1
            ? true
            : false;
        if (typeof this.user.picture !== 'string' && this.user.picture) {
          this.user.picture = 'data:image/jpeg;base64,' + data.picture.buffer;
        } else {
          this.user.picture = data.picture;
        }
        this.invitSended =
          this.user.notifs?.friends
            ?.map((f) => {
              return f.id;
            })
            .indexOf(loggedUser.id) != -1
            ? true
            : false;

        this.cd.detectChanges();
      });
  }

  public base64data: string;

  ngOnInit() {
    const userId = this.route.snapshot.params.id;
    const loggedUser = this.authService.getUser();

    this.userService.getUser(userId).subscribe(async (res) => {
      this.user = res;
      if (this.user?.musicHistory?.length > 0) {
        this.getTracksInfo(this.user.musicHistory);
      }

      if (typeof this.user?.picture !== 'string' && this.user?.picture) {
        this.user.picture = 'data:image/jpeg;base64,' + res.picture.buffer;
      } else {
        this.user.picture = res?.picture;
      }
      this.invitSended =
        this.user.notifs?.friends
          ?.map((f) => {
            return f.id;
          })
          .indexOf(loggedUser.id) != -1
          ? true
          : false;

      this.cd.detectChanges();
    });

    this.userService.getUser(loggedUser?.id).subscribe(async (res) => {
      this.loggedUser = res;

      this.isFriends =
        this.loggedUser?.friends
          ?.map((f) => {
            return f.id;
          })
          .indexOf(userId) != -1
          ? true
          : false;

      this.invitToAccept =
        this.loggedUser.notifs?.friends
          ?.map((f) => {
            return f.id;
          })
          .indexOf(userId) != -1
          ? true
          : false;

      this.cd.detectChanges();
    });

    forkJoin([
      this.roomService.getAllRoom(),
      this.playlistService.getAllPlaylist(),
    ]).subscribe(([rooms, playlists]) => {
      this.rooms = rooms.filter((room: Room) => {
        if (room.created_by === this.user.id) return true;
        else return false;
      });
      this.playlists = playlists.filter((playlist: Playlist) => {
        if (playlist.created_by === this.user.id) return true;
        else return false;
      });
      this.cd.detectChanges();
    });

    // this.playlists = this.playlistService.getAllPlaylist(this.user?.id);
    // this.rooms = this.roomService.getAllRoom(this.user?.id);
    this.cd.detectChanges();
  }

  getTracksInfo(musics: string[]) {
    this.spotifyService
      .getTracksInfo(musics)
      .pipe(map((res: any) => res.tracks))
      .subscribe((res) => {
        if (JSON.stringify(this.musicsHistory) !== JSON.stringify(res)) {
          this.musicsHistory = res;
        }
        this.cd.detectChanges();
      });
  }

  play(track: any) {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      if (res === null || res?.device === null) {
        await this.presentAlert();
      } else if (res !== null && res.device) {
        this.spotifyService.playTrack(track.uri, track.id).subscribe();
      }
    });
  }

  inviteFriend() {
    this.socketService.emitToServer('friend invite', {
      userId: this.loggedUser.id,
      friendId: this.user.id,
    });
  }

  deleteFriend() {
    this.socketService.emitToServer('friend delete', {
      userId: this.loggedUser.id,
      friendId: this.user.id,
    });
  }

  acceptFriend() {
    this.socketService.emitToServer('friend accept invite', {
      userId: this.loggedUser.id,
      friendId: this.user.id,
    });
  }

  openPlaylist(playlistId: string) {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      if (
        (this.device.platform === null ||
          this.device.platform.toLocaleLowerCase() === 'ios' ||
          this.device.platform.toLocaleLowerCase() === 'android') &&
        res !== null &&
        res.device
      ) {
        this.router.navigate([`tabs/tab-home/playlist/${playlistId}`]);
      } else if (
        (this.device.platform === null && res === null) ||
        res?.device === null
      ) {
        await this.presentAlert();
      }
    });
    // this.roomService.enterRoom(this.user.id, roomId);
    //com.spotify.music
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

  quitUserProfile() {
    this.location.historyGo(-1);
    //this.navCtrl.navigateBack('/tabs/home');
  }
}
