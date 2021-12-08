import { User } from 'libs/user';
import { AuthService } from './../_services/auth_service';
import { UserService } from './../_services/user_service';
import { SpotifyService } from './../_services/spotify_service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search',
  template: `
    <div class="header">
      <div class="search-container">
        <img src="./assets/search-outline.svg" />
        <input (change)="this.search($event)" />
      </div>
    </div>
    <div class="result">
      <div *ngIf="!this.isUser && this.searchRes?.items?.length > 0; else user">
        <div
          class="result-item"
          (click)="this.isModal ? this.dismiss(item) : this.play(item)"
          *ngFor="let item of this.searchRes.items"
        >
          <img class="logo" [src]="item.album.images[0].url" />
          <div class="item-info">
            <div class="info-top">{{ item.name }}</div>
            <div class="info-bottom">{{ item.artists[0].name }}</div>
          </div>
        </div>
      </div>
      <ng-template #user>
        <div
          class="result-item"
          (click)="this.dismiss(item)"
          *ngFor="let item of this.searchRes"
        >
          <img
            class="logo round"
            [src]="
              item?.picture ? this.getPicture(item) : './assets/person.svg'
            "
          />
          <div class="item-info">
            <div class="info-top">{{ item.userName }}</div>
            <div class="info-bottom">
              {{ item.firstName }} {{ item.lastName }}
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() public isModal = false;
  @Input() public isUser = false;
  @Input() public onlyFriend = false;
  public searchRes: any;
  public progressTime = 0;
  public playerInfo: { is_playing: boolean; item: any; progress_ms: number };

  constructor(
    private spotifyService: SpotifyService,
    private cd: ChangeDetectorRef,
    public modalController: ModalController,
    private userService: UserService,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  play(track: any) {
    this.spotifyService.getPlayerInfo().subscribe(async (res) => {
      if (res === null || res?.device === null) {
        await this.presentAlert();
      } else if (res !== null && res.device) {
        this.spotifyService.playTrack(track.uri, track.id).subscribe();
      }
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

  search(event: any) {
    const user = this.authService.getUser();

    if (!this.isUser) {
      this.spotifyService.searchMusic(event.target.value).subscribe((data) => {
        this.searchRes = data.tracks;
        this.cd.detectChanges();
      });
    } else if (this.isUser) {
      this.userService.searchUser(event.target.value).subscribe((data) => {
        this.searchRes = data?.filter((el) => el.id !== user.id);
        if (this.onlyFriend) {
          this.searchRes = data?.filter((el) =>
            user?.friends
              ?.map((f) => {
                return f.id;
              })
              .indexOf(el.id) != -1
              ? true
              : false
          );
        }
        this.cd.detectChanges();
      });
    }
  }

  getPicture(user: User) {
    if (typeof user?.picture !== 'string' && user?.picture) {
      return 'data:image/jpeg;base64,' + user.picture.buffer;
    } else {
      return user.picture;
    }
  }

  testMusic() {
    this.spotifyService.getAuthorizationToken().subscribe();
  }

  testRequestAutho() {
    this.spotifyService.requestAuthorization();
  }

  dismiss(res?: any) {
    if (!this.isUser) {
      this.modalController.dismiss({
        dismissed: true,
        track: res,
      });
    } else if (this.isUser) {
      this.modalController.dismiss({
        dismissed: true,
        user: res,
      });
    }
  }
}
