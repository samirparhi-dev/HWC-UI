import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

import { PreviousDetailsComponent } from '../../../../core/components/previous-details/previous-details.component';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { MasterdataService, NurseService, DoctorService } from '../../../shared/services';
import { ConfirmationService } from '../../../../core/services/confirmation.service';

import { BeneficiaryDetailsService } from '../../../../core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { RegistrarService } from 'app/app-modules/registrar/shared/services/registrar.service';
import { ValidationUtils } from 'app/app-modules/nurse-doctor/shared/utility/validation-utility';

@Component({
  selector: 'general-other-vaccines',
  templateUrl: './other-vaccines.component.html',
  styleUrls: ['./other-vaccines.component.css']
})
export class OtherVaccinesComponent implements OnInit, DoCheck {

  @Input('otherVaccines')
  otherVaccinesForm: FormGroup;

  @Input('mode')
  mode: string;

  @Input('visitCategory')
  visitType: any;

  masterData: any;
  registrarMasterData: any;
  otherVaccineData: any;

  vaccineMasterData = [];
  // vaccineMasterData = [
  //   {
  //     vaccineID: 1,
  //     vaccineName: "PCV"
  //   },
  //   {
  //     vaccineID: 2,
  //     vaccineName: "MMR"
  //   },
  //   {
  //     vaccineID: 3,
  //     vaccineName: "Hepatitis-A Vaccine"
  //   },
  //   {
  //     vaccineID: 4,
  //     vaccineName: "Varicella Vaccine"
  //   },
  //   {
  //     vaccineID: 5,
  //     vaccineName: "Typhoid Vaccine"
  //   },
  //   {
  //     vaccineID: 6,
  //     vaccineName: "Meningococcal Vaccine"
  //   },
  //   {
  //     vaccineID: 6,
  //     vaccineName: "Other"
  //   },
  //   {
  //     vaccineID: 7,
  //     vaccineName: "Nil"
  //   }
  // ];
  previousSelectedVaccineList = [];
  vaccineSelectList = [];
  currentLanguageSet: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MdDialog,
    private nurseService: NurseService,
    private doctorService: DoctorService,
    private registrarService: RegistrarService,
    public httpServiceService: HttpServiceService,
    private confirmationService: ConfirmationService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    private masterdataService: MasterdataService) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.getMasterData();
    this.getBeneficiaryDetails();
    this.callMasterDataObservable();

    // this.httpServiceService.currentLangugae$.subscribe(response =>this.currentLanguageSet = response);
  }

  ngOnChanges(){
  
  }

  ngOnDestroy() {
    if (this.nurseMasterDataSubscription)
      this.nurseMasterDataSubscription.unsubscribe();

    if (this.generalHistorySubscription)
      this.generalHistorySubscription.unsubscribe();

    if (this.beneficiaryDetailSubscription)
      this.beneficiaryDetailSubscription.unsubscribe();
  }

  beneficiaryDetailSubscription: any;
  beneficiary: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription = this.beneficiaryDetailsService.beneficiaryDetails$
      .subscribe(beneficiary => {
        this.beneficiary = beneficiary;
      })
  }

  onAgeUnitEntered(index, vaccineForm?: FormGroup) {

    const ageUnit = this.registrarMasterData.ageUnit;
    console.log("ageUnit",ageUnit);
    ageUnit.forEach((element, i) => {
      if (element.name === vaccineForm.value.ageUnit) {
        vaccineForm.patchValue({
          ageUnit: element.name,
          ageUnitID: element.id
        });
      }
    });
    this.validateAge(vaccineForm);
    // if (this.personalDetailsForm.value.age != null) {
    //   this.onAgeEntered();
    // }
  }

  nurseMasterDataSubscription: any;
  getMasterData() {
    this.nurseMasterDataSubscription = this.masterdataService.nurseMasterData$.subscribe(masterData => {
      if (masterData) {
        // this.nurseMasterDataSubscription.unsubscribe();
        this.masterData = masterData;
        this.vaccineMasterData = masterData.vaccineMasterData;

        this.addOtherVaccine();

        if (this.mode == 'view') {
          this.getGeneralHistory();
        }
        if(parseInt(localStorage.getItem("specialistFlag")) == 100)
        {
          this.getGeneralHistory();
        }
       
      }
    })
  }

  generalHistorySubscription: any;
  getGeneralHistory() {
    this.generalHistorySubscription = this.doctorService.populateHistoryResponse$.subscribe(history => {
      if (history != null && history.statusCode == 200 && history.data != null && history.data.childOptionalVaccineHistory) {
        this.otherVaccineData = history.data.childOptionalVaccineHistory;
        this.handleOtherVaccinesData();
      }
    })
  }
  callMasterDataObservable() {
    this.registrarService.getRegistrationMaster(1);
    this.loadMasterDataObservable();
  }

  /**
   *
   * Load Master Data of Id Cards as Observable
   */
   masterDataSubscription: any;
  loadMasterDataObservable() {
    this.masterDataSubscription = this.registrarService.registrationMasterDetails$
      .subscribe(res => {
        console.log('Registrar master data', res);
        if (res != null) {
          this.registrarMasterData = Object.assign({}, res);
         console.log("master data",this.registrarMasterData);
        }
      })
  }
  handleOtherVaccinesData() {
    let formArray = this.otherVaccinesForm.controls['otherVaccines'] as FormArray;
    let temp = this.otherVaccineData.childOptionalVaccineList.slice();

    for (let i = 0; i < temp.length; i++) {
      let vaccines = this.vaccineMasterData.filter(item => {
        return item.vaccineName == temp[i].vaccineName;
      });

      if (vaccines.length > 0)
        temp[i].vaccineName = vaccines[0];


      if (temp[i].vaccineName) {
        let k = formArray.get('' + i);
        k.patchValue(temp[i]);
        k.markAsTouched();
        this.filterOtherVaccineList(temp[i].vaccineName, i);
      }

      if (i + 1 < temp.length)
        this.addOtherVaccine();
    }
    console.log("this.othervaccine",this.otherVaccinesForm);
  }

  addOtherVaccine() {
    let otherVaccineList = <FormArray>this.otherVaccinesForm.controls['otherVaccines'];
    let temp = otherVaccineList.value;
    let result = []

    if (this.vaccineMasterData) {
      result = this.vaccineMasterData.filter((item) => {
        let arr = temp.filter((value) => {
          if (value.vaccineName != null && value.vaccineName.vaccineName != 'Other')
            return value.vaccineName.vaccineName == item.vaccineName;
        })
        let flag = arr.length == 0 ? true : false;
        return flag;
      });
    }
    this.vaccineSelectList.push(result.slice());
    otherVaccineList.push(this.initOtherVaccinesForm());
  }

  filterOtherVaccineList(vaccine, i, vaccineForm?: FormGroup) {
    let previousValue = this.previousSelectedVaccineList[i];
    let snomedCTCode=vaccine.sctCode;
    let snomedCTTerm=vaccine.sctTerm;
    //snomedCTCode=vaccineForm.sctCode;
    //console.log("count:", snomedCTCode);
    if (vaccineForm && vaccine.vaccineName != 'Other'){
      vaccineForm.patchValue({ otherVaccineName: null });
      if(vaccine.sctCode != null)
      {
        vaccineForm.patchValue({sctCode:snomedCTCode, sctTerm: snomedCTTerm});
      }
      else{
        vaccineForm.patchValue({sctCode:null, sctTerm:null});
      }
    }

    if (previousValue) {
      this.vaccineSelectList.map((item, t) => {
        if (t != i && previousValue.vaccineName != 'Other') {
          item.push(previousValue);
          this.sortOtherVaccineList(item);
        }
      })
    }

    this.vaccineSelectList.map((item, t) => {
      let index = item.indexOf(vaccine);
      if (index != -1 && t != i && vaccine.vaccineName != 'Other')
        item = item.splice(index, 1);
    })

    this.previousSelectedVaccineList[i] = vaccine;
  }

  removeOtherVaccine(i, vaccineForm?: FormGroup) {
    this.confirmationService.confirm(`warn`, this.currentLanguageSet.alerts.info.warn).subscribe(result => {
      if (result) {
        let otherVaccineList = <FormArray>this.otherVaccinesForm.controls['otherVaccines'];
        this.otherVaccinesForm.markAsDirty();
        if (!!vaccineForm && otherVaccineList.length == 1) {
          vaccineForm.reset();
        } else {
          let removedValue = this.previousSelectedVaccineList[i];

          this.vaccineSelectList.map((item, t) => {
            if (t != i && !!removedValue && removedValue.vaccineName != 'Other') {
              item.push(removedValue);
              this.sortOtherVaccineList(item);
            }
          })

          this.previousSelectedVaccineList.splice(i, 1);
          this.vaccineSelectList.splice(i, 1);
          otherVaccineList.removeAt(i);
        }
      }
    });

  }

  initOtherVaccinesForm() {
    return this.fb.group({
      vaccineName: null,
      sctCode: null,
      sctTerm:null,     
      otherVaccineName: null,
      actualReceivingAge: null,
      ageUnit: null,
      ageUnitID: null,
      receivedFacilityName: null
    })
  }

  getPreviousOtherVaccineDetails() {
    let benRegID = localStorage.getItem('beneficiaryRegID');
    this.nurseService.getPreviousOtherVaccines(benRegID, this.visitType)
      .subscribe(res => {
        if (res.statusCode == 200 && res.data != null) {
          if (res.data.data.length > 0) {
            this.viewPreviousData(res.data);
          } else {
            this.confirmationService.alert(this.currentLanguageSet.alerts.info.pastHistoryNot);
          }
        } else {
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.errorFetchingHistory, 'error');
        }
      }, err => {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.errorFetchingHistory, 'error');
      })
  }

  viewPreviousData(data) {
    this.dialog.open(PreviousDetailsComponent, {
      data: { 'dataList': data, title: this.currentLanguageSet.common.prevVaccine }
    });
  }

  validateAge(formGroup) {
    if(formGroup.value.actualReceivingAge !=undefined && formGroup.value.actualReceivingAge !=null
      && formGroup.value.ageUnit !=undefined && formGroup.value.ageUnit !=null)
    {
      let actualReceivingAge = formGroup.value.actualReceivingAge;
      let ageUnit=formGroup.value.ageUnit;
      let flag = new ValidationUtils().validateDuration(actualReceivingAge, ageUnit, this.beneficiary.age);
      
      // if (this.beneficiary && (this.beneficiary.ageVal *365) < actualReceivingAge) {
      //   this.confirmationService.alert(this.currentLanguageSet.alerts.info.ageOfReceivingVaccine);
      //   formGroup.patchValue({ actualReceivingAge: null });
      //   formGroup.patchValue({ ageUnitID: null });
      //   formGroup.patchValue({ ageUnit: null });
      // }
      if (!flag) {
        this.confirmationService.alert(this.currentLanguageSet.alerts.info.ageOfReceivingVaccine);
        formGroup.patchValue({ actualReceivingAge: null });
        formGroup.patchValue({ ageUnitID: null });
        formGroup.patchValue({ ageUnit: null });
      }
    }
    else if((formGroup.value.actualReceivingAge ==undefined || formGroup.value.actualReceivingAge ==null)
      && (formGroup.value.ageUnit !=undefined && formGroup.value.ageUnit !=null))
      {
        formGroup.patchValue({ ageUnitID: null });
        formGroup.patchValue({ ageUnit: null });
      }
  }
 
  sortOtherVaccineList(otherVaccineList) {
    otherVaccineList.sort((a, b) => {
      if (a.vaccineName == b.vaccineName) return 0;
      if (a.vaccineName < b.vaccineName) return -1;
      else return 1;
    })
  }

  checkValidity(otherVaccineForm) {
    let temp = otherVaccineForm.value;
    if (temp.vaccineName && temp.actualReceivingAge && temp.receivedFacilityName) {
      return false;
    } else {
      return true;
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
}
