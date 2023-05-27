import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { BeneficiaryDetailsService } from 'app/app-modules/core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { Subscription } from 'rxjs/Subscription';
import { DoctorService } from '../shared/services/doctor.service';
import { MasterdataService } from '../shared/services/masterdata.service';
import { GeneralUtils } from '../shared/utility/general-utility';

@Component({
  selector: 'app-follow-up-for-immunization',
  templateUrl: './follow-up-for-immunization.component.html',
  styleUrls: ['./follow-up-for-immunization.component.css'],
  providers: [DatePipe]
})
export class FollowUpForImmunizationComponent implements OnInit {

  @Input('patientFollowUpImmunizationForm')
  patientFollowUpImmunizationForm: FormGroup

  @Input('followUpImmunizationMode')
  followUpImmunizationMode: String;

  @Input('visitCategory')
  visitCategory : any;

  @Input('patientFollowUpImmunizationForm')
  followUpImmunizationForm: FormGroup

  futureDate = new Date();
  currentLanguageSet: any;

  utils = new GeneralUtils(this.fb);
  dueVaccines = [];
  nextImmunizationSession = [];
  male: boolean = false;
  totalMonths: number;
  benAge: any;
  female: boolean = false;
  beneficiary: any;
  beneficiaryAge: any;

