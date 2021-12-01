import { SettingsProfileComponent } from './../settings-profile/settings-profile.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../profile/profile.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { AuthGuard } from '../_services/auth-guard';

const routes: Routes = [
  {
    path: 'user-profile/:id',
    canActivate: [AuthGuard],
    component: UserProfileComponent,
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: ProfileComponent,
    pathMatch: 'full',
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: SettingsProfileComponent,
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'profile',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabProfilePageRoutingModule {}
