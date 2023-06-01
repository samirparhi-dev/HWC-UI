import { Component, OnInit, Input, DoCheck } from "@angular/core";
import { FormGroup } from "@angular/forms";

import { BeneficiaryDetailsService } from "../../../../core/services/beneficiary-details.service";
import {
  MasterdataService,
  NurseService,
  DoctorService,
} from "../../../shared/services";
import { PreviousDetailsComponent } from "../../../../core/components/previous-details/previous-details.component";
import { MdDialog } from "@angular/material";
import { ConfirmationService } from "../../../../core/services/confirmation.service";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";

@Component({
  selector: "general-feeding-history",
  templateUrl: "./feeding-history.component.html",
  styleUrls: ["./feeding-history.component.css"],
})
export class FeedingHistoryComponent implements OnInit, DoCheck {
  @Input("feedingHistory")
  feedingHistoryForm: FormGroup;

  @Input("visitCategory")
  visitType: any;

  @Input("mode")
  mode: string;

  masterData: any;
  age = 0;
  currentLanguageSet: any;
  foodIntoleranceTypes = [];
  enableOthersTextField: boolean = false;

  constructor(
    private masterdataService: MasterdataService,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private dialog: MdDialog,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getMasterData();
    this.getBeneficiaryDetails();
  }

  ngOnChanges() {}

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();

    if (this.generalHistorySubscription)
      this.generalHistorySubscription.unsubscribe();
  }

  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription =
      this.masterdataService.nurseMasterData$.subscribe((masterData) => {
        if (masterData) {
          // this.nurseMasterDataSubscription.unsubscribe();
          this.masterData = masterData;
          if (this.mode == "view") {
            this.getGeneralHistory();
          }
          if (parseInt(localStorage.getItem("specialistFlag")) == 100) {
            this.getGeneralHistory();
          }
        }
      });
  }

  feedingHistoryData: any;
  generalHistorySubscription: any;
  getGeneralHistory() {
    this.generalHistorySubscription = this.doctorService.
    populateHistoryResponse$
      .subscribe((history) => {
        if (
          history != null &&
          history.statusCode == 200 &&
          history.data != null &&
          history.data.FeedingHistory
        ) {
          this.feedingHistoryData = history.data.FeedingHistory;
          if (this.feedingHistoryData) {
            this.masterFoodIntolerance();
            this.feedingHistoryForm.patchValue(this.feedingHistoryData);
            this.checkForOthersOption(this.feedingHistoryForm.controls.typeOfFoodIntolerances.value)
          }
        }
      });
  }

  beneficiaryDetailSubscription: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription =
      this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(
        (beneficairy) => {
          if (
            beneficairy &&
            beneficairy.age !== undefined &&
            beneficairy.age !== null
          ) {
            let temp = beneficairy.age.split("-");
            if (temp[0].indexOf("years") >= 0) {
              let years = +temp[0]
                .substring(0, temp[0].indexOf("years"))
                .trim();
              let months = +temp[1]
                .substring(0, temp[1].indexOf("months"))
                .trim();
              this.age = years * 12 + months;
            } else if (temp[0].indexOf("months") >= 0) {
              let months = +temp[0]
                .substring(0, temp[0].indexOf("months"))
                .trim();
              this.age = months;
            }
          }
        }
      );
  }

  getPreviousFeedingHistory() {
    let benRegID = localStorage.getItem("beneficiaryRegID");
    this.nurseService
      .getPreviousFeedingHistory(benRegID, this.visitType)
      .subscribe(
        (data) => {
          if (data != null && data.data != null) {
            if (data.data.data.length > 0) {
              this.viewPreviousData(data.data);
            } else {
              this.confirmationService.alert(
                this.currentLanguageSet.historyData.ancHistory
                  .previousHistoryDetails.pastHistoryalert
              );
            }
          } else {
            this.confirmationService.alert(
              this.currentLanguageSet.alerts.info.errorFetchingHistory,
              "error"
            );
          }
        },
        (err) => {
          this.confirmationService.alert(
            this.currentLanguageSet.alerts.info.errorFetchingHistory,
            "error"
          );
        }
      );
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title: this.currentLanguageSet.historyData.Perinatalhistorydetails.previousFeedingHistoryDetails }
    });
  }

  get compFeedStartAge() {
    return this.feedingHistoryForm.controls["compFeedStartAge"].value;
  }

  get foodIntoleranceStatus() {
    return this.feedingHistoryForm.controls["foodIntoleranceStatus"].value;
  }

  resetNoOfCompFeedPerDay() {
    this.feedingHistoryForm.patchValue({ noOfCompFeedPerDay: null });
  }

  resetTypeofFoodIntolerance() {
    this.feedingHistoryForm.patchValue({
      typeOfFoodIntolerances: null,
      otherFoodIntolerance: null,
    });
    this.enableOthersTextField = false;
    this.masterFoodIntolerance();
  }
  masterFoodIntolerance() {
    if (this.masterData !== undefined && this.masterData.foodIntoleranceStatus !== undefined ) {
      this.foodIntoleranceTypes = this.masterData.foodIntoleranceStatus
    }
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  checkForOthersOption(selectedFoodTntolerance) {
    if (selectedFoodTntolerance !== undefined && selectedFoodTntolerance !== null && 
      selectedFoodTntolerance.includes("Others")) {
      this.enableOthersTextField = true;
    }
    else {
      this.enableOthersTextField = false;
      this.feedingHistoryForm.patchValue({ otherFoodIntolerance: null });
    }

  }
}