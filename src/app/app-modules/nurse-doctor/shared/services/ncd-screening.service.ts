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
import { Injectable } from "@angular/core";
import { nextTick } from "process";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class NcdScreeningService {
  currentLanguageSet: any;
  suspectStatus: boolean = false;
  breastStatus: boolean = false;
  cervicalStatus: boolean = false;
  diabetesStatus: boolean = false;
  hypertensionStatus: boolean = false;
  enablingIdrs: boolean = false;
  enablingCbac: boolean = false;
  historyFormControlAdded: boolean = false;
  valueChanged: boolean = false;
  /// Change this variable according to the nurse response of cbac screening
  fetchCBACResponseFromNurse: boolean = false;
  enableDiseaseConfirm: string = "";

  isDiabetesConfirmed: boolean = null;
  isHypertensionConfirmed: boolean = null;
  isOralConfirmed: boolean = null;
  isCervicalConfirmed: boolean = null;
  isBreastConfirmed: boolean = null;
  diabetesScreeningValidationOnSave: boolean = false;
  hypertensionScreeningValidationOnSave: boolean = false;
  breastScreeningValidationOnSave: boolean = false;
  cervicalScreeningValidationOnSave: boolean = false;
  oralScreeningValidationOnSave: boolean = false;

  diabetesScreeningStatus = new BehaviorSubject<boolean>(this.diabetesStatus);
  diabetesStatus$ = this.diabetesScreeningStatus.asObservable();

  hypertensionScreeningStatus = new BehaviorSubject<boolean>(
    this.hypertensionStatus
  );
  hypertensionStatus$ = this.hypertensionScreeningStatus.asObservable();

  oralScreeningStatus = new BehaviorSubject<boolean>(this.suspectStatus);
  oralStatus$ = this.oralScreeningStatus.asObservable();

  breastScreeningStatus = new BehaviorSubject<boolean>(this.breastStatus);
  breastStatus$ = this.breastScreeningStatus.asObservable();

  cervicalScreeningStatus = new BehaviorSubject<boolean>(this.cervicalStatus);
  cervicalStatus$ = this.cervicalScreeningStatus.asObservable();

  enableIdrsForm = new BehaviorSubject<boolean>(this.enablingIdrs);
  enablingIdrs$ = this.enableIdrsForm.asObservable();

  valueChangedForNCD = new BehaviorSubject<boolean>(this.valueChanged);
  valueChangedForNCD$ = this.valueChangedForNCD.asObservable();

  enableDiseaseConfirmForm = new BehaviorSubject<string>(
    this.enableDiseaseConfirm
  );
  enableDiseaseConfirmForm$ = this.enableDiseaseConfirmForm.asObservable();

  confirmedDiseasesLists = [];
  confirmedDiseasesListCheck = new BehaviorSubject<any[]>(
    this.confirmedDiseasesLists
  );
  confirmedDiseasesListCheck$ = this.confirmedDiseasesListCheck.asObservable();

  checkIfCbacForm = new BehaviorSubject<boolean>(this.enablingCbac);
  enablingScreeningDiseases$ = this.checkIfCbacForm.asObservable();

  enableHistoryFormafterFormInit = new BehaviorSubject<boolean>(
    this.historyFormControlAdded
  );
  enableHistoryFormafterFormInit$ =
    this.enableHistoryFormafterFormInit.asObservable();

    screeningData: boolean = false;
    fetchScreeningData = new BehaviorSubject<boolean>(this.screeningData);
    fetchScreeningDataCheck$ = this.fetchScreeningData.asObservable();

  constructor() {}
  diabetesSuspectStatus(diabetesStatus) {
    this.diabetesScreeningStatus.next(diabetesStatus);
  }
  hypertensionSuspectStatus(hypertensionStatus) {
    this.hypertensionScreeningStatus.next(hypertensionStatus);
  }
  oralSuspectStatus(suspectStatus) {
    this.oralScreeningStatus.next(suspectStatus);
  }
  breastSuspectStatus(breastStatus) {
    this.breastScreeningStatus.next(breastStatus);
  }
  cervicalSuspectStatus(cervicalStatus) {
    this.cervicalScreeningStatus.next(cervicalStatus);
  }

  /* Enabling History Screen*/
  enableHistoryScreenOnIdrs(enablingIdrs) {
    this.enableIdrsForm.next(enablingIdrs);
  }

  /* Enabling Disease confirmed Screen*/
  enableDiseaseConfirmationScreen(enablingDisease) {
    this.enableDiseaseConfirmForm.next(enablingDisease);
  }

  clearDiseaseConfirmationScreenFlag() {
    this.enableDiseaseConfirm = null;
    this.enableDiseaseConfirmForm.next(null);
  }

  /* Setting confirmed diseases*/
  setConfirmedDiseasesForScreening(confirmedDiseasesList) {
    this.confirmedDiseasesListCheck.next(confirmedDiseasesList);
  }

  clearConfirmedDiseasesForScreening() {
    this.confirmedDiseasesLists = [];
    this.confirmedDiseasesListCheck.next(null);
  }

  /* Hiding Vitals form*/
  disableViatlsFormOnCbac(enablingCbac) {
    this.checkIfCbacForm.next(enablingCbac);
  }

  /* Enable history form after adding control to the medical form */
  enableHistoryFormAfterInitialization(historyFormControlAdded) {
    this.enableHistoryFormafterFormInit.next(historyFormControlAdded);
  }

  checkIfCbac(cbacIdrsValue) {
    this.checkIfCbacForm.next(cbacIdrsValue);
  }

  screeningValueChanged(valueChanged) {
    this.valueChangedForNCD.next(valueChanged)
  }


  setScreeningDataFetch(screeningData) {
    this.fetchScreeningData.next(screeningData);
  }

}
