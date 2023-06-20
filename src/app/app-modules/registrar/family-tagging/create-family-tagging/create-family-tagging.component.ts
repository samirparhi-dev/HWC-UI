/*
* AMRIT – Accessible Medical Records via Integrated Technology 
* Integrated EHR (Electronic Health Records) Solution 
*
* Copyright (C) "Piramal Swasthya Management and Research Institute" 
*
* This file is part of AMRIT.
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see https://www.gnu.org/licenses/.
*/
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ConfirmationService } from 'app/app-modules/core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { FamilyTaggingService } from '../../shared/services/familytagging.service';

@Component({
  selector: 'app-create-family-tagging',
  templateUrl: './create-family-tagging.component.html',
  styleUrls: ['./create-family-tagging.component.css']
})
export class CreateFamilyTaggingComponent implements OnInit {

  @ViewChild('newFamilyTaggingForm') form: any;
  currentLanguageSet: any;
  newFamilyTaggingForm: FormGroup;
  objs: any =[];
  relationWithHeadOfFamilyID = [];
  relationWithHeadOfFamily = [];
  isHeadOfFamilies = ['yes', 'No']
  relationShipType: any;
  relationShipList: any;
  enableOther: boolean;
  otherRelation: any;
  familyHead: any;
  familyName: any;
  benRelationshipID: any;
  getCreatedFamilyDetails: any;
  benFamilyName: any;
  benFamilyID: any;
  beneficiaryRegID: any;
  beneficiaryName: any;
  isHeadOfTheFamily: string;
  benVillageId: any;
  countryId = 1;


  constructor(
    public mdDialogRef: MdDialogRef<CreateFamilyTaggingComponent>, 
    public httpServiceService: HttpServiceService,
    private familyTaggingService: FamilyTaggingService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder,
    @Inject(MD_DIALOG_DATA) public data: any,

    ) { }

  ngOnInit() {
    this.benFamilyName = this.data.benFamilyName;
    this.benFamilyID = this.data.benFamilyID;
    this.beneficiaryRegID = this.data.benRegId;
    this.beneficiaryName = this.data.beneficiaryName
    this.benVillageId = this.data.benVillageId;
    this.assignSelectedLanguage();
    this.CreatenewFamilyTaggingForm();
    this.getSurname();
    this.getRelationShipMaster();
  }

  
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  CreatenewFamilyTaggingForm() {
   this.newFamilyTaggingForm = this.fb.group({
    familyName: null,
    isHeadOfTheFamily: null,
    relationWithHeadOfFamily: null,
    otherRelation: null
   });
  }


  ResetForm(){
    this.form.reset();
    this.enableOther = false;
  }

  getSurname(){
    //  let patchSurname = "sharma";
     this.familyName = this.benFamilyName;
  // this.newFamilyTaggingForm.controls['familyName'].setValue(patchSurname);
}

  createNewFamilyTagging() {
    let typeOfRelation = this.relationShipType.filter(item => {
      if(item.benRelationshipID === this.relationWithHeadOfFamily)
             return item;
      
    });
    
     let reqObject = {
      "beneficiaryRegId": this.beneficiaryRegID,
      "familyName" : this.familyName,
      "headofFamily_RelationID" : this.relationWithHeadOfFamily,
      "headofFamily_Relation" : typeOfRelation[0].benRelationshipType,
      "familyHeadName" : (this.isHeadOfTheFamily === "yes") ? this.beneficiaryName : null,
      "other" : this.otherRelation,
      "villageId" : parseInt(this.benVillageId),
      "vanID": JSON.parse(localStorage.getItem('serviceLineDetails')).vanID,
      "parkingPlaceID": JSON.parse(localStorage.getItem('serviceLineDetails')).parkingPlaceID,
      "createdBy": localStorage.getItem('userName')
    }
    console.log("Details to be saved", reqObject);
    this.familyTaggingService.createFamilyTagging(reqObject).subscribe(response => {
        //       let response = {
        //   "data":{"benFamilyTagId":10,"familyId":"16626482041101581","familyName":"Mishra","noOfmembers":1,"villageId":899,"familyHeadName":"Shubham","createdBy":"tmall","vanID":220,"parkingPlaceID":246,"beneficiaryRegId":265240,"headofFamily_RelationID":1,"headofFamily_Relation":"io"},"statusCode":200,"errorMessage":"Success","status":"Success"
        // }
      if (response.statusCode == 200 && response.data) { 
        this.confirmationService.alert(this.currentLanguageSet.familyCreatedSuccessfully,"success");
        this.getCreatedFamilyDetails = response.data
        this.mdDialogRef.close(this.getCreatedFamilyDetails);
      
      } else {
        this.confirmationService.alert(response.errorMessage, "error");
        this.mdDialogRef.close(false);
      }
    },
    err => {
      this.confirmationService.alert(err, "error");
      this.mdDialogRef.close(false);
    }
  );
 }




