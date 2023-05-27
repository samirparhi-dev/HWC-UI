import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ConfirmationService } from 'app/app-modules/core/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { FamilyTaggingService } from '../../shared/services/familytagging.service';
import { SearchFamilyComponent } from '../../search-family/search-family.component';
import { RegistrarService } from '../../shared/services/registrar.service';
import { CreateFamilyTaggingComponent } from '../create-family-tagging/create-family-tagging.component';
import { EditFamilyTaggingComponent } from '../edit-family-tagging/edit-family-tagging.component';

@Component({
  selector: 'app-family-tagging-details',
  templateUrl: './family-tagging-details.component.html',
  styleUrls: ['./family-tagging-details.component.css']
})
export class FamilyTaggingDetailsComponent implements OnInit {

  @ViewChild('sidenav')
  sidenav: any;

  currentLanguageSet: any;
  reqObj: { familyId: any; familyName: any; isHeadOfFamily: any; relationWithHeadOfFamily: any; otherRelation: any; };
  blankTable = [1, 2, 3, 4, 5, 6 ,7, 8, 9, 10];
  familytaggingservice: any;
  revisitDataSubscription: any;
  revisitData: any;
  params: any;
  disableCreateFamily: boolean = false;
  externalSearchTerm: any;
  benFamilyId = null;
  benFamilyName = null;
  headOfTheFamily = null;
  familySearchList = [];
  createdFamilyList = [];
  beneficiaryRegID: any;
  beneficiaryName: any;
  enableFamilyCreateTable: boolean = true;
  beneficiaryRelationWithHeadOfFamily: any;
  benVillageId: any;
  beneficiaryId: any;
  searchRequest: any=null;
  beneficiary:any;
  
  benDistrictId: any;
  benBlockId: any;
  // enableBacktoReg: boolean = true;
  // beneficiaryId: any;

  constructor(
    private dialog: MdDialog,
    public httpServiceService: HttpServiceService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private familyTaggingService: FamilyTaggingService,
    private registrarService: RegistrarService,
    private route: ActivatedRoute,

    ) { }

