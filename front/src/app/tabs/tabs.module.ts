import { EditProfileComponent } from './../edit-profile/edit-profile.component';
import { DelegationComponent } from './../delegation/delegation.component';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PlayerComponent } from '../player/player.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    MatProgressBarModule,
    NgxSliderModule,
  ],
  entryComponents: [PlayerComponent, DelegationComponent, EditProfileComponent],
  declarations: [TabsPage, PlayerComponent],
})
export class TabsPageModule {}
