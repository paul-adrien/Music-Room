import { Tab1Page } from '../tab-home/tab-home.page';
import { HomeComponent } from './../home/home.component';
import { ProfileComponent } from './../profile/profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { TabsPage } from './tabs.page';
import { RoomComponent } from '../room/room.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-home',
        component: Tab1Page,
        loadChildren: () =>
          import('../tab-home/tab-home.module').then((m) => m.Tab1PageModule),
      },
      {
        path: 'tab2',
        loadChildren: () =>
          import('../tab2/tab2.module').then((m) => m.Tab2PageModule),
      },
      {
        path: 'tab3',
        loadChildren: () =>
          import('../tab3/tab3.module').then((m) => m.Tab3PageModule),
      },
      { path: 'search', component: SearchComponent },
      { path: 'profile', component: ProfileComponent },
      {
        path: '',
        redirectTo: '/tabs/search',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
