import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked, Inject, HostListener } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../core/services/common-services.service';
import { environment } from 'environments/environment';
import { RegistrarService } from '../shared/services/registrar.service';
import { ConfirmationService } from '../../core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FamilyTaggingService } from '../shared/services/familytagging.service';

interface Beneficary {
   village: String;
   villageID: String;
   districtID: String;
   blockID: String;
   surname: String;
   familyId: String;
  }

  @Component({
    selector: 'app-search-family',
    templateUrl: './search-family.component.html',
    styleUrls: ['./search-family.component.css'] 
  })

  export class SearchFamilyComponent implements OnInit {


    
    masterData: any;
    masterDataSubscription: any;
    surname: any;
    villageID: any;
  
    
    familyIds: any;
  
    beneficiary: Beneficary;
    familySearchForm: FormGroup;
    currentLanguageSet: any;
    today: Date;
    disableState: Boolean = true;
    disableDistrict: Boolean = true;
    disableBlock: Boolean = false;

 
    familyDetails: any;
    // demographicsMaster: any;
    districtList: any;
    blockList: any;
    villageList: any;
    statesList: any;
    stateValue: any;
    benDistrictId: any;
    benBlockId: any;
    benVillageId: any;
    showProgressBar: Boolean = false;
    

    constructor(private confirmationService: ConfirmationService,private formBuilder: FormBuilder,public httpServiceService: HttpServiceService,
        public mdDialogRef: MdDialogRef<SearchFamilyComponent>, public commonService: CommonService,private router: Router,
      private registrarService: RegistrarService, private changeDetectorRef: ChangeDetectorRef,private familyTaggingService: FamilyTaggingService,
      @Inject(MD_DIALOG_DATA) public data: any,) { }
    
      ngOnInit() {
        this.showProgressBar = true;
        this.createFamilySearchForm();
        this.assignSelectedLanguage();
        // this.configState();
        if(this.data !== null && this.data !== undefined){
        this.familySearchForm.controls['surname'].setValue((this.data.benSurname !== undefined && this.data.benSurname !== null && this.data.benSurname !== "null" && this.data.benSurname !== "") ? this.data.benSurname : null);
        this.benDistrictId = parseInt(this.data.benDistrictId);
        this.benBlockId = parseInt(this.data.benBlockId);
        this.benVillageId = parseInt(this.data.benVillageId);
      }
   

      this.fetchDistrictsOnStateSelection();
      }

      ngDoCheck(){
        this.assignSelectedLanguage();
      }

      // configState() {
      //   this.demographicsMaster = Object.assign(
      //     {},
      //     JSON.parse(localStorage.getItem("location")),
      //     { servicePointID: localStorage.getItem("servicePointID") },
      //     { servicePointName: localStorage.getItem("servicePointName") }
      //   );
      //   // this.stateValue = this.demographicsMaster.otherLoc.stateID;
      // }


      createFamilySearchForm() {
        this.familySearchForm = this.formBuilder.group({
          villageID: [null, Validators.required],
          districtID: [null, Validators.required],
          blockID:[null, Validators.required],
          surname:[null, Validators.required],
          familyId:null

        })
      }

      getFamilySearchMaster(){
        let requestObj = {
               "villageId": this.familySearchForm.value.villageID,
                "districtId": this.familySearchForm.value.districtID,
                "blockId": this.familySearchForm.value.blockID,
                "familyName": this.familySearchForm.value.surname,
                "familyId": this.familySearchForm.value.familyId,
              
          }
        
        this.familyTaggingService.benFamilySearch(requestObj)
        .subscribe((res) => {
          if (res && res.statusCode === 200 && res.data && res.data.response === undefined) {
      
              this.familyDetails = res.data;
            this.mdDialogRef.close({"familyDetails" : this.familyDetails, "searchRequest" : requestObj});
           
          } else {
            this.confirmationService.alert(res.data.response, 'info');
              this.mdDialogRef.close(null);  // if no record is found than the result is passing as null
            }
          err => {
            this.confirmationService.alert(err, "error");
            this.mdDialogRef.close(false);
          }
        });
      
      }

     
      assignSelectedLanguage() {
        const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
        getLanguageJson.setLanguage();
        this.currentLanguageSet = getLanguageJson.currentLanguageObject;
        }

          // loadLocationFromStorage() {
          //   let location = JSON.parse(localStorage.getItem("location"));
          //   this.demographicsMaster = Object.assign({}, location,
          //   );
        
          //   console.log(this.demographicsMaster, "demographics master");
        
          //   if (
          //     this.demographicsMaster.otherLoc &&
          //     this.demographicsMaster.stateMaster &&
          //     this.demographicsMaster.stateMaster.length >= 1 
              
          //   ) {
          //     this.districtList = this.demographicsMaster.otherLoc.districtList;
          //     this.blockList = [];
          //     this.villageList = [];
          //     this.emptyDistrict();
          //     this.emptyVillage();
          //     this.emptyBlock();
          //     this.disableDistrict = false;
          //   } else if (
          //     this.demographicsMaster.stateMaster &&
          //     this.demographicsMaster.stateMaster.length >= 1
          //   ) {
          //     this.statesList = this.demographicsMaster.stateMaster;
          //     this.districtList = [];
          //     this.blockList = [];
          //     this.villageList = [];
        
          //     this.emptyVillage();
          //     this.emptyBlock();
          //     this.emptyDistrict();
          //     this.emptyState();
          //   }
          // }

          onVillageChange() {
            this.updateVillageName();
          }

          updateVillageName() {
            this.villageList.find((village) => {
              if (
                village.districtBranchID === this.familySearchForm.value.villageID
              ) {
                this.familySearchForm.patchValue({
                  villageName: village.villageName,
                });
              }
            });
          }

          onBlockChange() {      
            this.registrarService
              .getVillageList(this.familySearchForm.value.blockID)
              .subscribe((res) => {
                if (res && res.statusCode === 200) {
                  this.villageList = res.data;
                  this.emptyVillage();
                } else {
                  this.confirmationService.alert(
                    this.currentLanguageSet.alerts.info
                      .IssuesInFetchingLocationDetails,
                    "error"
                  );
                }
              });
          }

          emptyDistrict() {
            this.familySearchForm.patchValue({
              districtID: null,
              districtName: null,
            });
          }

          emptyVillage() {
            this.familySearchForm.patchValue({
              villageID: null,
              villageName: null,
            });
          }

          emptyBlock() {
            this.familySearchForm.patchValue({
              blockID: null,
              blockName: null,
            });
          }

          emptyState() {
            this.familySearchForm.patchValue({
              stateID: null,
              stateName: null,
            });
          }

          onDistrictChange() {
           
            this.fetchBlockSelection();
          }

          

        
          fetchBlockSelection() {
            this.registrarService
            .getSubDistrictList(this.familySearchForm.value.districtID)
            .subscribe((res) => {
              if (res && res.statusCode === 200) {
                this.blockList = res.data;
                this.emptyBlock();
                this.emptyVillage();
              } else {
                this.confirmationService.alert(
                  this.currentLanguageSet.alerts.info.IssuesInFetchingDemographics,
                  "error"
                );
              }
            });
          }

          fetchDistrictsOnStateSelection() {
            
            let stateId = this.registrarService.stateIdFamily;
            this.registrarService
              .getDistrictList(stateId)
              .subscribe((res) => {
                if (res && res.statusCode === 200) {
                  this.districtList = res.data;
                  this.emptyDistrict();
                  this.emptyBlock();
                  this.emptyVillage();
                  
                  this.familySearchForm.controls['districtID'].setValue((this.benDistrictId !== undefined && this.benDistrictId !== null) ? this.benDistrictId : null);
                  this.fetchBlockSelectionInitial();
                } else {
                  this.confirmationService.alert(
                    this.currentLanguageSet.alerts.info.IssuesInFetchingDemographics,
                    "error"
                  );
                }
              });
          }
        
          
          fetchBlockSelectionInitial() {
            this.registrarService
            .getSubDistrictList(this.familySearchForm.value.districtID)
            .subscribe((res) => {
              if (res && res.statusCode === 200) {
                this.blockList = res.data;
                this.emptyBlock();
                this.emptyVillage();
                this.familySearchForm.controls['blockID'].setValue((this.benBlockId !== undefined && this.benBlockId !== null) ? this.benBlockId : null);
                 this.onBlockChangeInitial();
              } else {
                this.confirmationService.alert(
                  this.currentLanguageSet.alerts.info.IssuesInFetchingDemographics,
                  "error"
                );
              }
            });
          }

          onBlockChangeInitial() {      
            this.registrarService
              .getVillageList(this.familySearchForm.value.blockID)
              .subscribe((res) => {
                if (res && res.statusCode === 200) {
                  this.villageList = res.data;
                  this.emptyVillage();
                  this.familySearchForm.controls['villageID'].setValue((this.benVillageId !== undefined && this.benVillageId !== null) ? this.benVillageId : null);
                  this.showProgressBar = false;
                } else {
                  this.confirmationService.alert(
                    this.currentLanguageSet.alerts.info
                      .IssuesInFetchingLocationDetails,
                    "error"
                  );
                }
              });
          }

          onClose(){
            // this.router.navigate([
            //     "/registrar/familyTagging/"
            //   ]);
              this.mdDialogRef.close();
          }


          dataObj:any;
          getSearchResult(formValues){
            this.dataObj = {
              villageID: formValues.village,
              }
            };


            @HostListener('document:keypress', ['$event'])
            startSearch(event: KeyboardEvent) {
              if (event.code === "Enter") {
                if(this.familySearchForm.valid) {
                this.getFamilySearchMaster();
                }
              }
            }        
        
    }
