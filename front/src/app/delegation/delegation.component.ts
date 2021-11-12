import { WebsocketService } from './../_services/websocketService';
import { AuthService } from './../_services/auth_service';
import { User } from 'libs/user';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
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
        (click)="this.dismiss(device.id)"
        *ngFor="let device of this.user?.devices"
        class="device-container"
      >
        {{ device.name }}
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
    private socketService: WebsocketService
  ) {}

  public user: User;

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  async delegateControl() {
    const modal = await this.modalController.create({
      component: SearchComponent,
      cssClass: ['my-custom-class', 'my-custom-modal'],
      swipeToClose: true,
      componentProps: {
        isModal: true,
        isUser: true,
      },
    });
    modal.onWillDismiss().then((res) => {
      console.log(res);
      if (res?.data?.user) {
        const user = res.data.user;
        console.log(user);
        this.socketService.emitToServer('user edit', {
          userId: user.id,
          user: {
            ...user,
            devices: {
              id: this.deviceId,
              name: this.deviceName,
              userId: user.id,
            },
          },
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
