import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { CattlesListComponent } from './cattles/cattles-list.component';
import { CattleDetailsComponent } from './cattles/cattle-details.component';
import { SignupComponent } from "./auth/signup.component";
import { RecoverComponent } from "./auth/recover.component";
import { LoginComponent } from "./auth/login.component";

export const routes: Route[] = [
  { path: '', component: CattlesListComponent },
  { path: 'cattle/:cattleId', component: CattleDetailsComponent, canActivate: ['canActivateForLoggedIn'] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'recover', component: RecoverComponent }
];

export const ROUTES_PROVIDERS = [{
  provide: 'canActivateForLoggedIn',
  useValue: () => !!Meteor.userId()
}];
