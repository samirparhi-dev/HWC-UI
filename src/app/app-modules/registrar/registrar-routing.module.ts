import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistrationComponent } from './registration/registration.component';
import { SearchComponent } from './search/search.component';
import {ConsentFormComponent } from './consent-form/consent-form.component';
import { CanDeactivateGuardService } from '../../app-modules/core/services/can-deactivate-guard.service';
import { FamilyTaggingDetailsComponent } from './family-tagging/family-tagging-details/family-tagging-details.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: SearchComponent
      },
      {
        path: 'registration',
        component: RegistrationComponent,
        canDeactivate: [CanDeactivateGuardService]
      }, {
        path: 'search/:beneficiaryID',
        component: RegistrationComponent
      },{
        path: 'familyTagging',
        component: FamilyTaggingDetailsComponent
      }, {
        path: 'familyTagging/:benDetails',
        component: FamilyTaggingDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistrarRoutingModule { }
