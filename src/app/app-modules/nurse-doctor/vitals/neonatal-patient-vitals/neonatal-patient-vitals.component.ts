import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MdDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { IotcomponentComponent } from 'app/app-modules/core/components/iotcomponent/iotcomponent.component';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { BeneficiaryDetailsService, ConfirmationService } from 'app/app-modules/core/services';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { environment } from 'environments/environment';
import { DoctorService, NurseService } from '../../shared/services';
import { AudioRecordingService } from '../../shared/services/audio-recording.service';
import { HrpService } from '../../shared/services/hrp.service';
import * as moment from "moment";

@Component({
  selector: 'nurse-neonatal-patient-vitals',
  templateUrl: './neonatal-patient-vitals.component.html',
  styleUrls: ['./neonatal-patient-vitals.component.css']
})
export class NeonatalPatientVitalsComponent implements OnInit {

  @Input("patientVitalsForm")
  neonatalVitalsForm: FormGroup;

  @Input("mode")
  mode: String;

  @Input("visitCategory")
  visitCategory: String;

  currentLanguageSet: any;
  male: boolean = false;
  totalMonths: number;
  benAge: any;
  female: boolean = false;
  startWeightTest = environment.startWeighturl;
  startTempTest = environment.startTempurl;
  doctorScreen: boolean = false;

    // Audio - SWAASA
    isRecording:boolean = false;
    recordedTime;
    blobUrl;
    teste;
    enableResult:boolean =false;
    enableSymptoms: boolean = false;
    frequentCough: boolean = false;
    sputum: boolean = false;
    coughAtNight: boolean = false;
    wheezing: boolean = false;
    painInChest: boolean = false;
    shortnessOfBreath: boolean = false;
    benGenderType: any;
    age: any;
    coughBlobFile: Blob;
    severityValue: any;
    cough_pattern_Value: any;
    assessmentDetail: any; 
    enableLungAssessment: boolean = false;
    severity: any;
    cough_pattern: any;
    cough_severity_score: any;
    record_duration: any;
    disabledLungAssesment: boolean = false;

  constructor(
    private dialog: MdDialog,
    private confirmationService: ConfirmationService, 
    private beneficiaryDetailsService: BeneficiaryDetailsService,
    public httpServiceService: HttpServiceService,
    private doctorService: DoctorService, 
    private nurseService: NurseService, 
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer
  ) {
  //   this.audioRecordingService
  //   .recordingFailed()
  //   .subscribe(() => (this.isRecording = false));
  // this.audioRecordingService
  //   .getRecordedTime()
  //   .subscribe(time => {this.recordedTime = time;
  //     if(this.recordedTime=="00:16"){
  //       this.stopRecording();
  //     }});
  // this.audioRecordingService.getRecordedBlob().subscribe(data => {
  //   this.teste = data;
  //   this.coughBlobFile = data.blob;
  //   this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(
  //     URL.createObjectURL(data.blob)
  //   );
  // });
  }

  ngOnInit() {
    this.getBeneficiaryDetails();
    if(this.benAge < 18){
      this.disabledLungAssesment = true;
    } else {
      this.disabledLungAssesment = false;
    }

    this.nurseService.clearEnableLAssessment();
    this.getGender();
    // this.nurseService.enableLAssessment$.subscribe(
    //   (response) => {
    //     if(response == true) {
    //       this.enableLungAssessment = true;
    //     } else {
    //       this.enableLungAssessment = false;
    //     }
    //   }
    // );
  }

  ngOnChanges(){
    if (this.mode == "view") {
      let visitID = localStorage.getItem("visitID");
      let benRegID = localStorage.getItem("beneficiaryRegID");
      this.getGeneralVitalsData();
      // this.getAssessmentID();
      this.doctorScreen = true;
    }
    if (parseInt(localStorage.getItem("specialistFlag")) == 100) {
      let visitID = localStorage.getItem("visitID");
      let benRegID = localStorage.getItem("beneficiaryRegID");
      this.getGeneralVitalsData();
    }

    if (this.mode == "update") {
      this.doctorScreen = true;
      this.updateGeneralVitals(this.neonatalVitalsForm);
    }
  }

