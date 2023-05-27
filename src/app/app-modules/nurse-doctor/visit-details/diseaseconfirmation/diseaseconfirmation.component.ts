import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BeneficiaryDetailsService } from "app/app-modules/core/services";
import { environment } from "environments/environment";
import {
  DoctorService,
  MasterdataService,
  NurseService,
} from "../../shared/services";
import { IdrsscoreService } from "../../shared/services/idrsscore.service";
import { NcdScreeningService } from "../../shared/services/ncd-screening.service";
import { VisitDetailUtils } from "../../shared/utility/visit-detail-utility";

@Component({
  selector: "diseaseconfirmation",
  templateUrl: "./diseaseconfirmation.component.html",
  styleUrls: ["./diseaseconfirmation.component.css"],
})
export class DiseaseconfirmationComponent implements OnInit {
  @Input("mode")
  mode: String;

  @Input("diseaseFormsGroup")
  diseaseFormsGroup: FormGroup;

  @Input("idrsOrCbac")
  idrsOrCbac: String;

  diseaseFormsArray: FormArray;
  questions: any = [];
  diseasearray: any = [];
  diseases: any = [];
  suspect: any = []; // this suspect variable is used to store confirm Disease
  revisit: any;
  diseaseArray = [];
  attendantType: any;
  isDoctor: any;
  diseasesList = [];
  confirmedDisease = [];
  beneficiaryGender: any;
  previousConfirmedDiseases = [];
  confirmDiseasesSubscription: any;
  confirmedDiseasesOnPreviousVisit: any;

  constructor(
    private fb: FormBuilder,
    private masterdataService: MasterdataService,
    private idrsScoreService: IdrsscoreService,
    private doctorService: DoctorService,
    private nurseService: NurseService,
    private route: ActivatedRoute,
    private ncdScreeningService: NcdScreeningService,
    private beneficiaryDetailsService: BeneficiaryDetailsService
  ) {}

  ngOnInit() {
    this.getBenificiaryDetails();
    this.ncdScreeningService.clearDiseaseConfirmationScreenFlag();
    // API call to fetch the confirmed diseases for CBAC
    this.fetchPreviousVisitConfirmedDiseases();
    this.confirmDiseasesSubscription =
      this.ncdScreeningService.enableDiseaseConfirmForm$.subscribe(
        (response) => {
          if (response === "idrs") {
            this.idrsOrCbac = response;
            this.diseaseFormsArray = this.getData();
            while (this.getData().length) {
              this.diseaseFormsArray.removeAt(0);
            }
            this.getPatientRevisitSuspectedDieseaData();
          } else if (response === "cbac") {
            this.idrsOrCbac = response;
            this.diseaseFormsArray = this.getData();
            while (this.getData().length) {
              this.diseaseFormsArray.removeAt(0);
            }
            this.getpatientDiseasesata();
          }
        }
      );
    this.diseaseFormsArray = this.getData();
    while (this.getData().length) {
      this.diseaseFormsArray.removeAt(0);
    }

    // if (this.mode == 'view') {
    //   let visitID = localStorage.getItem('visitID');
    //   let benRegID = localStorage.getItem('beneficiaryRegID');
    //   if (visitID != null && benRegID != null) {
    //     if( this.idrsOrCbac === "idrs")
    //        this.getIDRSDetailsFrmNurse(visitID, benRegID);

    //     else if( this.idrsOrCbac === "cbac")
    //         this.getCbacDiseaseDetailsFromNurse(visitID, benRegID);

    //   }
    // }
    // else
    // {
    if (this.mode != "view") {
      if (this.idrsOrCbac === "cbac") this.getpatientDiseasesata();
      else if (this.idrsOrCbac === "idrs")
        this.getPatientRevisitSuspectedDieseaData();
    }
    // }

    this.attendantType = this.route.snapshot.params["attendant"];
    if (
      this.attendantType == "doctor" ||
      this.attendantType == "tcspecialist"
    ) {
      this.isDoctor = true;
    }
  }

