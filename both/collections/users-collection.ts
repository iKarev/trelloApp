import {UsersDataObject} from "../models/users-data-object";
import {Mongo} from "meteor/mongo";

export const UsersCollection = new Mongo.Collection<UsersDataObject>('demo-collection');