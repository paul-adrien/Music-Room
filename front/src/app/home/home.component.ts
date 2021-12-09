import { WebsocketService } from './../_services/websocketService';
import { PlaylistService } from './../_services/playlist_service';
import { UserService } from './../_services/user_service';
import { CreateModalComponent } from './../create-modal/create-modal.component';
import { map } from 'rxjs/operators';
import { async } from '@angular/core/testing';
import { Observable, forkJoin } from 'rxjs';
import { RoomService } from './../_services/room_service';
import { AuthService } from './../_services/auth_service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { User } from 'libs/user';
import { Route, Router } from '@angular/router';
import {
  AlertController,
  NavController,
  ModalController,
} from '@ionic/angular';
import { SpotifyService } from '../_services/spotify_service';
import { Device } from '@ionic-native/device/ngx';
import { Location } from '@angular/common';
import { Room } from 'libs/room';
import { Playlist } from 'libs/playlist';

@Component({
  selector: 'app-home',
  template: `
    <div class="title-container">
      <div>Rooms</div>
      <div class="buttons">
        <img
          (click)="this.openMessages()"
          class="img"
          src="./assets/messages.svg"
        />
        <div class="notif">
          <img
            (click)="this.openNotifs()"
            class="img"
            src="./assets/notifications-outline.svg"
          />
          <div class="red-dot" *ngIf="this.hasNotif"></div>
        </div>
        <img
          (click)="this.createRoom()"
          class="img"
          src="./assets/add-outline.svg"
        />
      </div>
    </div>
    <div class="rooms" *ngIf="this.rooms?.length > 0; else noRoom">
      <div
        class="room-container"
        (click)="this.openRoom(room._id)"
        *ngFor="let room of this.rooms"
      >
        <img class="logo-room no-img" src="./assets/radio-outline.svg" />
        <div class="title-room">
          {{ room.name }}
        </div>
      </div>
    </div>
    <ng-template #noRoom>
      <div class="no-room-or-pl">Aucune room à afficher pour l'instant</div>
    </ng-template>
    <div class="title-container">
      <div>Playlists</div>
      <div class="buttons">
        <img
          (click)="
            this.user.type == 'premium' ? this.createPlaylist() : premiumAlert()
          "
          class="img"
          src="./assets/add-outline.svg"
        />
      </div>
    </div>
    <div class="rooms" *ngIf="this.playlists?.length > 0; else noPlaylist">
      <div
        class="room-container"
        (click)="
          this.user.type == 'premium'
            ? this.openPlaylist(playlist._id)
            : premiumAlert()
        "
        *ngFor="let playlist of this.playlists"
      >
        <img class="logo-room no-img" src="./assets/radio-outline.svg" />
        <div class="title-room">
          {{ playlist.name }}
        </div>
      </div>
    </div>
    <ng-template #noPlaylist>
      <div class="no-room-or-pl">Aucune playlist à afficher pour l'instant</div>
    </ng-template>

    <!-- <div class="primary-button" (click)="this.createRoom()">Créer une room</div> -->
  `,
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public user: Partial<User>;
  public rooms: Room[];
  public playlists: Playlist[];
  public hasNotif = false;
  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private playlistService: PlaylistService,
    private router: Router,
    private spotifyService: SpotifyService,
    private device: Device,
    private alertController: AlertController,
    private modalController: ModalController,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private socketService: WebsocketService
  ) {
    const user = this.authService.getUser();

    this.socketService.listenToServer('room create').subscribe((data) => {
      if (JSON.stringify(this.rooms) !== JSON.stringify(data)) {
        this.rooms = data.filter((room: Room) => {
          if (
            room.type === 'public' ||
            (room.type === 'private' &&
              (room.created_by === this.user.id ||
                room.invited.indexOf(this.user.id) >= 0))
          )
            return true;
          else return false;
        });
        this.cd.detectChanges();
      }
    });

    this.socketService.listenToServer('playlist create').subscribe((data) => {
      if (JSON.stringify(this.playlists) !== JSON.stringify(data)) {
        this.playlists = data.filter((playlist: Playlist) => {
          if (
            playlist.type === 'public' ||
            (playlist.type === 'private' &&
              (playlist.created_by === this.user.id ||
                playlist.invited.indexOf(this.user.id) >= 0))
          )
            return true;
          else return false;
        });
      }
      this.cd.detectChanges();
    });

    this.socketService
      .listenToServer(`user update ${user?.id}`)
      .subscribe((data) => {
        this.authService.saveUser(data);
        this.user = data;
        if (
          this.user.notifs.friends.length > 0 ||
          this.user.notifs.playlist.length > 0 ||
          this.user.notifs.rooms.length > 0
        ) {
          this.hasNotif = true;
        } else {
          this.hasNotif = false;
        }

        forkJoin([
          this.roomService.getAllRoom(),
          this.playlistService.getAllPlaylist(),
        ]).subscribe(([rooms, playlists]) => {
          this.rooms = rooms.filter((room: Room) => {
            if (
              room.type === 'public' ||
              (room.type === 'private' &&
                (room.created_by === this.user.id ||
                  room.invited.indexOf(this.user.id) >= 0))
            )
              return true;
            else return false;
          });
          this.playlists = playlists.filter((playlist: Playlist) => {
            if (
              playlist.type === 'public' ||
              (playlist.type === 'private' &&
                (playlist.created_by === this.user.id ||
                  playlist.invited.indexOf(this.user.id) >= 0))
            )
              return true;
            else return false;
          });
          this.cd.detectChanges();
        });

        this.cd.detectChanges();
      });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (
      this.user?.notifs?.friends?.length > 0 ||
      this.user?.notifs?.playlist?.length > 0 ||
      this.user?.notifs?.rooms?.length > 0
    ) {
      this.hasNotif = true;
    } else {
      this.hasNotif = false;
    }
    forkJoin([
      this.roomService.getAllRoom(),
      this.playlistService.getAllPlaylist(),
    ]).subscribe(([rooms, playlists]) => {
      this.rooms = rooms.filter((room: Room) => {
        if (
          room.type === 'public' ||
          (room.type === 'private' &&
            (room.created_by === this.user.id ||
              room.invited.indexOf(this.user.id) >= 0))
        )
          return true;
        else return false;
      });
      this.playlists = playlists.filter((playlist: Playlist) => {
        if (
          playlist.type === 'public' ||
          (playlist.type === 'private' &&
            (playlist.created_by === this.user.id ||
              playlist.invited.indexOf(this.user.id) >= 0))
        )
          return true;
        else return false;
      });
      this.cd.detectChanges();
    });
  }

  ngAfterContentInit() {
    this.user = this.authService.getUser();
  }

  async createRoom() {
    const modal = await this.modalController.create({
      component: CreateModalComponent,
      cssClass: ['my-custom-class', 'my-custom-modal'],
      swipeToClose: true,
      showBackdrop: true,
      componentProps: {
        isModal: true,
        isRoom: true,
      },
    });
    modal.onWillDismiss().then((res) => {
      if (res?.data?.name) {
        // this.roomService
        //   .createRoom(this.user, res?.data?.name)
        //   .subscribe((res) => {
        //     this.rooms = this.roomService.getAllRoom();
        //     this.cd.detectChanges();
        //   });

        this.socketService.emitToServer('room create', {
          userId: this.user.id,
          name: res?.data?.name,
        });
      }
    });
    return await modal.present();
  }

  async createPlaylist() {
    const modal = await this.modalController.create({
      component: CreateModalComponent,
      cssClass: ['my-custom-class', 'my-custom-modal'],
      swipeToClose: true,
      showBackdrop: true,
      componentProps: {
        isModal: true,
        isPlaylist: true,
      },
    });
    modal.onWillDismiss().then((res) => {
      if (res?.data?.name) {
        // this.playlistService
        //   .createPlaylist(this.user, res?.data?.name)
        //   .subscribe((res) => {
        //     // this.playlists = this.playlistService.getAllPlaylist();
        //     this.cd.detectChanges();
        //   });

        this.socketService.emitToServer('playlist create', {
          userId: this.user.id,
          name: res?.data?.name,
        });
      }
    });
    return await modal.present();
  }

  openRoom(roomId: string) {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      if (
        (this.device.platform === null ||
          this.device.platform.toLocaleLowerCase() === 'ios' ||
          this.device.platform.toLocaleLowerCase() === 'android') &&
        res !== null &&
        res.device
      ) {
        this.socketService.emitToServer('room enter', {
          userId: this.user.id,
          roomId: roomId,
          device: res?.device?.id,
        });
        this.router.navigate([`tabs/tab-home/room/${roomId}`]);
      } else if (res === null || res?.device === null) {
        await this.presentAlert();
      }
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
      } else if (res === null || res?.device === null) {
        await this.presentAlert();
      }
    });
    // this.roomService.enterRoom(this.user.id, roomId);
    //com.spotify.music
  }

  openNotifs() {
    this.router.navigate([`tabs/tab-home/notifications`]);
  }

  openMessages() {
    this.router.navigate([`tabs/tab-home/messages`]);
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

  async premiumAlert() {
    const alert = await this.alertController.create({
      header: 'Attention',
      message:
        'Vous devez passer premium pour avoir accès à cette fonctionnalité.',
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
  }
}
