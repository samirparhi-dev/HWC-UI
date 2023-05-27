import { Component, Input, OnInit } from '@angular/core';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { BeneficiaryDetailsService } from 'app/app-modules/core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { Timestamp } from 'rxjs';

@Component({
  selector: 'app-neonatal-and-infant-service-case-sheet',
  templateUrl: './neonatal-and-infant-service-case-sheet.component.html',
  styleUrls: ['./neonatal-and-infant-service-case-sheet.component.css']
})
export class NeonatalAndInfantServiceCaseSheetComponent implements OnInit {
  @Input("data")
  caseSheetData: any;

  @Input('printPagePreviewSelect')
  printPagePreviewSelect: any;

  @Input("previous")
  previous: any;
  
  currentLanguageSet: any;
  infantBirthDeatilsCasesheet: any;
  otherDelPlace: boolean = false;
  otherDelComplication: boolean = false;
  followUpImmunizationCasesheet: any;
  formImmunizationHistoryCasesheet: any;
  formImmunizationHistoryDetails: any;
  immunizationServiceCasesheet: any;
  immunizationServicesCasesheet: any;
  vaccinetaken= [];
  serviceVaccinetaken= [];
  immunizationDataList: any;
  immunizationVaccine: any;
  beneficiaryAge: number = 0;
  beneficiary: any;
  enableImmunizationServiceVaccine: boolean = false;
  benAge: any;
  visitCategory: string;
  birthTime: Date;

  constructor(
    private httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService
  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.visitCategory = localStorage.getItem("caseSheetVisitCategory");
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
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

  ngOnChanges() {
    if(this.caseSheetData != undefined && this.caseSheetData != null){
      if(
        this.caseSheetData &&
        this.caseSheetData.nurseData &&
        this.caseSheetData.nurseData.history &&
        this.caseSheetData.nurseData.history.infantBirthDetails
      ){
        this.infantBirthDeatilsCasesheet = this.caseSheetData.nurseData.history.infantBirthDetails;

        if(this.infantBirthDeatilsCasesheet.otherDeliveryPlace !== undefined && 
          this.infantBirthDeatilsCasesheet.otherDeliveryPlace !== null){
          this.otherDelPlace = true;
        } else{
          this.otherDelPlace = false;
        }

        if(this.infantBirthDeatilsCasesheet.otherDeliveryComplication !== undefined && 
          this.infantBirthDeatilsCasesheet.otherDeliveryComplication !== null){
          this.otherDelComplication = true;
        } else{
          this.otherDelComplication = false;
        }

        if(this.infantBirthDeatilsCasesheet.timeOfBirth){
        this.birthTime = toTime(this.infantBirthDeatilsCasesheet.timeOfBirth);
        }
      }

      if(
        this.caseSheetData &&
        this.caseSheetData.nurseData && 
        this.caseSheetData.nurseData.history &&
        this.caseSheetData.nurseData.history.immunizationHistory && 
        this.caseSheetData.nurseData.history.immunizationHistory.immunizationList
      ) {
        this.immunizationDataList = this.caseSheetData.nurseData.history.immunizationHistory.immunizationList;

        this.immunizationVaccine = [];
        this.immunizationDataList.forEach(vaccineList => {
          this.immunizationVaccine = [];
          vaccineList.vaccines.forEach(vaccine => { 
            if(vaccine.status === true)
            { 
              this.immunizationVaccine.push(vaccine.vaccine);
            }
          })
          let consumedVaccineData = {
            vaccine: this.immunizationVaccine.join(","),
            defaultReceivingAge: vaccineList.defaultReceivingAge,
            vaccinationReceivedAt: vaccineList.vaccinationReceivedAt,
          }
          this.vaccinetaken.push(consumedVaccineData);
        });
        console.log(this.vaccinetaken);
      }

      if(
        this.caseSheetData &&
        this.caseSheetData.nurseData &&
        this.caseSheetData.nurseData.immunizationServices &&
        this.caseSheetData.nurseData.immunizationServices.immunizationServices &&
        this.caseSheetData.nurseData.immunizationServices.immunizationServices.vaccines
      ) {
        this.immunizationServicesCasesheet = this.caseSheetData.nurseData.immunizationServices.immunizationServices;
        
        let immunizationServiceData = this.caseSheetData.nurseData.immunizationServices.immunizationServices.vaccines;

        let serviceVaccineName= [];
        immunizationServiceData.forEach(vaccine => {
          serviceVaccineName = [];
          if(vaccine.vaccineName !== undefined && vaccine.vaccineName !== null) {
            serviceVaccineName.push(vaccine.vaccineName);
            this.enableImmunizationServiceVaccine = true;
          } else{
            this.enableImmunizationServiceVaccine = false;
          }
          let consumedVaccineData = {
            vaccine: serviceVaccineName.join(","),
            vaccineDose: vaccine.vaccineDose,
            siteOfInjection: vaccine.siteOfInjection,
            route: vaccine.route,
            batchNo: vaccine.batchNo
          }
          this.serviceVaccinetaken.push(consumedVaccineData);
        });
        console.log(this.serviceVaccinetaken);
      }

      if(
        this.caseSheetData &&
        this.caseSheetData.doctorData &&
        this.caseSheetData.doctorData.followUpForImmunization
      ){
        this.followUpImmunizationCasesheet = this.caseSheetData.doctorData.followUpForImmunization;
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

function toTime(timeString){
  var timeTokens = timeString.split(':');
  return new Date(1970,0,1, timeTokens[0], timeTokens[1]);
}
