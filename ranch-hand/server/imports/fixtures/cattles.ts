import { Cattles } from '../../../both/collections/cattles.collection';
import { Cattle, Location } from '../../../both/models/cattle.model';
import { Meteor } from 'meteor/meteor';

import * as Papa from "papaparse";
import * as _ from "lodash";

export function loadCattles() {
  if (Cattles.find().cursor.count() === 0) {

    let fs = Npm.require("fs");
    let dataPath = 'assets/app/csvdata/';
    let data = fs.readdirSync(dataPath);

    _.forEach(data, function(datum: string) {
      let csvRegex: RegExp = /.csv/g;
      if (datum.match(csvRegex) != undefined) {
        // Read your file as a csv string (assuming it's in the private dir)
        let csv = Assets.getText('csvdata/' + datum);

        // Convert the csv to an array of arrays
        let rows: PapaParse.ParseResult = Papa.parse(csv);

        let pastLocations: Location[] = [];
        for (let i = 1; i < rows.data.length-1; i++) {
          let location: Location = {
            latitude: rows.data[i][0],
            longitude: rows.data[i][1],
            time: rows.data[i][3]
          }
          pastLocations.push(location);
        }

        let name: string = datum.substr(0, datum.lastIndexOf('.')) || datum;
        let cattle: Cattle = {
          name: name,
          location: pastLocations[pastLocations.length-1],
          pastLocations: pastLocations,
        }
        Cattles.insert(cattle);
      }
    });

    const cattles: Cattle[] = [{
      name: 'Spotty',
    }, {
      name: 'Old Bessie',
    }, {
      name: 'Great Jon',
    }];

    cattles.forEach((cattle: Cattle) => Cattles.insert(cattle));
  }
}
