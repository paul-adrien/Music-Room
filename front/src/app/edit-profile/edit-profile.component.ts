import { UserService } from './../_services/user_service';
import { User } from 'libs/user';
import { ModalController, Platform } from '@ionic/angular';
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { AuthService } from '../_services/auth_service';
import { FormControl, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

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
      <div>Annuler</div>
      <div class="title">Modifier le profil</div>
      <div (click)="this.saveProfile()">Enregistrer</div>
    </div>
    <form [formGroup]="this.userForm" class="form-container">
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
      </div>
      <div class="input-container">
        <input
          formControlName="firstName"
          id="firstName"
          required
          class="input"
        />
        <div class="name-input">Prénom</div>
      </div>
      <div class="input-container">
        <input
          formControlName="lastName"
          id="lastName"
          required
          class="input"
        />
        <div class="name-input">Nom</div>
      </div>
      <div class="input-container">
        <input formControlName="email" id="email" required class="input" />
        <div class="name-input">Email</div>
      </div>
    </form>
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
    private userService: UserService
  ) {}

  public userForm = new FormGroup({
    userName: new FormControl('', ValidatorUserNameLength),
    firstName: new FormControl('', ValidatorLength),
    lastName: new FormControl('', ValidatorLength),
    email: new FormControl('', ValidatorEmail),
  });

  public lastImage;

  public uploadPicture = new FormData();

  ngOnInit() {
    this.user = this.authSercive.getUser();
    this.userService.getUser(this.user.id).subscribe(async (res) => {
      this.user = res;

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

  saveProfile() {
    const user = this.userForm.getRawValue();
    user.id = this.user.id;
    this.userService
      .updatePicture(this.uploadPicture, this.user.id)
      .subscribe();
    this.userService.updateUser(user).subscribe();
  }

  dismiss(res?: any) {
    // if (!this.isUser) {
    //   this.modalController.dismiss({
    //     dismissed: true,
    //     track: res,
    //   });
    // } else if (this.isUser) {
    //   this.modalController.dismiss({
    //     dismissed: true,
    //     user: res,
    //   });
    // }
  }
}
