import { Component, OnInit, Input, OnDestroy } from "@angular/core";

import { FormBuilder, FormGroup } from "@angular/forms";

import { DoctorService } from "../../../../shared/services";

import { GeneralUtils } from "../../../../shared/utility";

import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-covid-diagnosis",
  templateUrl: "./covid-diagnosis.component.html",
  styleUrls: ["./covid-diagnosis.component.css"],
})
export class CovidDiagnosisComponent implements OnInit, OnDestroy {
  utils = new GeneralUtils(this.fb);

  @Input("generalDiagnosisForm")
  generalDiagnosisForm: FormGroup;

  @Input("caseRecordMode")
  caseRecordMode: string;
  current_language_set: any;
  designation: any;
  specialist: boolean;
  doctorDiagnosis: any;

  constructor(
    private fb: FormBuilder,
    public httpServiceService: HttpServiceService,
    private doctorService: DoctorService
  ) {}

  ngOnInit() {
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
    if (this.designation == "TC Specialist") {
      this.generalDiagnosisForm.controls["doctorDiagnosis"].disable();
      this.specialist = true;
    } else {
      this.generalDiagnosisForm.controls["doctorDiagnosis"].enable();
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

  get specialistDaignosis() {
    return this.generalDiagnosisForm.get("specialistDiagnosis");
  }

  get doctorDaignosis() {
    return this.generalDiagnosisForm.get("doctorDiagnosis");
  }

  ngOnChanges() {
    if (this.caseRecordMode == "view") {
      this.getDiagnosisDetails();
    }
  }

  diagnosisSubscription: Subscription;
  getDiagnosisDetails() {
    this.diagnosisSubscription =
      this.doctorService.populateCaserecordResponse$.subscribe((res) => {
        if (res && res.statusCode == 200 && res.data && res.data.diagnosis) {
          console.log("caserecord", res.data.diagnosis);

          this.patchDiagnosisDetails(res.data.diagnosis);
        }
      });
  }
  patchDiagnosisDetails(diagnosis) {
    console.log("diagnosis", diagnosis.doctorDiagnonsis);

    this.generalDiagnosisForm.patchValue({
      doctorDiagnosis: diagnosis.doctorDiagnonsis,
    });
    this.generalDiagnosisForm.patchValue(diagnosis);
  }
  ngOnDestroy() {
    if (this.diagnosisSubscription) {
      this.diagnosisSubscription.unsubscribe();
    }
  }
}