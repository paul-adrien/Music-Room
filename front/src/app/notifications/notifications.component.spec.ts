/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NotificationsComponent } from './notifications.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Device } from '@ionic-native/device/ngx';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { WebsocketService } from '../_services/websocketService';
import { AuthService } from '../_services/auth_service';

const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        SocketIoModule.forRoot(config)
      ],
      declarations: [NotificationsComponent],
      providers: [
        Device,
        HttpClient,
        HttpHandler,
        InAppBrowser,
        WebsocketService,
        AuthService
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
