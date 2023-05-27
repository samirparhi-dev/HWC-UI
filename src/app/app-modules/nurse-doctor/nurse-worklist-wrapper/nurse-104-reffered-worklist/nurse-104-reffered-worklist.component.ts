import { Component, DoCheck, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ConfirmationService } from '../../../core/services/confirmation.service';
import { NurseService } from '../../shared/services';
import { CameraService } from '../../../core/services/camera.service';
import { BeneficiaryDetailsService } from '../../../core/services/beneficiary-details.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { RegistrarService } from 'app/app-modules/registrar/shared/services/registrar.service';
import moment from 'moment';


@Component({
  selector: 'app-nurse-104-reffered-worklist',
  templateUrl: './nurse-104-reffered-worklist.component.html',
  styleUrls: ['./nurse-104-reffered-worklist.component.css']
})

export class Nurse104RefferedWorklistComponent implements OnInit, DoCheck {

  rowsPerPage = 5;
  activePage = 1;
  pagedList = [];
  rotate = true;
  beneficiary: any;
  regDate: string;

  beneficiaryName: any;



  blankTable = [1, 2, 3, 4, 5];
  beneficiaryList: any;
  filteredBeneficiaryList = [];
  filterTerm;
  currentLanguageSet: any;
  currentPage: number;

  constructor(
    private nurseService: NurseService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private cameraService: CameraService,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
    private registrarService: RegistrarService,
) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    localStorage.setItem('currentRole', 'Nurse');
    //this.removeBeneficiaryDataForNurseVisit();
  //  this.getNurseWorklist();
    this.beneficiaryDetailsService.reset();
    this.nurse104ReferredWorklistResponce();
  
  }
  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  ngOnDestroy() {
    localStorage.removeItem('currentRole');
  }

  removeBeneficiaryDataForNurseVisit() {
    localStorage.removeItem('benCallID');
    localStorage.removeItem('beneficiaryGender');
    localStorage.removeItem('patientName');
    localStorage.removeItem('patientAge');
    localStorage.removeItem("referredFlag");
    localStorage.removeItem('beneficiaryRegID');
    localStorage.removeItem('beneficiaryID');
    localStorage.removeItem('doctorFlag');
     }


     
        



  pageChanged(event): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.pagedList = this.filteredBeneficiaryList.slice(startItem, endItem);
  }

  patientImageView(benregID: any) {
    this.beneficiaryDetailsService.getBeneficiaryImage(benregID)
      .subscribe(data => {
        if (data && data.benImage)
          this.cameraService.viewImage(data.benImage);
        else
          this.confirmationService.alert(this.currentLanguageSet.alerts.info.imageNotFound);
      });
  }

  
  
  
  loadNursePatientDetails(beneficiary)
  {
    if(beneficiary.referredFlag == false){
     this.confirmationService.confirm('info', this.currentLanguageSet.alerts.info.confirmtoProceedFurther)
    .subscribe(result => {
      if (result) {
        localStorage.setItem('benCallID', beneficiary.benCallID);
        localStorage.setItem('beneficiaryGender', beneficiary.genderName);
        localStorage.setItem('patientName', beneficiary.benName);
        localStorage.setItem('patientAge', beneficiary.age);
        localStorage.setItem('beneficiaryRegID', beneficiary.beneficiaryRegID);
        localStorage.setItem('referredFlag', beneficiary.referredFlag);
        localStorage.setItem('beneficiaryID', beneficiary.beneficiaryID);
        localStorage.setItem('benVisitNo', beneficiary.benVisitNo);
        localStorage.setItem('benFlowID', beneficiary.benFlowID);
        this.router.navigate(['/common/attendant/nurse/104referredpatient/', beneficiary.beneficiaryRegID]);
  }
    });
    }
    else{
      this.confirmationService.alert(this.currentLanguageSet.alerts.info.consultation_done);
    }
  }

     nurse104ReferredWorklistResponce()
     {
      let vanId = JSON.parse(localStorage.getItem('serviceLineDetails')).vanID;
      this.nurseService.loadNursePatientDetails(vanId)
      .subscribe((res) => {

        if (res != null) {
          const benlist = this.loadDataToNurse104ReferredWorklist(res);
          this.beneficiaryList = benlist;
          this.filteredBeneficiaryList = benlist;
          this.pageChanged({
            page: this.activePage,
            itemsPerPage: this.rowsPerPage
            });

          this.filterTerm = null;
          this.currentPage=1;
        } else
          this.confirmationService.alert(res.errorMessage, 'error');
      }, err => {
        this.confirmationService.alert(err, 'error');
      });

      


   }


