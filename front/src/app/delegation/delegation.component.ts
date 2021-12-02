import { WebsocketService } from './../_services/websocketService';
import { AuthService } from './../_services/auth_service';
import { User } from 'libs/user';
import { ModalController } from '@ionic/angular';
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
        (click)="this.dismiss(device.userId)"
        *ngFor="let device of this.devices"
        class="device-container"
      >
        {{ device?.userName }}
      </div>
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
    private cd: ChangeDetectorRef
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
          friend: user.id,
        });
      }
    });
    return await modal.present();
  }

  dismiss(deviceId?: string) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
      deviceId: deviceId,
    });
  }
}
