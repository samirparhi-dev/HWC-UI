/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { BeneficiaryDetailsService } from '../../services/beneficiary-details.service';

import 'rxjs/Rx';
import { HttpServiceService } from '../../services/http-service.service';
import { RegistrarService } from 'app/app-modules/registrar/shared/services/registrar.service';
import { ConfirmationService } from '../../services';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { Subscription } from 'rxjs/Rx';
import * as moment from 'moment';

@Component({
  selector: 'app-beneficiary-details',
  templateUrl: './beneficiary-details.component.html',
  styleUrls: ['./beneficiary-details.component.css']
})
export class BeneficiaryDetailsComponent implements OnInit {

  beneficiary: any;
  today: any;
  beneficiaryDetailsSubscription: any;
  familyIdStatusStatusSubscription:Subscription;
  current_language_set: any;
  benDetails: any;
  healthIDArray: any=[];
  healthIDValue: string='';
  beneficiaryId: any;
  benFlowStatus: boolean;
  getBenFamilyData: boolean;
  benFamilySubscription: Subscription
  benFamilyId: any;
  beneficiaryName: any;
  firstName: any;
  lastName: any;
  regDate: string;



 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
    private registrarService: RegistrarService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.today = new Date();
    this.getHealthIDDetails();
    let benFlowID = localStorage.getItem('benFlowID')
   if(benFlowID !== null && benFlowID !== undefined){
    this.getBenDetails();
    this.benFlowStatus = true;

   }else{
    this.getBenFamilyDetails();
    this.benFlowStatus = false;
   }
   this.benFamilySubscription =
      this.registrarService.benFamilyDetails$.subscribe((response) => {
       this.benFamilyId = response;
      });
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnDestroy() {
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();
      localStorage.removeItem('benFlowID');
    if (this.benFamilySubscription)
      this.benFamilySubscription.unsubscribe();
  }


getBenDetails(){

  this.route.params.subscribe(param => {
    this.beneficiaryDetailsService.getBeneficiaryDetails(param['beneficiaryRegID'], localStorage.getItem('benFlowID'));
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(res => {
        if (res != null) {
          this.beneficiary = res;
         if (res.serviceDate) {
           this.today = res.serviceDate;
         }
        }
      });

    this.beneficiaryDetailsService.getBeneficiaryImage(param['beneficiaryRegID'])
      .subscribe(data => {
        if (data && data.benImage) {
          this.beneficiary.benImage = data.benImage;
        }
      });
  });

}


getBenFamilyDetails(){
  const reqObj = {
    "beneficiaryRegID" : null,
    "beneficiaryName" : null,
    "beneficiaryID" : localStorage.getItem('beneficiaryID'),
    "phoneNo" : null,
    "HealthID" : null,
    "HealthIDNumber" : null,
    "familyId" : null,
    "identity" : null,
  };
    this.registrarService.identityQuickSearch(reqObj)
      .subscribe((res) => {
        if (res && res.length === 1) {
          this.beneficiary = res[0];
          this.benFamilyId = res[0].familyId;
          this.beneficiaryName = this.beneficiary.firstName + (this.beneficiary.lastName !== undefined ? ( " " + this.beneficiary.lastName) : "")  ;

          
          this.regDate =  moment.utc(this.beneficiary.createdDate).format('DD-MM-YYYY hh:mm A');

  
        } 
      });

    this.beneficiaryDetailsService.getBeneficiaryImage(localStorage.getItem('beneficiaryRegID'))
      .subscribe(data => {
        if (data && data.benImage) {
          this.beneficiary.benImage = data.benImage;
        }
      });
}





  getHealthIDDetails()
  {
    this.route.params.subscribe(param => {
      console.log("benID",param);
    let data = {
      "beneficiaryRegID": param['beneficiaryRegID'],
      "beneficiaryID": null
    }
    this.registrarService.getHealthIdDetails(data)
      .subscribe((healthIDDetails) => {
        if (healthIDDetails.statusCode == 200) {
          console.log("healthID",healthIDDetails);
          if(healthIDDetails.data.BenHealthDetails !=undefined && healthIDDetails.data.BenHealthDetails !=null)
          {
          this.benDetails=healthIDDetails.data.BenHealthDetails;
          if(this.benDetails.length >0)
          {
          this.benDetails.forEach((healthID,index) => {
            if(healthID.healthId !=undefined && healthID.healthId !=null && (index != this.benDetails.length-1))
            this.healthIDArray.push(healthID.healthId+',');
            else if(healthID.healthId !=undefined && healthID.healthId !=null)
            this.healthIDArray.push(healthID.healthId);
            if(healthID.healthId !=undefined && healthID.healthId !=null)
            this.healthIDValue=this.healthIDValue+healthID.healthId+',';
          })
        }
          if(this.healthIDValue !=undefined && this.healthIDValue !=null && this.healthIDValue.length >1)
          {
            this.healthIDValue=this.healthIDValue.substring(0,this.healthIDValue.length-1);
            //this.beneficiaryDetailsService.healthID= this.healthIDValue;
          }
        }
        } else {
          this.confirmationService.alert(this.current_language_set.issueInGettingBeneficiaryABHADetails, 'error');
        }
      }, (err) => {
        this.confirmationService.alert(this.current_language_set.issueInGettingBeneficiaryABHADetails, 'error');

      })
  });
}
  
}
