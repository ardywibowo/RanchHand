import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { InjectUser } from "angular2-meteor-accounts-ui";
import { MouseEvent } from "angular2-google-maps/core";

import 'rxjs/add/operator/map';

import { Cattles } from '../../../../both/collections/cattles.collection';
import { Cattle } from '../../../../both/models/cattle.model';
import { Users } from '../../../../both/collections/users.collection';
import { User } from '../../../../both/models/user.model';

import template from './cattle-details.component.html';
import style from './cattle-details.component.scss';

@Component({
  selector: 'cattle-details',
  template,
  styles: [ style ]
})
@InjectUser('user')
export class CattleDetailsComponent implements OnInit, OnDestroy {
  cattleId: string;
  paramsSub: Subscription;
  cattle: Cattle;
  cattleSub: Subscription;
  users: Observable<User>;
  user: Meteor.User;
  // Default center Palo Alto coordinates.
  centerLat: number = 37.4292;
  centerLongitude: number = -122.1381;

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['cattleId'])
      .subscribe(cattleId => {
        this.cattleId = cattleId;
        
        if (this.cattleSub) {
          this.cattleSub.unsubscribe();
        }

        this.cattleSub = MeteorObservable.subscribe('cattle', this.cattleId).subscribe(() => {
          MeteorObservable.autorun().subscribe(() => {
            this.cattle = Cattles.findOne(this.cattleId);
          });
        });
      });
  }

  saveCattle() {
    if (!Meteor.userId()) {
      alert('Please log in to change this cattle');
      return;
    }
    
    Cattles.update(this.cattle._id, {
      $set: {
        name: this.cattle.name,
        location: this.cattle.location,
      }
    });
  }

  get isOwner(): boolean {
    return this.cattle && this.user && this.user._id === this.cattle.owner;
  }

  get latitude(): number {
    return this.cattle && this.cattle.location.latitude;
  }

  get longitude(): number {
    return this.cattle && this.cattle.location.longitude;
  }

  mapClicked($event: MouseEvent) {
    this.cattle.location.latitude = $event.coords.lat;
    this.cattle.location.longitude = $event.coords.lng;
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.cattleSub.unsubscribe();
  }
}
