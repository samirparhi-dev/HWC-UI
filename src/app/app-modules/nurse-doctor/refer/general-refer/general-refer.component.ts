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
import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MasterdataService, DoctorService, NurseService } from '../../shared/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { DatePipe } from '@angular/common'
import { IdrsscoreService } from '../../shared/services/idrsscore.service';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ConfirmationService } from 'app/app-modules/core/services';
import { PreviousDetailsComponent } from 'app/app-modules/core/components/previous-details/previous-details.component';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { NcdScreeningService } from '../../shared/services/ncd-screening.service';
import { Subscription } from 'rxjs/Subscription';
//import {DatePipe} from '@angular/common';
@Component({
  selector: 'app-general-refer',
  templateUrl: './general-refer.component.html',
  styleUrls: ['./general-refer.component.css'],
  providers: [DatePipe]
})
export class GeneralReferComponent implements OnInit, DoCheck {
  @Input('referForm')
  referForm: FormGroup;

  @Input('referMode')
  referMode: String;

  revisitDate: any;
  tomorrow: any;
  maxSchedulerDate: any;
  today: any;
  higherHealthcareCenter: any;
  additionalServices: any;
  beneficiaryRegID: any;
  visitID: any;
  visitCategory: any;
  date: any;
  previousServiceList: any;
  currentLanguageSet: any;
  referralReason: any;

  selectValue: any;
  selectValueService: any;
  showMsg: any = 0;
  healthCareReferred: boolean = false;
  referralReferred: boolean = false;
  instituteFlag: boolean = false;
  referralSuggested: any = 0;
  referredVisitcode: any;
  designation: string;
  fpReferral = [];
  // fpReferral = ["Injection MPA (Antara) 1st Dose", "Injectable MPA (Antara) Contraceptives", "IUCD Insertion, IUCD Removal", "Expulsion of IUCD, Complications of IUCD", "Complication of Injection MPA (Antara) Contraceptive", "Tubectomy (Female Sterilization)", "Vasectomy (Male Sterilization)", "Safe Abortion Services", "Other"];
  enableOthersReferralTextField: boolean = false;
  enableOtherHigherInstitute: boolean = false;
  enableCBACForm: boolean = false;

  constructor(
    //   private datepipe: DatePipe,
    private fb: FormBuilder,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    public datepipe: DatePipe,
    private masterdataService: MasterdataService,
    private idrsScoreService: IdrsscoreService,
    private nurseService: NurseService,
    private dialog: MdDialog,
    private confirmationService: ConfirmationService,
    private ncdScreeningService: NcdScreeningService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.visitCategory = localStorage.getItem('visitCategory');
    if (localStorage.getItem("referredVisitCode")) {
      this.referredVisitcode = localStorage.getItem("referredVisitCode");
    }
    else {
      this.referredVisitcode = "undefined";
    }
    this.getDoctorMasterData();
    this.idrsScoreService.clearSuspectedArrayFlag();
    this.idrsScoreService.clearReferralSuggested();
    
    this.idrsScoreService.IDRSSuspectedFlag$.subscribe(response => {
      this.showMsg = response;
      if (this.showMsg > 0)
        sessionStorage.setItem('suspectFlag', "true");
      else
        sessionStorage.setItem('suspectFlag', "false");
    });
    this.idrsScoreService.referralSuggestedFlag$.subscribe(response => {
      this.showMsg = response;
      if (this.showMsg > 0)
        sessionStorage.setItem('suspectFlag', "true");
      else
        sessionStorage.setItem('suspectFlag', "false");
    });
    this.today = new Date();
    let d = new Date();
    let checkdate = new Date();
    d.setDate(d.getDate() + 1)
    checkdate.setMonth(this.today.getMonth() + 3)
    this.maxSchedulerDate = checkdate;
    this.tomorrow = d;

    //designation to show the TMC suggestion.  
    this.designation = localStorage.getItem("designation");
   
  }
  // getTomorrow() {
  //   let d = new Date();
  //   d.setDate(d.getDate() + 1);
  //   return this.datepipe.transform(d, 'yyyy-MM-dd');
  // }

  ngOnChanges() {

  }

  ngOnDestroy() {
    if (this.doctorMasterDataSubscription)
      this.doctorMasterDataSubscription.unsubscribe();
    if (this.referSubscription)
      this.referSubscription.unsubscribe();
  }

