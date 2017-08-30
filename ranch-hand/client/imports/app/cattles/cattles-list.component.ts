import { OnDestroy, OnInit } from "@angular/core";
import { Observable, Subscription, Subject } from "rxjs";
import { Cattle } from "../../../../both/models/cattle.model";
import { PaginationService } from "ng2-pagination";
import { MeteorObservable } from "meteor-rxjs";
import { Cattles } from "../../../../both/collections/cattles.collection";
import { Counts } from "meteor/tmeasday:publish-counts";
import { InjectUser } from "angular2-meteor-accounts-ui";

import { Component, ViewChild } from '@angular/core';
import { Ng2MapComponent } from 'ng2-map';
import { HeatmapLayer } from "ng2-map";
import { PushNotificationsService } from "angular2-notifications";

import template from './cattles-list.component.html';
import style from './cattles-list.component.scss';


interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

@Component({
  selector: 'cattles-list',
  template,
  styles: [style]
})
@InjectUser('user')
export class CattlesListComponent implements OnInit, OnDestroy {

  // Map Display
  allCattles: Cattle[];
  allCattlesSub: Subscription;
  currentPositions = [];
  @ViewChild(HeatmapLayer) heatmapLayer: HeatmapLayer;
  heatmap: google.maps.visualization.HeatmapLayer;
  map: google.maps.Map;
  allOptions: any = {
    "center": {
      "lat": 45.251909,
      "lng": -118.55761946546436,
    },
    "zoom": 12,
    "mapTypeId": "satellite",
    "tilt": 45
  };
  heatmapPoints = [];
  heatmapTimeRange: number = 50;
  timeIndex: number = 0;
  timer: Observable<number>;

  // Pagination
  pageCattles: Observable<Cattle[]>;
  pageCattlesSub: Subscription;
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  cattlesSize: number = 0;
  autorunSub: Subscription;

  // Search
  searchName: Subject<string> = new Subject<string>();

  // User
  user: Meteor.User;

  constructor(private paginationService: PaginationService, private pushService: PushNotificationsService) { }

  // Controller lifecycle
  ngOnInit() {
    if (this.allCattlesSub) {
      this.allCattlesSub.unsubscribe();
    }

    this.allCattlesSub = MeteorObservable.subscribe('cattles').subscribe(() => {
      this.allCattles = Cattles.find({}).fetch();
      this.currentPositions = [];

      let initPositions = [];
      let initHeatPoints = [];

      this.allCattles.forEach(function (result: Cattle) {
        if (result.pastLocations != null && result.pastLocations[0].latitude != null && result.pastLocations[0].longitude != null) {
          initPositions.push([result.pastLocations[0].latitude, result.pastLocations[0].longitude]);
          initHeatPoints.push(new google.maps.LatLng(result.pastLocations[0].latitude, result.pastLocations[0].longitude));
        }
      });
      this.currentPositions = initPositions;
      this.heatmapPoints = initHeatPoints;
    });

    this.optionsSub = Observable.combineLatest(
      this.pageSize,
      this.curPage,
      this.nameOrder,
      this.searchName
    ).subscribe(([pageSize, curPage, nameOrder, searchName]) => {
      const options: Options = {
        limit: pageSize as number,
        skip: ((curPage as number) - 1) * (pageSize as number),
        sort: { name: nameOrder as number }
      };

      this.paginationService.setCurrentPage(this.paginationService.defaultId(), curPage as number);

      if (this.pageCattlesSub) {
        this.pageCattlesSub.unsubscribe();
      }

      this.pageCattlesSub = MeteorObservable.subscribe('cattles', options, searchName).subscribe(() => {
        let selector: any = {};
        if (searchName.length > 0) {
          selector = { name: { $regex: '.*' + (searchName || '') + '.*', '$options': 'i' } };
        }
        this.pageCattles = Cattles.find(selector, options).zone();
      });
    });

    this.paginationService.register({
      id: this.paginationService.defaultId(),
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.cattlesSize
    });

    this.pageSize.next(5);
    this.curPage.next(1);
    this.nameOrder.next(1);
    this.searchName.next('');

    this.autorunSub = MeteorObservable.autorun().subscribe(() => {
      this.cattlesSize = Counts.get('numberOfCattles');
      this.paginationService.setTotalItems(this.paginationService.defaultId(), this.cattlesSize);
    });

    // Timer Initialization
    this.timer = Observable.timer(2000, 1000);
    this.timer.subscribe(t => { 
      this.timeIndex++; 
      this.updateTimeIndex(this.timeIndex); 
    });
  }

