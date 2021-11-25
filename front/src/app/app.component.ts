import { Device } from '@ionic-native/device/ngx';
import { Component, OnInit } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { AuthService } from './_services/auth_service';
import { WebsocketService } from './_services/websocketService';
import {
  Keyboard,
  KeyboardResize,
  KeyboardResizeOptions,
} from '@capacitor/keyboard';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private device: Device,
    private platform: Platform,
    private socketService: WebsocketService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    let scheme;
    if (this.device.platform === 'iOS') {
      scheme = 'twitter://';
    } else if (this.device.platform === 'Android') {
      scheme = 'com.twitter.android';
    }

    this.platform.ready().then(() => {
      if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
        StatusBar.setStyle({ style: Style.Dark });
        if (this.platform.is('ios')) {
          Keyboard.addListener('keyboardWillShow', async (info) => {
            console.log('keyboard did show with height:', info.keyboardHeight);
            await Keyboard.setScroll({ isDisabled: false });
          });

          Keyboard.addListener('keyboardWillHide', async () => {
            await Keyboard.setScroll({ isDisabled: true });
          });
        }
      }
    });

    // this.authService.checkIfUserCo()
    // .toPromise()
    // .then(
    //   (data) => {
    //     if (
    //       JSON.parse(data)['status'] === true &&
    //       this.authService.getUser()
    //     ) {
    //       this.socketService.setupSocketConnection();
    //     }
    //   },
    //   (err) => {
    //   }
    // );
  }
}
