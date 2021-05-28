import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  template: `
    <div class="header">
      <div class="search-container">
        <img src="./assets/search-outline.svg" />
        <input />
      </div>
    </div>
  `,
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
