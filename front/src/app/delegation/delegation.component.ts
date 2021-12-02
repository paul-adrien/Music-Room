import { SpotifyService } from './../_services/spotify_service';
import { WebsocketService } from './../_services/websocketService';
import { AuthService } from './../_services/auth_service';
import { User } from 'libs/user';
import { ModalController, AlertController } from '@ionic/angular';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-delegation',
  template: `
    <div class="title">Écoute sur {{ this.user?.userName }}</div>
    <div class="primary-button" (click)="this.delegateControl()">
      Déléguer le controle
    </div>
    <div class="sub-title">Autres appareils</div>
    <div class="devices">
      <div
        (click)="this.selectPlayer(device)"
        *ngFor="let device of this.devices"
        class="device-container"
      >
        {{ device?.userName }}
      </div>
    </div>
    <div class="control-buttons-container">
      <img
        (click)="this.previousTrack()"
        class="next-previous"
        src="./assets/previous.svg"
      />
      <div class="play-pause-container">
        <img (click)="this.play()" class="play-pause" src="./assets/play.svg" />
        <img
          (click)="this.pause()"
          class="play-pause"
          src="./assets/pause.svg"
        />
      </div>
      <img
        (click)="this.nextTrack()"
        class="next-previous"
        src="./assets/next.svg"
      />
    </div>
  `,
  styleUrls: ['./delegation.component.scss'],
})
export class DelegationComponent implements OnInit {
  @Input() public deviceName: string;
  @Input() public deviceId: string;
  constructor(
    private modalController: ModalController,
    private authService: AuthService,
    private socketService: WebsocketService,
    private cd: ChangeDetectorRef,
    private spotifyService: SpotifyService,
    private alertController: AlertController
  ) {
    this.user = this.authService.getUser();

    this.socketService
      .listenToServer(`user update ${this.user?.id}`)
      .subscribe((data) => {
        this.user = data;
        this.authService.saveUser(data);
        this.cd.detectChanges();
      });
  }

  public user: User;
  public devices: any;

  ngOnInit() {
    this.user = this.authService.getUser();
    this.devices = this.authService.getDelegation();
  }

  async delegateControl() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: ['my-custom-class', 'my-custom-modal'],
      swipeToClose: true,
      componentProps: {
        isModal: true,
        isUser: true,
        onlyFriend: true,
      },
    });
    modal.onWillDismiss().then((res) => {
      console.log(res);
      if (res?.data?.user) {
        const user = res.data.user;
        console.log(user);
        this.socketService.emitToServer('give delegation permission', {
          userId: this.user.id,
          friendId: user.id,
          userName: this.user.id,
        });
      }
    });
    return await modal.present();
  }

  play() {
    const isDeleg = this.authService.getPlayerId() !== null ? true : false;
    console.log(isDeleg);

    this.spotifyService.play(undefined, isDeleg).subscribe((data) => {
      this.cd.detectChanges();
    });
  }

  playTrack(trackId: string, uri: string) {
    const isDeleg = this.authService.getPlayerId() !== null ? true : false;

    this.spotifyService
      .playTrack(uri, trackId, undefined, undefined, isDeleg)
      .subscribe((data) => {
        this.cd.detectChanges();
      });
  }

  pause() {
    const isDeleg = this.authService.getPlayerId() !== null ? true : false;

    this.spotifyService.pause(undefined, isDeleg).subscribe((data) => {
      this.cd.detectChanges();
    });
  }

  nextTrack() {
    const isDeleg = this.authService.getPlayerId() !== null ? true : false;

    this.spotifyService.next(isDeleg).subscribe();
  }

  previousTrack() {
    const isDeleg = this.authService.getPlayerId() !== null ? true : false;

    this.spotifyService.previous(isDeleg).subscribe();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Attention',
      message: 'Ouvrez Spotify avant et lancez une musique.',
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  dismiss(device: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
      device: device,
    });
  }

  selectPlayer(device: any) {
    this.authService.savePlayerId(device);
  }
}
