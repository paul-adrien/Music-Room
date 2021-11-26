import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { Camera } from '@ionic-native/camera/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RoomComponent } from './room/room.component';
import { WebsocketService } from './_services/websocketService';
import { MessagesComponent } from './messages/messages.component';
import { ConversationComponent } from './conversation/conversation.component';
import { CreateModalComponent } from './create-modal/create-modal.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { SettingsRoomComponent } from './settings-room/settings-room.component';
import { DelegationComponent } from './delegation/delegation.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { VerifyComponent } from './verify/verify.component';

// const config: SocketIoConfig = { url: environment.AUTH_API, options: {} };

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
    PlaylistComponent,
    SettingsRoomComponent,
    DelegationComponent,
    EditProfileComponent,
    VerifyComponent,
    UserProfileComponent,
  ],
  entryComponents: [],
  imports: [
    FormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    // SocketIoModule.forRoot(config),
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
    InAppBrowser,
    Camera,
    Geolocation,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
