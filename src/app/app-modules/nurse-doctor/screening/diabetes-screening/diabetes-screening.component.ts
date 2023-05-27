import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormGroup
} from "@angular/forms";
import { MdDialog } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { IotcomponentComponent } from "app/app-modules/core/components/iotcomponent/iotcomponent.component";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { ConfirmationService } from "app/app-modules/core/services/confirmation.service";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { environment } from "environments/environment";
import { Subscription } from "rxjs/Subscription";
import {
  DoctorService,
  MasterdataService,
  NurseService,
} from "../../shared/services";
import { NcdScreeningService } from "../../shared/services/ncd-screening.service";

@Component({
  selector: "app-diabetes-screening",
  templateUrl: "./diabetes-screening.component.html",
  styleUrls: ["./diabetes-screening.component.css"],
})
export class DiabetesScreeningComponent implements OnInit {
  @Input("diabetesScreeningForm")
  diabetesScreeningForm: FormGroup;

  @Input("ncdScreeningMode")
  mode: String;

  @Input("confirmDiseasesList")
  confirmDiseasesList: any[];

  interpretation: string;
  isDiabetesSuspected: boolean = false;  // This value is to mark the diabetes as suspected or not susoected case
  hideForm: boolean = false;

  bloodGlucoseSampleTypes = [];
  currentLanguageSet: any;
  nurseMasterDataSubscription: Subscription;
  startRBSTest = environment.startRBSurl;
  confirmDiseaseArray = [];
  disableFindStatuButton: boolean = true;
  hideStatusButton: boolean = false;

  @Output() diabetesFormStatus = new EventEmitter<boolean>();
  confirmedDiseasesListSubscription: Subscription;
  hideRemoveFunctionalityInDoctorIfSuspected: boolean = false;
  disableCheckbox: boolean = false;
  attendant: string;

