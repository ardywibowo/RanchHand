import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Cattles } from '../../../both/collections/cattles.collection';

interface Options {
  [key: string]: any;
}

Meteor.publish('cattles', function (options: Options, name?: string) {
  const selector = buildQuery.call(this, null, name);

  Counts.publish(this, 'numberOfCattles', Cattles.collection.find(selector), { noReady: true });

  return Cattles.find(selector, options);
});

Meteor.publish('cattle', function (cattleId: string) {
  return Cattles.find(buildQuery.call(this, cattleId));
});

function buildQuery(cattleId?: string, name?: string): Object {
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

  if (cattleId) {
    return {
      // only single cattle
      $and: [{
        _id: cattleId
      },
        isAvailable
      ]
    };
  }

  const searchRegEx = { '$regex': '.*' + (name || '') + '.*', '$options': 'i' };

  return {
    $and: [{
      $or: [{
        'name': searchRegEx
      }]
    },
      isAvailable
    ]
  };
}
