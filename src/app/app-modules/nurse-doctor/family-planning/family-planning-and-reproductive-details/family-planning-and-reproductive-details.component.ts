import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { ConfirmationService } from "app/app-modules/core/services/confirmation.service";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { RegistrarService } from "app/app-modules/registrar/shared/services/registrar.service";
import { MasterdataService } from "../../shared/services/masterdata.service";
import { DoctorService } from "../../shared/services";
import { BeneficiaryDetailsService } from "app/app-modules/core/services/beneficiary-details.service";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-family-planning-and-reproductive-details",
  templateUrl: "./family-planning-and-reproductive-details.component.html",
  styleUrls: ["./family-planning-and-reproductive-details.component.css"],
})
export class FamilyPlanningAndReproductiveComponent implements OnInit {
  @Input("familyPlanningAndReproductiveForm")
  familyPlanningAndReproductiveForm: FormGroup;

  @Input("familyPlanningMode")
  familyPlanningMode: String;

  @Input("visitCategory")
  visitCategory: String;

  current_language_set: any;

  today = new Date();
  maxEndDate = new Date();
  countryId = 1;
  ageUnitMaster: any;
  unitOfAges = [];
  genderMaster: any;
  youngestChildGenMasters = [];
  currentlyFPMethod = [];
  enableDoseFields: boolean = false;
  enablecurrentlyUsingFPOther: boolean = false;
  enableSterilizationFields: boolean = false;
  disableCurrentlyUsingFPNone: boolean = null;
  fertilityStatusOption = [];
  enableDispensationDetailsForm: boolean = false;
  ageUnitMasterData = [];
  genderMasterData = [];
  beneficiary: any;
  beneficiaryDetailsSubscription: any;
  beneficiaryAge: number = 0;
  benAgeUnit: any;
  masterDataServiceSubscription: any;
  benFamilyPlanningSubscription: Subscription;
  attendant: any;
  bengender: any;
  constructor(
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService,
    private registrarService: RegistrarService,
    private masterdataService: MasterdataService,
    private doctorService: DoctorService,
    private route: ActivatedRoute

  ) {}

  ngOnInit() {
    this.doctorService.setFamilyDataFetch(false);
    this.attendant = this.route.snapshot.params["attendant"];
    this.getBeneficiaryDetails();
    this.assignSelectedLanguage();
    // this.getAgeUnitMasters();
    this.getMastersOfcurrentlyFPMethod();
    /* Set Max date*/
    this.maxEndDate = new Date();
    this.today = new Date();
    this.maxEndDate.setDate(this.today.getDate() - 1);
    this.enableDispensationDetailsForm = false;

    this.doctorService.fetchFamilyDataCheck$.subscribe(
      (responsevalue) => {
        if(responsevalue == true) {
          this.getFamilyPlanningNurseFetchDetails();
        }
      });
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
  }

