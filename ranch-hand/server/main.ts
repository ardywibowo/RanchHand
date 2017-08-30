import { Meteor } from 'meteor/meteor';

import { loadCattles } from './imports/fixtures/cattles';
import { Cattles } from './../both/collections/cattles.collection';

import './imports/publications/cattles';

Meteor.startup(() => {
  loadCattles();
  var PORT = 7777;

  var dgram = require('dgram');
  var server = dgram.createSocket('udp4');

  server.on('listening', function () {
      var address = server.address();
      console.log('UDP Server listening on ' + address.address + ":" + address.port);
  });

  server.on('message', function (message, remote) {
      console.log(remote.address + ':' + remote.port +' - ' + message);

      // Parse received message
      // Check new sensor
        // Create a collection of notifications that the client subscribes to.
      // Temporarily keep readings somewhere (probably in the cattle object as a new field (untriangulated readings & sensor id tuple))
      // Cattles.insert
  });

  server.bind(PORT);
});
