import { WebsocketService } from './../_services/websocketService';
import { UserService } from './../_services/user_service';
import { EditProfileComponent } from './../edit-profile/edit-profile.component';
import { RoomService } from './../_services/room_service';
import { Room } from './../../../libs/room';
import { SpotifyService } from './../_services/spotify_service';
import { AuthService } from './../_services/auth_service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from 'libs/user';
import { PlaylistService } from '../_services/playlist_service';
import { Playlist } from 'libs/playlist';
import { Observable } from 'rxjs-compat/Observable';
import { Device } from '@ionic-native/device/ngx';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  template: `
    <div class="top-container" *ngIf="this.user">
      <img class="log-out" src="./assets/log-out.svg" (click)="this.logOut()" />
      <img
        class="picture"
        [src]="this.user?.picture ? this.user.picture : './assets/person.svg'"
      />
      <div class="name">{{ this.user.firstName }} {{ this.user.lastName }}</div>
      <div>{{ this.user.userName }}</div>
      <div class="primary-button" (click)="this.presentModalEdit()">
        Modifier le profil
      </div>
    </div>
    <div class="bottom-container">
      <div class="title-category">Playlists</div>
      <div class="playlists" *ngIf="this.playlists | async">
        <div
          class="result-item"
          (click)="this.openPlaylist(playlist._id)"
          *ngFor="let playlist of this.playlists | async"
        >
          <img class="logo no-img" src="./assets/musical-notes.svg" />
          <div class="item-info">
            <div class="info-top">{{ playlist.name }}</div>
            <!-- <div class="info-bottom">{{ item.artists[0].name }}</div> -->
          </div>
        </div>
      </div>
      <div class="title-category">Rooms</div>
      <div class="rooms" *ngIf="this.rooms | async">
        <div
          class="result-item"
          (click)="this.openRoom(room._id)"
          *ngFor="let room of this.rooms | async"
        >
          <img class="logo no-img" src="./assets/musical-notes.svg" />
          <div class="item-info">
            <div class="info-top">{{ room.name }}</div>
            <!-- <div class="info-bottom">{{ item.artists[0].name }}</div> -->
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public user: Partial<User>;
  public playlists: Observable<Playlist[]>;
  public rooms: Observable<Room[]>;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private spotifyService: SpotifyService,
    private playlistService: PlaylistService,
    private roomService: RoomService,
    private device: Device,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private socketService: WebsocketService,
    private cd: ChangeDetectorRef
  ) {
    const user = this.authService.getUser();

    this.socketService.setupSocketConnection();
    this.socketService
      .listenToServer(`user update ${user.id}`)
      .subscribe((data) => {
        this.user = data;
        console.log('ici bg');
        if (typeof this.user.picture !== 'string' && this.user.picture) {
          this.user.picture = 'data:image/jpeg;base64,' + data.picture.buffer;
        } else {
          this.user.picture = data.picture;
        }
        this.cd.detectChanges();
      });
  }

  public base64data: string;

  ngOnInit() {
    this.user = this.authService.getUser();
    this.userService.getUser(this.user.id).subscribe(async (res) => {
      this.user = res;
      console.log(res);
      if (typeof this.user.picture !== 'string' && this.user.picture) {
        this.user.picture = 'data:image/jpeg;base64,' + res.picture.buffer;
      } else {
        this.user.picture = res.picture;
      }
      this.cd.detectChanges();
    });

    this.playlists = this.playlistService.getAllPlaylist(this.user.id);
    this.rooms = this.roomService.getAllRoom(this.user.id);
    this.cd.detectChanges();
  }

  openRoom(roomId: string) {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      console.log(this.device.platform, res);
      if (
        (this.device.platform === null ||
          this.device.platform.toLocaleLowerCase() === 'ios') &&
        res?.device?.id
      ) {
        this.roomService
          .enterRoom(this.user.id, roomId, res?.device?.id)
          .subscribe((res) => {
            if (res?.status) {
              this.router.navigate([`tabs/tab-home/room/${roomId}`]);
            }
          });
      } else if (this.device.platform === null && !res?.device?.id) {
        await this.presentAlert();
      }
    });
    // this.roomService.enterRoom(this.user.id, roomId);
    //com.spotify.music
  }

  openPlaylist(playlistId: string) {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      console.log(this.device.platform, res);
      if (
        (this.device.platform === null ||
          this.device.platform.toLocaleLowerCase() === 'ios') &&
        res?.device?.id
      ) {
        this.router.navigate([`tabs/tab-home/playlist/${playlistId}`]);
      } else if (this.device.platform === null && !res?.device?.id) {
        await this.presentAlert();
      }
    });
    // this.roomService.enterRoom(this.user.id, roomId);
    //com.spotify.music
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

  async presentModalEdit() {
    const modal = await this.modalController.create({
      component: EditProfileComponent,
      cssClass: ['my-custom-class', 'my-custom-modal'],
      swipeToClose: true,
      componentProps: {
        isModal: true,
        isUser: true,
      },
    });
    modal.onWillDismiss().then((res) => {
      if (res?.data?.picture) {
        this.user.picture = res?.data?.picture;
      }
      this.cd.detectChanges();
    });
    return await modal.present();
  }

  logOut() {
    this.spotifyService.pause().subscribe(
      (res) => {},
      () => this.authService.logOut(),
      () => this.authService.logOut()
    );
  }
}
