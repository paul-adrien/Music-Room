/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DelegationComponent } from './delegation.component';
import { RouterTestingModule } from '@angular/router/testing';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DelegationComponent', () => {
  let component: DelegationComponent;
  let fixture: ComponentFixture<DelegationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [DelegationComponent],
      providers: [
        InAppBrowser,
        ModalController,
        AngularDelegate
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelegationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
