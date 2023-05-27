import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { ConfirmationService } from "app/app-modules/core/services";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { environment } from "environments/environment";
import { Subscription } from "rxjs/Subscription";
import { DoctorService, MasterdataService } from "../../shared/services";
import { NcdScreeningService } from "../../shared/services/ncd-screening.service";

@Component({
  selector: "app-cervical-cancer-screening",
  templateUrl: "./cervical-cancer-screening.component.html",
  styleUrls: ["./cervical-cancer-screening.component.css"],
})
export class CervicalCancerScreeningComponent implements OnInit {
  @Input("cervicalScreeningForm")
  cervicalScreeningForm: FormGroup;

  @Input("confirmDiseasesList")
  confirmDiseasesList: any[];

  @Input("ncdScreeningMode")
  mode: String;

  currentLanguageSet: any;

  visualExaminationSuspected: boolean = false;

  visualExaminations = [];
  hideCervicalForm: boolean = false;
  nurseMasterDataSubscription: Subscription;
  nurseMasterData: any = [];

  @Output() cervicalFormStatus = new EventEmitter<boolean>();
  confirmDiseaseArray = [];
  confirmedDiseasesListSubscription: Subscription;
  hideRemoveFunctionalityInDoctorIfSuspected: boolean = false;
  disableCheckbox: boolean = false;
  attendant: string;
  checkIsCervicalSuspected: boolean = false;
  /**
   * Modified by JA354063
   */
  constructor(
    private confirmationService: ConfirmationService,
    public httpServiceService: HttpServiceService,
    private ncdScreeningService: NcdScreeningService,
    private masterdataService: MasterdataService,
    private doctorService: DoctorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.ncdScreeningService.setScreeningDataFetch(false);
    this.assignSelectedLanguage();
    this.getNurseMasterData();
    this.attendant = this.route.snapshot.params["attendant"];
    this.confirmDiseaseArray = this.confirmDiseasesList;
    this.setConfirmedDiseasesForScreening();
    this.ncdScreeningService.clearConfirmedDiseasesForScreening();
    this.confirmedDiseasesListSubscription =
      this.ncdScreeningService.confirmedDiseasesListCheck$.subscribe(
        (response) => {
          if (
            response !== undefined &&
            response !== null &&
            response.length >= 0
          ) {
            this.confirmDiseaseArray = response;
            if(this.checkIsCervicalSuspected != false)
            this.setConfirmedDiseasesForScreening();
            else {
          this.setConfirmedDiseasesForScreeningOnMark();
            }
          }
        }
      );

      this.ncdScreeningService.fetchScreeningDataCheck$.subscribe(
        (responsevalue) => {
          if(responsevalue == true) {
            this.getNcdScreeningDataForCbac();
          }
        });
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  ngOnChanges() {
    if (this.mode == "view") {
      // this.getNcdScreeningDataForCbac();
    }
  }

  setConfirmedDiseasesForScreening() {
    if (this.confirmDiseaseArray.length > 0) {
      if (this.confirmDiseaseArray.includes(environment.cervical)) {
        this.cervicalScreeningForm.disable();
        this.cervicalScreeningForm.patchValue({
          suspected: null,
          formDisable: true,
        });
        this.disableCheckbox = true;
      } else {
        this.ncdScreeningService.isCervicalConfirmed = null;
        this.resetCervicalForm();
        this.disableCheckbox = false;
      }
    } else {
      this.resetCervicalForm();
      // On nurse initial load, checkbox should be disabled and enable the checkbox if the cervical cancer is suspected.
    //  ((this.attendant === "nurse" || this.attendant === "doctor") && this.visualExaminationSuspected === true) ? (this.disableCheckbox = false) : this.disableCheckbox = true;
    }
  }
  resetCervicalForm() {
    this.cervicalScreeningForm.enable();
    this.cervicalScreeningForm.patchValue({ formDisable: null });
    this.checkCervicalCancerSuspect();
  }


  setConfirmedDiseasesForScreeningOnMark() {
    if (this.confirmDiseaseArray.length > 0) {
      if (this.confirmDiseaseArray.includes(environment.cervical)) {
        this.cervicalScreeningForm.disable();
        this.cervicalScreeningForm.patchValue({
          suspected: null,
          formDisable: true,
        });
        this.disableCheckbox = true;
      } else {
        this.ncdScreeningService.isCervicalConfirmed = null;
        this.resetCervicalFormOnMark();
        this.disableCheckbox = false;
      }
    } else {
      this.resetCervicalFormOnMark();
      // On nurse initial load, checkbox should be disabled and enable the checkbox if the cervical cancer is suspected.
    //  ((this.attendant === "nurse" || this.attendant === "doctor") && this.visualExaminationSuspected === true) ? (this.disableCheckbox = false) : this.disableCheckbox = true;
    }
  }
  resetCervicalFormOnMark() {
    this.cervicalScreeningForm.enable();
    this.cervicalScreeningForm.patchValue({ formDisable: null });
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  get visualExaminationId() {
    return this.cervicalScreeningForm.controls["visualExaminationId"].value;
  }
  getNurseMasterData() {
    this.nurseMasterDataSubscription =
      this.masterdataService.nurseMasterData$.subscribe((data) => {
        if (data) {
          if (
            data.cervicalCancer !== undefined &&
            data.cervicalCancer !== null
          ) {
            this.nurseMasterData = data.cervicalCancer;
            this.visualExaminations = this.nurseMasterData.visualExamination;
            if (this.mode == "view") {
              this.getNcdScreeningDataForCbac();
              this.markAsUnSuspectedOnLoad(this.visualExaminationSuspected);
            }
          } else {
            console.log("Issue in fetching cervical cancer masters");
          }
        }
      });
  }
  getNcdScreeningDataForCbac() {
    if (
      this.doctorService.screeningDetailsResponseFromNurse !== null &&
      this.doctorService.screeningDetailsResponseFromNurse !== undefined &&
      this.doctorService.screeningDetailsResponseFromNurse.cervical !== null &&
      this.doctorService.screeningDetailsResponseFromNurse.cervical !==
        undefined
    ) {
      this.hideRemoveFunctionalityInDoctorIfSuspected = true;
      let ncdCervicalData = Object.assign(
        this.doctorService.screeningDetailsResponseFromNurse.cervical
      );
      ncdCervicalData.suspected === true ? this.visualExaminationSuspected = true : this.visualExaminationSuspected = false;
      this.ncdScreeningService.cervicalSuspectStatus(
        this.visualExaminationSuspected
      );
      this.cervicalScreeningForm.patchValue(ncdCervicalData);
    }
  }
  checkCervicalCancerSuspect() {
    if (
      this.visualExaminationId !== undefined &&
      this.visualExaminationId !== null
    ) {
      this.visualExaminations.filter((cervical) => {
        if (cervical.id === this.visualExaminationId) {
          this.cervicalScreeningForm.controls[
            "visualExaminationVIA"
          ].patchValue(cervical.name);
        }
      });
      this.ncdScreeningService.screeningValueChanged(true); // observable used to enable the update button.
      if (
        this.cervicalScreeningForm.controls["visualExaminationVIA"].value !==
          undefined &&
        this.cervicalScreeningForm.controls["visualExaminationVIA"].value !==
          null &&
        this.cervicalScreeningForm.controls[
          "visualExaminationVIA"
        ].value.toLowerCase() !== "negative"
      ) {
        (this.ncdScreeningService.isCervicalConfirmed !== true) ? this.visualExaminationSuspected = true : this.visualExaminationSuspected = false;
        this.attendant === "nurse" || this.attendant === "doctor" ? (this.disableCheckbox = false) : null;
        this.checkIsCervicalSuspected = this.visualExaminationSuspected;
      } else {
        this.visualExaminationSuspected = false;
      }
    }
    this.ncdScreeningService.cervicalSuspectStatus(
      this.visualExaminationSuspected
    );
    this.cervicalScreeningForm.patchValue({
      suspected: this.visualExaminationSuspected === false ? false : true,
    });
  }

  hideCervicalScreeningForm() {
    this.confirmationService
      .confirm(`warn`, this.currentLanguageSet.alerts.info.warn)
      .subscribe((result) => {
        if (result) {
          this.hideCervicalForm = true;
          this.cervicalFormStatus.emit(false);
          this.cervicalScreeningForm.reset();
          this.ncdScreeningService.cervicalSuspectStatus(false);
          if (this.mode == 'view' || this.mode == 'update')
          this.ncdScreeningService.screeningValueChanged(true);
        } else {
          this.hideCervicalForm = false;
        }
      });
  }
  markAsUnsuspected(checkedValue) {
    if (!checkedValue) {
      this.cervicalScreeningForm.patchValue({ suspected: false });
      this.visualExaminationSuspected = false;
      this.cervicalScreeningForm.markAsDirty();
      this.ncdScreeningService.cervicalSuspectStatus(false); // remove badge
      this.ncdScreeningService.screeningValueChanged(true);
    } else {
      this.cervicalScreeningForm.patchValue({ suspected: true });
      this.visualExaminationSuspected = true;
      this.cervicalScreeningForm.markAsDirty();
      this.ncdScreeningService.cervicalSuspectStatus(true); // enable badge
      this.ncdScreeningService.screeningValueChanged(true);
    }
    this.checkIsCervicalSuspected = checkedValue;
  }

  markAsUnSuspectedOnLoad(checkedValue) {
    if (!checkedValue) {
      this.cervicalScreeningForm.patchValue({ suspected: false });
      this.visualExaminationSuspected = false;
      this.ncdScreeningService.cervicalSuspectStatus(false); // remove badge
      this.ncdScreeningService.screeningValueChanged(true);
    } else {
      this.cervicalScreeningForm.patchValue({ suspected: true });
      this.visualExaminationSuspected = true;
      this.ncdScreeningService.cervicalSuspectStatus(true); // enable badge
      this.ncdScreeningService.screeningValueChanged(true);
    }
    this.checkIsCervicalSuspected = checkedValue;
  }


  ngOnDestroy() {
    if (this.nurseMasterDataSubscription) {
      this.nurseMasterDataSubscription.unsubscribe();
    }
    if (this.confirmedDiseasesListSubscription)
      this.confirmedDiseasesListSubscription.unsubscribe();
    this.cervicalScreeningForm.reset();
  }
}
