import { SearchComponent } from './search/search.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RoomComponent } from './room/room.component';
import { MessagesComponent } from './messages/messages.component';
import { ConversationComponent } from './conversation/conversation.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  { path: 'login', component: LoginComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'conversation/:convId', component: ConversationComponent },
  // { path: 'search', component: SearchComponent },
  // {
  //   path: '',
  //   redirectTo: '/search',
  //   pathMatch: 'full',
  // },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