  constructor(
    private httpServiceService: HttpServiceService,
    private fb: FormBuilder,
    private doctorService: DoctorService,
    public datepipe: DatePipe, private beneficiaryDetailsService: BeneficiaryDetailsService,
    private masterdataService: MasterdataService
  ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.visitCategory = localStorage.getItem('visitCategory');
    this.futureDate.setDate(this.futureDate.getDate() + 1);
    this.loadMasterData();
    this.getBenificiaryDetails();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  benGenderAndAge: any;
  beneficiaryDetailSubscription: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails) {
          this.beneficiary = beneficiaryDetails;
          let calculateAgeInYears = beneficiaryDetails.age.split("-")[0].trim();
          let calculateAgeInMonths = beneficiaryDetails.age.split("-")[1] ? beneficiaryDetails.age.split("-")[1].trim(): "";
          if (calculateAgeInMonths !== "0 months") {
            let ageInYear = this.getAgeValueNew(calculateAgeInYears);
            let ageInMonth = this.getAgeValueNew(calculateAgeInMonths);

            this.beneficiaryAge = ageInYear + ageInMonth + " days";

            // this.beneficiaryAge = ageInYear + ageInMonth + " days";
          } else {
            this.beneficiaryAge = beneficiaryDetails.age.split("-")[0].trim();
          }
        }
        }
      )}
  

  getAgeValueNew(age) {
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
            return 12 * 30;
        else if (arr[0] === "16-24")
            return 24 * 30;
        else  
            return parseInt(arr[0]) * 30;
    }
      else if (ageUnit.toLowerCase() == "weeks") return parseInt(arr[0]) * 7;
      else if (ageUnit.toLowerCase() === "days") return parseInt(arr[0]);
    }
    return 0;
  }	


  doctorMasterDataSubscription : any;
  loadMasterData() {
    this.doctorMasterDataSubscription = this.masterdataService.doctorMasterData$.subscribe((masterData) => {
      if(masterData){
        console.log("masterData=", masterData);
        this.dueVaccines = masterData.nextDueVaccines;
        this.nextImmunizationSession = masterData.nextImmuLocations;

        if(this.visitCategory.toLowerCase() == 'neonatal and infant health care services'){
          this.nextImmunizationSession = masterData.nextImmuLocations;
          if(masterData.nextImmuLocations !== undefined && masterData.nextImmuLocations !== null) {
          this.nextImmunizationSession = masterData.nextImmuLocations.filter(item => {
            if(item.name.toLowerCase() != "school"){
              this.nextImmunizationSession.push(item);
              return item.name;
            }
          })
        } else {
          this.nextImmunizationSession = masterData.nextImmuLocations;
        }
        }

        if(this.visitCategory.toLowerCase() == 'neonatal and infant health care services'){
          this.dueVaccines = masterData.nextDueVaccines;
          if(masterData.nextDueVaccines !== undefined && masterData.nextDueVaccines !== null) {
          this.dueVaccines = masterData.nextDueVaccines.filter(item => {
            if(item.name.toLowerCase() != "16-24 months" && 
               item.name.toLowerCase() != "5-6 years" && 
               item.name.toLowerCase() != "10 years" && 
               item.name.toLowerCase() != "16 years"){
              this.dueVaccines.push(item);
              return item.name;
            }
          })
        } else {
          this.dueVaccines = masterData.nextDueVaccines;
        }
        }
        
        // if(this.visitCategory.toLowerCase() == 'childhood & adolescent healthcare services' && this.getAgeValueNew(this.beneficiaryAge) >= 360){
        //  let vaccines = masterData.nextDueVaccines;
        //   if(vaccines !== undefined && vaccines !== null){
        //      vaccines.filter(item => {
        //       if(this.getAgeValueNew(item.name) >= 365  && this.getAgeValueNew(item.name) >= this.getAgeValueNew(this.beneficiaryAge)){
        //         this.dueVaccines.push(item);
        //       }
        //     })
        //   }

        // }
        //  if(this.visitCategory.toLowerCase() == 'neonatal and infant health care services' && this.getAgeValueNew(this.beneficiaryAge) <= 365){
        //   let vaccines = masterData.nextDueVaccines;
        //    if(vaccines !== undefined && vaccines !== null){
        //       vaccines.filter(item => {
        //         if(this.getAgeValueNew(item.name) <= 365 && this.getAgeValueNew(item.name) >= this.getAgeValueNew(this.beneficiaryAge)){
        //           this.dueVaccines.push(item);
        //         }
        //      })
        //    }
 
        //  }

      if (this.followUpImmunizationMode == 'view') {
          this.getFollowUpImmunization(); 
        }
    } else {
      console.log("Error in fetching doctor master data details");
    }
    })
  }

  get dueDateForNextImmunization() {
    return this.followUpImmunizationForm.controls['dueDateForNextImmunization'].value;
  }

  get nextDueVaccines() {
    return this.followUpImmunizationForm.controls['nextDueVaccines'].value;
  }

  get locationOfNextImmunization() {
    return this.followUpImmunizationForm.controls['locationOfNextImmunization'].value;
  }

  followUpImmunizationSubscription: Subscription;
  getFollowUpImmunization() {
    this.followUpImmunizationSubscription = this.doctorService.populateCaserecordResponse$
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data && 
          res.data.followUpForImmunization != undefined && res.data.followUpForImmunization != null) {
          let followUpImmunizationDetails = res.data.followUpForImmunization;
          let followUpForImmunization =  Object.assign({},
            followUpImmunizationDetails, { dueDateForNextImmunization: new Date(followUpImmunizationDetails.dueDateForNextImmunization)});
          this.followUpImmunizationForm.patchValue(followUpForImmunization);
          // this.followUpImmunizationForm.controls['followUpForImmunization'].setValue(res.data.followUpForImmunization);
        }
      })
  }

  onClickOfNextDueVaccine() {
    this.dueVaccines.filter(item => {
      if(item.name == this.followUpImmunizationForm.controls.nextDueVaccines.value) {
        this.followUpImmunizationForm.controls.nextDueVaccinesID.patchValue(item.id);
      }
   });
  }

  onClickOfLocationOfNextImmunization() {
    this.nextImmunizationSession.filter(item => {
      if(item.name == this.followUpImmunizationForm.controls.locationOfNextImmunization.value) {
        this.followUpImmunizationForm.controls.locationOfNextImmunizationID.patchValue(item.id);
      }
    })
  }

  ngOnDestroy() {
    if(this.followUpImmunizationSubscription)
      this.followUpImmunizationSubscription.unsubscribe();
    if(this.doctorMasterDataSubscription)
      this.doctorMasterDataSubscription.unsubscribe();
      if (this.beneficiaryDetailSubscription)
    this.beneficiaryDetailSubscription.unsubscribe();
  }
}
