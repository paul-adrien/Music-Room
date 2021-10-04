import { Room } from './../../../libs/room';
import { PlaylistService } from './../_services/playlist_service';
import { RoomService } from './../_services/room_service';
import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Playlist } from 'libs/playlist';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-settings-room',
  template: `
    <div class="item-container">
      <div class="item-name">Public / Private</div>
      <ion-toggle
        *ngIf="this.type === 'room'"
        [(ngModel)]="this.toggle"
        [checked]="this.room.type === 'private'"
        (click)="this.changeType($event)"
      ></ion-toggle>
      <ion-toggle
        *ngIf="this.type === 'playlist'"
        [(ngModel)]="this.toggle"
        [checked]="this.playlist.type === 'private'"
        (click)="this.changeType($event)"
      ></ion-toggle>
    </div>
  `,
  styleUrls: ['./settings-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsRoomComponent implements OnInit {
  @Input() public userId: string;
  @Input() public room?: Room;
  @Input() public playlist?: Playlist;
  @Input() public type: 'room' | 'playlist';

  public toggle = false;
  public test = false;

  constructor(
    private popoverCtrl: PopoverController,
    private roomService: RoomService,
    private playlistService: PlaylistService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.type === 'room') {
      this.toggle = this.room.type === 'private' ? true : false;
    } else if (this.type === 'playlist') {
      this.toggle = this.playlist.type === 'private' ? true : false;
    }
    this.cd.detectChanges();
  }

  changeType(event: any) {
    if (this.type === 'room') {
      this.roomService
        .changeType(
          this.room._id,
          this.userId,
          !this.toggle ? 'private' : 'public'
        )
        .subscribe((res) => {
          if (res.status) {
            this.room.type = event?.detail?.checked;
          } else {
            this.toggle = !this.toggle;
          }
          this.cd.detectChanges();
        });
    } else if (this.type === 'playlist') {
      this.playlistService
        .changeType(
          this.playlist._id,
          this.userId,
          !this.toggle ? 'private' : 'public'
        )
        .subscribe((res) => {
          if (res.status) {
            this.playlist.type = event?.detail?.checked;
          } else {
            this.toggle = !this.toggle;
          }
          this.cd.detectChanges();
        });
    }
    this.cd.detectChanges();
  }

  close() {
    this.popoverCtrl.dismiss();
  }
}