  ngOnDestroy(){
    if (this.beneficiaryDetailSubscription)
    this.beneficiaryDetailSubscription.unsubscribe();
    if (this.generalVitalsDataSubscription)
    this.generalVitalsDataSubscription.unsubscribe();
  this.nurseService.isAssessmentDone = false;

  }
 
  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }

  benGenderAndAge: any;
  beneficiaryDetailSubscription: any;
  getBeneficiaryDetails() {
    this.beneficiaryDetailSubscription =
      this.beneficiaryDetailsService.beneficiaryDetails$.subscribe(
        (beneficiary) => {
          if (beneficiary) {
            if (beneficiary && beneficiary.ageVal)
      {
        this.benGenderAndAge = beneficiary;
        this.benAge = beneficiary.ageVal;
        if(this.benAge < 18){
          this.disabledLungAssesment = true;
        } else {
          this.disabledLungAssesment = false;
        }
            this.benGenderAndAge = beneficiary;
            let ageMonth = this.benGenderAndAge.age;
        let ar = ageMonth.split(" ");
        this.totalMonths = Number(ar[0] * 12) + Number(ar[3]);
      }
            if (beneficiary !=undefined && 
              beneficiary.genderName != undefined &&
              beneficiary.genderName != null &&
              beneficiary.genderName &&
              beneficiary.genderName.toLowerCase() == "female"
            ) {
              this.female = true;
            }
            if (beneficiary !=undefined && 
              beneficiary.genderName != undefined &&
              beneficiary.genderName != null &&
              beneficiary.genderName &&
              beneficiary.genderName.toLowerCase() == "male"
            ) {
              this.male = true;
            }
          }
        }
      );
  }

  openIOTWeightModel() {
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      width: "600px",
      height: "180px",
      disableClose: true,
      data: { startAPI: this.startWeightTest },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("he;;p", result, result["result"]);
      if (result != null) {
        //result['result']
        this.neonatalVitalsForm.patchValue({
          weight_Kg: result["result"],
        });
        this.doctorService.setValueToEnableVitalsUpdateButton(true);
        
      }
    });
  }

  updateGeneralVitals(neonatalVitalsForm) {
      this.doctorService
        .updateNeonatalVitals(neonatalVitalsForm, this.visitCategory)
        .subscribe(
          (res: any) => {
            if (res.statusCode == 200 && res.data != null) {
              this.confirmationService.alert(res.data.response, "success");
              this.doctorService.setValueToEnableVitalsUpdateButton(false);
              this.neonatalVitalsForm.markAsPristine();
            } else {
              this.confirmationService.alert(res.errorMessage, "error");
            }
          },
          (err) => {
            this.confirmationService.alert(err, "error");
          }
        );
    
  }

  generalVitalsDataSubscription: any;
  getGeneralVitalsData() {
    this.generalVitalsDataSubscription = this.doctorService
      .getGenericVitals({
        benRegID: localStorage.getItem("beneficiaryRegID"),
        benVisitID: localStorage.getItem("visitID"),
      })
      .subscribe((vitalsData) => {
        if (vitalsData) {
          let temp = Object.assign(
            {},
            vitalsData.benAnthropometryDetail,
            vitalsData.benPhysicalVitalDetail
          );
          this.neonatalVitalsForm.patchValue(temp);    
        } 
      });
  }

  openIOTTempModel() {
    let dialogRef = this.dialog.open(IotcomponentComponent, {
      width: "600px",
      height: "180px",
      disableClose: true,
      data: { startAPI: this.startTempTest },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("temperature", result, result["temperature"]);
      if (result != null) {
        this.neonatalVitalsForm.patchValue({
          temperature: result["temperature"],
        });
        this.doctorService.setValueToEnableVitalsUpdateButton(true);
      }
    });
  }

  checkHeight(height_cm) {
    if(this.visitCategory.toLowerCase() === "neonatal and infant health care services"){
    if (height_cm < 35 || height_cm > 85) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }
  if(this.visitCategory.toLowerCase() === "childhood & adolescent healthcare services"){
    if (height_cm < 60 || height_cm > 190) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    } 
  }
  }

  checkWeight(weight_Kg) {
    if(this.visitCategory.toLowerCase() === "neonatal and infant health care services"){
      if (weight_Kg < 1 || weight_Kg > 15) {
        this.confirmationService.alert(
          this.currentLanguageSet.alerts.info.recheckValue
        );
      }
    }
    if(this.visitCategory.toLowerCase() === "childhood & adolescent healthcare services"){
      if (weight_Kg < 6 || weight_Kg > 99) {
        this.confirmationService.alert(
          this.currentLanguageSet.alerts.info.recheckValue
        );
      }
    }
  }

  checkHeadCircumference(headCircumference_cm) {
    if (headCircumference_cm <= 29 || headCircumference_cm >= 61) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }

  checkTemperature(temperature) {
    if (temperature <= 94 || temperature >= 107) {
      this.confirmationService.alert(
        this.currentLanguageSet.alerts.info.recheckValue
      );
    }
  }

  get height_cm() {
    return this.neonatalVitalsForm.controls["height_cm"].value;
  }

  get weight_Kg() {
    return this.neonatalVitalsForm.controls["weight_Kg"].value;
  }

  get temperature() {
    return this.neonatalVitalsForm.controls["temperature"].value;
  }

  get headCircumference_cm() {
    return this.neonatalVitalsForm.controls["headCircumference_cm"].value;
  }

  // startRecording() {
  //   if (!this.isRecording) {
  //     this.isRecording = true;
  //     this.audioRecordingService.startRecording();
  //   }
  // }

  // abortRecording() {
  //   if (this.isRecording) {
  //     this.isRecording = false;
  //     this.audioRecordingService.abortRecording();
  //   }
  // }

  // stopRecording() {
  //   if (this.isRecording) {
  //     this.audioRecordingService.stopRecording();
  //     this.isRecording = false;
  //   }
  // }

  // clearRecordedData() {
  //   this.confirmationService.confirm(
  //     `info`,
  //     "Do you really want to clear the recording?"
      
  //   ).subscribe((res)=>{
  //     if(res){
  //       this.blobUrl = null;
  //      this.coughBlobFile = null;
  //      this.frequentCough = false;
  //      this.sputum = false;
  //      this.coughAtNight = false;
  //      this.wheezing = false;
  //      this.painInChest = false;
  //      this.shortnessOfBreath = false;
  //      this.enableResult = false;
  //      this.nurseService.isAssessmentDone = false;
  //     }
  //   });
    
  // }

  getGender() {
  let gender = localStorage.getItem("beneficiaryGender");
    if(gender === "Female")
    this.benGenderType = 1;
    else if(gender === "Male")
    this.benGenderType = 0;
    else if(gender === "Transgender")
    this.benGenderType = 2;
  }

  // onCheckboxChange(symptomName: string, event: any) {
  //   this[symptomName] = event.checked ? 1 : 0;
  // }
  
  // startAssessment() {
  //   let todayDate = new Date();
  //   formData.append('File', file, file.name); // file.name was mandatory for us (otherwise again an error occured)
  //   this.enableResult = true;
  //   const symptoms = {
  //     frequent_cough: this.frequentCough ? 1 : 0,
  //     sputum: this.sputum ? 1 : 0,
  //     cough_at_night: this.coughAtNight ? 1 : 0,
  //     wheezing: this.wheezing ? 1 : 0,
  //     pain_in_chest: this.painInChest ? 1 : 0,
  //     shortness_of_breath: this.shortnessOfBreath ? 1 : 0
  //   };
  //   let reqObj = {
  //     coughsoundfile: null,
  //     gender: this.benGenderType,
  //     age: this.benAge,
  //     patientId: localStorage.getItem('beneficiaryRegID'),
  //     timestamp: moment(todayDate).format('YYYY-MM-DD HH:mm:ss'),
  //     assessmentId: null,
  //     providerServiceMapID: localStorage.getItem("providerServiceID"),
  //     createdBy: localStorage.getItem("userName"),
  //     symptoms: symptoms,
  //   }
  //   const file = new File([this.coughBlobFile], 'coughSound.wav');
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("request", JSON.stringify(reqObj));
  //   console.log("reqObjFile", formData.get('file'));
  //   this.audioRecordingService.getResultStatus(formData)
  //   .subscribe(res => {
  //     if (res.statusCode == 200 && res.data !== null) {
  //       this.severity = res.data.severity;
  //       this.cough_pattern = res.data.cough_pattern;
  //       this.cough_severity_score = res.data.cough_severity_score;
  //       this.record_duration = res.data.record_duration;
  //       this.nurseService.setEnableLAssessment(false);
  //       this.enableResult = true;
  //       this.nurseService.isAssessmentDone = true;
  //       console.log("Cough Result Data", res.data)
  //       }
  //       else
  //       {
  //         this.confirmationService.alert(res.errorMessage, 'error')
  //       }
  //     },
  //     err => {
  //       this.confirmationService.alert(
  //         err,
  //         'error'
  //       );
  //     });
  //   console.log("reqObj",reqObj);
  // }

  // getAssessmentID() {
  //   let benRegID = localStorage.getItem("beneficiaryRegID");
  //   this.doctorService.getAssessment(benRegID).subscribe(res => {
  //     if (res.statusCode == 200 && res.data !== null && res.data.length > 0) {
  //       const lastElementIndex = res.data.length - 1;
  //       const lastElementData = res.data[lastElementIndex];
  //       let assessmentId = lastElementData.assessmentId;
  //       if(assessmentId !== null && assessmentId !== undefined) {
  //         this.getAssessmentDetails(assessmentId);
  //       }
  //     }
  //   })
  // }

  // getAssessmentDetails(assessmentId) {
  //   this.doctorService.getAssessmentDet(assessmentId).subscribe(res => {
  //     if (res.statusCode === 200 && res.data !== null) {
  //       this.severity = res.data.severity;
  //       this.cough_pattern = res.data.cough_pattern;
  //       this.cough_severity_score = res.data.cough_severity_score;
  //       this.record_duration = res.data.record_duration;
  //       this.nurseService.setEnableLAssessment(false);
  //       this.enableResult = true;
  //       this.nurseService.isAssessmentDone = true;
  //     }
  //   })
  // }

}
