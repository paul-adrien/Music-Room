import { CreateModalComponent } from '../create-modal/create-modal.component';
import { SearchComponent } from '../search/search.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabProfilePage } from './tab-profile.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabProfilePageRoutingModule as TabProfilePageRoutingModule } from './tab-profile-routing.module';
import { SettingsRoomComponent } from '../settings-room/settings-room.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TabProfilePageRoutingModule,
  ],
  entryComponents: [
    SearchComponent,
    CreateModalComponent,
    SettingsRoomComponent,
  ],
  declarations: [TabProfilePage],
})
export class TabProfileModule {}
