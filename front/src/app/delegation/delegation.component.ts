import { AuthService } from './../_services/auth_service';
import { User } from 'libs/user';
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-delegation',
  template: `
    <div class="title">Écoute sur {{ this.user?.userName }}</div>
    <div class="primary-button">Déléguer le controle</div>
    <div class="sub-title">Autres appareils</div>
    <div class="devices">
      <div class="device-container"></div>
    </div>
  `,
  styleUrls: ['./delegation.component.scss'],
})
export class DelegationComponent implements OnInit {
  @Input() public deviceName: string;
  constructor(
    private modalController: ModalController,
    private authService: AuthService
  ) { }

  public user: User;

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  async presentModalInvite() {
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
      if (res?.data?.user) {
        const user = res.data.user;
        console.log(user);
        // this.socketService.emitToServer('user edit', {
        //   userId: user.id,
        //   user: {...user, devices: {id: }}

        // });
      }
    });
    return await modal.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
