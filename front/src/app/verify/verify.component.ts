import { UserService } from './../_services/user_service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'libs/user';
import { AuthService } from '../_services/auth_service';

@Component({
  selector: 'app-verify',
  template: `
    <div class="no-verify-container">
      Veuillez vérifier votre mail en cliquant sur le lien du mail de
      vérification.
    </div>
    <div>Vous n'avez rien reçu ?</div>
    <div (click)="this.resendMail()" class="primary-button">
      Renvoyer le mail
    </div>
  `,
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  public user: User;

  ngOnInit(): void {
    this.user = this.authService.getUser();
    if (this.user.validEmail) {
      this.router.navigate(['/tabs/tab-home/home']);
    } else if (!this.user) {
      this.router.navigate(['/login']);
    }
    this.userService.getUser(this.user.id).subscribe((res) => {
      this.user = res;
      this.authService.saveUser(res);
      if (this.user.validEmail) {
        this.router.navigate(['/tabs/tab-home/home']);
      } else if (!this.user) {
        this.router.navigate(['/login']);
      }
      this.cd.detectChanges();
    });
  }

  resendMail() {
    this.authService.sendMailVerify(this.user.email).subscribe();
  }
}
