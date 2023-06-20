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
import { Component, DoCheck, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { BeneficiaryDetailsService } from "app/app-modules/core/services/beneficiary-details.service";
import { ConfirmationService } from "app/app-modules/core/services/confirmation.service";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { Subscription } from "rxjs/Subscription";
import { DoctorService, MasterdataService } from "../../shared/services";
import { GeneralUtils } from "../../shared/utility";

@Component({
  selector: "app-neonatal-immunization-service",
  templateUrl: "./neonatal-immunization-service.component.html",
  styleUrls: ["./neonatal-immunization-service.component.css"],
})
export class NeonatalImmunizationServiceComponent implements OnInit, DoCheck {
  @Input("neonatalImmunizationServicesForm")
  immunizationServicesForm: FormGroup;

  @Input("mode")
  mode: any;

  @Input("visitCategory")
  visitCategory: any;

  today: any;
  currentLanguageSet: any;
  typeOfImmunizationServiceList = [];
  currentImmunizationServiceList = [];
  vaccineList: any[];
  enableVaccineDetails: boolean = false;
  vaccineStatus = ["Given", "Not Given"];
  nurseMasterDataSubscription: Subscription;
  masterData: any;
  missingVaccineList = [];
  utils = new GeneralUtils(this.fb);
  enableFieldsToCaptureMissedVaccineDetails: boolean = false;
  currentVaccineTaken: any = [];
  capturedImmunizationService: any;
  missingVaccine = [];
  patchVaccineDetailsOnView: boolean = false;
  currentImmunizationValue: any = [];
  beneficiaryDetailsSubscription: Subscription;
  beneficiaryAge: any;
  todayDate = new Date();
  filteredImmunizationServiceList = [];

  constructor(
    private httpServiceService: HttpServiceService,
    private masterdataService: MasterdataService,
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    private beneficiaryDetailsService: BeneficiaryDetailsService
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    this.today = new Date();
    this.getNurseMasterData();
    this.getBeneficiaryDetails();
    this.todayDate.setDate(this.today.getDate());
    this.immunizationServicesForm.patchValue({ dateOfVisit: this.todayDate });
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  ngOnChanges() {
    if (this.mode == "view") {
      this.getNurseFetchImmunizationServiceDetailsForChildhood();
      this.getNurseFetchImmunizationServiceDetails();
    }
    if (this.mode == "update") {
      this.updateImmunizationServiceFromDoctor(this.immunizationServicesForm);
    }
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  getNurseMasterData() {
    this.nurseMasterDataSubscription =
      this.masterdataService.nurseMasterData$.subscribe((masterData) => {
        if (
          masterData !== undefined &&
          masterData !== null &&
          masterData.m_currentimmunizationservice &&
          masterData.m_immunizationservicestype
        ) {
          this.currentImmunizationServiceList =
            masterData.m_currentimmunizationservice;
          this.typeOfImmunizationServiceList =
            masterData.m_immunizationservicestype;
          this.checkCurrentImmunizationService(
            masterData.m_currentimmunizationservice
          );
          if (this.mode == "view") {
            this.getNurseFetchImmunizationServiceDetailsForChildhood();
            this.getNurseFetchImmunizationServiceDetails();
          }
        }
      });
  }
  setImmunizationServiceType(immunizationServicesTypeID) {
    this.resetFormValuesOnChangeofImmunizationType();
    this.typeOfImmunizationServiceList.filter((immunizationServiceType) => {
      if (immunizationServiceType.id === immunizationServicesTypeID)
        this.immunizationServicesForm.patchValue({
          immunizationServicesType: immunizationServiceType.name,
        });
    });
    this.filterCurrentImmunizationServiceType(immunizationServicesTypeID,false);
  }
  filterCurrentImmunizationServiceType(immunizationServicesTypeID, isFecthForRegularVaccine) {
    this.filteredImmunizationServiceList = [];
    if (immunizationServicesTypeID === 2) {
      this.currentImmunizationServiceList.filter((missingVaccine) => {
        if (missingVaccine.id === 6 || missingVaccine.id === 11) {
          this.filteredImmunizationServiceList.push(missingVaccine);
        }
      });
    } else {
      let index = this.currentImmunizationServiceList.findIndex(
        (filterMissingVaccine) =>
          filterMissingVaccine.id === 6 || filterMissingVaccine.id === 11
      );
      this.filteredImmunizationServiceList.push(
        ...this.currentImmunizationServiceList
      );
      this.filteredImmunizationServiceList.splice(index, 1);
    }
    if (this.filteredImmunizationServiceList != undefined && 
        this.filteredImmunizationServiceList.length == 0 &&
        isFecthForRegularVaccine == false) {
      this.confirmationService.alert(
        "No regular vaccination available for this age group"
      );
      console.log("regular vaccination",this.filteredImmunizationServiceList.length);
    }
  }
  setCurrentImmunizationService(currentImmunizationServiceID) {
    this.currentImmunizationServiceList.filter((currentImmunizationType) => {
      if (currentImmunizationType.id === currentImmunizationServiceID) {
        this.immunizationServicesForm.patchValue({
          currentImmunizationService: currentImmunizationType.name,
        });
      }
    });
  }
  resetFormValuesOnChangeofImmunizationType() {
    this.immunizationServicesForm.controls[
      "currentImmunizationServiceID"
    ].reset();
    this.immunizationServicesForm.controls[
      "currentImmunizationService"
    ].reset();
    this.immunizationServicesForm.controls["vaccines"].reset();
    this.vaccineList = [];
    this.enableVaccineDetails = false;
  }
  checkCurrentImmunizationService(temp) {
    this.currentImmunizationServiceList = [];
    temp.forEach((item) => {
      if (
        this.getAgeValue(item.name) <= this.getAgeValue(this.beneficiaryAge)
      ) {
        this.currentImmunizationServiceList.push(item);
      }
    });
  }

  /**List of vaccines based on selected immunization service */

  getVaccineListOnSelectedService(currentImmunizationServiceID, currentImmunizationService) {
    this.enableFieldsToCaptureMissedVaccineDetails = false;
    this.missingVaccineList = [];
    let vaccines = <FormArray>(
      this.immunizationServicesForm.controls["vaccines"]
    );
    if (vaccines.value.length > 0) {
      vaccines.controls.splice(0, vaccines.controls.length);
      vaccines.value.splice(0, vaccines.value.length);
    }

    this.masterdataService.getVaccineList(currentImmunizationServiceID).subscribe(
      (vaccines) => {
        if (
          vaccines !== undefined &&
          vaccines.data !== undefined &&
          vaccines.data.vaccineList !== undefined
        ) {
          this.enableVaccineDetails = true;
          this.vaccineList = vaccines.data.vaccineList;
          for (let i = 0; i < this.vaccineList.length; i++) {
            // if (currentImmunizationService.toLowerCase() !== "missing vaccine(s)") {
              let vaccines = <FormArray>(
                this.immunizationServicesForm.controls["vaccines"]
              );
              vaccines.push(this.utils.initVaccineListOnSelectedService());
            // } 
            // else {
            //   this.missingVaccineList.push(this.vaccineList[i].vaccine);
            //   this.missingVaccine.push(this.vaccineList[i]);
            // }
          }
          if (this.missingVaccineList.length > 0) {
            let vaccines = <FormArray>(
              this.immunizationServicesForm.controls["vaccines"]
            );
            vaccines.push(this.utils.initVaccineListOnSelectedService());
          }
          /* patchVaccineDetailsOnView - variable used to restrict the method call on change of immunization
          service dropdown on doctor */
          if (this.mode == "view" && this.patchVaccineDetailsOnView === true) {
            this.viewImmunizationServices();
          }
        }
      },
      (err) => {
        this.confirmationService.alert(err.errorMessage, "err");
      }
    );
    this.onValueChange();
  }

  onValueChange() {
    if (
      this.visitCategory.toLowerCase ===
      "childhood & adolescent healthcare services"
    ) {
      this.mode == "view" || this.mode == "update"
        ? this.doctorService.immunizationServiceChildhoodValueChanged(true)
        : null;
    }
  }

  viewImmunizationServices() {
    /*weeks vaccines */
    if (this.vaccineList.length > 0) {
      let vaccineControls = <FormArray>(
        this.immunizationServicesForm.controls["vaccines"]
      );
      this.currentVaccineTaken.forEach((selectedVaccine) => {
        this.vaccineList.forEach((listOfVaccine, index) => {
          if (
            listOfVaccine.vaccine.trim().toLowerCase() ===
            selectedVaccine.vaccineName.trim().toLowerCase()
          ) {
            vaccineControls.at(index).patchValue(selectedVaccine);
            if (
              selectedVaccine.vaccineName !== undefined &&
              selectedVaccine.vaccineName !== null
            ) {
              vaccineControls.at(index).patchValue({ status: "Given" });
            }
          }
        });
      });
    }
    /*Missing vaccines */
    // if (
    //   this.capturedImmunizationService.currentImmunizationService.toLowerCase() === "missing vaccine(s)" &&
    //   this.missingVaccine.length > 0
    // ) {
    //   let missingVaccineControls = <FormArray>(
    //     this.immunizationServicesForm.controls["vaccines"]);
    //   this.currentVaccineTaken.forEach((selectedVaccine) => {
    //     this.missingVaccine.forEach((listOfVaccine) => {
    //       if (
    //         listOfVaccine.vaccine.trim().toLowerCase() ===
    //         selectedVaccine.vaccineName.trim().toLowerCase()
    //       ) {
    //         if (
    //           selectedVaccine.vaccineName !== undefined &&
    //           selectedVaccine.vaccineName !== null
    //         ) {
    //           missingVaccineControls.at(0).patchValue({ status: selectedVaccine.vaccineName });
    //           this.setMissingVaccineName(selectedVaccine.vaccineName, 0);
    //         }
    //         missingVaccineControls.at(0).patchValue(selectedVaccine);
    //       }
    //     });
    //   });
    //   this.enableFieldsToCaptureMissedVaccineDetails = true;
    // }
    this.enableVaccineDetails = true;
    this.patchVaccineDetailsOnView = false;
    /* patch other fields */
    this.immunizationServicesForm.patchValue({
      currentImmunizationServiceID:
        this.capturedImmunizationService.currentImmunizationServiceID,
      immunizationServicesTypeID:
        this.capturedImmunizationService.immunizationServicesTypeID,
      currentImmunizationService:
        this.capturedImmunizationService.currentImmunizationService,
      immunizationServicesType:
        this.capturedImmunizationService.immunizationServicesType,
      dateOfVisit: new Date(this.capturedImmunizationService.dateOfVisit),
      processed: this.capturedImmunizationService.processed,
      deleted: this.capturedImmunizationService.deleted,
      beneficiaryRegID: this.capturedImmunizationService.beneficiaryRegID,
      providerServiceMapID:
        this.capturedImmunizationService.providerServiceMapID,
      createdBy: this.capturedImmunizationService.createdBy,
      vanID: this.capturedImmunizationService.vanID,
      parkingPlaceID: this.capturedImmunizationService.parkingPlaceID,
    });
    this.filterCurrentImmunizationServiceType( this.capturedImmunizationService.immunizationServicesTypeID,true);
  }
  setVaccineName(vaccineStatus, index) {
    if (vaccineStatus.toLowerCase() === "given") {
      (<FormArray>this.immunizationServicesForm.controls["vaccines"])
        .at(index)
        .patchValue({
          vaccineName: this.vaccineList[index].vaccine,
        });
      this.setDefaultVaccineDetailsForSelectedWeeks(index);
    } else {
      (<FormArray>(
        this.immunizationServicesForm.controls["vaccines"]["controls"]
      ))
        .at(index)
        ["controls"].vaccineName.reset();
      this.resetVaccineDetails(index);
    }
  }
  /* Set default doses, route and site of injection for selected vaccine on weeks */
  setDefaultVaccineDetailsForSelectedWeeks(index) {
    let vaccineArrayControls = (<FormArray>(
      this.immunizationServicesForm.controls["vaccines"]["controls"]
    )).at(index);
    if (this.vaccineList[index].dose.length === 1) {
      vaccineArrayControls.patchValue({
        vaccineDose: this.vaccineList[index].dose[0].dose,
      });
    }
    if (this.vaccineList[index].route.length === 1) {
      vaccineArrayControls.patchValue({
        route: this.vaccineList[index].route[0].route,
      });
    }
    if (this.vaccineList[index].siteOfInjection.length === 1) {
      vaccineArrayControls.patchValue({
        siteOfInjection:
          this.vaccineList[index].siteOfInjection[0].siteofinjection,
      });
    }
  }
  /* Selected Missing vaccine name */
  setMissingVaccineName(vaccinename, index) {
    this.resetVaccineDetails(index);
    (<FormArray>this.immunizationServicesForm.controls["vaccines"])
      .at(index)
      .patchValue({
        vaccineName: vaccinename,
      });
    this.fetchVaccineDetailsOnSelectedMissingVaccine(vaccinename, index);
    this.enableFieldsToCaptureMissedVaccineDetails = true;
  }
  /* Set default doses, route and site of injection for selected missing vaccine */
  fetchVaccineDetailsOnSelectedMissingVaccine(vaccinename, index) {
    let doses;
    let route;
    let siteOfInjection;
    if (
      vaccinename !== undefined &&
      vaccinename !== null &&
      this.missingVaccine !== undefined &&
      this.missingVaccine.length > 0
    ) {
      this.missingVaccine.forEach((vaccine) => {
        if (
          vaccine.vaccine.trim().toLowerCase() ===
          vaccinename.trim().toLowerCase()
        ) {
          doses = vaccine.dose;
          route = vaccine.route;
          siteOfInjection = vaccine.siteOfInjection;
        }
      });
      this.vaccineList[index].dose = doses;
      this.vaccineList[index].route = route;
      this.vaccineList[index].siteOfInjection = siteOfInjection;
      this.setDefaultVaccineDetailsOnSelectedMissedVaccine(
        index,
        doses,
        route,
        siteOfInjection
      );
    }
  }
  /* Set default doses, route and site of injection for selected missing vaccine */
  setDefaultVaccineDetailsOnSelectedMissedVaccine(
    index,
    doses,
    route,
    siteOfInjection
  ) {
    let vaccineControls = (<FormArray>(
      this.immunizationServicesForm.controls["vaccines"]["controls"]
    )).at(index);
    if (
      this.vaccineList[index].dose !== undefined &&
      this.vaccineList[index].dose.length === 1
    ) {
      vaccineControls.patchValue({
        vaccineDose: doses[0].dose,
      });
    }
    if (
      this.vaccineList[index].route !== undefined &&
      this.vaccineList[index].route.length === 1
    ) {
      vaccineControls.patchValue({
        route: route[0].route,
      });
    }
    if (
      this.vaccineList[index].siteOfInjection !== undefined &&
      this.vaccineList[index].siteOfInjection.length === 1
    ) {
      vaccineControls.patchValue({
        siteOfInjection: siteOfInjection[0].siteofinjection,
      });
    }
  }

  resetVaccineDetails(index) {
    let getControls = (<FormArray>(
      this.immunizationServicesForm.controls["vaccines"]["controls"]
    )).at(index);
    getControls["controls"].batchNo.reset();
    getControls["controls"].vaccineDose.reset();
    getControls["controls"].route.reset();
    getControls["controls"].siteOfInjection.reset();
  }
  /** Nurse fetch */
   getNurseFetchImmunizationServiceDetails() {
     if(this.visitCategory.toLowerCase() == "neonatal and infant health care services"){
     this.doctorService.fetchImmunizationServiceDeatilsFromNurse().subscribe(
       (serviceResponse) => {
         if (
           serviceResponse !== undefined &&
           serviceResponse !== null &&
           serviceResponse.data !== undefined &&
           serviceResponse.data.immunizationServices !== undefined
         ) {
           this.capturedImmunizationService =
             serviceResponse.data.immunizationServices;
           this.currentVaccineTaken =
             serviceResponse.data.immunizationServices.vaccines;
             this.patchVaccineDetailsOnView = true;
           this.getVaccineListOnSelectedService(
             this.capturedImmunizationService
               .currentImmunizationServiceID, this.capturedImmunizationService
               .currentImmunizationService
           );
         }
       },
       (err) => {
         this.confirmationService.alert(err, "error");
       }
     );
    }
  }

  getNurseFetchImmunizationServiceDetailsForChildhood() {
    if(this.visitCategory.toLowerCase() == "childhood & adolescent healthcare services"){
    if(this.doctorService.immunizationServiceFetchDetails !== undefined && 
       this.doctorService.immunizationServiceFetchDetails !== null && 
       this.doctorService.immunizationServiceFetchDetails.immunizationServices !== undefined &&
       this.doctorService.immunizationServiceFetchDetails.immunizationServices !== null){
        let immunizationServiceData = this.doctorService.immunizationServiceFetchDetails.immunizationServices;

          this.capturedImmunizationService =
          immunizationServiceData;
        this.currentVaccineTaken =
          immunizationServiceData.vaccines;
          this.patchVaccineDetailsOnView = true;
        this.getVaccineListOnSelectedService(
          immunizationServiceData
            .currentImmunizationServiceID, immunizationServiceData.currentImmunizationService
        );
      }
    }
  }
  /** Nurse update */
  updateImmunizationServiceFromDoctor(immunizationServiceForm) {
    if(this.visitCategory.toLowerCase() == "neonatal and infant health care services"){
    this.doctorService
      .updateImmunizationServices(immunizationServiceForm)
      .subscribe(
        (response) => {
          if (response.statusCode == 200 && response.data != null) {
            this.confirmationService.alert(response.data.response, "success");
            immunizationServiceForm.markAsPristine();
          } else {
            this.confirmationService.alert(response.errorMessage, "error");
          }
        },
        (err) => {
          this.confirmationService.alert(err, "error");
        }
      );
    }
  }

  getAgeValue(age) {
    if (!age) return 0;
    let arr = age !== undefined && age !== null ? age.trim().split(" ") : age;
    if (arr[1]) {
      let ageUnit = arr[1];
      if (ageUnit.toLowerCase() == "years") {
        if (arr[0] === "5-6") {
          return 5 * 12 * 30;
        } else return parseInt(arr[0]) * 12 * 30;
      } else if (ageUnit.toLowerCase() == "months") {
        if (arr[0] === "9-12") return 9 * 30;
        else if (arr[0] === "16-24") return 16 * 30;
        else return parseInt(arr[0]) * 30;
      } else if (ageUnit.toLowerCase() == "weeks") return parseInt(arr[0]) * 7;
      else if (ageUnit.toLowerCase() === "days") return parseInt(arr[0]);
    }
    return 0;
  }

  getBeneficiaryDetails() {
    this.beneficiaryDetailsSubscription =
      this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(
        (beneficiaryDetails) => {
          if (beneficiaryDetails) {
            // this.beneficiaryAge = beneficiaryDetails.age;
            let calculateAgeInYears = beneficiaryDetails.age
              .split("-")[0]
              .trim();
            let calculateAgeInMonths = beneficiaryDetails.age.split("-")[1]
              ? beneficiaryDetails.age.split("-")[1].trim()
              : "";
            if (calculateAgeInMonths !== "0 months") {
              let ageInYear = this.getAgeValue(calculateAgeInYears);
              let ageInMonth = this.getAgeValue(calculateAgeInMonths);
              this.beneficiaryAge = ageInYear + ageInMonth + " days";
            } else {
              this.beneficiaryAge = beneficiaryDetails.age.split("-")[0].trim();
            }
          }
        }
      );
  }

  ngOnDestroy() {
    let vaccinationsList = <FormArray>(
      this.immunizationServicesForm.controls["vaccines"]
    );
    while (vaccinationsList.length) {
      vaccinationsList.removeAt(0);
    }
    this.immunizationServicesForm.reset();
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();
  }
}
