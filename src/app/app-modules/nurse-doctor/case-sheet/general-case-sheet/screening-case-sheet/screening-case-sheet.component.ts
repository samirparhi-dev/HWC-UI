import { Component, Input, OnInit } from "@angular/core";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";

@Component({
  selector: "app-screening-case-sheet",
  templateUrl: "./screening-case-sheet.component.html",
  styleUrls: ["./screening-case-sheet.component.css"]
})
export class ScreeningCaseSheetComponent implements OnInit {
  @Input("data")
  caseSheetData: any;

  @Input('printPagePreviewSelect')
  printPagePreviewSelect: any;

  @Input("previous")
  previous: any;

  currentLanguageSet: any;
  cbacScore: any;
  diabetesConfirmed: boolean = false;
  hypertensionConfirmed: boolean = false;
  oralCancerConfirmed: boolean = false;
  breastCancerConfirmed: boolean = false;
  cervicalCancerConfirmed: boolean = false;
  diabetesCasesheet: any;
  hypertensionCasesheet: any;
  oralCancerCasesheet: any;
  breastCancerCasesheet: any;
  cervicalCancerCasesheet: any;
  diabetesSuspected: boolean = false;
  hypertensionSuspected: boolean = false;
  oralSuspected: boolean = false;
  breastSuspected: boolean = false;
  cervicalSuspected: boolean = false;
  enableDiabetesForm: boolean = false;
  enableHypertensionForm: boolean = false;
  enableOralForm: boolean = false;
  enableBreastForm: boolean = false;
  enableCervicalForm: boolean = false;

  constructor(private httpServiceService: HttpServiceService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
    
  ngOnChanges() {
    if(this.caseSheetData !== undefined){
    /* cbac score patch*/ 
    if( this.caseSheetData &&
      this.caseSheetData.nurseData &&
      this.caseSheetData.nurseData.cbac){
       this.cbacScore = this.caseSheetData.nurseData.cbac.totalScore;
       }


    /* Diabetes Screening patch*/  
    if (
      this.caseSheetData &&
      this.caseSheetData.nurseData &&
      this.caseSheetData.nurseData.diabetes
    ) {
      this.diabetesCasesheet = this.caseSheetData.nurseData.diabetes;
      this.diabetesSuspected = this.caseSheetData.nurseData.diabetes.suspected;
      this.diabetesConfirmed = this.caseSheetData.nurseData.diabetes.confirmed;
      if(this.caseSheetData.nurseData.diabetes.suspected !== null && this.caseSheetData.nurseData.diabetes.suspected !== undefined){
      this.enableDiabetesForm = true;
      } else{
        this.enableDiabetesForm = false;
      }
      }

    /* Hypertension Screening patch*/  
    if(
      this.caseSheetData &&
      this.caseSheetData.nurseData &&
      this.caseSheetData.nurseData.hypertension
    ) {
      this.hypertensionCasesheet = this.caseSheetData.nurseData.hypertension;
      this.hypertensionSuspected = this.caseSheetData.nurseData.hypertension.suspected;
      this.hypertensionConfirmed = this.caseSheetData.nurseData.hypertension.confirmed;
      if(this.caseSheetData.nurseData.hypertension.suspected !== null && this.caseSheetData.nurseData.hypertension.suspected !== undefined){
        this.enableHypertensionForm = true;
        } else{
          this.enableHypertensionForm = false;
        }
      }

    /* Oral Cancer Screening patch*/  
    if(
      this.caseSheetData &&
      this.caseSheetData.nurseData &&
      this.caseSheetData.nurseData.oral
    ) {
      this.oralCancerCasesheet = this.caseSheetData.nurseData.oral;
      this.oralSuspected = this.caseSheetData.nurseData.oral.suspected;
      this.oralCancerConfirmed = this.caseSheetData.nurseData.oral.confirmed;
      if(this.caseSheetData.nurseData.oral.suspected !== null && this.caseSheetData.nurseData.oral.suspected !== undefined){
        this.enableOralForm = true;
        } else{
          this.enableOralForm = false;
        }
      }

    /* Breast Cancer Screening patch*/  
    if(
      this.caseSheetData &&
      this.caseSheetData.nurseData &&
      this.caseSheetData.nurseData.breast
    ) {
      this.breastCancerCasesheet = this.caseSheetData.nurseData.breast;
      this.breastSuspected = this.caseSheetData.nurseData.breast.suspected;
      this.breastCancerConfirmed = this.caseSheetData.nurseData.breast.confirmed;
      if(this.caseSheetData.nurseData.breast.suspected !== null && this.caseSheetData.nurseData.breast.suspected !== undefined){
        this.enableBreastForm = true;
        } else{
          this.enableBreastForm = false;
        }
      }

    /* Cervical Cancer Screening patch*/  
    if(
      this.caseSheetData &&
      this.caseSheetData.nurseData &&
      this.caseSheetData.nurseData.cervical
    ) {
      this.cervicalCancerCasesheet = this.caseSheetData.nurseData.cervical;
      this.cervicalSuspected = this.caseSheetData.nurseData.cervical.suspected;
      this.cervicalCancerConfirmed = this.caseSheetData.nurseData.cervical.confirmed;
      if(this.caseSheetData.nurseData.cervical.suspected !== null && this.caseSheetData.nurseData.cervical.suspected !== undefined){
        this.enableCervicalForm = true;
        } else{
          this.enableCervicalForm= false;
        }
      }
    }
  }
}
