import { async } from '@angular/core/testing';
import { UserService } from './../_services/user_service';
import { RoomService } from './../_services/room_service';
import { User } from './../../../libs/user';
import { AuthService } from './../_services/auth_service';
import { Location } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  template: `
    <img
      class="back-img"
      (click)="this.back()"
      src="./assets/chevron-back-outline.svg"
    />
    <div class="title">Mes notifications</div>
    <div *ngFor="let notif of this.user.notifs?.rooms" class="notif-container">
      <div class="text">
        Vous avez été invité à rejoindre la room
        <span class="font-medium">
          {{ notif?.name }}
        </span>
      </div>
      <div class="buttons">
        <img class="img" src="./assets/close-outline.svg" />
        <img class="img" src="./assets/checkmark-outline.svg" />
      </div>
    </div>
    <div *ngFor="let notif of this.user.notifs?.playlist">
      {{ notif?.name }}
    </div>
    <div *ngFor="let notif of this.user.notifs?.friends">{{ notif?.name }}</div>
  `,
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  constructor(
    private location: Location,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    private roomService: RoomService,
    private userService: UserService
  ) {}

  public user: User;

  ngOnInit() {
    this.user = this.authService.getUser();
    // this.notifs = this.notifs.concat(
    //   this.user.notifs.rooms,
    //   this.user.notifs.playlist,
    //   this.user.notifs.friends
    // );
    //this.notifs = {playlist: this.user.notifs.playlist, friends: this.user.notifs.friends, rooms: this.user.notifs.rooms.map(room => {...room, this.})}
    this.cd.detectChanges();
  }

  public back() {
    this.location.back();
  }

  getRoomName(roomId: string) {
    return this.roomService.getRoom(roomId).pipe(map((room) => room.name));
  }
}
