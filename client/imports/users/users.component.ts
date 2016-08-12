import { Component } from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';

import { UsersDataService } from './users-data.service';
import template from './users.view.html';

@Component({
  selector: 'users',
  template,
  providers: [UsersDataService]
})
export class UsersComponent extends MeteorComponent {
  greeting: string;

  constructor(private usersDataService: UsersDataService) {
    super();

    this.greeting = 'Hello Users Component!';
  }

  getData() {
    return this.usersDataService.getData();
  }
}
