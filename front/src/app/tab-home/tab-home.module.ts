import { CreateModalComponent } from './../create-modal/create-modal.component';
import { SearchComponent } from './../search/search.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabHomePage } from './tab-home.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab-home-routing.module';
import { SettingsRoomComponent } from '../settings-room/settings-room.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
  ],
  entryComponents: [
    SearchComponent,
    CreateModalComponent,
    SettingsRoomComponent,
  ],
  declarations: [TabHomePage],
})
export class TabHomeModule {}
