import { Device } from '@ionic-native/device/ngx';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { AuthService } from './_services/auth_service';
import { WebsocketService } from './_services/websocketService';
import { Keyboard } from '@capacitor/keyboard';

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
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      console.log(this.platform);
      if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
        StatusBar.setStyle({ style: Style.Dark });
        if (this.platform.is('ios')) {
          Keyboard.addListener('keyboardDidShow', async (info) => {
            console.log('keyboard did show with height:', info.keyboardHeight);
            await Keyboard.setScroll({ isDisabled: false });
            this.cd.detectChanges();
          });

          Keyboard.addListener('keyboardDidHide', async () => {
            await Keyboard.setScroll({ isDisabled: true });
            this.cd.detectChanges();
          });
        }
      }
    });
  }
}
