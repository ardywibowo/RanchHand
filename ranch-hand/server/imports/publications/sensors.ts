import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Sensors } from '../../../both/collections/sensors.collection';

Meteor.publish('sensors', function () {
  const selector = buildQuery.call(this);

  Counts.publish(this, 'numberOfSensors', Sensors.collection.find(selector), { noReady: true });

  return Sensors.find(selector);
});

Meteor.publish('cattle', function () {
  return Sensors.find(buildQuery.call(this));
});

function buildQuery(sensorId?: string): Object {
  // const isAvailable = {
  //   // current user is the owner
  //   $and: [{
  //     owner: this.userId
  //   }, {
  //     owner: {
  //       $exists: true
  //     }
  //   }]
  // };

  const isAvailable = {};

  if (sensorId) {
    return {
      // only single cattle
      $and: [{
        _id: sensorId
      },
        isAvailable
      ]
    };
  }
  return {
    isAvailable
  };
}