  doctorMasterDataSubscription: any;
  getDoctorMasterData() {
    this.doctorMasterDataSubscription = this.masterdataService.doctorMasterData$.subscribe(masterData => {
      if (masterData) {
        console.log("masterData=", masterData);
        this.higherHealthcareCenter = masterData.higherHealthCare;
        if (this.higherHealthcareCenter.length == 0) {
          this.instituteFlag = false;
          sessionStorage.setItem('instFlag', "false");
        }
        else {
          this.instituteFlag = true;
          sessionStorage.setItem('instFlag', "true");
        }
        this.additionalServices = masterData.additionalServices;
        //to add correct name by checking it from masterdata
        console.log(masterData.revisitDate);
        console.log("hi");
        this.revisitDate = masterData.revisitDate;

        this.fpReferral = masterData.referralReasonList;

        if(this.visitCategory.toLowerCase() == 'ncd screening'){
          this.ncdScreeningService.enablingIdrs$.subscribe((response) => {
            if (response === true) {
              this.enableCBACForm = false;
            } else {
              this.enableCBACForm = true;
            }
          });

          if(this.enableCBACForm == false){
            this.fpReferral = masterData.referralReasonList;
            if(masterData.referralReasonList !== undefined && masterData.referralReasonList !== null) {
            this.fpReferral = masterData.referralReasonList.filter(item => {
              if(item.name.toLowerCase() == "screening positive for diabetes"){
                this.fpReferral.push(item);
                return item.name;
              }
              if(item.name.toLowerCase() == "screening positive for epilepsy"){
                this.fpReferral.push(item);
                return item.name;
              }
              if(item.name.toLowerCase() == "screening positive for asthma"){
                this.fpReferral.push(item);
                return item.name;
              }
              if(item.name.toLowerCase() == "screening positive for vision screening"){
                this.fpReferral.push(item);
                return item.name;
              }
              if(item.name.toLowerCase() == "screening positive for tuberculosis screening"){
                this.fpReferral.push(item);
                return item.name;
              }
              if(item.name.toLowerCase() == "screening positive for malaria screening"){
                this.fpReferral.push(item);
                return item.name;
              }
              if(item.name.toLowerCase() == "screening positive for hypertension"){
                this.fpReferral.push(item);
                return item.name;
              }
            });
          }
            } else{
              console.log("Unable to fetch the master data for referral reason list");
            }
  
            if(this.enableCBACForm == true) {
              this.fpReferral = masterData.referralReasonList;
              if (localStorage.getItem("beneficiaryGender") === "Male") {
                if(masterData.referralReasonList !== undefined && masterData.referralReasonList !== null) {
                this.fpReferral = masterData.referralReasonList.filter(item => {
                  if(item.name.toLowerCase() == "screening positive for hypertension"){
                    this.fpReferral.push(item);
                    return item.name;
                  }
                  if(item.name.toLowerCase() == "screening positive for diabetes"){
                    this.fpReferral.push(item);
                    return item.name;
                  }
                  if(item.name.toLowerCase() == "screening positive for oral cancer"){
                    this.fpReferral.push(item);
                    return item.name;
                  }
                });
              }
              } else{
                if(masterData.referralReasonList !== undefined && masterData.referralReasonList !== null) {
                this.fpReferral = masterData.referralReasonList.filter(item => {
                  if(item.name.toLowerCase() == "screening positive for hypertension"){
                    this.fpReferral.push(item);
                    return item.name;
                  }
                  if(item.name.toLowerCase() == "screening positive for diabetes"){
                    this.fpReferral.push(item);
                    return item.name;
                  }
                  if(item.name.toLowerCase() == "screening positive for oral cancer"){
                    this.fpReferral.push(item);
                    return item.name;
                  }
                  if(item.name.toLowerCase() == "screening positive for cervical cancer"){
                    this.fpReferral.push(item);
                    return item.name;
                  }
                  if(item.name.toLowerCase() == "screening positive for breast cancer"){
                    this.fpReferral.push(item);
                    return item.name;
                  }
                });
              }
                console.log("Unable to fetch the master data for referral reason list");
              }
            }
          }

        if (this.referMode == 'view') {
          this.beneficiaryRegID = localStorage.getItem('beneficiaryRegID');
          this.visitID = localStorage.getItem('visitID');
          this.visitCategory = localStorage.getItem('visitCategory');
          this.getReferDetails();
        }
      }
    });
  }

