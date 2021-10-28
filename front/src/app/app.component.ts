import { Device } from '@ionic-native/device/ngx';
import { Component, OnInit } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private device: Device, private platform: Platform) {}

  ngOnInit() {
    let scheme;
    if (this.device.platform === 'iOS') {
      scheme = 'twitter://';
    } else if (this.device.platform === 'Android') {
      scheme = 'com.twitter.android';
    }

    this.platform.ready().then(() => {
      if (this.platform.is('mobile')) {
        StatusBar.setStyle({ style: Style.Dark });
      }
    });
  }
}
