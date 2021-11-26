import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabProfilePage } from './tab-profile.page';

describe('Tab1Page', () => {
  let component: TabProfilePage;
  let fixture: ComponentFixture<TabProfilePage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TabProfilePage],
        imports: [
          IonicModule.forRoot(),
          ExploreContainerComponentModule,
          RouterTestingModule,
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(TabProfilePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
