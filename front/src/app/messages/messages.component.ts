import { ModalController } from '@ionic/angular';
import { CreateModalComponent } from './../create-modal/create-modal.component';
import { AuthService } from './../_services/auth_service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../_services/message_service';
import { WebsocketService } from '../_services/websocketService';
import { User } from 'libs/user';
import { Location } from '@angular/common';

@Component({
  selector: 'app-messages',
  template: `
    <img
      class="back-img"
      (click)="this.back()"
      src="./assets/chevron-back-outline.svg"
    />
    <div class="header">
      <div class="title">Mes conversations</div>
      <img
        (click)="this.createConv()"
        class="img"
        src="./assets/add-outline.svg"
      />
    </div>
    <div *ngIf="this.convList" class="messages-container">
      <div
        (click)="this.openConversation(conv._id)"
        *ngFor="let conv of this.convList"
        class="conv-container"
      >
        <img
          class="picture"
          [src]="this.user?.picture ? this.user.picture : './assets/person.svg'"
        />
        <div class="info-container">
          <div class="conv-title">
            {{ conv.name }}
          </div>
          <div class="last-message">
            {{
              conv?.messages[conv?.messages?.length - 1]?.message ||
                'Envoyez un message !'
            }}
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit {
  public user: Partial<User>;
  public convList = [];

  constructor(
    private messageService: MessageService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private socketService: WebsocketService,
    private modalController: ModalController
  ) {
    const user = this.authService.getUser();

    this.socketService
      .listenToServer(`chat convs ${user.id}`)
      .subscribe((data) => {
        console.log(data);
        let index = this.convList.findIndex((conv) => conv._id === data._id);
        if (index >= 0) {
          this.convList[index] = data;
        } else {
          this.convList.unshift(data);
        }

        this.cd.detectChanges();
      });
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.messageService.getConvList(this.user.id).subscribe((res) => {
      console.log(res);
      if (res.status) {
        this.convList = res.conversations;
      }
      this.cd.detectChanges();
    });
    this.cd.detectChanges();
  }

  public back() {
    this.location.back();
  }

  async createConv() {
    const modal = await this.modalController.create({
      component: CreateModalComponent,
      cssClass: ['my-custom-class', 'my-custom-modal'],
      swipeToClose: true,
      componentProps: {
        isConv: true,
      },
    });
    modal.onWillDismiss().then((res) => {
      if (res?.data?.users && res?.data?.name)
        this.socketService.emitToServer('chat create conv', {
          users: [
            ...res?.data?.users,
            { userId: this.user.id, name: this.user.userName },
          ],
          name: res?.data?.name,
        });
    });
    return await modal.present();

    // this.messageService
    //   .createConv('60b7dc84c32e29ce6919e2a6', 'ionicTest2', this.users)
    //   .subscribe((res) => {
    //     console.log(res);
    //   });
    // this.messageService
    //   .getConvList('60b7dc84c32e29ce6919e2a6')
    //   .subscribe((res) => {
    //     console.log(res);
    //     this.convList = res;
    //     this.cd.detectChanges();
    //   });
  }

  openConversation(id: string) {
    this.router.navigate([`tabs/tab-home/conversation/${id}`]);
  }
}
