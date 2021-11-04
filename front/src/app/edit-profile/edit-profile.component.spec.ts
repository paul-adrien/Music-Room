/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditProfileComponent } from './edit-profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { Device } from '@ionic-native/device/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { WebsocketService } from '../_services/websocketService';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const config: SocketIoConfig = { url: 'http://localhost:8080', options: {} };

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        SocketIoModule.forRoot(config)
      ],
      declarations: [EditProfileComponent],
      providers: [
        ModalController,
        AngularDelegate,
        Device,
        WebsocketService,
        Camera
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