  getBeneficiaryDetails(){
    this.beneficiaryDetailsSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
    .subscribe(res => {
      if (res != null) {
        this.beneficiary = res;
        let beneficiary = this.beneficiary;
        this.bengender = beneficiary.genderName.toLowerCase();

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
    });
  }

  getAgeValueNew(age) {
    if (!age) return 0;
    let arr = (age !== undefined && age !== null) ? age.trim().split(' ') : age;
    this.benAgeUnit = arr[1];
    if (arr[1]) {
      let ageUnit = arr[1];
      if (ageUnit.toLowerCase() == "years") {
        return parseInt(arr[0]);
      }
    }
    return 0;
  }	

  checkWithFertilityStatus() {
    // let fertilityStatusDetails =
    //   this.familyPlanningAndReproductiveForm.controls.fertilityStatus.value;

      (this.familyPlanningMode == "view" || this.familyPlanningMode == "update")
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
      
    // this.familyPlanningAndReproductiveForm.reset();
    this.resetFormOnRadioSelection();
    this.resetCurrentFPOptions();

    this.familyPlanningAndReproductiveForm.patchValue({
      // fertilityStatus: fertilityStatusDetails,
      unitOfAge: "Years",
    });
    this.fertilityStatusOption.filter((itemId) => {
      if (
        itemId.name ===
        this.familyPlanningAndReproductiveForm.controls.fertilityStatus.value
      ) {
        this.familyPlanningAndReproductiveForm.controls.fertilityStatusID.setValue(
          itemId.id
        );
      }
    });
    // (this.familyPlanningMode == "view" || this.familyPlanningMode == "update")
    //   ? this.doctorService.familyPlanningValueChanged(true)
    //   : null;
    if (
      this.fertilityStatus !== undefined &&
      this.fertilityStatus !== null &&
      this.fertilityStatus.toLowerCase() === "fertile"
    ) {
      this.enableDispensationDetailsForm = true;
    } else {
      this.enableDispensationDetailsForm = false;
    }
    this.doctorService.enableDispenseFlag = true;
    this.registrarService.enableDispenseOnFertility(
      this.enableDispensationDetailsForm
    );
  
  }

  resetFormOnRadioSelection() {

  this.familyPlanningAndReproductiveForm.controls["parity"].reset();
  this.familyPlanningAndReproductiveForm.controls["totalNoOfChildrenBorn"].reset();
  this.familyPlanningAndReproductiveForm.controls["totalNoOfChildrenBornFemale"].reset();
  this.familyPlanningAndReproductiveForm.controls["totalNoOfChildrenBornMale"].reset();

  this.familyPlanningAndReproductiveForm.controls["numberOfLiveChildren"].reset();
  this.familyPlanningAndReproductiveForm.controls["numberOfLiveChildrenFemale"].reset();
  this.familyPlanningAndReproductiveForm.controls["numberOfLiveChildrenMale"].reset();
  this.familyPlanningAndReproductiveForm.controls["ageOfYoungestChild"].reset();
  this.familyPlanningAndReproductiveForm.controls["unitOfAge"].reset();
  this.familyPlanningAndReproductiveForm.controls["youngestChildGender"].reset();

  this.familyPlanningAndReproductiveForm.controls["currentlyUsingFpMethod"].reset();
  this.familyPlanningAndReproductiveForm.controls["dateOfSterilization"].reset();
  this.familyPlanningAndReproductiveForm.controls["placeOfSterilization"].reset();
  this.familyPlanningAndReproductiveForm.controls["dosesTaken"].reset();
  this.familyPlanningAndReproductiveForm.controls["dateOfLastDoseTaken"].reset();
  this.familyPlanningAndReproductiveForm.controls["otherCurrentlyUsingFpMethod"].reset();


}

  checktotalFemaleChildrenBorn(
    totalNumberOfChildrenBornFemale,
    noOfLiveChildrenFemale
  ) {
    let totalNoOfFemaleBorn =
      totalNumberOfChildrenBornFemale !== undefined &&
      totalNumberOfChildrenBornFemale !== null
        ? parseInt(totalNumberOfChildrenBornFemale)
        : 0;
    let totalNOOfFemaleAlive =
      noOfLiveChildrenFemale !== undefined && noOfLiveChildrenFemale !== null
        ? parseInt(noOfLiveChildrenFemale)
        : 0;
    if (
      totalNoOfFemaleBorn &&
      totalNOOfFemaleAlive &&
      totalNoOfFemaleBorn < totalNOOfFemaleAlive
    ) {
      this.confirmationService.alert(
        this.current_language_set.valueEnteredMustBeGreaterThanLivingFemale
      );
      this.familyPlanningAndReproductiveForm.controls[
        "totalNoOfChildrenBornFemale"
      ].reset();
    }
    this.checktotalChildrenBorn();
    this.familyPlanningMode == "view" || this.familyPlanningMode == "update"
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
  }

  checktotalMaleChildrenBorn(
    totalNumberOfChildrenBornMale,
    noOfLiveChildrenMale
  ) {
    let totalNoOfMaleBorn =
      totalNumberOfChildrenBornMale !== undefined &&
      totalNumberOfChildrenBornMale !== null
        ? parseInt(totalNumberOfChildrenBornMale)
        : 0;
    let totalNOOfMaleAlive =
      noOfLiveChildrenMale !== undefined && noOfLiveChildrenMale !== null
        ? parseInt(noOfLiveChildrenMale)
        : 0;
    if (
      totalNoOfMaleBorn &&
      totalNOOfMaleAlive &&
      totalNoOfMaleBorn < totalNOOfMaleAlive
    ) {
      this.confirmationService.alert(
        this.current_language_set.valueEnteredMustBeGreaterThanLivingMale
      );
      this.familyPlanningAndReproductiveForm.controls[
        "totalNoOfChildrenBornMale"
      ].reset();
    }
    this.checktotalChildrenBorn();
    this.familyPlanningMode == "view" || this.familyPlanningMode == "update"
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
  }

  checktotalChildrenBorn() {
    let totalNoOfFemaleBorn =
      this.totalNoOfChildrenBornFemale !== undefined &&
      this.totalNoOfChildrenBornFemale !== null
        ? parseInt(this.totalNoOfChildrenBornFemale)
        : 0;
    let totalNoOfMaleBorn =
      this.totalNoOfChildrenBornMale !== undefined &&
      this.totalNoOfChildrenBornMale !== null
        ? parseInt(this.totalNoOfChildrenBornMale)
        : 0;
    if (totalNoOfFemaleBorn || totalNoOfMaleBorn) {
      this.familyPlanningAndReproductiveForm.patchValue({
        totalNoOfChildrenBorn: totalNoOfFemaleBorn + totalNoOfMaleBorn,
      });
    } else {
      this.familyPlanningAndReproductiveForm.controls[
        "totalNoOfChildrenBorn"
      ].reset();
    }
    this.familyPlanningMode == "view" || this.familyPlanningMode == "update"
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
  }

  checkLiveNoOfChildrenBornFemale(
    totalNumberOfChildrenBornFemale,
    noOfLiveChildrenFemale
  ) {
    let totalNoOfFemaleBorn =
      totalNumberOfChildrenBornFemale !== undefined &&
      totalNumberOfChildrenBornFemale !== null
        ? parseInt(totalNumberOfChildrenBornFemale)
        : 0;
    let totalNOOfFemaleAlive =
      noOfLiveChildrenFemale !== undefined && noOfLiveChildrenFemale !== null
        ? parseInt(noOfLiveChildrenFemale)
        : 0;
    if (
      totalNoOfFemaleBorn &&
      totalNOOfFemaleAlive &&
      totalNOOfFemaleAlive > totalNoOfFemaleBorn
    ) {
      this.confirmationService.alert(
        this.current_language_set.valueEnteredCannotBeGreaterFemale
      );
      this.familyPlanningAndReproductiveForm.controls[
        "numberOfLiveChildrenFemale"
      ].reset();
    }
    this.checkLiveNoOfChildrenBorn();
    this.familyPlanningMode == "view" || this.familyPlanningMode == "update"
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
  }

  checkLiveNoOfChildrenBornMale(
    totalNumberOfChildrenBornMale,
    noOfLiveChildrenMale
  ) {
    let totalNoOfMaleBorn =
      totalNumberOfChildrenBornMale !== undefined &&
      totalNumberOfChildrenBornMale !== null
        ? parseInt(totalNumberOfChildrenBornMale)
        : 0;
    let totalNOOfMaleAlive =
      noOfLiveChildrenMale !== undefined && noOfLiveChildrenMale !== null
        ? parseInt(noOfLiveChildrenMale)
        : 0;
    if (
      totalNoOfMaleBorn &&
      totalNOOfMaleAlive &&
      totalNOOfMaleAlive > totalNoOfMaleBorn
    ) {
      this.confirmationService.alert(
        this.current_language_set.valueEnteredCannotBeGreaterMale
      );
      this.familyPlanningAndReproductiveForm.controls[
        "numberOfLiveChildrenMale"
      ].reset();
      ` `;
    }
    this.checkLiveNoOfChildrenBorn();
    this.familyPlanningMode == "view" || this.familyPlanningMode == "update"
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
  }

  checkAgeOfYoungestChildValidation(youngChildAge){
    // let benAge = this.beneficiary.ageVal
    if (youngChildAge !== undefined && youngChildAge !== null){
    let youngChildageUnit = this.familyPlanningAndReproductiveForm.controls.unitOfAge.value
    if(youngChildageUnit.toLowerCase() === this.benAgeUnit){
    if(youngChildAge > this.beneficiaryAge){
      this.confirmationService.alert(this.current_language_set.youngChildAgeShouldBeLessThanBenAge);
      this.familyPlanningAndReproductiveForm.get('ageOfYoungestChild').reset()
    }
  }
  }
    (this.familyPlanningMode == "view" || this.familyPlanningMode == "update") 
     ? this.doctorService.familyPlanningValueChanged(true) : null;
  }

  checkLiveNoOfChildrenBorn() {
    let totalNoOfLivingFemale =
      this.numberOfLiveChildrenFemale !== undefined &&
      this.numberOfLiveChildrenFemale !== null
        ? parseInt(this.numberOfLiveChildrenFemale)
        : 0;
    let totalNoOfLivingMale =
      this.numberOfLiveChildrenMale !== undefined &&
      this.numberOfLiveChildrenMale !== null
        ? parseInt(this.numberOfLiveChildrenMale)
        : 0;
    if (totalNoOfLivingFemale || totalNoOfLivingMale) {
      this.familyPlanningAndReproductiveForm.patchValue({
        numberOfLiveChildren: totalNoOfLivingFemale + totalNoOfLivingMale,
      });
    } else {
      this.familyPlanningAndReproductiveForm.controls[
        "numberOfLiveChildren"
      ].reset();
    }
    this.familyPlanningMode == "view" || this.familyPlanningMode == "update"
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
  }
  getMastersOfcurrentlyFPMethod() {
    this.currentlyFPMethod = [];
    this.fertilityStatusOption = [];
    this.ageUnitMasterData = [];
    this.genderMasterData = [];
    this.masterDataServiceSubscription =
    this.masterdataService.nurseMasterData$.subscribe((res) => {
      if (res != undefined && res != null) {
        this.currentlyFPMethod = res.m_fpmethodfollowup;
        this.fertilityStatusOption = res.m_FertilityStatus;
        this.genderMasterData = res.m_gender;
        this.ageUnitMasterData = res.m_ageunits;
        //making years value as a default

        this.familyPlanningAndReproductiveForm.patchValue({
          unitOfAge: "Years",
        });
        if (this.familyPlanningMode == "view") {
          this.getFamilyPlanningNurseFetchDetails();
        }
      } else {
        console.log("Error in fetching nurse master data details");
      }
    });
  }

  checkParity() {
    if (this.parity < 1 || this.parity > 15) {
      this.confirmationService.alert(
        this.current_language_set.alerts.info.recheckValue
      );
    }
    this.familyPlanningMode == "view" || this.familyPlanningMode == "update"
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
  }
  validateNoOfChildrenBorn(noOfChildren) {
    if (noOfChildren < 1 || noOfChildren > 15) {
      this.confirmationService.alert(
        this.current_language_set.alerts.info.recheckValue
      );
    }
    this.familyPlanningMode == "view" || this.familyPlanningMode == "update"
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
  }
  populateDosesFieldForAntara() {
    if (
      this.currentlyUsingFpMethod !== undefined &&
      this.currentlyUsingFpMethod !== null &&
      this.currentlyUsingFpMethod.includes(
        "Injectable MPA Contraceptive (Antara)"
      )
    ) {
      this.enableDoseFields = true;
    } else {
      this.enableDoseFields = false;
      this.familyPlanningAndReproductiveForm.get("dosesTaken").reset();
      this.familyPlanningAndReproductiveForm.get("dateOfLastDoseTaken").reset();
    }
    this.familyPlanningMode == "view" || this.familyPlanningMode == "update"
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
  }

  populateSterilizationForTubectomyOrVasectomy() {
    if (
      this.currentlyUsingFpMethod !== undefined &&
      this.currentlyUsingFpMethod !== null &&
      (this.currentlyUsingFpMethod.includes(
        "Tubectomy (Female Sterilization)"
      ) ||
        this.currentlyUsingFpMethod.includes("Vasectomy (Male sterilization)"))
    ) {
      this.enableSterilizationFields = true;
    } else {
      this.enableSterilizationFields = false;
      this.familyPlanningAndReproductiveForm.get("dateOfSterilization").reset();
      this.familyPlanningAndReproductiveForm
        .get("placeOfSterilization")
        .reset();
    }
    this.familyPlanningMode == "view" || this.familyPlanningMode == "update"
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
  }

  currentlyUsingFPOther() {
    if (
      this.currentlyUsingFpMethod !== undefined &&
      this.currentlyUsingFpMethod !== null &&
      this.currentlyUsingFpMethod.includes("Other")
    ) {
      this.enablecurrentlyUsingFPOther = true;
    } else {
      this.enablecurrentlyUsingFPOther = false;
      this.familyPlanningAndReproductiveForm
        .get("otherCurrentlyUsingFpMethod")
        .reset();
    }
  }

  onValueChange() {
    this.familyPlanningMode == "view" || this.familyPlanningMode == "update"
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
  }

  resetcurrentlyUsingFPOptions(selectedOption) {
    if (selectedOption !== undefined && selectedOption !== null && selectedOption.length > 0) {
      if (selectedOption.includes("None")) {
        this.disableCurrentlyUsingFPNone = true;
      } else {
        this.disableCurrentlyUsingFPNone = false;
      }
    } else {
      this.disableCurrentlyUsingFPNone = null;
    }
    this.familyPlanningMode == "view" || this.familyPlanningMode == "update"
      ? this.doctorService.familyPlanningValueChanged(true)
      : null;
  }

  get fertilityStatus() {
    return this.familyPlanningAndReproductiveForm.controls["fertilityStatus"]
      .value;
  }

  get parity() {
    return this.familyPlanningAndReproductiveForm.controls["parity"].value;
  }

  get totalNoOfChildrenBorn() {
    return this.familyPlanningAndReproductiveForm.controls[
      "totalNoOfChildrenBorn"
    ].value;
  }

  get totalNoOfChildrenBornFemale() {
    return this.familyPlanningAndReproductiveForm.controls[
      "totalNoOfChildrenBornFemale"
    ].value;
  }

  get totalNoOfChildrenBornMale() {
    return this.familyPlanningAndReproductiveForm.controls[
      "totalNoOfChildrenBornMale"
    ].value;
  }

  get numberOfLiveChildren() {
    return this.familyPlanningAndReproductiveForm.controls[
      "numberOfLiveChildren"
    ].value;
  }

  get numberOfLiveChildrenFemale() {
    return this.familyPlanningAndReproductiveForm.controls[
      "numberOfLiveChildrenFemale"
    ].value;
  }

  get numberOfLiveChildrenMale() {
    return this.familyPlanningAndReproductiveForm.controls[
      "numberOfLiveChildrenMale"
    ].value;
  }

  get ageOfYoungestChild() {
    return this.familyPlanningAndReproductiveForm.controls["ageOfYoungestChild"]
      .value;
  }

  get unitOfAge() {
    return this.familyPlanningAndReproductiveForm.controls["unitOfAge"].value;
  }

  get youngestChildGender() {
    return this.familyPlanningAndReproductiveForm.controls[
      "youngestChildGender"
    ].value;
  }

  get currentlyUsingFpMethod() {
    return this.familyPlanningAndReproductiveForm.controls[
      "currentlyUsingFpMethod"
    ].value;
  }

  get youngestChildGenderOther() {
    return this.familyPlanningAndReproductiveForm.controls[
      "youngestChildGenderOther"
    ].value;
  }

  get otherCurrentlyUsingFpMethod() {
    return this.familyPlanningAndReproductiveForm.controls[
      "otherCurrentlyUsingFpMethod"
    ].value;
  }

  get dateOfSterilization() {
    return this.familyPlanningAndReproductiveForm.controls[
      "dateOfSterilization"
    ].value;
  }

  get placeOfSterilization() {
    return this.familyPlanningAndReproductiveForm.controls[
      "placeOfSterilization"
    ].value;
  }

  get dosesTaken() {
    return this.familyPlanningAndReproductiveForm.controls["dosesTaken"].value;
  }

  get dateOfLastDoseTaken() {
    return this.familyPlanningAndReproductiveForm.controls[
      "dateOfLastDoseTaken"
    ].value;
  }

  ngOnChanges() {
    this.attendant = this.route.snapshot.params["attendant"];
    if (this.familyPlanningMode == "view") {
      this.getFamilyPlanningNurseFetchDetails();
    }
    if (
      localStorage.getItem("visitReason") != undefined &&
      localStorage.getItem("visitReason") != "undefined" &&
      localStorage.getItem("visitReason") != null &&
      localStorage.getItem("visitReason").toLowerCase() == "follow up" && this.attendant == "nurse"
    ) {
      this.getFamilyPlanningFetchDetailsForRevisit();
    }
  }

  getFamilyPlanningNurseFetchDetails() {
    if (
      this.doctorService.familyPlanningDetailsResponseFromNurse !== null &&
      this.doctorService.familyPlanningDetailsResponseFromNurse !== undefined
    ) {
      let familyPlanningReproductiveData =
        this.doctorService.familyPlanningDetailsResponseFromNurse
          .familyPlanningReproductiveDetails;
      let familyPlanningReproductiveFormData = Object.assign(
        {},
        familyPlanningReproductiveData,
        {
          dateOfSterilization: new Date(
            familyPlanningReproductiveData.dateOfSterilization
          ),
        },
        {
          dateOfLastDoseTaken: new Date(
            familyPlanningReproductiveData.dateOfLastDoseTaken
          ),
        }
      );
      this.familyPlanningAndReproductiveForm.patchValue(
        familyPlanningReproductiveFormData
      );
      this.populateDosesFieldForAntara();
      this.populateSterilizationForTubectomyOrVasectomy();
      this.currentlyUsingFPOther();
      this.resetcurrentlyUsingFPOptions(familyPlanningReproductiveData.currentlyUsingFpMethod);
    }
    if (
      this.fertilityStatus !== undefined &&
      this.fertilityStatus !== null &&
      this.fertilityStatus.toLowerCase() === "fertile"
    ) {
      this.enableDispensationDetailsForm = true;
    } else {
      this.enableDispensationDetailsForm = false;
    }
    this.registrarService.enableDispenseOnFertility(
      this.enableDispensationDetailsForm
    );
  }

  getFamilyPlanningFetchDetailsForRevisit() {
    this.benFamilyPlanningSubscription  = 
    this.doctorService.benFamilyPlanningDetails$.subscribe((response) => {
      if(response !== undefined && response !== null &&  
        response.familyPlanningReproductiveDetails !== undefined && response.familyPlanningReproductiveDetails !== null)
     {
      let familyPlanningReproductiveData =
       response.familyPlanningReproductiveDetails;
      let familyPlanningReproductiveFormData = Object.assign(
        {},
        familyPlanningReproductiveData,
        {
          dateOfSterilization: new Date(
            familyPlanningReproductiveData.dateOfSterilization
          ),
        },
        {
          dateOfLastDoseTaken: new Date(
            familyPlanningReproductiveData.dateOfLastDoseTaken
          ),
        }
      );
      this.familyPlanningAndReproductiveForm.patchValue(
        familyPlanningReproductiveFormData
      );
      this.populateDosesFieldForAntara();
      this.populateSterilizationForTubectomyOrVasectomy();
      this.currentlyUsingFPOther();
      this.resetcurrentlyUsingFPOptions(familyPlanningReproductiveFormData.currentlyUsingFpMethod);
    }
    if (
      this.fertilityStatus !== undefined &&
      this.fertilityStatus !== null &&
      this.fertilityStatus.toLowerCase() === "fertile"
    ) {
      this.enableDispensationDetailsForm = true;
    } else {
      this.enableDispensationDetailsForm = false;
    }
    this.registrarService.enableDispenseOnFertility(
      this.enableDispensationDetailsForm
    );
    this.familyPlanningAndReproductiveForm.patchValue({ id: null });
  });
}


  resetCurrentFPOptions() {
    this.enableDoseFields = false;
    this.enableSterilizationFields = false;
    this.enablecurrentlyUsingFPOther = false;
  }

  ngOnDestroy() {
    this.familyPlanningAndReproductiveForm.reset();
    if (this.beneficiaryDetailsSubscription)
    this.beneficiaryDetailsSubscription.unsubscribe();
    if(this.masterDataServiceSubscription)
    this.masterDataServiceSubscription.unsubscribe();
    if (this.benFamilyPlanningSubscription)
    this.benFamilyPlanningSubscription.unsubscribe();
  }
}
