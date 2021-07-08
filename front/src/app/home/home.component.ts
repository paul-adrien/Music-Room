import { async } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { RoomService } from './../_services/room_service';
import { AuthService } from './../_services/auth_service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { User } from 'libs/user';
import { Route, Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  template: `
    <div>Home</div>
    <div class="rooms" *ngIf="this.rooms | async">
      <div
        class="room-container"
        (click)="this.openRoom(room._id)"
        *ngFor="let room of this.rooms | async"
      >
        {{ room.name }}
      </div>
    </div>
    <div class="primary-button" (click)="this.createRoom()">Créer une room</div>
  `,
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  public user: Partial<User>;
  public rooms: Observable<any[]>;
  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.rooms = this.roomService.getAllRoom();
  }

  createRoom() {
    this.roomService
      .createRoom(this.user, 'test room')
      .subscribe((res) => console.log(res));
  }

  openRoom(roomId: string) {
    this.router.navigate([`tabs/room/${roomId}`]);
  }
}
