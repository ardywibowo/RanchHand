import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';

import { Sensor } from '../models/sensor.model';

export const Sensors = new MongoObservable.Collection<Sensor>('sensors');

function loggedIn() {
  return !!Meteor.user();
}

Sensors.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
