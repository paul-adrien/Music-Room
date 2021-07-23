import { async } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { RoomService } from './../_services/room_service';
import { AuthService } from './../_services/auth_service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { User } from 'libs/user';
import { Route, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { SpotifyService } from '../_services/spotify_service';
import { Device } from '@ionic-native/device/ngx';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  template: `
    <div>Home</div>
    <div class="rooms" *ngIf="this.rooms | async">
      <div
        class="room-container"
        (click)="this.openRoom(room._id)"
        *ngFor="let room of this.rooms | async"
      >
        {{ room.name }}
      </div>
    </div>
    <div class="primary-button" (click)="this.createRoom()">Créer une room</div>
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
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.rooms = this.roomService.getAllRoom();
  }

  createRoom() {
    this.roomService
      .createRoom(this.user, 'test room')
      .subscribe((res) => console.log(res));
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