  ngOnChanges() {
    //this.nurseService.mmuVisitData=false;
    if (this.mode == "view") {
      let visitID = localStorage.getItem("visitID");
      let benRegID = localStorage.getItem("beneficiaryRegID");
      if (visitID != null && benRegID != null) {
        if (this.idrsOrCbac === "idrs")
          this.getIDRSDetailsFrmNurse(visitID, benRegID);
        else if (this.idrsOrCbac === "cbac")
          this.getCbacDiseaseDetailsFromNurse(visitID, benRegID);
      }
    }
  }

  ngOnDestroy() {
    if (this.beneficiaryDetailsSubscription)
      this.beneficiaryDetailsSubscription.unsubscribe();

    if (this.cbacDiseaseDetailsSubscription)
      this.cbacDiseaseDetailsSubscription.unsubscribe();

    if (this.patientDiseasesDataSub) this.patientDiseasesDataSub.unsubscribe();

    if (this.patientDiseasesata) this.patientDiseasesata.unsubscribe();

    if (this.IDRSDetailsSubscription)
      this.IDRSDetailsSubscription.unsubscribe();

    if (this.confirmDiseasesSubscription)
      this.confirmDiseasesSubscription.unsubscribe();
  }
  getData() {
    return this.diseaseFormsGroup.get("diseaseFormsArray") as FormArray;
  }

  addMoreDiseases(data) {
    this.getData().push(
      new VisitDetailUtils(this.fb).createPatientDiseaseArrayForm(data)
    );
  }
  fetchPreviousVisitConfirmedDiseases() {
    let obj = {
      beneficiaryRegId: localStorage.getItem("beneficiaryRegID"),
    };
    this.nurseService.getPreviousVisitConfirmedDiseases(obj).subscribe(
      (value) => {
        if (
          value != undefined &&
          value.statusCode == 200 &&
          value.data != null &&
          value.data !== undefined &&
          value.data.confirmedDiseases !== undefined &&
          value.data.confirmedDiseases !== null
        ) {
          this.confirmedDiseasesOnPreviousVisit = value.data.confirmedDiseases;
          this.doctorService.setPreviousVisitConfirmedDiseases(
            value.data.confirmedDiseases
          );
        }
      },
      (err) => {
        console.log(err.errorMessage());
      }
    );
  }

