import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularDelegate, NavController, PopoverController } from '@ionic/angular';
import { popoverController } from '@ionic/core';

import { SettingsRoomComponent } from './settings-room.component';

describe('SettingsRoomComponent', () => {
  let component: SettingsRoomComponent;
  let fixture: ComponentFixture<SettingsRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SettingsRoomComponent],
      providers: [
        { provide: PopoverController },
        AngularDelegate,
        HttpClient,
        { provide: NavController },
        HttpHandler
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
