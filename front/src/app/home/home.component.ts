import { UserService } from './../_services/user_service';
import { CreateModalComponent } from './../create-modal/create-modal.component';
import { map } from 'rxjs/operators';
import { async } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { RoomService } from './../_services/room_service';
import { AuthService } from './../_services/auth_service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-home',
  template: `
    <div class="title-container">
      <div>Mes rooms</div>
      <div class="buttons">
        <img
          (click)="this.openNotifs()"
          class="img"
          src="./assets/notifications-outline.svg"
        />
        <img
          (click)="this.createRoom()"
          class="img"
          src="./assets/add-outline.svg"
        />
      </div>
    </div>
    <div class="rooms" *ngIf="this.rooms | async">
      <div
        class="room-container"
        (click)="this.openRoom(room._id)"
        *ngFor="let room of this.rooms | async"
      >
        <img class="logo-room no-img" src="./assets/radio-outline.svg" />
        <div class="title-room">
          {{ room.name }}
        </div>
      </div>
    </div>
    <!-- <div class="primary-button" (click)="this.createRoom()">Créer une room</div> -->
  `,
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public user: Partial<User>;
  public rooms: Observable<any[]>;
  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private router: Router,
    private spotifyService: SpotifyService,
    private device: Device,
    private alertController: AlertController,
    private modalController: ModalController,
    private userService: UserService
  ) {}

  public interval;

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.rooms = this.roomService.getAllRoom();
  }

  ngAfterContentInit() {
    this.interval = setInterval(() => {
      this.userService.getUser(this.user.id).subscribe((res) => {
        this.authService.saveUser(res);
        this.user = this.authService.getUser();
      });
    }, 10000);
  }

  async createRoom() {
    const modal = await this.modalController.create({
      component: CreateModalComponent,
      cssClass: ['my-custom-class', 'my-custom-modal'],
      swipeToClose: true,
      showBackdrop: true,
      componentProps: {
        isModal: true,
      },
    });
    modal.onWillDismiss().then((res) => {
      if (res?.data?.name) {
        this.roomService
          .createRoom(this.user, res?.data?.name)
          .subscribe((res) => {
            console.log(res);
            this.rooms = this.roomService.getAllRoom();
          });
      }
    });
    return await modal.present();
  }

  openRoom(roomId: string) {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      console.log(this.device.platform, res);
      if (this.device.platform === null && res?.device?.id) {
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

  openNotifs() {
    this.router.navigate([`tabs/tab-home/notifications`]);
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
