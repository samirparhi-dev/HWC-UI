import { Component, OnInit, Input, DoCheck, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";

import { MasterdataService, DoctorService } from "../../../shared/services";
import { BeneficiaryDetailsService } from "../../../../core/services/beneficiary-details.service";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";

@Component({
  selector: "general-immunization-history",
  templateUrl: "./immunization-history.component.html",
  styleUrls: ["./immunization-history.component.css"],
})
export class ImmunizationHistoryComponent implements OnInit, DoCheck, OnDestroy {
  @Input("immunizationHistory")
  immunizationHistoryForm: any;

  @Input("mode")
  mode: string;

  @Input("visitCategory")
  visitType: any;

  masterData: any;
  temp: any;
  beneficiaryAge: any;
  currentLanguageSet: any;

  constructor(
    private fb: FormBuilder,
    private masterdataService: MasterdataService,
    private doctorService: DoctorService,
    public httpServiceService: HttpServiceService,
    private beneficiaryDetailsService: BeneficiaryDetailsService
  ) {}
/**Modified by JA354063 */
/** Code optimization required */
  ngOnInit() {
    this.assignSelectedLanguage();
    this.getMasterData();
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription =
      this.masterdataService.nurseMasterData$.subscribe((masterData) => {
        if (masterData && masterData.childVaccinations) {
          // this.nurseMasterDataSubscription.unsubscribe();
          this.masterData = masterData;
          this.getBeneficiaryDetails();
          this.filterImmunizationList(masterData.childVaccinations);
        }
      });
  }
  beneficiaryDetailSubscription: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription =
      this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(
        (beneficiary) => {
          if (
            beneficiary !== null &&
            beneficiary.age !== undefined &&
            beneficiary.age !== null
          ) {
            let calculateAgeInYears = beneficiary.age.split("-")[0].trim();
            let calculateAgeInMonths = beneficiary.age.split("-")[1]
              ? beneficiary.age.split("-")[1].trim()
              : "";
            if (calculateAgeInMonths !== "0 months") {
              let ageInYear = this.getAgeValue(calculateAgeInYears);
              let ageInMonth = this.getAgeValue(calculateAgeInMonths);
              this.beneficiaryAge = ageInYear + ageInMonth + " days";
            } else {
              this.beneficiaryAge = beneficiary.age.split("-")[0].trim();
            }
          }
        }
      );
  }

  filterImmunizationList(list) {
    let immunizationAge = [];
    let temp = [];

    list.forEach((element) => {
      if (
        immunizationAge.indexOf(element.vaccinationTime) < 0 &&
        (this.getAgeValue(element.vaccinationTime) <=
          this.getAgeValue(this.beneficiaryAge)) && (element.vaccinationTime.trim().toLowerCase() !== '9-12 months' && element.vaccinationTime.trim().toLowerCase() !== '5-6 years')
      )
      
        immunizationAge.push(element.vaccinationTime);
    });

    immunizationAge.sort((prev, next) => {
      return this.getAgeValue(prev) - this.getAgeValue(next);
    });

    immunizationAge.forEach((item) => {
      let vaccines = [];
      list.forEach((element) => {
        if (element.vaccinationTime == item) {
          if (element.sctCode != null) {
            vaccines.push({
              vaccine: element.vaccineName,
              sctCode: element.sctCode,
              sctTerm: element.sctTerm,
              status: false,
              hide: false,
            });
          } else {
            vaccines.push({
              vaccine: element.vaccineName,
              sctCode: null,
              sctTerm: null,
              status: false,
              hide: false,
            });
          }
        }
      });

      vaccines.forEach((value) => {
        if (
          value.vaccine.toLowerCase() == "fipv-2" ||
          value.vaccine.toLowerCase() == "pentavalent-2" ||
          value.vaccine.toLowerCase() == "rota vaccine-2" ||
          value.vaccine.toLowerCase() == "opv-2" ||
          value.vaccine.toLowerCase() == "pcv2" ||
          value.vaccine.toLowerCase() == "pentavalent-3" ||
          value.vaccine.toLowerCase() == "rota vaccine-3" ||
          value.vaccine.toLowerCase() == "opv-3"
        ) {
          value.hide = true;
        }
        if (
          (value.vaccine.toLowerCase() === "bcg" ||
            value.vaccine.toLowerCase() === "pentavalent-1" ||
            value.vaccine.toLowerCase() === "rota vaccine-1") &&
          this.getAgeValue(this.beneficiaryAge) > 360
        ) {
          value.hide = true;
        }
        if (
          (value.vaccine.toLowerCase() === "opv-0" &&
            this.getAgeValue(this.beneficiaryAge) > 14) ||
          (value.vaccine.toLowerCase() === "hbv-0" &&
            this.getAgeValue(this.beneficiaryAge) > 2)
        ) {
          value.hide = true;
        }
      });
      let count: number = 0;
      vaccines.forEach((vaccineStatus) => {
        if (vaccineStatus.hide === true) {
          count = count + 1;
        }
      });
      if (count === vaccines.length) {
        temp.push({
          defaultReceivingAge: item,
          vaccines: vaccines,
          hideSelectAll: true,
        });
      } else {
        temp.push({
          defaultReceivingAge: item,
          vaccines: vaccines,
          hideSelectAll: false,
        });
      }
    });

    this.temp = temp;
    this.initImmunizationForm();
  }
  getAgeValue(age) {
    if (!age) return 0;
    let arr = age !== undefined && age !== null ? age.trim().split(" ") : age;
    if (arr[1]) {
      let ageUnit = arr[1];
      if (ageUnit.toLowerCase() == "years") return parseInt(arr[0]) * 12 * 30;
      else if (ageUnit.toLowerCase() == "months") return parseInt(arr[0]) * 30;
      else if (ageUnit.toLowerCase() == "weeks") return parseInt(arr[0]) * 7;
      else if (ageUnit.toLowerCase() === "days") return parseInt(arr[0]);
    }
    return 0;
  }
  initImmunizationForm() {
    for (let i = 0; i < this.temp.length; i++) {
      this.addImmunization();
      for (let j = 0; j < this.temp[i].vaccines.length; j++) this.addVaccine(i);
    }
    (<FormArray>(
      this.immunizationHistoryForm.controls["immunizationList"]
    )).patchValue(this.temp);

    if (this.mode == "view") {
      this.loadVaccineData();
    }
    if (parseInt(localStorage.getItem("specialistFlag")) == 100) {
      this.loadVaccineData();
    }
  }
  addVaccine(i) {
    let immunizationList = <FormArray>(
      this.immunizationHistoryForm.controls["immunizationList"]
    );
    let vaccineList = (<FormArray>immunizationList.controls[i]).controls[
      "vaccines"
    ];
    vaccineList.push(this.initVaccineList());
  }

  addImmunization() {
    let immunizationList = <FormArray>(
      this.immunizationHistoryForm.controls["immunizationList"]
    );
    immunizationList.push(this.initImmunizationList());
  }
  initImmunizationList() {
    return this.fb.group({
      defaultReceivingAge: null,
      hideSelectAll: null,
      vaccines: this.fb.array([]),
    });
  }

  initVaccineList() {
    return this.fb.group({
      vaccine: null,
      sctCode: null,
      sctTerm: null,
      status: null,
      hide: null,
    });
  }
  count: any;
  immunizationHistorySubscription: any;
  loadVaccineData() {
    this.immunizationHistorySubscription = this.doctorService
      .populateHistoryResponse$
      .subscribe((history) => {
        if (
          history != null &&
          history.statusCode == 200 &&
          history.data != null &&
          history.data.ImmunizationHistory &&
          history.data.ImmunizationHistory.immunizationList
        ) {
          let temp = history.data.ImmunizationHistory;
          (<FormArray>(
            this.immunizationHistoryForm.controls["immunizationList"]
          )).patchValue(temp.immunizationList);
          let immunizationList = <FormArray>(
            this.immunizationHistoryForm.controls["immunizationList"]
          );
          let vaccineArray = null;
          for (var j = 0; j < immunizationList.length; j++) {
            let ageFormGroup = <FormGroup>immunizationList.controls[j];
            vaccineArray = ageFormGroup.controls["vaccines"];
            for (let i = 0; i < vaccineArray.length; i++) {
              let vaccineGroup = <FormGroup>vaccineArray.controls[i];
              if (
                vaccineGroup != undefined &&
                vaccineGroup.controls["vaccine"] != undefined &&
                vaccineGroup.controls["vaccine"] != null &&
                vaccineGroup.controls["status"].value === true
              ) {
                vaccineGroup.patchValue({ hide: false });
              }
              this.onVaccineCheck(vaccineGroup);
            }
          }
        }
      });
  }

  selectAll(value, i) {
    let immunizationList = <FormArray>(
      this.immunizationHistoryForm.controls["immunizationList"]
    );
    let vaccineList = (<FormArray>immunizationList.controls[i]).controls[
      "vaccines"
    ];
    immunizationList.markAsDirty();

    if (value) {
      vaccineList.controls.forEach((vaccine: FormGroup) => {
        if (vaccine.controls["hide"].value !== true) {
          vaccine.patchValue({ status: true });
        }
        this.onVaccineCheck(vaccine);
      });
    } else {
      vaccineList.controls.forEach((vaccine: FormGroup) => {
        vaccine.patchValue({ status: false });
        this.onVaccineCheck(vaccine);
      });
    }
  }

  onVaccineCheck(vaccine) {
    //fipv-1
    if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "fipv-1" &&
      vaccine.controls["status"].value == true
    ) {
      this.makeVaccineHideShow("14 weeks", "fipv-2", false);
    } else if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "fipv-1" &&
      vaccine.controls["status"].value == false
    ) {
      this.makeVaccineHideShow("14 weeks", "fipv-2", true);
    }

    //Pentavalent-1
    if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "pentavalent-1" &&
      vaccine.controls["status"].value == true
    ) {
      this.makeVaccineHideShow("10 weeks", "pentavalent-2", false);
    } else if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "pentavalent-1" &&
      vaccine.controls["status"].value == false
    ) {
      this.makeVaccineHideShow("10 weeks", "pentavalent-2", true);
      this.makeVaccineHideShow("14 weeks", "pentavalent-3", true);
    }

    //Pentavalent-2
    if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "pentavalent-2" &&
      vaccine.controls["status"].value == true
    ) {
      this.makeVaccineHideShow("14 weeks", "pentavalent-3", false);
    } else if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "pentavalent-2" &&
      vaccine.controls["status"].value == false
    ) {
      this.makeVaccineHideShow("14 weeks", "pentavalent-3", true);
    }
    //Rota vaccine 1
    if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "rota vaccine-1" &&
      vaccine.controls["status"].value == true
    ) {
      this.makeVaccineHideShow("10 weeks", "rota vaccine-2", false);
    } else if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "rota vaccine-1" &&
      vaccine.controls["status"].value == false
    ) {
      this.makeVaccineHideShow("10 weeks", "rota vaccine-2", true);
      this.makeVaccineHideShow("14 weeks", "rota vaccine-3", true);
    }

    //Rota vaccine 2
    if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "rota vaccine-2" &&
      vaccine.controls["status"].value == true
    ) {
      this.makeVaccineHideShow("14 weeks", "rota vaccine-3", false);
    } else if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "rota vaccine-2" &&
      vaccine.controls["status"].value == false
    ) {
      this.makeVaccineHideShow("14 weeks", "rota vaccine-3", true);
    }
    //OPV 1
    if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "opv-1" &&
      vaccine.controls["status"].value == true
    ) {
      this.makeVaccineHideShow("10 weeks", "opv-2", false);
    } else if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "opv-1" &&
      vaccine.controls["status"].value == false
    ) {
      this.makeVaccineHideShow("10 weeks", "opv-2", true);
      this.makeVaccineHideShow("14 weeks", "opv-3", true);
    }

    //OPV 2
    if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "opv-2" &&
      vaccine.controls["status"].value == true
    ) {
      this.makeVaccineHideShow("14 weeks", "opv-3", false);
    } else if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "opv-2" &&
      vaccine.controls["status"].value == false
    ) {
      this.makeVaccineHideShow("14 weeks", "opv-3", true);
    }

    //PCV 1
    if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "pcv1" &&
      vaccine.controls["status"].value == true
    ) {
      this.makeVaccineHideShow("14 weeks", "pcv2", false);
    } else if (
      vaccine != undefined &&
      vaccine.controls["vaccine"] != undefined &&
      vaccine.controls["vaccine"] != null &&
      vaccine.controls["vaccine"].value.toLowerCase() == "pcv1" &&
      vaccine.controls["status"].value == false
    ) {
      this.makeVaccineHideShow("14 weeks", "pcv2", true);
    }
  }

  // Hide and show the vaccines based on the status of the first dosage of the particular vaccine.
  makeVaccineHideShow(vaccineReceivingAge, vaccineName, hideValue) {
    let immunizationList = <FormArray>(
      this.immunizationHistoryForm.controls["immunizationList"]
    );
    let vaccineArray = null;
    let enableSelectAll = null;
    let count = 0;

    if (immunizationList != undefined && immunizationList.length > 0) {
      immunizationList.controls.forEach((element, j) => {
        let ageFormGroup = <FormGroup>immunizationList.controls[j];
        if (
          ageFormGroup != undefined &&
          ageFormGroup.controls["defaultReceivingAge"].value &&
          ageFormGroup.controls["defaultReceivingAge"].value.toLowerCase() ==
            vaccineReceivingAge
        ) {
          vaccineArray = ageFormGroup.controls["vaccines"];
          enableSelectAll = j;
        }
      });
    }
    if (vaccineArray != undefined && vaccineArray.length > 0) {
      vaccineArray.controls.forEach((value, i) => {
        let vaccineGroup = <FormGroup>vaccineArray.controls[i];
        if (
          vaccineGroup != undefined &&
          vaccineGroup.controls["vaccine"] != undefined &&
          vaccineGroup.controls["vaccine"] != null &&
          vaccineGroup.controls["vaccine"].value.toLowerCase() == vaccineName
        ) {
          vaccineGroup.patchValue({ hide: hideValue });
          immunizationList.controls[enableSelectAll].patchValue({
            hideSelectAll: false,
          });
          if (hideValue === true) {
            vaccineGroup.patchValue({ status: false });
          }
        }
      });
      vaccineArray.controls.forEach((checkHideStatus) => {
        if (checkHideStatus.controls["hide"].value === true) {
          count = count + 1;
        }
      });
      if (count === vaccineArray.length) {
        immunizationList.controls[enableSelectAll].patchValue({
          hideSelectAll: true,
        });
      }
    }
  }
  // select ALL should enable if all the vaccines selected
  checkSelectALLValue(ageGroup) {
    let immunizationList = <FormArray>(
      this.immunizationHistoryForm.controls["immunizationList"]
    );

    let vaccineArray = null;

    let flag = true;

    if (immunizationList != undefined && immunizationList.length > 0) {
      immunizationList.controls.forEach((element, j) => {
        let ageFormGroup = <FormGroup>immunizationList.controls[j];

        if (
          ageFormGroup != undefined &&
          ageFormGroup.controls["defaultReceivingAge"].value &&
          ageFormGroup.controls["defaultReceivingAge"].value.toLowerCase() ==
            ageGroup.toLowerCase()
        ) {
          vaccineArray = ageFormGroup.controls["vaccines"];

          vaccineArray.controls.forEach((value, i) => {
            let vaccineGroup = <FormGroup>vaccineArray.controls[i];

            if (
              vaccineGroup != undefined &&
              vaccineGroup.controls["vaccine"] != undefined &&
              vaccineGroup.controls["vaccine"] != null &&
              vaccineGroup.controls["hide"].value != true &&
              vaccineGroup.controls["status"].value === false
            ) {
              flag = false;
            }
          });
        }
      });

      return flag;
    }
  }
  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();
  }
}