import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountsModule } from 'angular2-meteor-accounts-ui';
import { Ng2PaginationModule } from 'ng2-pagination';
import { Ng2MapModule } from 'ng2-map';

import { AppComponent } from "./app.component";
import { routes, ROUTES_PROVIDERS } from './app.routes';
import { CATTLE_DECLARATIONS } from './cattles';
import { SHARED_DECLARATIONS } from './shared';
import { MaterialModule } from "@angular/material";
import { AUTH_DECLARATIONS } from "./auth/index";
import { FileDropModule } from "angular2-file-drop";
import { PushNotificationsModule } from "angular2-notifications";

let moduleDefinition;

moduleDefinition = {
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    Ng2PaginationModule,
    Ng2MapModule.forRoot({
      apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
    }),
    MaterialModule,
    FileDropModule,
    PushNotificationsModule
  ],
  declarations: [
    AppComponent,
    ...CATTLE_DECLARATIONS,
    ...SHARED_DECLARATIONS,
    ...AUTH_DECLARATIONS
  ],
  providers: [
    ...ROUTES_PROVIDERS
  ],
  bootstrap: [
    AppComponent
  ]
}

@NgModule(moduleDefinition)
export class AppModule { }
