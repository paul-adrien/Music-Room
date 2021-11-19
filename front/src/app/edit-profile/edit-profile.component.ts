import { forkJoin } from 'rxjs';
import { UserService } from './../_services/user_service';
import { User } from 'libs/user';
import { ModalController, Platform, AlertController } from '@ionic/angular';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthService } from '../_services/auth_service';
import { FormControl, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebsocketService } from '../_services/websocketService';

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
}

function ValidatorEmail(control: FormControl) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(control.value).toLowerCase())) {
    return { error: 'Mauvais format' };
  }
}

@Component({
  selector: 'app-edit-profile',
  template: `
    <div class="header">
      <div (click)="this.dismiss(false)">Annuler</div>
      <div class="title">Modifier le profil</div>
      <div (click)="this.saveProfile()">Enregistrer</div>
    </div>
    <form
      *ngIf="this.userForm"
      [formGroup]="this.userForm"
      class="form-container"
    >
      <img
        class="picture"
        [src]="this.user?.picture ? this.user.picture : './assets/person.svg'"
      />

      <div class="button-picture" (click)="this.getPicture()">
        Modifier la photo
      </div>

      <div class="input-container">
        <input
          formControlName="userName"
          id="userName"
          required
          class="input"
        />
        <div class="name-input">Pseudo</div>
        <div class="error" *ngIf="this.userForm.get('userName').errors?.error">
          {{ this.userForm.get('userName').errors.error }}
        </div>
      </div>
      <div class="input-container">
        <input
          formControlName="firstName"
          id="firstName"
          required
          class="input"
        />
        <div class="name-input">Prénom</div>
        <div class="error" *ngIf="this.userForm.get('firstName').errors?.error">
          {{ this.userForm.get('firstName').errors.error }}
        </div>
      </div>
      <div class="input-container">
        <input
          formControlName="lastName"
          id="lastName"
          required
          class="input"
        />
        <div class="name-input">Nom</div>
        <div class="error" *ngIf="this.userForm.get('lastName').errors?.error">
          {{ this.userForm.get('lastName').errors.error }}
        </div>
      </div>
      <!-- <div class="input-container">
        <input formControlName="email" id="email" required class="input" />
        <div class="name-input">Email</div>
      </div> -->
    </form>

    <div class="premium-container">
      <div class="premium-name">Free / Premium</div>
      <ion-toggle
        [(ngModel)]="this.toggle"
        [checked]="this.user.type === 'premium'"
        (click)="this.upgradeAccount($event)"
      ></ion-toggle>
    </div>
  `,
  styleUrls: ['./edit-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileComponent implements OnInit {
  public user: User;
  public newPicture: string;

  constructor(
    private modalController: ModalController,
    private authSercive: AuthService,
    private camera: Camera,
    private platform: Platform,
    private cd: ChangeDetectorRef,
    private userService: UserService,
    private socketService: WebsocketService
  ) {
    this.user = this.authSercive.getUser();

    this.socketService
      .listenToServer(`user update ${this.user?.id}`)
      .subscribe((data) => {
        this.toggle = data.type === 'premium' ? true : false;
        this.cd.detectChanges();
      });
  }

  public userForm = new FormGroup({
    userName: new FormControl('', ValidatorUserNameLength),
    firstName: new FormControl('', ValidatorLength),
    lastName: new FormControl('', ValidatorLength),
    email: new FormControl('', ValidatorEmail),
  });

  public lastImage;

  public uploadPicture = new FormData();

  public toggle = false;

  ngOnInit() {
    this.user = this.authSercive.getUser();
    if (this.user.type === 'premium') {
      this.toggle = true;
    }
    this.userService.getUser(this.user?.id).subscribe(async (res) => {
      this.user = res;

      if (typeof this.user.picture !== 'string' && this.user.picture) {
        this.user.picture = 'data:image/jpeg;base64,' + res.picture.buffer;
      } else {
        this.user.picture = res.picture;
      }

      this.userForm.patchValue({
        userName: this.user.userName,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
      });
      this.cd.detectChanges();
    });
  }

  getPicture() {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    };

    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.camera.getPicture(options).then(
          async (imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64 (DATA_URL):
            let base64Image = 'data:image/jpeg;base64,' + imageData;

            const blob = await (await fetch(base64Image)).blob();

            this.user.picture = base64Image;
            this.uploadPicture.append('file', blob, `myimage.jpeg`);
            this.uploadPicture.append('name', 'jsp');
            this.userService
              .updatePicture(this.uploadPicture, this.user.id)
              .subscribe();

            this.cd.detectChanges();
          },
          (err) => {
            // Handle error
          }
        );
        this.cd.detectChanges();
      }
    });
  }

  async saveProfile() {
    const user = this.userForm.getRawValue();
    user.id = this.user?.id;
    let stop = false;
    if (
      (this.user.firstName !== user.firstName ||
        this.user.lastName !== user.lastName ||
        this.user.userName !== user.userName) &&
      this.userForm.valid
    ) {
      await this.userService
        .checkUsername(this.user.id, user.userName)
        .toPromise()
        .then((res: any) => {
          if (res.status) {
            this.socketService.emitToServer('user edit', {
              userId: user.id,
              user: user,
            });
          } else {
            stop = true;
            this.userForm.get('userName').setErrors({
              error: 'Ce pseudo existe déjà',
            });
          }
        });
    } else {
      stop = true;
    }

    if (this.uploadPicture.has('file') && !stop) {
      this.userService
        .updatePicture(this.uploadPicture, this.user.id)
        .subscribe((res) => {
          this.dismiss(true);
        });
    } else if (!stop) {
      this.dismiss(false);
    }
    this.cd.detectChanges();
  }

  dismiss(isSave?: boolean) {
    if (!isSave) {
      this.modalController.dismiss();
    } else if (isSave) {
      this.modalController.dismiss({
        picture: this.user?.picture,
      });
    }
  }

  upgradeAccount(event: any) {
    this.socketService.emitToServer('user update type', {
      userId: this.user.id,
      type: !this.toggle ? 'premium' : 'free',
    });
    // this.cd.detectChanges();
  }
}
