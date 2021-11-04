/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PlaylistComponent } from './playlist.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Device } from '@ionic-native/device/ngx';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { modalController } from '@ionic/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AngularDelegate, ModalController, PopoverController } from '@ionic/angular';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { WebsocketService } from '../_services/websocketService';
import { environment } from 'src/environments/environment';

const config: SocketIoConfig = {
  url: environment.AUTH_API, options: {}
};

describe('PlaylistComponent', () => {
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SocketIoModule.forRoot(config),
        RouterTestingModule
      ],
      declarations: [PlaylistComponent],
      providers: [
        Device,
        InAppBrowser,
        ModalController,
        AngularDelegate,
        WebsocketService,
        PopoverController
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
