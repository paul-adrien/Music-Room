import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  template: `
    <div class="top-container">
      <img class="picture" src="./assets/test-profile.jpg" />
      <div class="name">Gabin Guyot</div>
    </div>
  `,
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
