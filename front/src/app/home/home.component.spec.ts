import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { WebsocketService } from '../_services/websocketService';

import { HomeComponent } from './home.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = {
  url: environment.AUTH_API, options: {}
};

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SocketIoModule.forRoot(config),
        RouterTestingModule
      ],
      declarations: [HomeComponent],
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
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
