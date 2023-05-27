import { Component, OnInit, Input } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../shared/services/doctor.service';

@Component({
  selector: 'app-case-record',
  templateUrl: './case-record.component.html',
  styleUrls: ['./case-record.component.css']
})
export class CaseRecordComponent implements OnInit {

  @Input('patientCaseRecordForm')
  patientCaseRecordForm: FormGroup

  @Input('provideCounselling')
  provideCounselling: FormGroup

  @Input('visitCategory')
  visitCategory : string;

  @Input('visitReason')
  visitReason : string;

  @Input('caseRecordMode')
  caseRecordMode: String;

  @Input('findings')
  findings: any;

  @Input('currentVitals')
  currentVitals: any;
  
  @Input('pregnancyStatus')
  pregnancyStatus: any;
  attendant: any;

  showGeneralOPD: boolean = false;
  
  constructor(private route: ActivatedRoute,
    private doctorService: DoctorService) { }

  ngOnInit() {
      if (this.visitCategory) {
        this.showGeneralOPD = this.visitCategory == 'General OPD' || this.visitCategory == 'ANC' || this.visitCategory == 'NCD care' || this.visitCategory == 'PNC' || this.visitCategory == 'COVID-19 Screening' || this.visitCategory == 'NCD screening' || this.visitCategory == 'FP & Contraceptive Services' || this.visitCategory.toLowerCase() == "neonatal and infant health care services" || this.visitCategory.toLowerCase() ==  "childhood & adolescent healthcare services" ? true : false;
      }
      this.attendant = this.route.snapshot.params["attendant"];
      this.doctorService.setCapturedCaserecordDeatilsByDoctor(null);
  
      if (this.attendant != "nurse") this.fetchCaseRecordDetails();
  }

  ngOnChanges() {
  }

  ngOnDestroy(){
    this.doctorService.setCapturedCaserecordDeatilsByDoctor(null);
  }
  fetchCaseRecordDetails() {
    let visitID = localStorage.getItem("visitID");
    let benRegID = localStorage.getItem("beneficiaryRegID");
     this.doctorService.getCaseRecordAndReferDetails(benRegID, visitID, this.visitCategory)
    .subscribe(caserecordResponse => {
      if (caserecordResponse && caserecordResponse.statusCode == 200 && caserecordResponse.data !== undefined) {
        this.doctorService.setCapturedCaserecordDeatilsByDoctor(caserecordResponse);
      }
    });
  }
}
