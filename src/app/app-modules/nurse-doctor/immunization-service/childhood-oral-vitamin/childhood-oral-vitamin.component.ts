import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { BeneficiaryDetailsService } from "app/app-modules/core/services/beneficiary-details.service";
import { ConfirmationService } from "app/app-modules/core/services/confirmation.service";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { Subscription } from "rxjs/Subscription";
import { DoctorService } from "../../shared/services/doctor.service";
import { MasterdataService } from "../../shared/services/masterdata.service";
import { GeneralUtils } from "../../shared/utility/general-utility";

@Component({
  selector: "app-childhood-oral-vitamin",
  templateUrl: "./childhood-oral-vitamin.component.html",
  styleUrls: ["./childhood-oral-vitamin.component.css"]
})
export class ChildhoodOralVitaminComponent implements OnInit {
  @Input("oralVitaminAForm")
  oralVitaminAForm: FormGroup;
  
  @Input("mode")
  mode: any;
  
  @Input("visitCategory")
  visitCategory: String;

  currentLanguageSet: any;
  today: any;
  utils = new GeneralUtils(this.fb);
  nurseMasterDataSubscription: Subscription;
  oralVitaminADoses = [];
  vaccineStatus = ['Given', 'Not Given'];
  oralVitaminAData: any;
  beneficiaryAge: number = 0;
  beneficiary: any;

  constructor(
    private httpServiceService: HttpServiceService,
    private masterdataService: MasterdataService,
    private fb: FormBuilder,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private confirmationService: ConfirmationService,
    private doctorService: DoctorService
  ) { }

  todayDate = new Date()

  ngOnInit() {
    this.assignSelectedLanguage();
    this.today = new Date();
    this.getNurseMasterData();
    this.getBeneficiaryDetails();
    this.todayDate.setDate(this.today.getDate());
    this.oralVitaminAForm.patchValue({ dateOfVisit : this.todayDate})
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
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
          masterData.oralVitaminNoDose
        ) {
          this.oralVitaminADoses = masterData.oralVitaminNoDose;
          if (this.mode == "view") {
            this.getNurseFetchOralVitaminADetails();
          }
        }
      });
  }

  ngOnChanges() {
    if (this.mode == "view") {
      this.getNurseFetchOralVitaminADetails();
    }
  }

  setVaccineDetails(vaccineStatus) {
    if (vaccineStatus === "Given") {
    this.oralVitaminAForm.patchValue({dose: "2 ml (2 lakh IU)"});
    this.oralVitaminAForm.patchValue({route: "Oral"});
    } else{
      if (vaccineStatus === "Not Given")
      this.resetFormOnChangeOfVaccineStatus();
    }
    (this.mode == "view" || this.mode == "update") ? this.doctorService.immunizationServiceChildhoodValueChanged(true) : null;
  }

  onValueChange() {
    (this.mode == "view" || this.mode == "update") ? this.doctorService.immunizationServiceChildhoodValueChanged(true) : null;
  }

  resetFormOnChangeOfVaccineStatus() {

    this.oralVitaminAForm.controls["noOfOralVitaminADoseID"].reset();
    this.oralVitaminAForm.controls["noOfOralVitaminADose"].reset();
    this.oralVitaminAForm.controls["dose"].reset();
    this.oralVitaminAForm.controls["batchNo"].reset();
    this.oralVitaminAForm.controls["route"].reset();
  }

  beneficiaryDetailsSubscription: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(beneficiary => {
      if (beneficiary) {
        this.beneficiary = beneficiary;
       

        let calculateAgeInYears = beneficiary.age.split('-')[0].trim();
        let calculateAgeInMonths = beneficiary.age.split('-')[1] ? beneficiary.age.split('-')[1].trim() : "";
        let age = this.getAgeValueNew(calculateAgeInYears);
        if (age !== 0 && calculateAgeInMonths !== "0 months") {

          this.beneficiaryAge = age + 1; 
        }
        else
        {
             this.beneficiaryAge = age;
        }
      }
    })
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

  /** Nurse fetch */
  getNurseFetchOralVitaminADetails() {
    if(this.doctorService.immunizationServiceFetchDetails !== undefined && 
      this.doctorService.immunizationServiceFetchDetails !== null && 
      this.doctorService.immunizationServiceFetchDetails.oralVitaminAProphylaxis !== undefined &&
      this.doctorService.immunizationServiceFetchDetails.oralVitaminAProphylaxis !== null){
       let oralVitaminFetchData = this.doctorService.immunizationServiceFetchDetails.oralVitaminAProphylaxis;

       let childhoodOralVitaminData = Object.assign ({},
        oralVitaminFetchData,
        {dateOfVisit: new Date(oralVitaminFetchData.dateOfVisit)})
       this.oralVitaminAForm.patchValue(childhoodOralVitaminData);
     }
  }

  getNoOfOralVitaminADose() {
    this.oralVitaminADoses.filter((item) => {
      if (item.id === this.oralVitaminAForm.controls.noOfOralVitaminADoseID.value
      ) {
        this.oralVitaminAForm.controls.noOfOralVitaminADose.setValue(item.name);
      }
    });
    (this.mode == "view" || this.mode == "update") ? this.doctorService.immunizationServiceChildhoodValueChanged(true) : null;
  }

  ngOnDestroy(){
    if (this.beneficiaryDetailsSubscription)
    this.beneficiaryDetailsSubscription.unsubscribe();
    this.oralVitaminAForm.reset();
  }

  get dateOfVisit() {
    return this.oralVitaminAForm.controls["dateOfVisit"].value;
  }

  get oralVitaminAStatus() {
    return this.oralVitaminAForm.controls["oralVitaminAStatus"].value;
  }

  get noOfOralVitaminADose() {
    return this.oralVitaminAForm.controls["noOfOralVitaminADose"].value;
  }

  get dose() {
    return this.oralVitaminAForm.controls["dose"].value;
  }

  get batchNo() {
    return this.oralVitaminAForm.controls["batchNo"].value;
  }

  get route() {
    return this.oralVitaminAForm.controls["route"].value;
  }
}
