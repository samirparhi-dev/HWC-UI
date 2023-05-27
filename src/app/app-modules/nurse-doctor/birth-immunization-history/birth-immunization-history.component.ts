import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { BeneficiaryDetailsService, ConfirmationService } from 'app/app-modules/core/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { Subscription } from 'rxjs';
import { DoctorService } from '../shared/services';

@Component({
  selector: 'app-birth-immunization-history',
  templateUrl: './birth-immunization-history.component.html',
  styleUrls: ['./birth-immunization-history.component.css']
})
export class BirthImmunizationHistoryComponent implements OnInit {


  @Input('patientBirthImmunizationHistoryForm')
  patientBirthImmunizationHistoryForm: FormGroup

  @Input('visitCategory')
  visitCategory : string;

  @Input('immunizationHistoryMode')
  mode: String;
  currentLanguageSet: any;
  attendant: any;
  beneficiaryDetailsSubscription: Subscription;
  beneficiaryAge: any;

  constructor( public httpServiceService: HttpServiceService,
    private doctorService: DoctorService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    ) { }

  ngOnInit() {
    this.getBenificiaryDetails();
    this.doctorService.clearPreviousInfantAndImmunizationHistoryDetails();
    this.assignSelectedLanguage();
    this.attendant = this.route.snapshot.params["attendant"];
    
    if(this.mode !== undefined && this.mode !== null && this.mode == "view"){
      this.getNurseImmunizationHistoryDetailsFromNurse();
    }

    if(this.attendant == "nurse") {
    this.getPreviousVisitBirthImmunizationDetails(this.visitCategory);
    }
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  ngOnChanges(){
    if (this.mode == "update") {
      let visitCategory = localStorage.getItem("visitCategory");
      this.updateBirthAndImmunizationHistoryFromDoctor(
        this.patientBirthImmunizationHistoryForm,
        visitCategory
      );
    }
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  getBenificiaryDetails() {
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiaryDetails => {
        if (beneficiaryDetails) {
          this.beneficiaryAge = beneficiaryDetails.ageVal;
        }
      })
  }

  getNurseImmunizationHistoryDetailsFromNurse(){
    if ((this.mode == "view" || this.mode == "update") && this.visitCategory.toLowerCase() == "neonatal and infant health care services" ) {
      this.doctorService.birthAndImmunizationDetailsFromNurse = null;
      this.doctorService.getBirthImmunizationHistoryNurseDetails().subscribe((res) => {
        if (
          res.statusCode == 200 &&
          res.data !== null &&
          res.data !== undefined
        ) {
          this.doctorService.birthAndImmunizationDetailsFromNurse = res.data;
          this.doctorService.setInfantDataFetch(true);
        }
      });
    }
    if ((this.mode == "view" || this.mode == "update") && this.visitCategory.toLowerCase() == "childhood & adolescent healthcare services" ) {
      this.doctorService.birthAndImmunizationDetailsFromNurse = null;
      this.doctorService.getBirthImmunizationHistoryNurseDetailsForChildAndAdolescent().subscribe((res) => {
        if (
          res.statusCode == 200 &&
          res.data !== null &&
          res.data !== undefined
        ) {
          this.doctorService.birthAndImmunizationDetailsFromNurse = res.data;
          this.doctorService.setInfantDataFetch(true);
        }
      });
    }
  }


  getPreviousVisitBirthImmunizationDetails(visitCategory) {
    this.doctorService.birthAndImmunizationDetailsFromNurse = null;
      this.doctorService.getPreviousBirthImmunizationHistoryDetails(visitCategory).subscribe((res) => {
        if (
          res.statusCode == 200 &&
          res.data !== null &&
          res.data !== undefined
        ) {
          this.doctorService.getPreviousInfantAndImmunizationHistoryDetails(res.data);
        }

      });


    
  }

  updateBirthAndImmunizationHistoryFromDoctor(medicalForm, visitCategory) {
    this.doctorService
      .updateBirthAndImmunizationHistory(medicalForm, visitCategory)
      .subscribe(
        (response) => {
          if (response.statusCode == 200 && response.data != null) {
            this.confirmationService.alert(response.data.response, "success");
            this.doctorService.BirthAndImmunizationValueChanged(false);
            this.getNurseImmunizationHistoryDetailsFromNurse();
            medicalForm.markAsPristine();
          } else {
            this.confirmationService.alert(response.errorMessage, "error");
          }
        },
        (err) => {
          this.confirmationService.alert(err, "error");
        }
      );
  }

  ngOnDestroy() {
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();
  }

}