  referSubscription: Subscription;
  getReferDetails() {
    this.referSubscription = this.doctorService.populateCaserecordResponse$
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data && res.data.Refer) {
          let referAndRevistData = res.data.Refer;
          let referedToInstitute = this.higherHealthcareCenter.filter(item => {
            return item.institutionID == referAndRevistData.referredToInstituteID;
          });
          if (referedToInstitute.length > 0) {
              referAndRevistData.referredToInstituteName = referedToInstitute[0];
            }
          this.higherhealthcarecenter(referAndRevistData.referredToInstituteName);  
          if (referAndRevistData.referralReasonList != undefined && referAndRevistData.referralReasonList != null) {
            this.referForm.patchValue({ 'referralReasonList': referAndRevistData.referralReasonList })
            this.checkForOthersOption(this.referForm.controls.referralReasonList.value)
            this.referForm.controls["otherReferralReason"].setValue(referAndRevistData.otherReferralReason);
            }
          let referRevisitDetails = Object.assign(
            {},
            referAndRevistData,
            {
              revisitDate: new Date(
                referAndRevistData.revisitDate
              ),
            },
          );
          // this.patchReferDetails(res.data.Refer);
          this.referForm.patchValue(referRevisitDetails);
        }
      })
  }

  // patchReferDetails(referDetails) {
  //   // this.date=new Date();

  //   let dateOfRevisit = referDetails.revisitDate
  //   // this.revisitDate = new Date(dateOfRevisit);
  //   this.referForm.patchValue({ 'revisitDate': new Date(dateOfRevisit) })

  //   if (referDetails.referralReason != undefined && referDetails.referralReason != null) {

  //     this.referralReason = referDetails.referralReason;

  //   }
  //   // this.revisitDate = this.datepipe.transform(this.revisitDate, 'yyyy-MM-dd')
  //   // let temp = [];
  //   // if (referDetails.refrredToAdditionalServiceList) {
  //   //   this.previousServiceList = referDetails.refrredToAdditionalServiceList;
  //   //   referDetails.refrredToAdditionalServiceList.map(item => {
  //   //     let arr = this.additionalServices.filter(element => {
  //   //       return element.serviceName == item.serviceName;
  //   //     });
  //   //     if (arr.length > 0)
  //   //       temp.push(arr[0]);
  //   //   });
  //   // }
  //   // console.log('line96' + temp.slice())
  //   // referDetails.refrredToAdditionalServiceList = temp.slice();
  //   console.log('referDetails', referDetails);
  //   let referedToInstitute = this.higherHealthcareCenter.filter(item => {
  //     return item.institutionID == referDetails.referredToInstituteID;
  //   });
  //   if (referedToInstitute.length > 0) {
  //     referDetails.referredToInstituteName = referedToInstitute[0];
  //   }

  //   this.higherhealthcarecenter(referDetails.referredToInstituteName);  

  //   console.log("referredDet=" + referDetails);
  //   console.log("revisitDate" + this.revisitDate);
  //   referDetails.revisitDate = this.revisitDate;
  //   if (referDetails.referralReason != undefined && referDetails.referralReason != null) {
  //   referDetails.referralReason = this.referralReason;
  //   this.referForm.patchValue({ 'referralReason': referDetails.referralReason })
  //   }

  //   if (referDetails.referralReasonList != undefined && referDetails.referralReasonList != null) {
  //     this.referForm.patchValue({ 'referralReasonList': referDetails.referralReasonList })
  //     this.checkForOthersOption(this.referForm.controls.referralReasonList.value)
  //     this.referForm.controls["otherReferralReason"].setValue(referDetails.otherReferralReason);
  //     }
  //   this.referForm.patchValue(referDetails);
  //   //check whether health care referred or not 
  //   // if(referDetails.referredToInstituteName != null){
  //   //   this.healthCareReferred = true;
  //   // }
  //   // if(referDetails.referralReason !=null)
  //   // {
  //   //   this.referralReferred = true;
  //   // }
  // }
  get RevisitDate() {
    return this.referForm.get('revisitDate');
  }
  get ReferralReason() {
    return this.referForm.get('referralReason');
  }
  checkdate(revisitDate) {
    this.today = new Date();
    let d = new Date();
    let checkdate = new Date();
    d.setDate(d.getDate() + 1)
    checkdate.setMonth(this.today.getMonth() + 3)
    this.maxSchedulerDate = checkdate;
    this.tomorrow = d;

  }

  canDisable(service) {

    if (this.previousServiceList) {
      let temp = this.previousServiceList.filter(item => {
        return item.serviceID == service.serviceID;
      })

      if (temp.length > 0)
        service.disabled = true;
      else
        service.disabled = false;

      return temp.length > 0;
    }
  }

  public additionalservices(selected: any): void {
    if (selected != null && selected.length >= 0) {
      this.selectValueService = selected.length;
      console.log(this.selectValue);
    }


    // should display the selected option.
  }

  public higherhealthcarecenter(selected: any): void {

    if (selected != null && selected.institutionName) {
      this.selectValue = 1;
      this.healthCareReferred = true;
    } // should display the selected option.

    if(selected != null && selected.institutionName !== undefined && selected.institutionName !== null && selected.institutionName.toLowerCase() === "other") {
      this.enableOtherHigherInstitute = true;
    }
    else if(selected == null || selected == "select none")
    {
      this.selectValue = 0;
      this.enableOtherHigherInstitute = false;
      this.referForm.controls['otherReferredToInstituteName'].setValue(null);
      this.healthCareReferred = false;
    }
    else
    {
      this.enableOtherHigherInstitute = false;
      this.referForm.controls['otherReferredToInstituteName'].setValue(null);
    }

    console.log(this.selectValue);
  }


  setInstituteNameValue() {
    this.referForm.controls['referredToInstituteID'].setValue(null);
    this.referForm.controls['referredToInstituteName'].setValue(null);
  }


  getPreviousReferralHistory() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousReferredHistory(benRegID, this.visitCategory)
      .subscribe(res => {
        if (res.statusCode == 200 && res.data != null) {
          if (res.data.data.length > 0) {
            this.viewPreviousData(res.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.Referdetails.previousReferralhistorynotAvailable);
          }
        } else {
          this.confirmationService.alert(this.currentLanguageSet.Referdetails.errorInFetchingPreviousHistory, 'error');
        }
      }, err => {
        this.confirmationService.alert(this.currentLanguageSet.Referdetails.errorInFetchingPreviousHistory, 'error');
      })
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title: this.currentLanguageSet.previousReferralHistoryDetails }
    });
  }

  loadMMUReferDeatils() {
    let reqObj = {
      "benRegID": localStorage.getItem('beneficiaryRegID'),
      "visitCode": localStorage.getItem("referredVisitCode"),
      "benVisitID": localStorage.getItem("referredVisitID"),
      "fetchMMUDataFor": "Referral"
    }
    if (localStorage.getItem("referredVisitCode") !== "undefined" && localStorage.getItem("referredVisitID") !== "undefined") {
      this.doctorService.getMMUData(reqObj)
        .subscribe(res => {
          if (res.statusCode == 200 && res.data != null) {
            if (res.data.data.refrredToAdditionalServiceList.length > 0) {
              this.viewMMUReferData(res.data);
            } else {
              this.confirmationService.alert(this.currentLanguageSet.Referdetails.mMUReferraldetailsnotAvailable);
            }
          } else {
            this.confirmationService.alert(this.currentLanguageSet.Referdetails.errorInFetchingMMUReferraldetails, 'error');
          }
        }, err => {
          this.confirmationService.alert(this.currentLanguageSet.Referdetails.errorInFetchingMMUReferraldetails, 'error');
        })
    }
  }

  viewMMUReferData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title: this.currentLanguageSet.Referdetails.mMUReferralDetails }
    });
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
 
  checkForOthersOption(selectedReferral) {
    if(selectedReferral.length > 0) {
      if(selectedReferral.includes("Other")) {
        this.enableOthersReferralTextField = true;
      }
      else {
        this.enableOthersReferralTextField = false;
        this.referForm.controls["otherReferralReason"].setValue(null);
      }

     

  }
  else
  {
    this.enableOthersReferralTextField = false;
    this.referForm.controls["otherReferralReason"].setValue(null);
   
  }
}


}
