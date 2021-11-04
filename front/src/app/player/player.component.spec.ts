/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { WebsocketService } from '../_services/websocketService';

import { PlayerComponent } from './player.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Device } from '@ionic-native/device/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularDelegate, ModalController } from '@ionic/angular';

const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

describe('PlayerComponent', () => {
  let component: PlayerComponent;
  let fixture: ComponentFixture<PlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        SocketIoModule.forRoot(config),
        RouterTestingModule
      ],
      declarations: [PlayerComponent],
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
