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
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { BeneficiaryDetailsService, ConfirmationService } from 'app/app-modules/core/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { Subscription } from 'rxjs';
import { DoctorService, MasterdataService } from '../../shared/services';

@Component({
  selector: 'app-infant-birth-details',
  templateUrl: './infant-birth-details.component.html',
  styleUrls: ['./infant-birth-details.component.css']
})
export class InfantBirthDetailsComponent implements OnInit {

  @Input('visitCategory')
  visitType : any;

  @Input('infantBirthDetailsForm')
  infantBirthDetailsForm: FormGroup

  @Input('mode')
  mode: any;

  currentLanguageSet: any;
  enableOtherDeliveryPlace: boolean;
  enableOtherDeliveryType: boolean;
  enableOtherBirthComplication: boolean;

  deliveryPlaceList = []

  deliveryTypeList = []

  birthComplicationList = []

  gestationList = []

  deliveryConductedByList = []

  congenitalAnomaliesList = []
  
  placeOfDelivery= [];

  attendant: any;
  today= new Date();
  masterDataSubscription: Subscription;
  infantAndBirthHistoryDetailsSubscription: Subscription;
  beneficiaryDetailsSubscription: any;
  beneficiary: any;
  benBirthDetails: Date;

  constructor(
    public httpServiceService: HttpServiceService,
    private masterDataService: MasterdataService,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private beneficiaryDetailsService: BeneficiaryDetailsService
  ) {}