  ngOnDestroy() {
    this.pageCattlesSub.unsubscribe();
    this.allCattlesSub.unsubscribe();
    this.optionsSub.unsubscribe();
    this.autorunSub.unsubscribe();
  }

  // Search
  search(value: string): void {
    this.curPage.next(1);
    this.searchName.next(value);
  }

  // Pagination
  onPageChanged(page: number): void {
    this.curPage.next(page);
  }

  changeSortOrder(nameOrder: string): void {
    this.nameOrder.next(parseInt(nameOrder));
  }

  // Cattle Removal
  removeCattle(cattle: Cattle): void {
    Cattles.remove(cattle._id);
  }

  // User
  isOwner(cattle: Cattle): boolean {
    return this.user && this.user._id === cattle.owner;
  }

  // Map
  // updateMap(sliderValue: number): void {
  //   let allCattle = Cattles.collection.find({});
  //   allCattle.forEach((cattle: Cattle) => {
  //     cattle.location.latitude = cattle.pastLocations[sliderValue].latitude;
  //     cattle.location.longitude = cattle.pastLocations[sliderValue].longitude;
  //   });
  // }

  updateTimeIndex(newIndex: number) {
    this.timeIndex = newIndex;
    this.currentPositions = [];
    this.heatmapPoints = [];

    let initPositions = [];
    let initHeatPoints = [];
    let minHeatTimeIndex = Math.max(0, newIndex - this.heatmapTimeRange);

    this.allCattles.forEach(function (result: Cattle) {
      if (result.pastLocations != null && result.pastLocations[newIndex] != null && result.pastLocations[newIndex].latitude != null && result.pastLocations[newIndex].longitude != null) {
        initPositions.push([result.pastLocations[newIndex].latitude, result.pastLocations[newIndex].longitude]);
      }
      for (let i = minHeatTimeIndex; i <= newIndex; ++i) {
        if (result.pastLocations != null && result.pastLocations[i] != null && result.pastLocations[i].latitude != null && result.pastLocations[i].longitude != null) {
          initHeatPoints.push(new google.maps.LatLng(result.pastLocations[i].latitude, result.pastLocations[i].longitude));
        }
      }
    });
    this.currentPositions = initPositions;
    this.heatmapPoints = initHeatPoints;
  }

  // Testing
  testButton() {
    this.timeIndex = 30;
    this.updateTimeIndex(this.timeIndex);
    // let test = [];
    // if (this.testCattle) {
    //   let currentTime = this.timeIndex;
    //   this.testCattle.forEach(function (cat: Cattle) {
    //     console.log(cat.location);
    //     if (cat && cat.pastLocations && typeof cat.pastLocations[currentTime] !== 'undefined') {
    //       test.push(new google.maps.LatLng(cat.pastLocations[currentTime].latitude, cat.pastLocations[currentTime].longitude));
    //     }
    //   });
    // }
    // this.points = test;
    this.pushService.create('OSUX83041 Battery Warning', { body: 'One of your cow tags have less than 5% battery remaining' }).subscribe(
      res => console.log(res),
      err => console.log(err)
    )
  }

  // points = [
  //     new google.maps.LatLng(37.782551, -122.445368),
  //];
}
