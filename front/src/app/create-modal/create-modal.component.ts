import { RoomService } from './../_services/room_service';
import { ModalController } from '@ionic/angular';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-create-modal',
  template: `
    <img
      class="x"
      (click)="this.dismiss(true)"
      src="./assets/close-outline.svg"
    />
    <div class="title">Donnez un nom</div>
    <input #input [defaultValue]="'My Room'" class="input" />
    <div *ngIf="this.errorInput">{{ this.errorInput }}</div>
    <div (click)="this.dismiss(false)" class="primary-button">Créer</div>
  `,
  styleUrls: ['./create-modal.component.scss'],
})
export class CreateModalComponent implements OnInit {
  @Input() public isRoom = false;
  @Input() public isPlaylist = false;
  @ViewChild('input') input: ElementRef;

  public errorInput = '';

  constructor(
    private modalController: ModalController,
    private roomService: RoomService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  dismiss(isQuit: boolean) {
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
  }
}
