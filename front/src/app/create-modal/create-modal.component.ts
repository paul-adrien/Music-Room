import { User } from 'libs/user';
import { RoomService } from './../_services/room_service';
import { ModalController } from '@ionic/angular';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-create-modal',
  template: `
    <img
      class="x"
      (click)="this.dismiss(true)"
      src="./assets/close-outline.svg"
    />
    <div class="title">Donnez un nom</div>
    <input #input [defaultValue]="this.default" class="input" />
    <div *ngIf="this.errorInput">{{ this.errorInput }}</div>
    <div class="title" *ngIf="this.isConv">Membres de la conversation</div>
    <div *ngIf="this.users?.length > 0; else noUser" class="users">
      <div class="user-container" *ngFor="let user of this.users">
        <img
          class="logo round"
          [src]="user.picture || './assets/person.svg'"
        />
        <div class="user-info">
          <div class="info-top">{{ user.userName }}</div>
          <div class="info-bottom">
            {{ user.firstName }} {{ user.lastName }}
          </div>
        </div>
      </div>
    </div>
    <ng-template #noUser>
      <div *ngIf="this.isConv">Aucun utilisateur</div>
    </ng-template>
    <div
      class="primary-button add"
      *ngIf="this.isConv"
      (click)="this.addUserModal()"
    >
      Ajoutez un utilisateur
    </div>
    <div (click)="this.dismiss(false)" class="primary-button">Créer</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./create-modal.component.scss'],
})
export class CreateModalComponent implements OnInit {
  @Input() public isRoom = false;
  @Input() public isPlaylist = false;
  @Input() public isConv = false;
  @ViewChild('input') input: ElementRef;

  public errorInput = '';

  public users = [];

  public default = '';

  constructor(
    private modalController: ModalController,
    private roomService: RoomService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.isConv) {
      this.default = 'MyGroup';
    } else if (this.isPlaylist) {
      this.default = 'MyPlaylist';
    } else if (this.isRoom) {
      this.default = 'MyRoom';
    }
    this.cd.detectChanges();
  }

  dismiss(isQuit: boolean) {
    if (isQuit) {
      this.modalController.dismiss({
        dismissed: true,
      });
    }

    if (this.isConv && this.users.length > 0) {
      this.modalController.dismiss({
        dismissed: true,
        name: this.input.nativeElement.value,
        users: this.users.map((user) => ({
          userId: user.id,
          name: user.userName,
        })),
      });
    } else {
      if (this.isRoom) {
        this.roomService
          .checkNameRoom(this.input.nativeElement.value)
          .subscribe((res) => {
            if (res.status && res.room === null) {
              this.errorInput = '';
              if (isQuit) {
                this.modalController.dismiss({
                  dismissed: true,
                });
              } else {
                this.modalController.dismiss({
                  dismissed: true,
                  name: this.input.nativeElement.value,
                });
              }
            } else if (res.status && res.room) {
              this.errorInput = 'Ce nom existe déja';
            }
            this.cd.detectChanges();
          });
      } else if (this.isPlaylist) {
        this.modalController.dismiss({
          dismissed: true,
          name: this.input.nativeElement.value,
        });
      }
    }
  }

  async addUserModal() {
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
        this.users.push(user);
        this.cd.detectChanges();
      }
    });
    return await modal.present();
  }
}
