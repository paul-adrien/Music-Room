import { WebsocketService } from './../_services/websocketService';
import { UserService } from './../_services/user_service';
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
        *ngIf="this.friends == false"
        class="primary-button"
        (click)="this.addFriend()"
      >
        Ajouter en ami
      </div>
      <div
        *ngIf="this.friends == true"
        class="primary-button"
        (click)="this.removeFriend()"
      >
        Enlever des amis
      </div>
    </div>
    <div class="bottom-container">
      <div *ngIf="this.playlists?.length > 0" class="title-category">
        Playlists
      </div>
      <div class="playlists" *ngIf="this.playlists">
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
    </div>
  `,
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  public user: User;
  public playlists: Playlist[];
  public rooms: Room[];
  public friends: boolean;

  constructor(
    private userService: UserService,
    private spotifyService: SpotifyService,
    private playlistService: PlaylistService,
    private roomService: RoomService,
    private device: Device,
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private socketService: WebsocketService,
    private cd: ChangeDetectorRef,
    private location: Location,
    private route: ActivatedRoute
  ) {
    const userId = this.route.snapshot.params.id;
    console.log('user id ==> ', userId);
    const user = this.userService.getUser(userId);
    console.log('this.friends 1==> ', this.friends, userId, this.user);
    this.friends = this.user?.friends?.indexOf(userId) >= 0 ? true : false;
    console.log('this.friends 2==> ', this.friends);

    this.socketService
      .listenToServer(`user update ${userId}`)
      .subscribe((data) => {
        this.user = data;
        if (typeof this.user.picture !== 'string' && this.user.picture) {
          this.user.picture = 'data:image/jpeg;base64,' + data.picture.buffer;
        } else {
          this.user.picture = data.picture;
        }
        this.cd.detectChanges();
      });

    this.socketService.listenToServer(`playlist create`).subscribe((data) => {
      this.playlists = data.filter((playlist: Playlist) => {
        if (playlist.created_by === this.user.id)
          if (this.friends == false && playlist.type == 'private') return false;
          else return true;
        else return false;
      });
      this.cd.detectChanges();
    });

    this.socketService.listenToServer(`room create`).subscribe((data) => {
      this.rooms = data.filter((room: Room) => {
        if (room.created_by === this.user.id) return true;
        else return false;
      });
      this.cd.detectChanges();
    });
  }

  public base64data: string;

  ngOnInit() {
    const userId = this.route.snapshot.params.id;
    this.userService.getUser(userId).subscribe(async (res) => {
      this.user = res;
      console.log(res);
      if (typeof this.user?.picture !== 'string' && this.user?.picture) {
        this.user.picture = 'data:image/jpeg;base64,' + res.picture.buffer;
      } else {
        this.user.picture = res?.picture;
      }
      this.cd.detectChanges();
    });
    this.friends = this.user?.friends?.indexOf(userId) >= 0 ? true : false;

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

  addFriend() {
    console.log('addFriend called !');
    this.friends = true;
  }

  removeFriend() {
    console.log('removeFriend called !');
    this.friends = false;
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

  quitUserProfile() {
    this.location.historyGo(-1);
    //this.navCtrl.navigateBack('/tabs/home');
  }
}
