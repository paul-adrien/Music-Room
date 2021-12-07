import { User } from './../../../libs/user';
import { AuthService } from './../_services/auth_service';
import { Location } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    <div *ngIf="this.notifs?.length > 0; else noNotifs">
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
          vous a envoyé une demande d'ami
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
    </div>
    <ng-template #noNotifs>
      <div class="no-notification">Aucune notification pour l'instant</div>
    </ng-template>
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
    private readonly location: Location,
    private readonly authService: AuthService,
    private readonly cd: ChangeDetectorRef,
    private readonly spotifyService: SpotifyService,
    private readonly device: Device,
    private readonly router: Router,
    private readonly alertController: AlertController,
    private readonly socketService: WebsocketService
  ) {
    const user = this.authService.getUser();

    this.socketService
      .listenToServer(`user update ${user?.id}`)
      .subscribe((data) => {
        this.user = data;
        this.authService.saveUser(data);

        const tmpRoom = this.user?.notifs?.rooms?.map((room) => ({
          ...room,
          type: 'rooms',
        }));
        const tmpPlaylist = this.user?.notifs?.playlist?.map((playlist) => ({
          ...playlist,
          type: 'playlist',
        }));
        const tmpFriend = this.user?.notifs?.friends?.map((friend) => ({
          ...friend,
          type: 'friends',
        }));
        this.notifs = new Array()
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
    const tmpRoom = this.user?.notifs?.rooms.map((room) => ({
      ...room,
      type: 'rooms',
    }));
    const tmpPlaylist = this.user?.notifs?.playlist.map((playlist) => ({
      ...playlist,
      type: 'playlist',
    }));
    const tmpFriend = this.user?.notifs?.friends.map((friend) => ({
      ...friend,
      type: 'friends',
    }));
    if (tmpFriend && tmpPlaylist && tmpRoom) {
      this.notifs = this.notifs
        .concat(tmpRoom, tmpPlaylist, tmpFriend)
        .sort((a, b) => {
          if (isBefore(new Date(a?.date), new Date(b?.date))) {
            return -1;
          } else if (isAfter(new Date(a?.date), new Date(b?.date))) {
            return 1;
          } else {
            return 0;
          }
        });
    }
    //this.notifs = {playlist: this.user.notifs.playlist, friends: this.user.notifs.friends, rooms: this.user.notifs.rooms.map(room => {...room, this.})}
    this.cd.detectChanges();
  }

  public back() {
    this.location.historyGo(-1);
  }

  acceptNotif(id: string, type: string) {
    if (type === 'rooms') {
      this.socketService.emitToServer('room accept invite', {
        userId: this.user.id,
        roomId: id,
      });
      this.openNotif(id, type);
    } else if (type === 'playlist') {
      this.socketService.emitToServer('playlist accept invite', {
        userId: this.user.id,
        playlistId: id,
      });
      this.openNotif(id, type);
    } else if (type === 'friends') {
      this.socketService.emitToServer('friend accept invite', {
        userId: this.user.id,
        friendId: id,
      });
    }
  }

  openNotif(id: string, type: string) {
    if (type === 'friends') {
      this.router.navigate([`tabs/tab-profile/user-profile/${id}`]);
    } else {
      this.spotifyService.getPlayerInfo().subscribe(async (res) => {
        if (this.device.platform === null && res?.device !== null) {
          if (type === 'rooms') {
            this.socketService.emitToServer('room enter', {
              userId: this.user.id,
              roomId: id,
              device: res?.device?.id,
            });
            this.router.navigate([`tabs/tab-home/room/${id}`]);
          } else if (type === 'playlist') {
            this.router.navigate([`tabs/tab-home/playlist/${id}`]);
          }
        } else if (this.device.platform === null && res?.device === null) {
          await this.presentAlert();
        }
      });
    }
    // this.roomService.enterRoom(this.user.id, roomId);
    //com.spotify.music
  }

  removeNotif(notif: any, type: string) {
    let user = this.user;
    user.notifs[type] = user?.notifs[type].filter(
      (el) =>
        el?.id === notif?.id && new Date(el?.date) === new Date(notif?.date)
    );
    this.user = user;
    this.cd.detectChanges();
    this.socketService.emitToServer('user edit', {
      userId: user.id,
      user: user,
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
}