  getPreviousVisitConfirmedDiseases() {
    this.previousConfirmedDiseases = [];

    if (
      this.confirmedDiseasesOnPreviousVisit !== undefined &&
      this.confirmedDiseasesOnPreviousVisit !== null
    ) {
      this.previousConfirmedDiseases = this.confirmedDiseasesOnPreviousVisit;
      if (this.previousConfirmedDiseases.length > 0) {
        this.previousConfirmedDiseases.forEach((elementValue) => {
          this.diseaseArray.forEach((confirmedValue) => {
            if (
              confirmedValue.disease.trim().toLowerCase() ===
              elementValue.trim().toLowerCase()
            )
              confirmedValue.selected = true;
          });
        });
      }
    }

    while (this.getData().length) {
      this.diseaseFormsArray.removeAt(0);
    }

    this.diseaseArray.filter((form) => {
      if (
        this.beneficiaryGender !== undefined &&
        this.beneficiaryGender !== null &&
        this.beneficiaryGender.toLowerCase() === "male"
      ) {
        if (
          form.disease.toLowerCase() === environment.diabetes.toLowerCase() ||
          form.disease.toLowerCase() ===
            environment.hypertension.toLowerCase() ||
          form.disease.toLowerCase() === environment.oral.toLowerCase()
        )
          this.addMoreDiseases(form);
      } else {
        if (
          form.disease.toLowerCase() === environment.diabetes.toLowerCase() ||
          form.disease.toLowerCase() ===
            environment.hypertension.toLowerCase() ||
          form.disease.toLowerCase() === environment.oral.toLowerCase() ||
          form.disease.toLowerCase() === environment.cervical.toLowerCase() ||
          form.disease.toLowerCase() === environment.breast.toLowerCase()
        )
          this.addMoreDiseases(form);
      }
    });

    this.checkedCbacDiseases();

    this.diseaseArray.forEach((res, index) => {
      if (res.selected == true) {
        let diseaseformArraygroup = (<FormGroup>(
          this.diseaseFormsGroup.controls["diseaseFormsArray"]
        )).controls[index];
        (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
      }
    });
  }

  cbacDiseaseDetailsSubscription: any;
  patientDiseasesDataSub: any;
  getCbacDiseaseDetailsFromNurse(visitID, benRegID) {
    this.patientDiseasesDataSub =
      this.masterdataService.nurseMasterData$.subscribe((data) => {
        if (data) {
          if (this.patientDiseasesata) this.patientDiseasesata.unsubscribe();
          this.confirmedDisease = data.screeningCondition;

          if (this.confirmedDisease && this.confirmedDisease.length > 0) {
            let obj = {
              beneficiaryRegId: benRegID,
              visitCode: localStorage.getItem("visitCode"),
            };

            this.cbacDiseaseDetailsSubscription = this.nurseService
              .getCbacDetailsFromNurse(obj)
              .subscribe((value) => {
                if (
                  value != null &&
                  value.statusCode == 200 &&
                  value.data != null &&
                  value.data != undefined
                ) {
                  this.diseases = [];
                  this.diseaseArray = [];
                  for (var i = 0; i < this.confirmedDisease.length; i++) {
                    if (
                      this.confirmedDisease[i].name === environment.diabetes
                    ) {
                      this.diseases.push({
                        disease: this.confirmedDisease[i].name,
                        flag: null,
                        selected:
                          value.data.diabetes !== undefined &&
                          value.data.diabetes !== null
                            ? value.data.diabetes.confirmed !== null
                              ? value.data.diabetes.confirmed
                              : false
                            : false,
                      });
                    }
                    if (
                      this.confirmedDisease[i].name === environment.hypertension
                    ) {
                      this.diseases.push({
                        disease: this.confirmedDisease[i].name,
                        flag: null,
                        selected:
                          value.data.hypertension !== undefined &&
                          value.data.hypertension !== null
                            ? value.data.hypertension.confirmed !== null
                              ? value.data.hypertension.confirmed
                              : false
                            : false,
                      });
                    }
                    if (this.confirmedDisease[i].name === environment.breast) {
                      this.diseases.push({
                        disease: this.confirmedDisease[i].name,
                        flag: null,
                        selected:
                          value.data.breast !== undefined &&
                          value.data.breast !== null
                            ? value.data.breast.confirmed !== null
                              ? value.data.breast.confirmed
                              : false
                            : false,
                      });
                    }
                    if (
                      this.confirmedDisease[i].name === environment.cervical
                    ) {
                      this.diseases.push({
                        disease: this.confirmedDisease[i].name,
                        flag: null,
                        selected:
                          value.data.cervical !== undefined &&
                          value.data.cervical !== null
                            ? value.data.cervical.confirmed !== null
                              ? value.data.cervical.confirmed
                              : false
                            : false,
                      });
                    }
                    if (this.confirmedDisease[i].name === environment.oral) {
                      this.diseases.push({
                        disease: this.confirmedDisease[i].name,
                        flag: null,
                        selected:
                          value.data.oral !== undefined &&
                          value.data.oral !== null
                            ? value.data.oral.confirmed !== null
                              ? value.data.oral.confirmed
                              : false
                            : false,
                      });
                    }
                  }
                  this.diseaseFormsArray = this.getData();
                  while (this.getData().length) {
                    this.diseaseFormsArray.removeAt(0);
                  }

                  this.diseaseArray = this.diseases;
                  this.diseaseArray.forEach((form, index) => {
                    if (
                      this.beneficiaryGender !== undefined &&
                      this.beneficiaryGender !== null &&
                      this.beneficiaryGender.toLowerCase() === "male"
                    ) {
                      if (
                        form.disease.toLowerCase() ===
                          environment.diabetes.toLowerCase() ||
                        form.disease.toLowerCase() ===
                          environment.hypertension.toLowerCase() ||
                        form.disease.toLowerCase() ===
                          environment.oral.toLowerCase()
                      )
                        this.addMoreDiseases(form);
                    } else {
                      if (
                        form.disease.toLowerCase() ===
                          environment.diabetes.toLowerCase() ||
                        form.disease.toLowerCase() ===
                          environment.hypertension.toLowerCase() ||
                        form.disease.toLowerCase() ===
                          environment.oral.toLowerCase() ||
                        form.disease.toLowerCase() ===
                          environment.cervical.toLowerCase() ||
                        form.disease.toLowerCase() ===
                          environment.breast.toLowerCase()
                      )
                        this.addMoreDiseases(form);
                    }
                  });

                  this.checkedCbacDiseases();
                }
              });
          }
        }
      });
  }

  checkedCbacDiseases() {
    if (this.diseaseFormsGroup.value) {
      this.diseasearray = [];
      this.diseasearray = this.diseaseFormsGroup.get("diseaseFormsArray").value;
      let arrayDiseases = [];
      this.diseasearray.forEach((value) => {
        if (value.selected !== false) arrayDiseases.push(value.diseaseName);
      });

      this.ncdScreeningService.setConfirmedDiseasesForScreening(arrayDiseases);

      if (
        arrayDiseases.length > 0 &&
        this.previousConfirmedDiseases.length <= 0
      ) {
        this.nurseService.diseaseFileUpload = true;
      } else if (arrayDiseases.length > this.previousConfirmedDiseases.length) {
        this.nurseService.diseaseFileUpload = true;
      } else {
        this.nurseService.diseaseFileUpload = false;
      }
    }
  }

  checked(event, item) {
    console.log(event.checked);
    console.log(this.diseaseFormsGroup.value);
    if (this.diseaseFormsGroup.value) {
      this.diseasearray = this.diseaseFormsGroup.get("diseaseFormsArray").value;
      let ar = [];
      this.diseasearray.forEach((value) => {
        if (value.selected != false) ar.push(value.diseaseName);
      });
      console.log("diseasearray", ar);
      if (!event.checked) {
        if (item.value.diseaseName === "Hypertension") {
          this.idrsScoreService.clearHypertensionSelected();
        }
        if (item.value.diseaseName === "Diabetes") {
          // this.idrsScoreService.clearConfirmedDiabeticSelected();
        }
        this.idrsScoreService.setUnchecked(item.value.diseaseName);
      } else {
        if (item.value.diseaseName === "Hypertension") {
          this.idrsScoreService.setHypertensionSelected();
        }
        if (item.value.diseaseName === "Diabetes") {
          // this.idrsScoreService.setConfirmedDiabeticSelected();
        }

        this.idrsScoreService.setDiseasesSelected(ar);
      }
    }
  }
  nurseMasterDataSubscription: any;
  IDRSDetailsSubscription: any;
  questionArray = [];
  getIDRSDetailsFrmNurse(visitID, benRegID) {
    this.nurseMasterDataSubscription =
      this.masterdataService.nurseMasterData$.subscribe((data) => {
        if (data) {
          if (this.nurseMasterDataSubscription)
            this.nurseMasterDataSubscription.unsubscribe();
          this.questions = data.IDRSQuestions;
          this.diseases = [];
          this.diseaseArray = [];
          if (this.questions && this.questions.length > 0) {
            for (var i = 0; i < this.questions.length; i++) {
              if (i != 0) {
                console.log(
                  this.questions.DiseaseQuestionType !==
                    this.questions[i - 1].DiseaseQuestionType
                );
                if (
                  this.questions[i].DiseaseQuestionType !==
                  this.questions[i - 1].DiseaseQuestionType
                )
                  this.diseases.push({
                    disease: this.questions[i].DiseaseQuestionType,
                    flag: null,
                    selected: false,
                    current: false,
                  });
              } else
                this.diseases.push({
                  disease: this.questions[i].DiseaseQuestionType,
                  flag: null,
                  selected: false,
                  current: false,
                });
            }

            this.diseaseArray = this.diseases;
          }
          let obj = {
            benRegID: localStorage.getItem("beneficiaryRegID"),
          };
          this.nurseService.getPreviousVisitData(obj).subscribe((res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              //console.log("visit", res);
              //if (res.data.suspectedDisease != null) {
              this.suspect = [];
              if (
                res.data.confirmedDisease != undefined &&
                res.data.confirmedDisease != null
              )
                this.suspect = res.data.confirmedDisease.split(",");
              if (res.data.isDiabetic) this.addToSuspected("Diabetes");
              if (res.data.isDefectiveVision)
                this.addToSuspected("Vision Screening");
              if (res.data.isEpilepsy) this.addToSuspected("Epilepsy");
              if (res.data.isHypertension) this.addToSuspected("Hypertension");

              this.suspect.forEach((element) => {
                this.diseaseArray.forEach((value) => {
                  if (value.disease === element) value.selected = true;
                  if (element === "Hypertension") {
                    this.idrsScoreService.setHypertensionSelected();
                  }
                  if (element === "Diabetes") {
                    // this.idrsScoreService.setConfirmedDiabeticSelected();
                  }
                });
              });
              this.IDRSDetailsSubscription = this.doctorService
                .getIDRSDetails(benRegID, visitID)
                .subscribe((value) => {
                  if (
                    value != null &&
                    value != undefined &&
                    value.statusCode == 200 &&
                    value.data != null &&
                    value.data != undefined
                  ) {
                    this.questionArray = [];
                    let suspect1 = [];
                    // this.suspect = [];
                    if (
                      value.data.IDRSDetail != undefined &&
                      value.data.IDRSDetail != null &&
                      value.data.IDRSDetail.confirmedDisease != null &&
                      value.data.IDRSDetail.confirmedDisease != undefined
                    )
                      suspect1 =
                        value.data.IDRSDetail.confirmedDisease.split(",");
                    if (
                      suspect1 != undefined &&
                      suspect1 != null &&
                      suspect1.length > 0
                    ) {
                      if (this.suspect != null && this.suspect.length == 0) {
                        this.suspect = suspect1;
                        this.suspect.forEach((value) => {
                          this.diseaseArray.forEach((val) => {
                            if (val.disease === value) val.current = true;
                          });
                        });
                        // });
                      } else {
                        let check = false;
                        suspect1.forEach((element) => {
                          check = false;
                          this.suspect.forEach((value) => {
                            if (value == element) {
                              check = true;
                            }
                          });
                          if (!check) {
                            this.addToSuspected(element);
                            this.diseaseArray.forEach((val) => {
                              if (val.disease === element) val.current = true;
                            });
                          }
                        });
                      }
                    }

                    this.suspect.forEach((element) => {
                      this.diseaseArray.forEach((value) => {
                        if (value.disease === element) value.selected = true;
                        if (element === "Hypertension") {
                          this.idrsScoreService.setHypertensionSelected();
                        }
                        if (element === "Diabetes") {
                          // this.idrsScoreService.setConfirmedDiabeticSelected();
                        }
                      });
                    });
                    this.diseaseFormsArray = this.getData();
                    while (this.getData().length) {
                      this.diseaseFormsArray.removeAt(0);
                    }

                    for (let d of this.diseaseArray) {
                      this.addMoreDiseases(d);
                    }
                  }
                  this.diseaseArray.forEach((res, index) => {
                    if (res.selected == true && res.current == false) {
                      let diseaseformArraygroup = (<FormGroup>(
                        this.diseaseFormsGroup.controls["diseaseFormsArray"]
                      )).controls[index];
                      (<FormGroup>diseaseformArraygroup).controls[
                        "selected"
                      ].disable();
                    }
                  });
                  let ar = [];
                  this.diseaseArray.forEach((value) => {
                    if (value.selected) ar.push(value.disease);
                  });
                  console.log("diseasearray", ar);
                  this.idrsScoreService.setDiseasesSelected(ar);
                });
            }
          });
        }
      });
  }
  diseasesMasterData: any;
  getDiseasesMasterData() {
    this.diseasesMasterData = this.masterdataService.nurseMasterData$.subscribe(
      (data) => {
        if (data) {
          if (this.diseasesMasterData) this.diseasesMasterData.unsubscribe();
          this.questions = data.IDRSQuestions;
          this.diseases = [];
          this.diseaseArray = [];
          if (this.questions && this.questions.length > 0) {
            for (var i = 0; i < this.questions.length; i++) {
              if (i != 0) {
                console.log(
                  this.questions.DiseaseQuestionType !==
                    this.questions[i - 1].DiseaseQuestionType
                );
                if (
                  this.questions[i].DiseaseQuestionType !==
                  this.questions[i - 1].DiseaseQuestionType
                )
                  this.diseases.push({
                    disease: this.questions[i].DiseaseQuestionType,
                    flag: null,
                    selected: false,
                    current: false,
                  });
              } else
                this.diseases.push({
                  disease: this.questions[i].DiseaseQuestionType,
                  flag: null,
                  selected: false,
                  current: false,
                });
            }
            this.diseaseArray = this.diseases;
            for (let d of this.diseaseArray) {
              this.addMoreDiseases(d);
            }
            this.diseaseArray.forEach((res, index) => {
              if (res.selected == true) {
                let diseaseformArraygroup = (<FormGroup>(
                  this.diseaseFormsGroup.controls["diseaseFormsArray"]
                )).controls[index];
                (<FormGroup>diseaseformArraygroup).controls[
                  "selected"
                ].disable();
              }
            });
          }
        }
      }
    );
  }
  addToSuspected(val) {
    let flag = false;
    for (var i = 0; i < this.suspect.length; i++) {
      if (this.suspect[i] === val) flag = true;
    }
    if (!flag) {
      this.suspect.push(val);
    }
  }

