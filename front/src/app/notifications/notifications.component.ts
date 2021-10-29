import { PlaylistService } from './../_services/playlist_service';
import { async } from '@angular/core/testing';
import { UserService } from './../_services/user_service';
import { RoomService } from './../_services/room_service';
import { User } from './../../../libs/user';
import { AuthService } from './../_services/auth_service';
import { Location } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { SpotifyService } from '../_services/spotify_service';
import { Device } from '@ionic-native/device/ngx';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { isAfter, isBefore } from 'date-fns';
import { WebsocketService } from '../_services/websocketService';

@Component({
  selector: 'app-notifications',
  template: `
    <img
      class="back-img"
      (click)="this.back()"
      src="./assets/chevron-back-outline.svg"
    />
    <div class="title">Mes notifications</div>
    <div *ngFor="let notif of this.notifs" class="notif-container">
      <div class="text" *ngIf="notif.type === 'rooms'">
        Vous avez été invité à rejoindre la room
        <span class="font-medium">
          {{ notif?.name }}
        </span>
      </div>
      <div class="text" *ngIf="notif.type === 'playlist'">
        Vous avez été invité à rejoindre la playlist
        <span class="font-medium">
          {{ notif?.name }}
        </span>
      </div>
      <div class="text" *ngIf="notif.type === 'friends'">
        <span class="font-medium">
          {{ notif?.name }}
        </span>
        s'est abonné(e) à vous
      </div>
      <div class="buttons">
        <img
          class="img"
          (click)="this.removeNotif(notif, notif.type)"
          src="./assets/close-outline.svg"
        />
        <img
          class="img"
          (click)="this.acceptNotif(notif.id, notif.type)"
          src="./assets/checkmark-outline.svg"
        />
      </div>
    </div>
    <!-- <div *ngFor="let notif of this.user.notifs?.rooms" class="notif-container">
      <div class="text">
        Vous avez été invité à rejoindre la room
        <span class="font-medium">
          {{ notif?.name }}
        </span>
      </div>
      <div class="buttons">
        <img
          class="img"
          (click)="this.removeNotif(notif, 'rooms')"
          src="./assets/close-outline.svg"
        />
        <img
          class="img"
          (click)="this.acceptNotif(notif.id, 'rooms')"
          src="./assets/checkmark-outline.svg"
        />
      </div>
    </div>
    <div *ngFor="let notif of this.user.notifs?.playlist">
      {{ notif?.name }}
    </div>
    <div *ngFor="let notif of this.user.notifs?.friends">{{ notif?.name }}</div> -->
  `,
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  constructor(
    private location: Location,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private roomService: RoomService,
    private playlistService: PlaylistService,
    private userService: UserService,
    private spotifyService: SpotifyService,
    private device: Device,
    private router: Router,
    private alertController: AlertController,
    private socketService: WebsocketService
  ) {
    const user = this.authService.getUser();

    this.socketService.setupSocketConnection();
    this.socketService
      .listenToServer(`user update ${user.id}`)
      .subscribe((data) => {
        this.user = data;

        const tmpRoom = this.user.notifs.rooms.map((room) => ({
          ...room,
          type: 'rooms',
        }));
        const tmpPlaylist = this.user.notifs.playlist.map((playlist) => ({
          ...playlist,
          type: 'playlist',
        }));
        const tmpFriend = this.user.notifs.friends.map((friend) => ({
          ...friend,
          type: 'friends',
        }));
        this.notifs = this.notifs
          .concat(tmpRoom, tmpPlaylist, tmpFriend)
          .sort((a, b) => {
            if (isBefore(new Date(a.date), new Date(b.date))) {
              return -1;
            } else if (isAfter(new Date(a.date), new Date(b.date))) {
              return 1;
            } else {
              return 0;
            }
          });
        this.cd.detectChanges();
      });
  }

  public user: User;

  public notifs: any[] = [];

  ngOnInit() {
    this.user = this.authService.getUser();
    const tmpRoom = this.user.notifs.rooms.map((room) => ({
      ...room,
      type: 'rooms',
    }));
    const tmpPlaylist = this.user.notifs.playlist.map((playlist) => ({
      ...playlist,
      type: 'playlist',
    }));
    const tmpFriend = this.user.notifs.friends.map((friend) => ({
      ...friend,
      type: 'friends',
    }));
    this.notifs = this.notifs
      .concat(tmpRoom, tmpPlaylist, tmpFriend)
      .sort((a, b) => {
        if (isBefore(new Date(a.date), new Date(b.date))) {
          return -1;
        } else if (isAfter(new Date(a.date), new Date(b.date))) {
          return 1;
        } else {
          return 0;
        }
      });
    //this.notifs = {playlist: this.user.notifs.playlist, friends: this.user.notifs.friends, rooms: this.user.notifs.rooms.map(room => {...room, this.})}
    this.cd.detectChanges();
  }

  public back() {
    this.location.back();
  }

  acceptNotif(id: string, type: string) {
    if (type === 'rooms') {
      this.roomService.acceptInviteRoom(id, this.user.id).subscribe((res) => {
        if (res.status) {
          this.openNotif(id, type);
        }
      });
    } else if (type === 'playlist') {
      this.playlistService
        .acceptInvitePlaylist(id, this.user.id)
        .subscribe((res) => {
          if (res.status) {
            this.openNotif(id, type);
          }
        });
    }
  }

  openNotif(id: string, type: string) {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      console.log(this.device.platform, res);
      if (this.device.platform === null && res?.device?.id) {
        if (type === 'rooms') {
          this.roomService
            .enterRoom(this.user.id, id, res?.device?.id)
            .subscribe((res) => {
              if (res?.status) {
                this.router.navigate([`tabs/tab-home/room/${id}`]);
              }
            });
        } else if (type === 'playlist') {
          this.router.navigate([`tabs/tab-home/playlist/${id}`]);
        }
      } else if (this.device.platform === null && !res?.device?.id) {
        await this.presentAlert();
      }
    });
    // this.roomService.enterRoom(this.user.id, roomId);
    //com.spotify.music
  }

  removeNotif(notif: any, type: string) {
    let user = this.user;
    user.notifs[type] = user.notifs[type].filter(
      (el) => el.id === notif.id && new Date(el.date) === new Date(notif.date)
    );
    console.log(user);
    this.userService.updateUser(user).subscribe((res) => {});
  }

  getRoomName(roomId: string) {
    return this.roomService.getRoom(roomId).pipe(map((room) => room.name));
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Attention',
      message: 'Ouvre spotify avant, fdp.',
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
