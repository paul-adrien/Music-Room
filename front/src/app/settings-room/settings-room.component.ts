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
import { WebsocketService } from '../_services/websocketService';

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
    private cd: ChangeDetectorRef,
    private socketService: WebsocketService
  ) {
    this.socketService.listenToServer('room update ' + this.room?._id).subscribe((data) => {
      if (data.status === false)
        this.toggle = !this.toggle;
      this.cd.detectChanges();
    });
    this.socketService.listenToServer('playlist update ' + this.playlist?._id).subscribe((data) => {
      if (data.status === false)
        this.toggle = !this.toggle;
      this.cd.detectChanges();
    });
  }

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
      this.socketService.emitToServer('room change type', {
        userId: this.userId,
        roomId: this.room?._id,
        type: !this.toggle ? 'private' : 'public'
      });
    } else if (this.type === 'playlist') {
      this.socketService.emitToServer('playlist change type', {
        userId: this.userId,
        playlistId: this.playlist?._id,
        type: !this.toggle ? 'private' : 'public'
      });
    }
    // this.cd.detectChanges();
  }

  close() {
    this.popoverCtrl.dismiss();
  }
}
