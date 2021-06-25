import { AuthService } from './../_services/auth_service';
import { Component, OnInit } from '@angular/core';
import { User } from 'libs/user';

@Component({
  selector: 'app-profile',
  template: `
    <div class="top-container" *ngIf="this.user">
      <img class="log-out" src="./assets/log-out.svg" (click)="this.logOut()" />
      <img class="picture" src="./assets/test-profile.jpg" />
      <div class="name">{{ this.user.firstName }} {{ this.user.lastName }}</div>
    </div>
  `,
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public user: Partial<User>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  logOut() {
    this.authService.logOut();
  }
}
