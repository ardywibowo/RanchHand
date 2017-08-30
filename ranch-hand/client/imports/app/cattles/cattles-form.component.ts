import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Cattles } from '../../../../both/collections/cattles.collection';
import { InjectUser } from "angular2-meteor-accounts-ui";
import template from './cattles-form.component.html';
import style from './cattles-form.component.scss';

@Component({
  selector: 'cattles-form',
  template,
  styles: [ style ]
})
@InjectUser("user")
export class CattlesFormComponent implements OnInit {
  addForm: FormGroup;
  newCattlePosition: {latitude:number, longitude: number} = {latitude: 37.4292, longitude: -122.1381};
  images: string[] = [];

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [],
      location: ['', Validators.required],
      public: [false]
    });
  }

  addCattle(): void {
    if (!Meteor.userId()) {
      alert('Please log in to add a cattle');
      return;
    }

    if (this.addForm.valid) {
      Cattles.insert({
        name: this.addForm.value.name,
        owner: Meteor.userId()
      });

      this.addForm.reset();
    }
  }

  onImage(imageId: string) {
    this.images.push(imageId);
  }
}
