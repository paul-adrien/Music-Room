import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Device } from '@ionic-native/device/ngx';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule],
      providers: [
        Device,
        // HttpClient,
        // HttpHandler,
        // InAppBrowser,
        // WebsocketService,
        // AuthService
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
  // TODO: add more tests!

});
