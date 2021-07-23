import { RoomComponent } from '../room/room.component';
import { HomeComponent } from '../home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab-home.page';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'room/:id',
    component: RoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
