import { Component } from '@angular/core';

import { UsersComponent } from './imports/users/users.component';
import { TrelloComponent } from './imports/trello/trello.component';
import template from './app.component.html';

@Component({
  selector: 'app',
  template,
  directives: [UsersComponent, TrelloComponent]
})
export class AppComponent {
  constructor() {
  }
}