  getRelationShipMaster()
  {
    this.familyTaggingService.getRelationShips(this.countryId)
      .subscribe((res) => {
        if (res && res.statusCode === 200) {
          this.relationShipType = res.data.relationshipMaster;
        } else {
          this.confirmationService.alert(this.currentLanguageSet.issueFetchingRelationship, 'error');
        }

      })
  }
        
  populateRelation(isHead) {
    //   this.relationShipType=[
    //     {
    //       "benRelationshipID": 16,
    //       "benRelationshipType": "Self",
    //       "gender": "unisex"
    //     },
    //     {
    //       "benRelationshipID": 13,
    //       "benRelationshipType": "Aunt",
    //       "gender": "unisex"
    //     },
    //     {
    //       "benRelationshipID": 6,
    //       "benRelationshipType": "Brother",
    //       "gender": "male"
    //     },
    //     {
    //       "benRelationshipID": 9,
    //       "benRelationshipType": "Daughter",
    //       "gender": "female"
    //     },
    //     {
    //       "benRelationshipID": 4,
    //       "benRelationshipType": "Father",
    //       "gender": "male"
    //     },
    //     {
    //       "benRelationshipID": 14,
    //       "benRelationshipType": "Grand Father",
    //       "gender": "unisex"
    //     },
    //     {
    //       "benRelationshipID": 15,
    //       "benRelationshipType": "Grand Mother",
    //       "gender": "unisex"
    //     },
    //     {
    //       "benRelationshipID": 5,
    //       "benRelationshipType": "Mother",
    //       "gender": "female"
    //     },
    //     {
    //       "benRelationshipID": 11,
    //       "benRelationshipType": "Other",
    //       "gender": "unisex"
    //     },
    //     {
    //       "benRelationshipID": 7,
    //       "benRelationshipType": "Sister",
    //       "gender": "female"
    //     },
    //     {
    //       "benRelationshipID": 8,
    //       "benRelationshipType": "Son",
    //       "gender": "male"
    //     },
    //     {
    //       "benRelationshipID": 10,
    //       "benRelationshipType": "Spouse",
    //       "gender": "unisex"
    //     },
    //     {
    //       "benRelationshipID": 12,
    //       "benRelationshipType": "Uncle",
    //       "gender": "unisex"
    //     }
    //   ];
      this.relationShipList=[];
      this.enableOther = false;
      this.otherRelation=null

      if(isHead.toLowerCase() === "yes")
      {
        let relation= this.relationShipType.filter(item => {
          if(item.benRelationshipType.toLowerCase() === "self")
          {
            this.relationShipList.push(item);
            return item.benRelationshipID;
          }
        });
         this.relationWithHeadOfFamily = relation[0].benRelationshipID;
         
      }
      else
      {
           this.relationShipType.filter(item => {
          if(item.benRelationshipType.toLowerCase() !== "self")
          {
            this.relationShipList.push(item);
           
          }
        });

        this.relationWithHeadOfFamily = null;
      }
    }
    checkOtherRelation(relationValue){
      this.otherRelation =null;
      let relationTypeValue= this.relationShipType.filter(item => {
        if(item.benRelationshipType.toLowerCase() === "other")
        {
          return item;
        }
      });

     if(relationTypeValue[0].benRelationshipID === relationValue)
     {
      this.enableOther = true;
     }
     else{
      this.enableOther = false;
     }
    }

}
