import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Cattle } from '../models/cattle.model';

export const Cattles = new MongoObservable.Collection<Cattle>('cattles');

function loggedIn() {
  return !!Meteor.user();
}

Cattles.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
