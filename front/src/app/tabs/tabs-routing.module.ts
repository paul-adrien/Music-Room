import { TabProfileModule } from './../tab-profile/tab-profile.module';
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
      { path: 'search', canActivate: [AuthGuard], component: SearchComponent },
      {
        path: 'tab-profile',
        loadChildren: () =>
          import('../tab-profile/tab-profile.module').then(
            (m) => m.TabProfileModule
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/tab-home',
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
