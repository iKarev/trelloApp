import { Injectable } from '@angular/core';
import { Mongo } from 'meteor/mongo';

import { UsersDataObject } from '../../../both/models/users-data-object';
import { UsersCollection } from '../../../both/collections/users-collection';

@Injectable()
export class UsersDataService {
  private data : Mongo.Cursor<UsersDataObject>;

  constructor() {
    this.data = UsersCollection.find({});
  }

  public getData() : Mongo.Cursor<UsersDataObject> {
    return this.data;
  }
}
