import { Component, Input, OnInit } from '@angular/core';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { NurseService } from 'app/app-modules/nurse-doctor/shared/services';

@Component({
  selector: 'app-visit-details-case-sheet',
  templateUrl: './visit-details-case-sheet.component.html',
  styleUrls: ['./visit-details-case-sheet.component.css']
})
export class VisitDeatilsCaseSheetComponent implements OnInit {
  @Input("data")
  caseSheetData: any;

  @Input("visitCategory")
  visitCategory: any;
  

  @Input('printPagePreviewSelect')
  printPagePreviewSelect: any;
  
  @Input("previous")
  previous: any;

  currentLanguageSet: any;
  visitDetailsCasesheet: any;
  enableOtherFollowFpMethod: boolean = false;
  enableOtherSideEffect: boolean = false;
  previousConfirmedDiseasesList = [];
  enableConfirmedDiseases: boolean = false;
  ncdVisitDetails: any;
  
  constructor(
    private httpServiceService: HttpServiceService,
    private nurseService: NurseService
  ) { }

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
    if(this.caseSheetData != undefined && this.caseSheetData != null){
        if(
            this.caseSheetData &&
            this.caseSheetData.nurseData &&
            this.caseSheetData.nurseData.fpNurseVisitData
        ){
            this.visitDetailsCasesheet = this.caseSheetData.nurseData.fpNurseVisitData;

            if(this.visitDetailsCasesheet.otherFollowUpForFpMethod !== undefined && 
                this.visitDetailsCasesheet.otherFollowUpForFpMethod !== null){
                this.enableOtherFollowFpMethod = true;
            } else{
                this.enableOtherFollowFpMethod = false;
            }
            
            if(this.visitDetailsCasesheet.otherSideEffects !== undefined && 
            this.visitDetailsCasesheet.otherSideEffects !== null){
            this.enableOtherSideEffect = true;
            } else{
            this.enableOtherSideEffect = false;
            }

          
        }

        if(this.caseSheetData && this.caseSheetData.BeneficiaryData !== undefined && 
          this.caseSheetData.BeneficiaryData !== null && this.visitCategory === 'NCD care'
          ){
            this.ncdVisitDetails = this.caseSheetData.BeneficiaryData;
            this.loadConfirmedDiseasesFromNCD(this.caseSheetData.BeneficiaryData.beneficiaryRegID)
          }
    }
    }


    loadConfirmedDiseasesFromNCD(benRegId) {
      this.previousConfirmedDiseasesList = [];
      this.enableConfirmedDiseases = false;
      let obj={
        
        "beneficiaryRegId": benRegId
    };
  
      this.nurseService.getPreviousVisitConfirmedDiseases(obj)
      .subscribe(value => {
        if (value != null && value.statusCode == 200 && value.data != null) {
          this.previousConfirmedDiseasesList = [];
  
          if(value.data.confirmedDiseases !== undefined && value.data.confirmedDiseases !== null && 
            value.data.confirmedDiseases.length > 0) {
          this.previousConfirmedDiseasesList = value.data.confirmedDiseases;
          this.enableConfirmedDiseases = true;
          }
    }
       });
  }
}