  ngOnInit() {
    this.doctorService.setInfantDataFetch(false);
    console.log(this.visitType)
    this.assignSelectedLanguage();
    this.attendant = this.route.snapshot.params["attendant"];
    this.loadMasterData();
    this.today.setDate(this.today.getDate());
    this.getBeneficiaryDetails();

    
    this.doctorService.fetchInfantDataCheck$.subscribe(
      (responsevalue) => {
        if(responsevalue == true) {
          this.getNurseFetchDetails();
        }
      });
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  ngOnChanges(){
    // if (this.mode == "view") {
    //   this.getNurseFetchDetails();
    // }
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  loadMasterData() {
    this.masterDataSubscription = 
    this.masterDataService.nurseMasterData$.subscribe((res) => {
      if(res !== undefined && res !== null){
      this.deliveryPlaceList = res.deliveryPlaces;
      this.placeOfDelivery = res.deliveryTypes;
      this.deliveryTypeList = res.deliveryTypes;
      this.birthComplicationList = res.birthComplications;
      this.gestationList = res.gestation;
      this.deliveryConductedByList = res.deliveryConductedByMaster;
      this.congenitalAnomaliesList = res.m_congenitalanomalies;
      if (this.mode == "view") {
        this.getNurseFetchDetails();
      }

        //for fetching previous visit immunization history
        if(this.attendant == "nurse") {
      this.getPreviousInfantBirthDetails();
      }
    } else {
      console.log("Error in fetching nurse master data details");
    }
    })
  }
  getBeneficiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails) {
        this.beneficiary = beneficiaryDetails;
        this.benBirthDetails = new Date(beneficiaryDetails.dOB);
        this.infantBirthDetailsForm.patchValue({dateOfBirth : this.benBirthDetails});

          }
        })
  }
  
  getDeliveryType() {
    this.deliveryTypeList.filter((item) => {
      if (item.deliveryTypeID === this.infantBirthDetailsForm.controls.deliveryTypeID.value
      ) {
        this.infantBirthDetailsForm.controls.deliveryType.setValue(item.deliveryType);
      }
    });
    (this.mode == "view" || this.mode == "update") ? this.doctorService.BirthAndImmunizationValueChanged(true) : null;
  }

  getGestation(){
    this.gestationList.filter((item) => {
      if (item.gestationID === this.infantBirthDetailsForm.controls.gestationID.value
      ) {
        this.infantBirthDetailsForm.controls.gestation.setValue(item.name);
      }
    });
    (this.mode == "view" || this.mode == "update") ? this.doctorService.BirthAndImmunizationValueChanged(true) : null;
  }

  getDeliveryConductedBy(){
    this.deliveryConductedByList.filter((item) => {
      if (item.deliveryConductedByID === this.infantBirthDetailsForm.controls.deliveryConductedByID.value
      ) {
        this.infantBirthDetailsForm.controls.deliveryConductedBy.setValue(item.deliveryConductedBy);
      }
    });
    (this.mode == "view" || this.mode == "update") ? this.doctorService.BirthAndImmunizationValueChanged(true) : null;
  }

  otherPlaceOfDelivery(isFetch){
    if(isFetch == true){
      this.infantBirthDetailsForm.get("deliveryTypeID").reset();
      this.infantBirthDetailsForm.get("deliveryType").reset();
    }
    let deliveryList = this.placeOfDelivery;
    this.deliveryPlaceList.filter((item) => {
      if (item.deliveryPlaceID === this.infantBirthDetailsForm.controls.deliveryPlaceID.value
      ) {
        this.infantBirthDetailsForm.controls.deliveryPlace.setValue(item.deliveryPlace);
      }
    });
    if(this.infantBirthDetailsForm.controls.deliveryPlace.value == "Home-Supervised" ||
    this.infantBirthDetailsForm.controls.deliveryPlace.value == "Home-Unsupervised"){
    let deliveryType = this.deliveryTypeList.filter(item => {
      return item.deliveryType == "Normal Delivery"
    })
    this.deliveryTypeList = deliveryType;
   } else if (this.infantBirthDetailsForm.controls.deliveryPlace.value == "Subcentre" || 
   this.infantBirthDetailsForm.controls.deliveryPlace.value == "PHC"){
    let deliveryType = deliveryList.filter(item => {
      return item.deliveryType !== "Cesarean Section (LSCS)"
    })
    this.deliveryTypeList = deliveryType;
   } 
   else {
     this.deliveryTypeList = this.placeOfDelivery;  
   }
    if(this.infantBirthDetailsForm.controls.deliveryPlace.value === "Other"){
      this.enableOtherDeliveryPlace = true;
    } else{
      this.enableOtherDeliveryPlace = false;
      this.infantBirthDetailsForm.get("otherDeliveryPlace").reset();
    }
    (this.mode == "view" || this.mode == "update") ? this.doctorService.BirthAndImmunizationValueChanged(true) : null;
  }

  otherBirthComplication(){
    this.birthComplicationList.filter((item) => {
      if (item.complicationID === this.infantBirthDetailsForm.controls.birthComplicationID.value
      ) {
        this.infantBirthDetailsForm.controls.birthComplication.setValue(item.complicationValue);
      }
    });
    if(this.infantBirthDetailsForm.controls.birthComplication.value === "Other"){
      this.enableOtherBirthComplication = true;
    } else{
      this.enableOtherBirthComplication = false;
      this.infantBirthDetailsForm.get("otherDeliveryComplication").reset();
    }
    (this.mode == "view" || this.mode == "update") ? this.doctorService.BirthAndImmunizationValueChanged(true) : null;
  }

  checkNewBornWeight(){
    if(this.infantBirthDetailsForm.controls.birthWeightOfNewborn.value !== undefined &&
      this.infantBirthDetailsForm.controls.birthWeightOfNewborn.value !== null &&
      this.infantBirthDetailsForm.controls.birthWeightOfNewborn.value < 500){
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue);
    }
    (this.mode == "view" || this.mode == "update") ? this.doctorService.BirthAndImmunizationValueChanged(true) : null;
  }

  onValueChange(){
    (this.mode == "view" || this.mode == "update") ? this.doctorService.BirthAndImmunizationValueChanged(true) : null;
  }

  getNurseFetchDetails() {
    if (
      this.doctorService.birthAndImmunizationDetailsFromNurse !== null &&
      this.doctorService.birthAndImmunizationDetailsFromNurse !== undefined && 
      this.doctorService.birthAndImmunizationDetailsFromNurse.infantBirthDetails !== undefined && 
      this.doctorService.birthAndImmunizationDetailsFromNurse.infantBirthDetails !== null) 
      {
      let infantBirthFormData = this.doctorService.birthAndImmunizationDetailsFromNurse.infantBirthDetails;
      let infantBirthDetails = Object.assign(
        {},
        infantBirthFormData,
        {
          dateOfBirth: new Date(
            infantBirthFormData.dateOfBirth
          ),
        },
        {
          dateOfUpdatingBirthDetails: new Date(
            infantBirthFormData.dateOfUpdatingBirthDetails
          ),
        },
      );
      this.infantBirthDetailsForm.patchValue(infantBirthDetails);
      this.otherBirthComplication();
      this.otherPlaceOfDelivery(false);
      } else{
        console.log("Error in fetching nurse details");
      }
  }


  getPreviousInfantBirthDetails() {
    this.infantAndBirthHistoryDetailsSubscription = this.doctorService.infantAndImmunizationData$.subscribe((res) => { 
    if (
      res !== null && res !== undefined && 
      res.infantBirthDetails !== undefined && res.infantBirthDetails !== null) 
      {
      let infantBirthFormData = res.infantBirthDetails;
      let infantBirthDetails = Object.assign(
        {},
        infantBirthFormData,
        {
          dateOfBirth: new Date(
            infantBirthFormData.dateOfBirth
          ),
        },
        {
          dateOfUpdatingBirthDetails: new Date(
            infantBirthFormData.dateOfUpdatingBirthDetails
          ),
        },
      );
      this.infantBirthDetailsForm.patchValue(infantBirthDetails);
      this.otherBirthComplication();
      this.otherPlaceOfDelivery(false);
      this.infantBirthDetailsForm.patchValue({ id: null });
      } 
    else{
        console.log("Error in fetching previous infant birth details");
      }
    });
  }

  ngOnDestroy(){
    this.infantBirthDetailsForm.reset();
    if (this.masterDataSubscription)
    this.masterDataSubscription.unsubscribe();
    if (this.infantAndBirthHistoryDetailsSubscription)
    this.infantAndBirthHistoryDetailsSubscription.unsubscribe();
    if (this.beneficiaryDetailsSubscription)
    this.beneficiaryDetailsSubscription.unsubscribe();
  }
}
