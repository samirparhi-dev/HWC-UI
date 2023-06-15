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
import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { MasterdataService, DoctorService } from "../../../../shared/services";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-ncd-care-diagnosis",
  templateUrl: "./ncd-care-diagnosis.component.html",
  styleUrls: ["./ncd-care-diagnosis.component.css"],
})
export class NcdCareDiagnosisComponent implements OnInit, OnDestroy {
  @Input("generalDiagnosisForm")
  generalDiagnosisForm: FormGroup;

  @Input("caseRecordMode")
  caseRecordMode: string;

  ncdCareConditions = [];
  ncdCareTypes: any;
  current_language_set: any;
  designation: any;
  specialist: boolean;
  isNcdScreeningConditionOther: boolean = false;
  temp: any = [];
  constructor(
    private masterdataService: MasterdataService,
    public httpServiceService: HttpServiceService,
    private doctorService: DoctorService
  ) {}

  ngOnInit() {
    this.getDoctorMasterData();
    this.assignSelectedLanguage();
    // this.httpServiceService.currentLangugae$.subscribe(response =>this.current_language_set = response);
    this.designation = localStorage.getItem("designation");
    if (this.designation == "TC Specialist") {
      this.generalDiagnosisForm.controls["specialistDiagnosis"].enable();
      this.specialist = true;
    } else {
      this.generalDiagnosisForm.controls["specialistDiagnosis"].disable();
      this.specialist = false;
    }
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
  }

  getDoctorMasterData() {
    this.masterdataService.doctorMasterData$.subscribe((masterData) => {
      if (masterData) {
        let ncdCareConditionsMasterData = [];
        if (masterData.ncdCareConditions)
        // this.ncdCareConditions = masterData.ncdCareConditions.slice();
          ncdCareConditionsMasterData = masterData.ncdCareConditions.slice();
          if (localStorage.getItem("beneficiaryGender") === "Male") {
            if(masterData.ncdCareConditions !== undefined && masterData.ncdCareConditions !== null) {
              masterData.ncdCareConditions.filter(item => {
                if(item.screeningCondition.toLowerCase() != "breast cancer" && item.screeningCondition.toLowerCase() != "cervical cancer")
                  this.ncdCareConditions.push(item);
                });
            } else{
              console.log("Unable to fetch master data for ncd care conditions");
            }
        } else{
          this.ncdCareConditions = ncdCareConditionsMasterData;
        }
        if (masterData.ncdCareTypes)
          this.ncdCareTypes = masterData.ncdCareTypes.slice();

        if (this.caseRecordMode == "view") {
          this.getDiagnosisDetails();
        }
      }
    });
  }

  diagnosisSubscription: Subscription;
  getDiagnosisDetails() {
    this.diagnosisSubscription =
      this.doctorService.populateCaserecordResponse$.subscribe((res) => {
        if (res && res.statusCode == 200 && res.data && res.data.diagnosis) {
          this.patchDiagnosisDetails(res.data.diagnosis);
        }
      });
  }

  patchDiagnosisDetails(diagnosis) {
    console.log("diagnosis", diagnosis);

    // let ncdScreeningCondition = this.ncdCareConditions.filter(item => {
    //   console.log('item',item);
    //   return item.screeningCondition == diagnosis.ncdScreeningCondition
    // });
    // if (ncdScreeningCondition.length > 0)
    //   diagnosis.ncdScreeningCondition = ncdScreeningCondition[0];
    if (
      diagnosis != undefined &&
      diagnosis.ncdScreeningConditionArray != undefined &&
      diagnosis.ncdScreeningConditionArray != null
    ) {
      this.temp = diagnosis.ncdScreeningConditionArray;
    }
    if (
      diagnosis != undefined &&
      diagnosis.ncdScreeningConditionOther != undefined &&
      diagnosis.ncdScreeningConditionOther != null
    ) {
      this.isNcdScreeningConditionOther = true;
    }
    let ncdCareType = this.ncdCareTypes.filter((item) => {
      return item.ncdCareType == diagnosis.ncdCareType;
    });
    if (ncdCareType.length > 0) diagnosis.ncdCareType = ncdCareType[0];

    this.generalDiagnosisForm.patchValue(diagnosis);
  }
  changeNcdScreeningCondition(value, event) {
    let flag = false;
    if (value != undefined && value != null && value.length > 0) {
      value.forEach((element) => {
        if (element == "Other") flag = true;
      });
    }
    if (flag) this.isNcdScreeningConditionOther = true;
    else {
      this.generalDiagnosisForm.controls[
        "ncdScreeningConditionOther"
      ].patchValue(null);
      this.isNcdScreeningConditionOther = false;
    }
    // console.log(value);
    // if(event.checked)
    // {
    //   this.addToTemp(value);
    //   if(value == "Other")
    //   {
    //     this.isNcdScreeningConditionOther=true;
    //   }
    // }
    // else{
    //   this.removeTemp(value);
    //   if(value == "Other")
    //   {
    //     this.generalDiagnosisForm.controls['ncdScreeningConditionOther'].patchValue(null);
    //     this.isNcdScreeningConditionOther=false;
    //   }
    // }
    this.temp = value;
    this.generalDiagnosisForm.controls["ncdScreeningConditionArray"].patchValue(
      value
    );
  }
  ngOnDestroy() {
    if (this.diagnosisSubscription) {
      this.diagnosisSubscription.unsubscribe();
    }
  }
}