  beneficiaryDetailsSubscription: any;
  getBenificiaryDetails() {
    this.beneficiaryDetailsSubscription =
      this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(
        (beneficiaryDetails) => {
          if (beneficiaryDetails) {
            this.beneficiaryGender = beneficiaryDetails.genderName;
          }
        }
      );
  }
  patientDiseasesata: any;
  getpatientDiseasesata() {
    this.patientDiseasesata = this.masterdataService.nurseMasterData$.subscribe(
      (data) => {
        if (data) {
          if (this.patientDiseasesata) this.patientDiseasesata.unsubscribe();
          this.confirmedDisease = data.screeningCondition;
          this.diseases = [];
          this.diseaseArray = [];
          if (this.confirmedDisease && this.confirmedDisease.length > 0) {
            for (var i = 0; i < this.confirmedDisease.length; i++) {
              this.diseases.push({
                disease: this.confirmedDisease[i].name,
                flag: null,
                selected: false,
              });
            }
            this.diseaseArray = this.diseases;

            this.getPreviousVisitConfirmedDiseases();
          }
        }
      }
    );
  }
  patientRevisitSuspectedDieseaData: any;
  getPatientRevisitSuspectedDieseaData() {
    this.patientRevisitSuspectedDieseaData =
      this.masterdataService.nurseMasterData$.subscribe((data) => {
        if (data) {
          if (this.patientRevisitSuspectedDieseaData)
            this.patientRevisitSuspectedDieseaData.unsubscribe();
          this.questions = data.IDRSQuestions;
          this.diseases = [];
          this.diseaseArray = [];
          if (this.questions && this.questions.length > 0) {
            for (var i = 0; i < this.questions.length; i++) {
              if (i != 0) {
                // console.log(this.questions.DiseaseQuestionType !== this.questions[i - 1].DiseaseQuestionType);
                if (
                  this.questions[i].DiseaseQuestionType !==
                  this.questions[i - 1].DiseaseQuestionType
                )
                  this.diseases.push({
                    disease: this.questions[i].DiseaseQuestionType,
                    flag: null,
                    selected: false,
                  });
              } else
                this.diseases.push({
                  disease: this.questions[i].DiseaseQuestionType,
                  flag: null,
                  selected: false,
                });
            }
            this.diseaseArray = this.diseases;

            let obj = {
              benRegID: localStorage.getItem("beneficiaryRegID"),
            };
            this.nurseService
              .getPreviousVisitData(obj)
              .subscribe((res: any) => {
                if (res.statusCode == 200 && res.data != null) {
                  //console.log("visit", res);
                  //if (res.data.suspectedDisease != null) {
                  this.suspect = [];
                  if (
                    res.data.confirmedDisease != undefined &&
                    res.data.confirmedDisease != null
                  )
                    this.suspect = res.data.confirmedDisease.split(",");
                  if (res.data.isDiabetic) this.addToSuspected("Diabetes");
                  if (res.data.isDefectiveVision)
                    this.addToSuspected("Vision Screening");
                  if (res.data.isEpilepsy) this.addToSuspected("Epilepsy");
                  if (res.data.isHypertension)
                    this.addToSuspected("Hypertension");

                  this.suspect.forEach((element) => {
                    this.diseaseArray.forEach((value) => {
                      if (value.disease === element) value.selected = true;
                      if (element === "Hypertension") {
                        this.idrsScoreService.setHypertensionSelected();
                      }
                    });
                  });
                  while (this.getData().length) {
                    this.diseaseFormsArray.removeAt(0);
                  }

                  this.diseaseArray.forEach((form, index) => {
                    if (
                      form.disease.toLowerCase() === "diabetes" ||
                      form.disease.toLowerCase() === "epilepsy" ||
                      form.disease.toLowerCase() === "asthma" ||
                      form.disease.toLowerCase() === "vision screening" ||
                      form.disease.toLowerCase() === "tuberculosis screening" ||
                      form.disease.toLowerCase() === "malaria screening" ||
                      form.disease.toLowerCase() === "hypertension"
                    )
                      this.addMoreDiseases(form);
                  });
                  this.diseaseArray.forEach((res, index) => {
                    if (res.selected == true) {
                      let diseaseformArraygroup = (<FormGroup>(
                        this.diseaseFormsGroup.controls["diseaseFormsArray"]
                      )).controls[index];
                      (<FormGroup>diseaseformArraygroup).controls[
                        "selected"
                      ].disable();
                    }
                  });
                }
                let ar = [];
                this.diseaseArray.forEach((value) => {
                  if (value.selected) ar.push(value.disease);
                });
                console.log("diseasearray", ar);
                this.idrsScoreService.setDiseasesSelected(ar);
              });
          }
        }
      });
  }
  addToChronicDiseases(res) {
    let tempdiseaseformArray = (<FormGroup>(
      this.diseaseFormsGroup.controls["diseaseFormsArray"]
    )).value;
    tempdiseaseformArray.forEach((element, i) => {
      if (
        res.data.isDefectiveVision == true &&
        element.diseaseName == "Vision Screening"
      ) {
        let diseaseformArraygroup = (<FormGroup>(
          this.diseaseFormsGroup.controls["diseaseFormsArray"]
        )).controls[i];
        diseaseformArraygroup.patchValue({
          disease: element.diseaseName,
          flag: null,
          selected: true,
        });
        (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
      } else if (
        res.data.isDiabetic == true &&
        element.diseaseName == "Diabetes"
      ) {
        let diseaseformArraygroup = (<FormGroup>(
          this.diseaseFormsGroup.controls["diseaseFormsArray"]
        )).controls[i];
        diseaseformArraygroup.patchValue({
          disease: element.diseaseName,
          flag: null,
          selected: true,
        });
        (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
      } else if (
        res.data.isEpilepsy == true &&
        element.diseaseName == "Epilepsy"
      ) {
        let diseaseformArraygroup = (<FormGroup>(
          this.diseaseFormsGroup.controls["diseaseFormsArray"]
        )).controls[i];
        diseaseformArraygroup.patchValue({
          disease: element.diseaseName,
          flag: null,
          selected: true,
        });
        (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
      } else if (
        res.data.isHypertension == true &&
        element.diseaseName == "Hypertension"
      ) {
        let diseaseformArraygroup = (<FormGroup>(
          this.diseaseFormsGroup.controls["diseaseFormsArray"]
        )).controls[i];
        diseaseformArraygroup.patchValue({
          disease: element.diseaseName,
          flag: null,
          selected: true,
        });
        (<FormGroup>diseaseformArraygroup).controls["selected"].disable();
      }
    });
  }
}