loadDataToNurse104ReferredWorklist(data) {
  data.forEach(element => {
    element.genderName = element.genderName || 'Not Available'
    element.age = element.age || 'Not Available'
    element.benVisitNo = element.benVisitNo || 'Not Available'
    element.districtName = element.districtName || 'Not Available'
    element.villageName = element.villageName || 'Not Available'
    element.preferredPhoneNum = element.preferredPhoneNum || 'Not Available'
    element.referredFlag = element.referredFlag
  })
  return data;
}




  /* 
  filterBeneficiaryList(searchTerm: string) {
    if (!searchTerm)
      this.filteredBeneficiaryList = this.beneficiaryList;
    else {
      this.filteredBeneficiaryList = [];
      this.beneficiaryList.forEach((item) => {
        console.log('item', JSON.stringify(item, null, 4))
        for (let key in item) {
          if (key == 'beneficiaryID' || key == 'benName' || key == 'genderName' || key == 'districtName' || key == 'preferredPhoneNum' || key == 'villageName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredBeneficiaryList.push(item); break;
            }
          } else {
            if (key == 'benVisitNo') {
              let value: string = '' + item[key];
              if (value == '1') {
                let val = 'First visit'
                if (val.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                  this.filteredBeneficiaryList.push(item); break;
                }
              } 
              else if(value == '2'){
                let val = 'Revist'
                if (val.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                  this.filteredBeneficiaryList.push(item); break;
                }
              }
              else if(value == '3'){
                let val = 'Tele-Consultation Done'
                if (val.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                  this.filteredBeneficiaryList.push(item); break;
                }
              }
              else {
                let val = 'Tele-Consultation'
                if (val.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                  this.filteredBeneficiaryList.push(item); break;
                }
              }


            }
          }
        }
      });
    }
    this.activePage = 1;
    this.pageChanged({
      page: 1,
      itemsPerPage: this.rowsPerPage
    });
    this.currentPage=1;
  }
*/
  // rebash() {
  //   this.beneficiaryDetailsService.getCheck()
  //   .subscribe(data => {
  //     console.log(data);
  //   })
  // }


  filterBeneficiaryList(searchTerm: string) {
    if (!searchTerm)
      this.filteredBeneficiaryList = this.beneficiaryList;
    else {
      this.filteredBeneficiaryList = [];
      this.beneficiaryList.forEach((item) => {
        console.log('item', JSON.stringify(item, null, 4))
        for (let key in item) {
          if (key == 'beneficiaryID' || key == 'benName' || key == 'genderName' || key == 'age' || key == 'districtName' || key == 'preferredPhoneNum' || key == 'villageName') {
            let value: string = '' + item[key];
            if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
              this.filteredBeneficiaryList.push(item); break;
            }
          } else {
            if (key == 'benVisitNo') {
              let value: string = '' + item[key];
              if (value == '1') {
                let val = 'First visit'
                if (val.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                  this.filteredBeneficiaryList.push(item); break;
                }
              } else {
                let val = 'Revist'
                if (val.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
                  this.filteredBeneficiaryList.push(item); break;
                }
              }
            }
          }
        }
      });
    }
    this.activePage = 1;
    this.pageChanged({
      page: 1,
      itemsPerPage: this.rowsPerPage
    });
    this.currentPage=1;
  }


}
