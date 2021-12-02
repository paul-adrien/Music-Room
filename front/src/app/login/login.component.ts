import { environment } from 'src/environments/environment';
import { SpotifyService } from './../_services/spotify_service';
import { AuthService } from './../_services/auth_service';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'libs/user';
import {
  InAppBrowser,
  InAppBrowserOptions,
} from '@ionic-native/in-app-browser/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AlertController, ToastController } from '@ionic/angular';

function ValidatorUserNameLength(control: FormControl) {
  const test = /^(?=.{3,20}$)[a-zA-Z0-9]+(?:[-' ][a-zA-Z0-9]+)*$/;
  if (control.value?.length < 3) {
    return { error: '3 caractères minimum' };
  } else if (control.value?.length > 20) {
    return { error: '20 caractères maximum' };
  } else if (!test.test(String(control.value).toLowerCase())) {
    return { error: 'Mauvais format' };
  }
}

function ValidatorLength(control: FormControl) {
  const test = /^(?=.{3,20}$)[a-zA-Z]+(?:[-' ][a-zA-Z]+)*$/;
  if (control.value?.length < 3) {
    return { error: '3 caractères minimum' };
  } else if (control.value?.length > 20) {
    return { error: '20 caractères maximum' };
  } else if (!test.test(String(control.value).toLowerCase())) {
    return { error: 'Mauvais format' };
  }
  return {};
}

function ValidatorEmail(control: FormControl) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(control.value).toLowerCase())) {
    return { error: 'Mauvais format' };
  }
  return {};
}

function ValidatorPass(control: FormControl) {
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!re.test(String(control.value).toLowerCase())) {
    return {
      error:
        'le mot de passe doit comporter minimum 8 caractères, un chiffre et un caractère spéciale',
    };
  }
  return {};
}

