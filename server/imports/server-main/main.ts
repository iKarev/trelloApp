import { UsersCollection } from '../../../both/collections/users-collection';
import { UsersDataObject } from '../../../both/models/users-data-object';

export class Main {
  constructor() {
  }

  start():void {
    this.initFakeData();
  }

  initFakeData():void {
    if (UsersCollection.find({}).count() === 0) {
      UsersCollection.insert(<UsersDataObject>{
        name: 'Dotan',
        age: 25
      });

      UsersCollection.insert(<UsersDataObject>{
        name: 'Liran',
        age: 26
      });

      UsersCollection.insert(<UsersDataObject>{
        name: 'Uri',
        age: 30
      });
    }
  }
}
