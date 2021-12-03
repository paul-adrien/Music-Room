import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularDelegate, ModalController, PopoverController } from '@ionic/angular';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { WebsocketService } from '../_services/websocketService';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { RoomComponent } from './room.component';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = {
  url: environment.AUTH_API, options: {}
};

describe('RoomComponent', () => {
  let component: RoomComponent;
  let fixture: ComponentFixture<RoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        SocketIoModule.forRoot(config)
      ],
      declarations: [RoomComponent],
      providers: [
        Device,
        InAppBrowser,
        ModalController,
        AngularDelegate,
        PopoverController,
        WebsocketService,
        Geolocation,
        // AuthService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
