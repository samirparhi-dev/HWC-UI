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
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MdDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { PreviousImmunizationServiceDetailsComponent } from 'app/app-modules/core/components/previous-immunization-service-details/previous-immunization-service-details.component';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { BeneficiaryDetailsService, ConfirmationService } from 'app/app-modules/core/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { Subscription } from 'rxjs';
import { DoctorService, MasterdataService, NurseService } from '../../shared/services';

@Component({
  selector: 'app-form-immunization-history',
  templateUrl: './form-immunization-history.component.html',
  styleUrls: ['./form-immunization-history.component.css']
})
export class FormImmunizationHistoryComponent implements OnInit {


  @Input('mode')
  mode: any;

  @Input("neonatalImmunizationHistoryForm")
  neonatalImmunizationHistoryForm: any;

  

  masterData: any;
  temp: any;
  beneficiaryAge: any;
  currentLanguageSet: any;

  vaccineReceivedStatus = [ {
    "name": "Received",
    "receivedStatus": true
  },
  {
    "name": "Not Received",
    "receivedStatus": false
  }];

  vaccineReceivedList = [];
  attendant: any;
  infantAndBirthHistoryDetailsSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private masterdataService: MasterdataService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private route: ActivatedRoute,
    private dialog: MdDialog,
    private nurseService: NurseService,
    private confirmationService: ConfirmationService
   
  ) {}
  ngOnInit() {
    this.assignSelectedLanguage();
    this.attendant = this.route.snapshot.params["attendant"];
    this.getMasterData();

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

  nurseMasterDataSubscription: any;
  getMasterData() {

    // this.masterData = vaccinesDatas;
    // this.getBeneficiaryDetails();
    // this.filterImmunizationMasterList(vaccinesDatas.childVaccinations);
    this.nurseMasterDataSubscription =
      this.masterdataService.nurseMasterData$.subscribe((masterData) => {
        if (masterData && masterData.childVaccinations) {
          // this.nurseMasterDataSubscription.unsubscribe();
          this.masterData = masterData;
          this.getBeneficiaryDetails();
    this.vaccineReceivedList =  this.masterData.m_birthdosevaccinationreceivedat;
          this.filterImmunizationMasterList(masterData.childVaccinations);
        }
      });
  }
  filterImmunizationMasterList(list) {

    let immunizationAge = [];
    let temp = [];

    list.forEach((element) => {
      if (
        immunizationAge.indexOf(element.vaccinationTime) < 0 &&
        this.getAgeValue(element.vaccinationTime) <=
          this.getAgeValue(this.beneficiaryAge)
      )
      if(element.vaccinationTime.toLowerCase() !== "9 months" && element.vaccinationTime.toLowerCase() !== "5 years") {
      if(this.getAgeValue(this.beneficiaryAge) <= 6935 &&  this.getAgeValue(element.vaccinationTime) <= this.getAgeValue(this.beneficiaryAge))
       {
         immunizationAge.push(element.vaccinationTime);
       }
      //  else if(this.getAgeValue(this.beneficiaryAge) <= 270  &&  this.getAgeValue(element.vaccinationTime) <= this.getAgeValue(this.beneficiaryAge))
      //   {
      //     immunizationAge.push(element.vaccinationTime);
      //   }
      //   else if(this.getAgeValue(this.beneficiaryAge) <= 97 && this.getAgeValue(element.vaccinationTime) <= this.getAgeValue(this.beneficiaryAge))
      //   {
      //     immunizationAge.push(element.vaccinationTime);
      //   }
      //   else if(this.getAgeValue(this.beneficiaryAge) <= 69 && this.getAgeValue(element.vaccinationTime) <= this.getAgeValue(this.beneficiaryAge))
      //   {
      //     immunizationAge.push(element.vaccinationTime);
      //   }
      //   else if(this.getAgeValue(this.beneficiaryAge) <= 41 && this.getAgeValue(element.vaccinationTime) <= this.getAgeValue(this.beneficiaryAge))
      //   {
      //     immunizationAge.push(element.vaccinationTime);
      //   }
      }
    });

    immunizationAge.sort((prev, next) => {
      return this.getAgeValue(prev) - this.getAgeValue(next);
    });

    immunizationAge.forEach((item) => {
      let vaccines = [];
      list.forEach((element) => {
        if (element.vaccinationTime == item) {
          if (element.sctCode != null) {
            vaccines.push({
              vaccine: element.vaccineName,
              sctCode: element.sctCode,
              sctTerm: element.sctTerm,
              status: null
            });
          } else {
            vaccines.push({
              vaccine: element.vaccineName,
              sctCode: null,
              sctTerm: null,
              status: null
            });
          }
        }
      });

     

      temp.push({
        defaultReceivingAge: item,
        enableVaccinationReceivedAt : false,
        vaccinationReceivedAtID : null,
        vaccinationReceivedAt: null,
        vaccines: vaccines
      });
    });

    this.temp = temp;
    this.initImmunizationForm();

    //for fetching previous visit immunization history
    if(this.attendant == "nurse") {
    this.getPreviousImmunizationHistoryDetails();
    }

  }

  beneficiaryDetailSubscription: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription =
      this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(
        (beneficiary) => {
          if (
            beneficiary !== null &&
            beneficiary.age !== undefined &&
            beneficiary.age !== null
          ) {
            let calculateAgeInYears = beneficiary.age.split("-")[0].trim();
            let calculateAgeInMonths = beneficiary.age.split("-")[1]
              ? beneficiary.age.split("-")[1].trim()
              : "";
            if (calculateAgeInMonths !== "0 months") {
              let ageInYear = this.getAgeValue(calculateAgeInYears);
              let ageInMonth = this.getAgeValue(calculateAgeInMonths);
              this.beneficiaryAge = ageInYear + ageInMonth + " days";
            } else {
              this.beneficiaryAge = beneficiary.age.split("-")[0].trim();
            }
          }
        }
      );
  }

  
  getAgeValue(age) {
    if (!age) return 0;
    let arr = age !== undefined && age !== null ? age.trim().split(" ") : age;
    if (arr[1]) {
      let ageUnit = arr[1];
      if (ageUnit.toLowerCase() == "years") {
        if (arr[0] === "5-6"){
          return 5 * 12 * 30;
        } else
        return parseInt(arr[0]) * 12 * 30;
      }
      else if (ageUnit.toLowerCase() == "months") 
      {
        if(arr[0] === "9-12")
            return 9 * 30;
        else if (arr[0] === "16-24")
            return 16 * 30;
        else    
            return parseInt(arr[0]) * 30;

      }
      else if (ageUnit.toLowerCase() == "weeks") return parseInt(arr[0]) * 7;
      else if (ageUnit.toLowerCase() === "days") return parseInt(arr[0]);
    }
    return 0;
  }
  initImmunizationForm() {
    for (let i = 0; i < this.temp.length; i++) {
      this.addImmunization();
      for (let j = 0; j < this.temp[i].vaccines.length; j++) this.addVaccine(i);
    }
    (<FormArray>(
      this.neonatalImmunizationHistoryForm.controls["immunizationList"]
    )).patchValue(this.temp);

    if (this.mode == "view") {
     
      this.getNurseFetchDetails();
    }
    if (parseInt(localStorage.getItem("specialistFlag")) == 100) {
      
      this.getNurseFetchDetails();
    }
  }
  addVaccine(i) {
    let immunizationList = <FormArray>(
      this.neonatalImmunizationHistoryForm.controls["immunizationList"]
    );
    let vaccineList = (<FormArray>immunizationList.controls[i]).controls[
      "vaccines"
    ];
    vaccineList.push(this.initVaccineList());
  }

  addImmunization() {
    let immunizationList = <FormArray>(
      this.neonatalImmunizationHistoryForm.controls["immunizationList"]
    );
    immunizationList.push(this.initImmunizationList());
  }
  initImmunizationList() {
    return this.fb.group({
      defaultReceivingAge: null,
      enableVaccinationReceivedAt : false,
      vaccinationReceivedAtID : null,
      vaccinationReceivedAt: null,
      vaccines: this.fb.array([]),
    });
  }

  initVaccineList() {
    return this.fb.group({
      vaccine: null,
      sctCode: null,
      sctTerm: null,
      status: null
    });
  }


  getNurseFetchDetails() {
    if (
      this.doctorService.birthAndImmunizationDetailsFromNurse !== undefined &&
      this.doctorService.birthAndImmunizationDetailsFromNurse !== null && 
      this.doctorService.birthAndImmunizationDetailsFromNurse.immunizationHistory !== undefined && 
      this.doctorService.birthAndImmunizationDetailsFromNurse.immunizationHistory !== null) 
      {
      let formImmunizationHistoryData = this.doctorService.birthAndImmunizationDetailsFromNurse.immunizationHistory;

      if (formImmunizationHistoryData && formImmunizationHistoryData.immunizationList) {
        let temp = formImmunizationHistoryData;
        (<FormArray>(
          this.neonatalImmunizationHistoryForm.controls["immunizationList"]
        )).patchValue(temp.immunizationList);

        //For enabling received at dropdown
        let immunizationListData = this.neonatalImmunizationHistoryForm.controls["immunizationList"].value;
       
       let immunizationListValues = <FormArray>(
        this.neonatalImmunizationHistoryForm.controls["immunizationList"]
      );

        immunizationListData.forEach((item,indexValue) => {
          this.vaccineReceivedList.forEach((vaccineValues,indexValues) => {
             if(vaccineValues.name === item.vaccinationReceivedAt)
        
           (<FormArray>immunizationListValues.controls[indexValue]).controls["vaccinationReceivedAtID"].patchValue(vaccineValues.id);
                  
          });
         this.enableReceivedAt(indexValue);

        
     });
        
    
      }
      }
 
  }

  getPreviousImmunizationHistoryDetails() {
    this.infantAndBirthHistoryDetailsSubscription 
              = this.doctorService.infantAndImmunizationData$.subscribe((res) => { 
    if (
      res !== undefined && res !== null && 
      res.immunizationHistory !== undefined && res.immunizationHistory !== null) 
      {
      let formImmunizationHistoryData = res.immunizationHistory;

      if (formImmunizationHistoryData && formImmunizationHistoryData.immunizationList) {
        let temp = formImmunizationHistoryData;
        (<FormArray>(
          this.neonatalImmunizationHistoryForm.controls["immunizationList"]
        )).patchValue(temp.immunizationList);

        //For enabling received at dropdown
        let immunizationListData = this.neonatalImmunizationHistoryForm.controls["immunizationList"].value;
       
        let immunizationListValues = <FormArray>(
          this.neonatalImmunizationHistoryForm.controls["immunizationList"]
        );

          immunizationListData.forEach((item,indexValue) => {
            this.vaccineReceivedList.forEach((vaccineValues,indexValues) => {
               if(vaccineValues.name === item.vaccinationReceivedAt)
          
             (<FormArray>immunizationListValues.controls[indexValue]).controls["vaccinationReceivedAtID"].patchValue(vaccineValues.id);
                    
            });
           this.enableReceivedAt(indexValue);

          
       });
        
    
      }
      }
    });
 
  }

  ngOnDestroy() {
    
    let immunizationList = <FormArray>(
      this.neonatalImmunizationHistoryForm.controls["immunizationList"]
    );
    while (immunizationList.length) {
      immunizationList.removeAt(0);
   }
    this.neonatalImmunizationHistoryForm.reset();
    this.vaccineReceivedList = [];
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();

    if (this.infantAndBirthHistoryDetailsSubscription)
    this.infantAndBirthHistoryDetailsSubscription.unsubscribe();
  }


  setVaccineReceivedAt(index) 
  {
    let immunizationList = <FormArray>(
      this.neonatalImmunizationHistoryForm.controls["immunizationList"]
    );

    let receivedAtId =   (<FormArray>immunizationList.controls[index]).controls["vaccinationReceivedAtID"].value;
    
    this.vaccineReceivedList.filter(item => {
       if(item.id == receivedAtId) 
       {
        (<FormArray>immunizationList.controls[index]).controls["vaccinationReceivedAt"].patchValue(item.name);
       }
    });

    // for enabling update button in doctor
    (this.mode == "view" || this.mode == "update") ? this.doctorService.BirthAndImmunizationValueChanged(true) : null;
  }

  enableReceivedAt(index) {

    let immunizationList = <FormArray>(
      this.neonatalImmunizationHistoryForm.controls["immunizationList"]
    );

    let vaccineArray =   (<FormArray>immunizationList.controls[index]).controls["vaccines"].value;

   let flag = false;
    vaccineArray.filter(item => {
      if(item.status == true) 
      {
        flag = true;
      }
   });

     if(flag) {
         (<FormArray>immunizationList.controls[index]).controls["enableVaccinationReceivedAt"].patchValue(true);
         
      }
     else
      {
          (<FormArray>immunizationList.controls[index]).controls["enableVaccinationReceivedAt"].patchValue(false);
          (<FormArray>immunizationList.controls[index]).controls["vaccinationReceivedAtID"].patchValue(null);
          (<FormArray>immunizationList.controls[index]).controls["vaccinationReceivedAt"].patchValue(null);
      }


// for enabling update button in doctor
      (this.mode == "view" || this.mode == "update") ? this.doctorService.BirthAndImmunizationValueChanged(true) : null;
  }

  getPreviousImmunizationServicesHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousImmunizationServicesData(benRegID)
      .subscribe(res => {
        if (res != null && res.data != null) {
          if (res.data.length > 0) {
            this.viewPreviousDetails(res.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.historyData.ancHistory.previousHistoryDetails.pastHistoryalert);
          }
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.errorFetchingHistory, 'error');
        }
      }, err => {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.errorFetchingHistory, 'error');
      })
  }

  viewPreviousDetails(data) {
    this.dialog.open(PreviousImmunizationServiceDetailsComponent, {
      data: {
        dataList: data,
        title: this.currentLanguageSet.previousImmunizationServicesDetails,
      },
    });
  }

}
