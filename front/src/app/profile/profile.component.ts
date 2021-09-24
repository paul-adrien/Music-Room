import { SpotifyService } from './../_services/spotify_service';
import { AuthService } from './../_services/auth_service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from 'libs/user';
import { PlaylistService } from '../_services/playlist_service';
import { Playlist } from 'libs/playlist';
import { Observable } from 'rxjs-compat/Observable';
import { Device } from '@ionic-native/device/ngx';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
      <div class="primary-button">Modifier le profil</div>
    </div>
    <div class="bottom-container">
      <div>Playlists</div>
      <div class="playlists" *ngIf="this.playlists | async">
        <div
          class="result-item"
          (click)="this.openPlaylist(playlist._id)"
          *ngFor="let playlist of this.playlists | async"
        >
          <img class="logo no-img" src="./assets/radio-outline.svg" />
          <div class="item-info">
            <div class="info-top">{{ playlist.name }}</div>
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

  constructor(
    private authService: AuthService,
    private spotifyService: SpotifyService,
    private playlistService: PlaylistService,
    private device: Device,
    private router: Router,
    private alertController: AlertController,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.playlists = this.playlistService.getAllPlaylist(this.user.id);
    this.cd.detectChanges();
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

  logOut() {
    this.spotifyService.pause().subscribe(
      (res) => {},
      () => this.authService.logOut(),
      () => this.authService.logOut()
    );
  }
}