  constructor(
    private httpServiceService: HttpServiceService,
    private masterdataService: MasterdataService,
    private confirmationService: ConfirmationService,
    private ncdScreeningService: NcdScreeningService,
    private nurseService: NurseService,
    private dialog: MdDialog,
    private doctorService: DoctorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.ncdScreeningService.setScreeningDataFetch(false);
    this.getNurseMasterData();
    this.attendant = this.route.snapshot.params["attendant"];
    this.disableFindStatuButton = true;
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
            this.setConfirmedDiseasesForScreening();
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
      this.getNcdScreeningDataForCbac();
      this.disableFindStatuButton = true;
    }
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  checkingDiabeticStatus() {
    if (this.bloodGlucose !== undefined && this.bloodGlucose !== null && this.bloodGlucose < 10){
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.recheckValue, "info");
      this.diabetesScreeningForm.get("bloodGlucose").reset();
      this.disableFindStatuButton = true;
    } else {
    if (
      this.bloodGlucoseSampleTypes !== undefined &&
      this.bloodGlucoseSampleTypes !== null &&
      this.bloodGlucose !== undefined &&
      this.bloodGlucose !== null
    ) {
      this.bloodGlucose >= 10 && this.bloodGlucose <= 600 ? this.disableFindStatuButton = false : this.disableFindStatuButton = true;
    } else {
      this.disableFindStatuButton = true;
      this.interpretation = null;
      this.isDiabetesSuspected = false;
      this.ncdScreeningService.diabetesSuspectStatus(false);
    }
    this.ncdScreeningService.screeningValueChanged(true); // observable used to enable the update button.
  }
  }

  setConfirmedDiseasesForScreening() {
    if (this.confirmDiseaseArray.length > 0) {
      if (this.confirmDiseaseArray.includes(environment.diabetes)) {
        this.diabetesScreeningForm.disable();
        this.hideStatusButton = true;
        this.diabetesScreeningForm.patchValue({
          suspected: null,
          formDisable: true,
        });
        // this.ncdScreeningService.diabetesSuspectStatus(false);
        this.disableCheckbox = true;
      } else {
        this.ncdScreeningService.isDiabetesConfirmed = null;
        this.resetDiabetesForm();
        this.disableCheckbox = false;
      }
    } else {
      this.resetDiabetesForm();
      // On nurse initial load, checkbox should be disabled and enable the checkbox if the diabetes is suspected.
     ((this.attendant === "nurse" || this.attendant === "doctor") && this.isDiabetesSuspected === true) ? (this.disableCheckbox = false) : this.disableCheckbox = true;
    }
    // on selection of "No" on final diagnosis, If diabetes already suspected, enable the badge
    if (this.isDiabetesSuspected === true) {
      this.ncdScreeningService.diabetesSuspectStatus(this.isDiabetesSuspected);
    }
  }
  resetDiabetesForm() {
    this.diabetesScreeningForm.enable();
    this.diabetesScreeningForm.patchValue({ formDisable: null });
    this.hideStatusButton = false;
    this.attendant === "nurse" ? (this.disableCheckbox = true) : null;
  }
  getNurseMasterData() {
    this.nurseMasterDataSubscription =
      this.masterdataService.nurseMasterData$.subscribe((data) => {
        if (data) {
          if (
            data.bloodGlucoseType !== undefined &&
            data.bloodGlucoseType !== null
          ) {
            this.bloodGlucoseSampleTypes = data.bloodGlucoseType;
            //making random value as a default 
            data.bloodGlucoseType.filter(item => {
              if(
                item.name !== undefined &&
                item.name !== null &&
                item.name.toLowerCase() === "random")
              {
                this.diabetesScreeningForm.patchValue({ bloodGlucoseTypeID: item.id });
              }
            });
            if (this.mode == "view") {
              this.getNcdScreeningDataForCbac();
              this.markAsUnSuspectedOnLoad(this.isDiabetesSuspected);
              this.disableFindStatuButton = true;
            }
          }
        } else {
          console.log("Issue in fetching blood glucose masters");
        }
      });
  }
  get bloodGlucoseTypeID() {
    return this.diabetesScreeningForm.controls["bloodGlucoseTypeID"].value;
  }
  get bloodGlucose() {
    return this.diabetesScreeningForm.controls["bloodGlucose"].value;
  }
  getDiabetes() {
    if (
      this.bloodGlucoseTypeID !== undefined &&
      this.bloodGlucoseTypeID !== null &&
      this.bloodGlucose !== undefined &&
      this.bloodGlucose !== null &&
      this.bloodGlucose !== ""
    ) {
      this.bloodGlucoseSampleTypes.filter((sampleType) => {
        if (sampleType.id === this.bloodGlucoseTypeID) {
          this.diabetesScreeningForm.controls["bloodGlucoseType"].patchValue(
            sampleType.name
          );
        }
      });
      const diabaticStatus = {
        bloodGlucoseTypeID: this.bloodGlucoseTypeID,
        bloodGlucoseType: this.diabetesScreeningForm.controls[
          "bloodGlucoseType"
        ].value
          ? this.diabetesScreeningForm.controls["bloodGlucoseType"].value
          : null,
        bloodGlucose: this.bloodGlucose,
      };

      this.nurseService.getDiabetesStatus(diabaticStatus).subscribe((res) => {
        if (res && res.statusCode === 200) {
          this.interpretation = res.data.status;
          if ( this.interpretation!== undefined && this.interpretation !== null &&
            this.interpretation.toLowerCase() !== "non-diabetic range" &&
            this.interpretation.toLowerCase() !== "normal/non-diabetic range" && this.interpretation.toLowerCase() !== "pre-diabetic range"
          ) {
            this.ncdScreeningService.isDiabetesConfirmed !== true ? this.isDiabetesSuspected = true : this.isDiabetesSuspected = null;
            this.attendant === "nurse" || this.attendant === "doctor" ? (this.disableCheckbox = false) : null;
            this.ncdScreeningService.diabetesSuspectStatus(
              this.isDiabetesSuspected
            );
            this.diabetesScreeningForm.patchValue({
              suspected: this.isDiabetesSuspected,
            });
          } else {
            this.isDiabetesSuspected = false;
            this.ncdScreeningService.diabetesSuspectStatus(
              this.isDiabetesSuspected
            );
            this.diabetesScreeningForm.patchValue({
              suspected: this.isDiabetesSuspected === false ? false : true,
            });
            this.disableFindStatuButton = true;
          }
        } else {
          this.confirmationService.alert(
            this.currentLanguageSet.issueFetchingDiabetesStatus,
            "error"
          );
        }
      });
    }
  }

  screeningDataSubscription: any;
  getNcdScreeningDataForCbac() {
    if (
      this.doctorService.screeningDetailsResponseFromNurse !== null &&
      this.doctorService.screeningDetailsResponseFromNurse !== undefined &&
      this.doctorService.screeningDetailsResponseFromNurse.diabetes !== null &&
      this.doctorService.screeningDetailsResponseFromNurse.diabetes !==
        undefined
    ) {
      this.hideRemoveFunctionalityInDoctorIfSuspected = true;
      let ncdDiabetesData = Object.assign(
        this.doctorService.screeningDetailsResponseFromNurse.diabetes
      );
      if (ncdDiabetesData !== null && ncdDiabetesData !== undefined) {
        ncdDiabetesData.suspected === true ? this.isDiabetesSuspected = true : this.isDiabetesSuspected = false;
        this.ncdScreeningService.diabetesSuspectStatus(this.isDiabetesSuspected);
        this.diabetesScreeningForm.patchValue(ncdDiabetesData);
      //   let boodGlucoseId = null;
      //   boodGlucoseId = this.bloodGlucoseSampleTypes.filter((item) => {
      //     if (item.name === ncdDiabetesData.bloodGlucoseType) return item;
      //   });

      //   this.diabetesScreeningForm.patchValue({
      //     bloodGlucoseTypeID: boodGlucoseId[0] ? boodGlucoseId[0].id : null,
      //   });
      }
      // if (this.interpretation === undefined || this.interpretation === null) {
      //   this.getDiabetes();
      // }

    }
  }

  openIOTRBSModel() {
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      width: "600px",
      height: "180px",
      disableClose: true,
      data: { startAPI: this.startRBSTest },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        this.diabetesScreeningForm.patchValue({
          testValue: result["result"],
        });
      }
    });
  }

  hideDiabetesForm() {
    this.confirmationService
      .confirm(`warn`, this.currentLanguageSet.alerts.info.warn)
      .subscribe((result) => {
        if (result) {
          this.hideForm = true;
          this.diabetesFormStatus.emit(false);
          this.diabetesScreeningForm.reset();
          this.ncdScreeningService.diabetesSuspectStatus(false);
          if (this.mode == 'view' || this.mode == 'update')
          this.ncdScreeningService.screeningValueChanged(true);
        } else {
          this.hideForm = false;
        }
      });
  }
  resetDiabeticValues() {
    this.diabetesScreeningForm.controls["bloodGlucose"].patchValue(null);
    this.isDiabetesSuspected = false;
    this.ncdScreeningService.diabetesSuspectStatus(this.isDiabetesSuspected);
    this.interpretation = null;
    this.disableFindStatuButton = true;
  }
  markAsUnsuspected(checkedValue) {
    if (!checkedValue) {
      this.diabetesScreeningForm.patchValue({ suspected: false });
      this.isDiabetesSuspected = false;
      this.diabetesScreeningForm.markAsDirty();
      this.ncdScreeningService.diabetesSuspectStatus(false); // remove badge
      this.ncdScreeningService.screeningValueChanged(true); // observable used to enable the update button.
    } else {
      this.diabetesScreeningForm.patchValue({ suspected: true });
      this.isDiabetesSuspected = true;
      this.diabetesScreeningForm.markAsDirty();
      this.ncdScreeningService.diabetesSuspectStatus(true); // enable badge
      this.ncdScreeningService.screeningValueChanged(true);
    }
  }

  markAsUnSuspectedOnLoad(checkedValue) {
    if (!checkedValue) {
      this.diabetesScreeningForm.patchValue({ suspected: false });
      this.isDiabetesSuspected = false;
      this.ncdScreeningService.diabetesSuspectStatus(false); // remove badge
      this.ncdScreeningService.screeningValueChanged(true); // observable used to enable the update button.
    } else {
      this.diabetesScreeningForm.patchValue({ suspected: true });
      this.isDiabetesSuspected = true;
      this.ncdScreeningService.diabetesSuspectStatus(true); // enable badge
      this.ncdScreeningService.screeningValueChanged(true);
    }
  }
  ngOnDestroy() {
    if (this.nurseMasterDataSubscription) {
      this.nurseMasterDataSubscription.unsubscribe();
    }
    if (this.screeningDataSubscription) {
      this.screeningDataSubscription.unsubscribe();
    }
    if (this.confirmedDiseasesListSubscription)
      this.confirmedDiseasesListSubscription.unsubscribe();
    this.diabetesScreeningForm.reset();
  }
}
