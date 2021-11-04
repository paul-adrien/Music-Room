import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { WebsocketService } from '../_services/websocketService';

import { ProfileComponent } from './profile.component';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = {
  url: environment.AUTH_API, options: {}
};

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SocketIoModule.forRoot(config),
        RouterTestingModule
      ],
      declarations: [ProfileComponent],
      providers: [
        Device,
        InAppBrowser,
        ModalController,
        AngularDelegate,
        // PopoverController,
        WebsocketService,
        // AuthService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
