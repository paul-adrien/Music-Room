import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../_services/auth_service';

function ValidatorEmail(control: FormControl) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(control.value).toLowerCase())) {
    return { error: 'Mauvais format' };
  }
  return {};
}

@Component({
  selector: 'app-verify',
  template: `
    <div class="no-verify-container">
      <div class="title">Veuillez entrer l'adresse mail de votre compte.</div>
      <form
        [formGroup]="this.loginForm"
        name="form"
        (ngSubmit)="f.form.valid && onSubmit()"
        #f="ngForm"
        novalidate
      >
        <div class="form-container">
          <input
            type="email"
            class="form-control"
            name="email"
            required
            email
            placeholder="Email"
            formControlName="email"
          />
          <div class="error" *ngIf="this.loginForm.get('email').errors?.error">
            {{ this.loginForm.get('email').errors.error }}
          </div>
          <button class="primary-button">Vérifier</button>
        </div>
      </form>
    </div>
  `,
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  public loginForm = new FormGroup({
    email: new FormControl('', ValidatorEmail),
  });
  id = 0;

  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
  }

  onSubmit() {
    this.authService.verify(this.loginForm.getRawValue(), this.id).subscribe(
      (data) => {
        this.router.navigate(['login']);
      },
      (err) => {}
    );
  }
}
