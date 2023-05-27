import { ConfirmationService } from 'app/app-modules/core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { BeneficiaryDetailsService } from 'app/app-modules/core/services/beneficiary-details.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//import { BeneficiaryDetailsService } from '../../services/beneficiary-details.service';


import 'rxjs/Rx';
//import { HttpServiceService } from '../../services/http-service.service';
import { RegistrarService } from 'app/app-modules/registrar/shared/services/registrar.service';
//import { ConfirmationService } from '../../services';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { Subscription } from 'rxjs/Rx';
import * as moment from 'moment';


@Component({
  selector: 'app-referred-104-beneficiary-details',
  templateUrl: './referred-104-beneficiary-details.component.html',
  styleUrls: ['./referred-104-beneficiary-details.component.css']
})
export class Referred104BeneficiaryDetailsComponent implements OnInit {

  beneficiary: any;
  today: any;
  beneficiaryDetailsSubscription: Subscription;
  familyIdStatusStatusSubscription:Subscription;
  current_language_set: any;
  benDetails: any;
  healthIDArray: any=[];
  healthIDValue: string='';
  beneficiaryId: any;
  benFlowStatus: boolean;
  getBenFamilyData: boolean;
  benFamilySubscription: Subscription
  benFamilyId: any;
  beneficiaryName: any;
  firstName: any;
  lastName: any;
  regDate: string;

  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
    private registrarService: RegistrarService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    
    this.assignSelectedLanguage();
    this.today = new Date();
    this.getBeneficiaryDetails();

  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
    }

  ngOnDestroy() {
    
  }




  getBeneficiaryDetails(){
  const reqObj = {
    "beneficiaryRegID" : null,
    "beneficiaryName" : null,
    "beneficiaryID" : localStorage.getItem('beneficiaryID'),
    "phoneNo" : null,
    "HealthID" : null,
    "HealthIDNumber" : null,
    "familyId" : null,
    "identity" : null,
  };
    this.registrarService.identityQuickSearch(reqObj)
      .subscribe((res) => {
        if (res) {
          
          this.beneficiary = res[0];
       //   this.benFamilyId = res[0].familyId;
       console.log(this.beneficiary);
       console.log(this.beneficiary.firstName);
          this.beneficiaryName = this.beneficiary.firstName + (this.beneficiary.lastName !== undefined ? ( " " + this.beneficiary.lastName) : "")  ;
           this.regDate =  moment.utc(this.beneficiary.createdDate).format('DD-MM-YYYY hh:mm A');
           console.log(this.beneficiaryName);
           console.log(this.regDate);
      } 
      });

    this.beneficiaryDetailsService.getBeneficiaryImage(localStorage.getItem('beneficiaryRegID'))
      .subscribe(data => {
        if (data && data.benImage) {
          this.beneficiary.benImage = data.benImage;
        }
      });
}




}

