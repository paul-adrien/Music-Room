import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRoomComponent } from './settings-room.component';

describe('SettingsRoomComponent', () => {
  let component: SettingsRoomComponent;
  let fixture: ComponentFixture<SettingsRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsRoomComponent ]
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
