import { TabHomePage } from '../tab-home/tab-home.page';
import { HomeComponent } from './../home/home.component';
import { ProfileComponent } from './../profile/profile.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from '../search/search.component';
import { TabsPage } from './tabs.page';
import { RoomComponent } from '../room/room.component';
import { AuthGuard } from '../_services/auth-guard';
import { UserProfileComponent } from './../user-profile/user-profile.component';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-home',
        component: TabHomePage,
        loadChildren: () =>
          import('../tab-home/tab-home.module').then((m) => m.TabHomeModule),
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
      { path: 'search', canActivate: [AuthGuard], component: SearchComponent },
      {
        path: 'profile',
        canActivate: [AuthGuard],
        component: ProfileComponent,
      },
      {
        path: 'user-profile/:id',
        canActivate: [AuthGuard],
        component: UserProfileComponent,
      },
      {
        path: '',
        redirectTo: '/tabs/search',
        canActivate: [AuthGuard],

        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/tab-home',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
