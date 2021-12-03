import { User } from 'libs/user';
import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth_service';
import { WebsocketService } from '../_services/websocketService';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@ionic-native/in-app-browser/ngx';
import { Device } from '@ionic-native/device/ngx';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-settings-profile',
  template: `
    <img
      class="back-img"
      (click)="this.back()"
      src="./assets/chevron-back-outline.svg"
    />
    <div class="title">Paramètres</div>
    <div class="item-container">
      <div class="text">Free / Premium</div>
      <ion-toggle
        [(ngModel)]="this.toggle"
        [checked]="this.user?.type === 'premium'"
        (click)="this.upgradeAccount($event)"
      ></ion-toggle>
    </div>
    <div
      *ngIf="!this.user?.google_account?.id && !isGoogleId"
      class="item-container last"
    >
      <div class="text">Lier un compte Google</div>
      <img
        (click)="this.linkGoogle()"
        class="img"
        src="./assets/add-outline.svg"
      />
    </div>
    <div *ngIf="this.user?.google_account?.id" class="item-container last">
      <div class="text">Compte Google</div>
      <div>{{ this.user?.google_account?.email }}</div>
    </div>
    <div (click)="this.presentDeleteUser()" class="item-container delete">
      <span> Supprimer mon compte </span>
    </div>
  `,
  styleUrls: ['./settings-profile.component.scss'],
})
export class SettingsProfileComponent implements OnInit {
  public user: User;

  constructor(
    private readonly location: Location,
    private authService: AuthService,
    private socketService: WebsocketService,
    private cd: ChangeDetectorRef,
    private iab: InAppBrowser,
    private device: Device,
    private ngZone: NgZone,
    private route: Router,
    private router: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.user = this.authService.getUser();

    this.socketService
      .listenToServer(`user update ${this.user?.id}`)
      .subscribe((data) => {
        this.isGoogleId = this.user.id.includes('google');

        this.toggle = data.type === 'premium' ? true : false;
        this.cd.detectChanges();
      });
  }
  public toggle = false;

  public isGoogleId = false;

  ngOnInit() {
    this.user = this.authService.getUser();
    this.isGoogleId = this.user?.id.includes('google');
    if (this.user?.type === 'premium') {
      this.toggle = true;
    }
    this.router.queryParams.subscribe((params) => {
      if (params?.data && params?.data !== 'undefined') {
        const data = JSON.parse(decodeURI(params.data));

        if (data.user) {
          this.authService.saveUser(data.user);
          this.user = this.authService.getUser();
          this.cd.detectChanges();
        }
      }
    });
  }

  public back() {
    this.location.back();
  }

  upgradeAccount(event: any) {
    this.socketService.emitToServer('user update type', {
      userId: this.user.id,
      type: !this.toggle ? 'premium' : 'free',
    });
  }

  public linkGoogle() {
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'no',
    };
    if (this.device?.platform === null) {
      location.href =
        'http://localhost:8080/user/authenticate/google-link/' + this.user.id;
    } else {
      const browser = this.iab.create(
        environment.AUTH_API + 'user/authenticate/google-link/' + this.user.id,
        'defaults',
        options
      );
      browser.on('loadstart').subscribe((event) => {
        console.log('start', event);
        if (
          event.url.includes('localhost:8100/tabs/tab-profile/settings?data')
        ) {
          const data = event.url.slice(
            event.url.indexOf('?data=') + '?data='.length
          );
          this.ngZone.run(() => {
            this.route.navigate([`/tabs/tab-profile/settings`], {
              queryParams: { data: data },
            });
          });
          browser.close();
        }
      });
    }
  }

  async presentDeleteUser() {
    const alert = await this.alertController.create({
      header: 'Attention',
      message:
        'Voulez vous vraiment supprimer votre compte ? Toutes vos données seront perdues.',
      buttons: [
        {
          text: 'Annuler',
          handler: (data: any) => {
            console.log('Canceled', data);
          },
        },
        {
          text: 'Confirmer',
          handler: (data: any) => {
            console.log('Saved Information', data);
            this.authService
              .deleteAccount(this.user.id)
              .subscribe((res: any) => {
                if (res?.status) {
                  this.authService.logOut();
                }
              });
          },
        },
      ],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