  ngOnInit() {
    this.assignSelectedLanguage();
    this.benFamilyId = this.route.snapshot.paramMap.get('familyId')
      this.benFamilyName = this.route.snapshot.paramMap.get('familyName');
      this.beneficiaryRegID  = this.route.snapshot.paramMap.get('beneficiaryRegID');
      this.beneficiaryName = this.route.snapshot.paramMap.get('beneficiaryName');
      this.benDistrictId = this.route.snapshot.paramMap.get('benDistrictId');  
      this.benBlockId = this.route.snapshot.paramMap.get('benBlockId');
      this.benVillageId = this.route.snapshot.paramMap.get('benVillageId');
      this.beneficiaryId = this.route.snapshot.paramMap.get('beneficiaryId');
      localStorage.setItem('beneficiaryID', this.beneficiaryId);
      localStorage.setItem('beneficiaryRegID', this.beneficiaryRegID); 
      let familySearchListValues =  this.route.snapshot.paramMap.get('familySearchListDetails');
      if(familySearchListValues !== undefined && familySearchListValues !== null && familySearchListValues !== "undefined" && familySearchListValues !== "null")
      {
        let familySearchListObj = JSON.parse(familySearchListValues);
        this.familySearchList = familySearchListObj.familyDetails;
        this.searchRequest = familySearchListObj.searchRequest;
        this.enableFamilyCreateTable = false;
        this.createdFamilyList = [];
        // this.enableBacktoReg = true;
      }
      else
      {
        this.familySearchList =[];
        this.enableFamilyCreateTable = true;
        this.createdFamilyList = [];
        // this.enableBacktoReg = false;
      }

      this.benFamilyId = (this.benFamilyId !== undefined && this.benFamilyId !== null && this.benFamilyId !== "undefined" && this.benFamilyId !== "null") ? this.benFamilyId : null;
      this.benFamilyName = (this.benFamilyName !== undefined && this.benFamilyName !== null && this.benFamilyName !== "undefined" && this.benFamilyName !== "null") ? this.benFamilyName : null;
      this.beneficiaryRegID = (this.beneficiaryRegID !== undefined && this.beneficiaryRegID !== null && this.beneficiaryRegID !== "undefined" && this.beneficiaryRegID !== "null") ? this.beneficiaryRegID : null;
      this.beneficiaryName = (this.beneficiaryName !== undefined && this.beneficiaryName !== null && this.beneficiaryName !== "undefined" && this.beneficiaryName !== "null") ? this.beneficiaryName : null;
      this.benDistrictId = (this.benDistrictId !== undefined && this.benDistrictId !== null && this.benDistrictId !== "undefined" && this.benDistrictId !== "null") ? this.benDistrictId : null;
      this.benBlockId = (this.benBlockId !== undefined && this.benBlockId !== null && this.benBlockId !== "undefined" && this.benBlockId !== "null") ? this.benBlockId : null;
      this.benVillageId = (this.benVillageId !== undefined && this.benVillageId !== null && this.benVillageId !== "undefined" && this.benVillageId !== "null") ? this.benVillageId : null;
      this.beneficiaryId = (this.beneficiaryId !== undefined && this.beneficiaryId !== null && this.beneficiaryId !== "undefined" && this.beneficiaryId !== "null") ? this.beneficiaryId : null;

// if((familySearchListValues !== undefined && familySearchListValues !== null))
// {
//       this.enableFamilyCreateTable = true;
//       this.familySearchList = [];
//       this.enableBacktoReg = false;

// }

// else{
//   this.enableFamilyCreateTable = false;
//   this.createdFamilyList = [];
//   this.enableBacktoReg = true;
// }

if(this.benFamilyId !== undefined && this.benFamilyId !== null){
  let reqObj={
    "beneficiaryRegID": this.beneficiaryRegID,
    "familyName": this.benFamilyName,
    "familyId": this.benFamilyId,
    "districtId" : this.benDistrictId,
    "blockId" : this.benBlockId,
    "villageId": this.benVillageId,
    "beneficiaryId" : this.beneficiaryId
  };
  this.loadSearchDetails(reqObj);
  this.enableFamilyCreateTable = false;
}



  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  


  
  ngOnDestroy() {
    this.registrarService.stateIdFamily = null;
    localStorage.removeItem('beneficiaryRegID');
    localStorage.removeItem('beneficiaryID');
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  CreateFamilyDialog() {
    let mdDialogRef: MdDialogRef<CreateFamilyTaggingComponent> = this.dialog.open(
      CreateFamilyTaggingComponent,
      {
        width: "60%",
        disableClose: true,
        data : {"benFamilyName" : this.benFamilyName, "benFamilyID": this.benFamilyId , "benRegId": this.beneficiaryRegID, "beneficiaryName": this.beneficiaryName, "benVillageId" : this.benVillageId}

      }
    );
    mdDialogRef.afterClosed().subscribe((result) => {

          
      if(result){
        this.createdFamilyList =[];
        this.createdFamilyList.push(result);
        this.enableFamilyCreateTable = true;
        this.familySearchList = [];
        this.getBeneficiaryDetailsAfterFamilyTag();
        }
      },
      (error) => {
        this.confirmationService.alert(error, "error");
    });
  }

  sideNavModeChange(sidenav) {
    let deviceHeight = window.screen.height;
    let deviceWidth = window.screen.width;

    if (deviceWidth < 700)
      sidenav.mode = "over";
    else
      sidenav.mode = "side";

    sidenav.toggle();
  }
  
  openSearchFamily() {
    let mdDialogRef: MdDialogRef<SearchFamilyComponent> = this.dialog.open(
      SearchFamilyComponent,
      {
        data : {"benSurname" : this.benFamilyName ,"benDistrictId" : this.benDistrictId, "benBlockId" : this.benBlockId, "benVillageId" : this.benVillageId},
        width: "60%",
        disableClose: true,
      }
    );
    mdDialogRef.afterClosed().subscribe((result) => {
      if(result !== null && result !== undefined){
        this.familySearchList = result.familyDetails;
        this.searchRequest = result.searchRequest;
        this.enableFamilyCreateTable = false;
        this.createdFamilyList = [];

        this.getBeneficiaryDetailsAfterFamilyTag();
      }
      // else{
      //   this.familySearchList = [];
      //   this.enableFamilyCreateTable = false;
      //   this.createdFamilyList = [];
      // }
      // this.getBeneficiaryDetailsAfterFamilyTag();
    });

    }  

    loadSearchDetails(requestObj) {
      this.familyTaggingService.benFamilySearch(requestObj)
      .subscribe((res) => {
        if (res && res.statusCode === 200 && res.data && res.data.response === undefined) {
         
                 this.familySearchList = res.data;
        
         
        } else {
          // 
          this.familySearchList=[];
           
          }
        err => {
          this.confirmationService.alert(err, "error");
          
        }
      });
    }

PatientRevistData() {
  this.revisitDataSubscription = this.registrarService.beneficiaryEditDetails
    .subscribe(res => {
      if (res != null) {
        this.revisitData = Object.assign({}, res);
      }
    });
}

  backToRegistration(){
    this.router.navigate(['/registrar/registration']);
  }


  getFamilyMembers(isEdit,familyDetails) {

    let memberReqObj = {
      "familyId" : familyDetails.familyId
   };


   this.familyTaggingService.getFamilyMemberDetails(memberReqObj).subscribe(
    (res: any) => {
      if (res.statusCode == 200 && res.data) {

       let familyMembersList = res.data;
        this.openFamilyTagDialog(isEdit,familyDetails,familyMembersList);
      
      } else {
        this.confirmationService.alert(res.errorMessage, "error");
      }
    },
    err => {
      this.confirmationService.alert(err, "error");
    }
  );

  //comment below code
  // let familyMembersList =  { "familyMembers": [
  //   {
  //     "memberId": 10,
  //     "memberName": "Shobha",
  //     "relationWithHead": "Self"
  //   },
  //   {
  //     "memberId": 11,
  //     "memberName": "Nissi",
  //     "relationWithHead": "Mother"
  //   },
  //   {
  //     "memberId": 12,
  //     "memberName": "Helen",
  //     "relationWithHead": "Sister"
  //   }
  // ]};
  // this.openFamilyTagDialog(isEdit,familyDetails,familyMembersList);

  //

  }

openFamilyTagDialog(isEdit,familyDetails,familyMembersList) {
  let mdDialogRef: MdDialogRef<EditFamilyTaggingComponent> = this.dialog.open(
    EditFamilyTaggingComponent,
    {
      width: "70%",
      disableClose: true,
      data : { "isEdit" : isEdit, "familyData" : familyMembersList, "beneficiaryRegID" : this.beneficiaryRegID, 
    "memberFamilyId" : familyDetails.familyId, "headInFamily" :  familyDetails.familyHeadName, 
  "beneficiaryName" : this.beneficiaryName}
    }
  );

  mdDialogRef.afterClosed().subscribe((result) => {
    if(result) {
       this.loadSearchDetails(this.searchRequest);
        this.getBeneficiaryDetailsAfterFamilyTag();
    }

  });
}

  getBeneficiaryDetailsAfterFamilyTag() {

    const benReqObj = {
      beneficiaryRegID: null,
      beneficiaryID: this.beneficiaryId,
      phoneNo: null,
      HealthID: null,
      HealthIDNumber: null,
      familyId : null,
      identity: null
    };
   

  this.registrarService.identityQuickSearch(benReqObj).subscribe(
    (beneficiaryDetails) => {
      if (beneficiaryDetails && beneficiaryDetails.length == 1) {
         this.benFamilyId = (beneficiaryDetails[0].familyId !== undefined && beneficiaryDetails[0].familyId !== null) ? beneficiaryDetails[0].familyId : null ;
        //  this.benFamilyName =  (beneficiaryDetails[0].familyName !== undefined && beneficiaryDetails[0].familyName !== null) ? beneficiaryDetails[0].familyName : null ;
         this.registrarService.getBenFamilyDetails(this.benFamilyId);
      }
      else
      {
        this.benFamilyId = null;
        //  this.benFamilyName = null;
      }
    },
    (error) => {
      this.confirmationService.alert(error, "error");
    }
  );

  }


  // backToEdit()
  // {
  //   this.router.navigate([
  //     "/registrar/search/" + parseInt(this.beneficiaryId),
  //   ]);
  // }

}
