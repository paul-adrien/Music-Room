import { Device } from '@ionic-native/device/ngx';
import { Component, OnInit } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private device: Device) {}

  ngOnInit() {
    let scheme;
    if (this.device.platform === 'iOS') {
      scheme = 'twitter://';
    } else if (this.device.platform === 'Android') {
      scheme = 'com.twitter.android';
    }

    if (this.device?.platform !== null) {
      StatusBar.setStyle({ style: Style.Dark });
    }
    console.log(this.device.platform);
  }
}
