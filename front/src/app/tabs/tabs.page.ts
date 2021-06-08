import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar color="dark" slot="bottom">
        <ion-tab-button tab="tab1">
          <ion-icon name="triangle"></ion-icon>
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="search">
          <ion-icon name="search-outline"></ion-icon>
          <ion-label>Search</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile">
          <ion-icon name="albums-outline"></ion-icon>
          <ion-label>Découvrir</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  constructor() {}
}
