import { Device } from '@ionic-native/device/ngx';
import { authInterceptorProviders } from './_helpers/auth-interceptor';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SearchComponent } from './search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import { WebsocketService } from './_services/websocketService';
import { MessagesComponent } from './messages/messages.component';
import { ConversationComponent } from './conversation/conversation.component';
import { CreateModalComponent } from './create-modal/create-modal.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PlaylistComponent } from './playlist/playlist.component';

@NgModule({
  declarations: [	
    AppComponent,
    LoginComponent,
    SearchComponent,
    ProfileComponent,
    HomeComponent,
    RoomComponent,
    MessagesComponent,
    ConversationComponent,
    CreateModalComponent,
    NotificationsComponent,
      PlaylistComponent
   ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    MatProgressBarModule,
    NgxSliderModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    authInterceptorProviders,
    Device,
    WebsocketService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
