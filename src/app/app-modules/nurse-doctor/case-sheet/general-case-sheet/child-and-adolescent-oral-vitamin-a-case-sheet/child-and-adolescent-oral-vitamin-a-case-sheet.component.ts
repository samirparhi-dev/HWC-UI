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
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { BeneficiaryDetailsService } from 'app/app-modules/core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';

@Component({
  selector: 'app-child-and-adolescent-oral-vitamin-a-case-sheet',
  templateUrl: './child-and-adolescent-oral-vitamin-a-case-sheet.component.html',
  styleUrls: ['./child-and-adolescent-oral-vitamin-a-case-sheet.component.css']
})
export class ChildAndAdolescentOralVitaminACaseSheetComponent implements OnInit {
  @Input("data")
  caseSheetData: any;

  @Input('printPagePreviewSelect')
  printPagePreviewSelect: any;

  @Input("previous")
  previous: any;

  @Input('visitCategory')
  visitCategory : string;
  
  currentLanguageSet: any;
  oralVitaminACasesheet: any;
  beneficiaryAge: number = 0;
  beneficiary: any;
  enableOralVitaminAData: boolean = false;

  constructor(private httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService
  ) { }
  
  ngOnInit() {
    this.visitCategory = localStorage.getItem("caseSheetVisitCategory");
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  getAgeValueNew(age) {
    if (!age) return 0;
    let arr = (age !== undefined && age !== null) ? age.trim().split(' ') : age;
    if (arr[1]) {
      let ageUnit = arr[1];
      if (ageUnit.toLowerCase() == "years") {
        return parseInt(arr[0]);
      }
    }
    return 0;
  }
  
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  ngOnChanges() {
    if(this.caseSheetData != undefined && this.caseSheetData != null){
      if(
        this.caseSheetData &&
        this.caseSheetData.nurseData &&
        this.caseSheetData.nurseData.immunizationServices &&
        this.caseSheetData.nurseData.immunizationServices.oralVitaminAProphylaxis
      ){
        this.oralVitaminACasesheet = this.caseSheetData.nurseData.immunizationServices.oralVitaminAProphylaxis;
        
        if(this.oralVitaminACasesheet.oralVitaminAStatus !== undefined && 
           this.oralVitaminACasesheet.oralVitaminAStatus !== null && 
           this.oralVitaminACasesheet.oralVitaminAStatus === "Given"
        ){
          this.enableOralVitaminAData = true;
        } else{
          this.enableOralVitaminAData = false;
        }
      }
      if(
        this.caseSheetData &&
        this.caseSheetData.BeneficiaryData &&
        this.caseSheetData.BeneficiaryData.age
      ){
        this.beneficiary = this.caseSheetData.BeneficiaryData;
        let calculateAgeInYears = this.beneficiary.age.split('-')[0].trim();
        let calculateAgeInMonths = this.beneficiary.age.split('-')[1] ? this.beneficiary.age.split('-')[1].trim() : "";
        let age = this.getAgeValueNew(calculateAgeInYears);
        if (age !== 0 && calculateAgeInMonths !== "0 months") {
          this.beneficiaryAge = age + 1;
        }
        else
        {
             this.beneficiaryAge = age;
        }

      }

    }
  }
}
