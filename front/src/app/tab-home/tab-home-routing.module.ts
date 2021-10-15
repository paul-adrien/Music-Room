import { NotificationsComponent } from './../notifications/notifications.component';
import { RoomComponent } from '../room/room.component';
import { HomeComponent } from '../home/home.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabHomePage } from './tab-home.page';
import { AuthGuard } from '../_services/auth-guard';
import { PlaylistComponent } from '../playlist/playlist.component';
import { MessagesComponent } from '../messages/messages.component';
import { ConversationComponent } from '../conversation/conversation.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'room/:id',
    component: RoomComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'playlist/:id',
    component: PlaylistComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'messages',
    component: MessagesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'conversation/:id',
    component: ConversationComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1PageRoutingModule {}