@Component({
  selector: 'app-login',
  template: `
    <ion-header class="header"></ion-header>
    <div class="title">
      {{ this.loginMode ? 'Créer un compte' : 'Se connecter' }}
    </div>
    <form
      [formGroup]="this.registerForm"
      class="form-container"
      *ngIf="!isLoggedIn && !this.loginMode"
      name="form"
      (ngSubmit)="f.form.valid && onSubmit()"
      #f="ngForm"
      novalidate
    >
      <div class="inputs">
        <input
          type="text"
          formControlName="userName"
          id="userName"
          required
          placeholder="{{ 'userName' }}"
          [class.error-input]="
            this.registerForm.get('userName').errors?.error &&
            this.isSuccessful === false
          "
        />
        <div
          class="error"
          *ngIf="
            this.registerForm.get('userName').errors?.error &&
            this.isSuccessful === false
          "
        >
          {{ this.registerForm.get('userName').errors.error }}
        </div>
        <input
          *ngIf="!this.loginMode"
          type="text"
          formControlName="lastName"
          required
          placeholder="{{ 'lastName' }}"
          [class.error-input]="
            this.registerForm.get('lastName').errors?.error &&
            this.isSuccessful === false
          "
        />
        <div
          class="error"
          *ngIf="
            this.registerForm.get('lastName').errors?.error &&
            !this.loginMode &&
            this.isSuccessful === false
          "
        >
          {{
            this.registerForm.get('lastName').errors?.error &&
              !this.loginMode &&
              this.isSuccessful === false &&
              this.registerForm.get('lastName').errors.error
          }}
        </div>
        <input
          *ngIf="!this.loginMode"
          type="text"
          formControlName="firstName"
          required
          placeholder="{{ 'firstName' }}"
          [class.error-input]="
            this.registerForm.get('firstName').errors?.error &&
            this.isSuccessful === false
          "
        />
        <div
          class="error"
          *ngIf="
            this.registerForm.get('firstName').errors?.error &&
            !this.loginMode &&
            this.isSuccessful === false
          "
        >
          {{ this.registerForm.get('firstName').errors.error }}
        </div>
        <input
          *ngIf="!this.loginMode"
          formControlName="email"
          required
          placeholder="Email"
          [class.error-input]="
            this.registerForm.get('email').errors?.error &&
            this.isSuccessful === false
          "
        />
        <div
          class="error"
          *ngIf="
            this.registerForm.get('email').errors?.error &&
            this.isSuccessful === false &&
            !this.loginMode
          "
        >
          {{ this.registerForm.get('email').errors.error }}
        </div>
        <input
          *ngIf="!this.loginMode"
          type="password"
          formControlName="password"
          required
          placeholder="{{ 'Password' }}"
          [class.error-input]="
            this.registerForm.get('password').errors?.error &&
            this.isSuccessful === false
          "
        />
        <div
          class="error"
          *ngIf="
            this.registerForm.get('password').errors?.error &&
            this.isSuccessful === false &&
            !this.loginMode
          "
        >
          {{ this.registerForm.get('password').errors.error }}
        </div>
      </div>
      <div class="error">{{ this.errorMessageReg }}</div>
      <button class="primary-button green">
        {{ !this.loginMode ? 'Créer un compte' : 'Se connecter' }}
      </button>
    </form>
    <form
      [formGroup]="this.loginForm"
      class="form-container"
      *ngIf="!isLoggedIn && this.loginMode"
      name="form"
      (ngSubmit)="f.form.valid && onSubmit()"
      #f="ngForm"
      novalidate
    >
      <div class="inputs">
        <input
          type="text"
          formControlName="userName"
          id="userName"
          required
          [class.error-input]="
            this.registerForm.get('userName').errors?.error &&
            this.isSuccessful === false
          "
          placeholder="{{ 'userName' }}"
        />
        <div
          class="error"
          *ngIf="
            this.loginForm.get('userName').errors?.error &&
            this.isSuccessful === false
          "
        >
          {{ this.loginForm.get('userName').errors.error }}
        </div>
        <input
          type="password"
          formControlName="password"
          required
          placeholder="{{ 'Password' }}"
          [class.error-input]="
            this.registerForm.get('password').errors?.error &&
            this.isSuccessful === false
          "
        />
      </div>
      <div class="error">{{ this.errorMessageLog }}</div>
      <button class="primary-button green">
        {{ !this.loginMode ? 'Créer un compte' : 'Se connecter' }}
      </button>
    </form>
    <a
      class="forgot-password"
      *ngIf="this.loginMode"
      (click)="this.forgotPassword()"
      >{{ 'Mot de passe oublié' }}
    </a>
    <div class="log-button" (click)="this.loginMode = !loginMode">
      {{ this.loginMode ? "Je n'ai pas de compte" : "J'ai déjà un compte" }}
    </div>
    <div class="separator">
      <div class="bar"></div>
      <div>Or</div>
      <div class="bar"></div>
    </div>
    <div class="buttons-auth">
      <div class="primary-button forty-two" (click)="this.Oauth42()">
        <img class="img-button" src="./assets/42.png" />
        Se connecter avec 42
      </div>
      <div class="primary-button google" (click)="this.OauthGoogle()">
        <img class="img-button" src="./assets/google.svg" />

        Se connecter avec Google
      </div>
      <!-- <div class="primary-button github" (click)="this.OauthGithub()">
        <img class="img-button" src="./assets/github.png" />
        Se connecter avec Github
      </div> -->
    </div>
  `,
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public registerForm = new FormGroup({
    userName: new FormControl('', ValidatorUserNameLength),
    firstName: new FormControl('', ValidatorLength),
    lastName: new FormControl('', ValidatorLength),
    password: new FormControl('', ValidatorPass),
    email: new FormControl('', ValidatorEmail),
  });

  public loginForm = new FormGroup({
    userName: new FormControl('', ValidatorUserNameLength),
    password: new FormControl(''),
  });

  public loginMode = false;
  isSuccessful = true;
  isSignUpFailed = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessageReg = '';
  errorMessageLog = '';

  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private authService: AuthService,
    private spotifyService: SpotifyService,
    private iab: InAppBrowser,
    private device: Device,
    private ngZone: NgZone,
    private alertController: AlertController,
    private toastCtrl: ToastController,
    private cd: ChangeDetectorRef //public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.router.queryParams.subscribe((params) => {
      if (params.data) {
        const data = JSON.parse(decodeURI(params.data));

        if (data.token && data.user) {
          this.authService.saveToken(data.token);
          this.authService.saveUser(data.user);
          this.spotifyService.requestAuthorization();
          if (localStorage.getItem('access_token')) {
            // this.authService.stockAppInfo(
            //   data.user._id,
            //   this.device.model,
            //   this.device.platform,
            //   '1.0.0'
            // );
            this.route.navigate(['/tabs/search']);
            this.isSuccessful = true;
            this.isSignUpFailed = false;
          }
        }
        // this.translate.setDefaultLang(data.user?.lang);
      } else if (params.code) {
        this.spotifyService.getAuthorizationToken().subscribe(() => {
          if (localStorage.getItem('access_token')) {
            let user: any = localStorage.getItem('auth-user');
            this.route.navigate(['/tabs/search']);
          }
        });
      }
    });
  }

  signInOrSignUp(loginMode: boolean) {
    this.loginMode = loginMode;
  }

  onSubmit() {
    if (this.loginMode === false) {
      const form: Partial<User> = this.registerForm.getRawValue();
      this.authService.register(form, this.device.model, this.device.platform, '1.0.0').subscribe(
        (data) => {
          if (data?.user && data?.token) {
            this.authService.saveToken(data.token);
            this.authService.saveUser(data.user);
            this.spotifyService.requestAuthorization();
            if (localStorage.getItem('access_token')) {
              this.route.navigate(['/tabs/search']);
              this.isSuccessful = true;
              this.isSignUpFailed = false;
            }
            this.cd.detectChanges();
          } else {
            this.errorMessageReg = data.message;
            this.cd.detectChanges();
          }
        },
        (err) => {
          this.isSignUpFailed = true;
        }
      );
    } else {
      const form: Partial<User> = this.loginForm.getRawValue();
      this.authService.login(form, this.device.model, this.device.platform, '1.0.0').subscribe(
        (data) => {
          if (data?.user && data?.token) {
            this.authService.saveToken(data.token);
            this.authService.saveUser(data.user);
            this.spotifyService.requestAuthorization();
            if (localStorage.getItem('access_token')) {
              this.route.navigate(['/tabs/search']);
              this.isSuccessful = true;
              this.isSignUpFailed = false;
            }
          } else {
            this.errorMessageLog = data.message;
          }
          this.cd.detectChanges();
        },
        (err) => {
          this.isLoginFailed = true;
        }
      );
    }
  }

  async forgotPassword() {
    let isSend = false;
    const alert = await this.alertController.create({
      header: 'Mot passe oublié',
      message: `Veuillez entrer votre adresse mail.
        Vous allez recevoir un mail pour changer votre mot de passe.`,
      inputs: [
        {
          name: 'email',
          placeholder: 'music-room@email.com',
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: (data: any) => {
            console.log('Canceled', data);
          },
        },
        {
          text: 'Confirmer',
          handler: (data: any) => {
            console.log('Saved Information', data);
            const validEmail = this.validEmail(data?.email);
            if (validEmail === true) {
              this.authService.forgotPass_s(data?.email).subscribe((data) => {
                if (data?.status === true) {
                  isSend = true;
                  return true;
                }
              });
            } else {
              this.showErrorToast(validEmail);
              return false;
            }
          },
        },
      ],
    });
    await alert.present();

    alert.onDidDismiss().then((res) => {
      console.log(isSend);
      if (isSend) {
        this.alertController
          .create({
            header: 'Changer votre mot de passe',
            message: `Veuillez entrer votre adresse mail, .`,
            inputs: [
              {
                name: 'email',
                placeholder: 'music-room@email.com',
              },
              {
                name: 'New password',
                placeholder: 'XXXXXXX',
              },
              {
                name: 'Code (in the mail)',
                placeholder: '123456',
              },
            ],
            buttons: [
              {
                text: 'Annuler',
                handler: (data: any) => {
                  console.log('Canceled', data);
                },
              },
              {
                text: 'Confirmer',
                handler: (data: any) => {
                  console.log('Saved Information', data);
                  const validEmail = this.validEmail(data?.email);
                  const validPass = this.validPass(data?.password);
                  if (validEmail !== true) {
                    this.showErrorToast(validEmail);
                    return false;
                  }
                  if (validPass !== true) {
                    this.showErrorToast(validPass);
                    return false;
                  }
                  this.authService
                    .forgotPass_c(data?.email, data?.password, data?.rand)
                    .subscribe((data) => {
                      if (data.status) {
                        return true;
                      } else if (
                        !data.status &&
                        data?.message === 'Same password'
                      ) {
                        this.showErrorToast(
                          'Vous ne pouvez pas utiliser votre ancien mot de passe.'
                        );
                        return false;
                      } else {
                        this.showErrorToast(
                          "Ce compte n'existe pas ou votre code est incorrect"
                        );
                        return false;
                      }
                    });
                },
              },
            ],
          })
          .then((res) => {
            res.present();
          });
      }

      this.cd.detectChanges();
    });
  }

  validEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase())) {
      return 'Mauvais format email';
    }
    return true;
  }

  validPass(password: string) {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!re.test(String(password).toLowerCase())) {
      return 'le mot de passe doit comporter minimum 8 caractères, un chiffre et un caractère spéciale';
    }
    return true;
  }

  async showErrorToast(data: any) {
    let toast = await this.toastCtrl.create({
      message: data,
      duration: 3000,
      position: 'top',
    });

    await toast.present();
  }

  public Oauth42() {
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'no',
    };
    if (this.device?.platform === null) {
      location.href = 'http://localhost:8080/user/authenticate/42?model=PC&platform=PC&version=1.0.0';
    } else {
      const browser = this.iab.create(
        environment.AUTH_API + 'user/authenticate/42?model='+this.device.model+'&platform='+this.device.platform+'&version=1.0.0',
        'defaults',
        options
      );
      browser.on('loadstart').subscribe((event) => {
        console.log('start', event);
        if (event.url.includes('localhost:8100/login?data')) {
          const data = event.url.slice(
            event.url.indexOf('?data=') + '?data='.length
          );
          this.ngZone.run(() => {
            this.route.navigate([`/login`], { queryParams: { data: data } });
          });
          console.log('close login');
          browser.close();
        }
      });
      // browser.on('exit').subscribe((event) => {
      //   console.log('end', event);

      //   browser.close();
      // });
    }
  }

  public OauthGoogle() {
    //location.href = 'http://localhost:8080/user/authenticate/google';
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'no',
    };
    if (this.device?.platform === null) {
      location.href = 'http://localhost:8080/user/authenticate/google?model=PC&platform=PC&version=1.0.0';
    } else {
      const browser = this.iab.create(
        environment.AUTH_API + 'user/authenticate/google?model='+this.device.model+'&platform='+this.device.platform+'&version=1.0.0',
        'defaults',
        options
      );
      browser.on('loadstart').subscribe((event) => {
        console.log('start', event);
        if (event.url.includes('localhost:8100/login?data')) {
          const data = event.url.slice(
            event.url.indexOf('?data=') + '?data='.length
          );
          this.ngZone.run(() => {
            this.route.navigate([`/login`], { queryParams: { data: data } });
          });
          browser.close();
        }
      });
      // browser.on('exit').subscribe((event) => {
      //   console.log('end', event);

      //   browser.close();
      // });
    }
  }

  public OauthGithub() {
    //location.href = 'http://localhost:8080/user/authenticate/github';
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'no',
    };
    if (this.device?.platform === null) {
      location.href = 'http://localhost:8080/user/authenticate/github';
    } else {
      const browser = this.iab.create(
        environment.AUTH_API + 'user/authenticate/github',
        'defaults',
        options
      );
      browser.on('loadstart').subscribe((event) => {
        console.log('start', event);
        if (event.url.includes('localhost:8100/login?data')) {
          const data = event.url.slice(
            event.url.indexOf('?data=') + '?data='.length
          );
          this.ngZone.run(() => {
            this.route.navigate([`/login`], { queryParams: { data: data } });
          });
          browser.close();
        }
      });
      // browser.on('exit').subscribe((event) => {
      //   console.log('end', event);

      //   browser.close();
      // });
    }
  }
}
