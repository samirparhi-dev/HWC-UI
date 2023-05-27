import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'nurse-vitals',
  templateUrl: './vitals.component.html',
  styleUrls: ['./vitals.component.css']
})
export class VitalsComponent implements OnInit {
  @Input('patientVitalsForm')
  patientVitalsForm: FormGroup;

  @Input('visitCategory')
  visitCategory: string;

  @Input('vitalsMode')
  mode: String;

  @Input('pregnancyStatus')
  pregnancyStatus: string;

  showGeneralOPD = false;
  showNeonatal = false;
  showChildAndAdolescent = false;

  constructor(
    private fb: FormBuilder ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.visitCategory) {
      this.showGeneralOPD = (this.visitCategory != 'Neonatal and Infant Health Care Services' && this.visitCategory != 'Childhood & Adolescent Healthcare Services') ? true : false;   
      this.showNeonatal = this.visitCategory == 'Neonatal and Infant Health Care Services' ? true : false;
      this.showChildAndAdolescent = this.visitCategory == 'Childhood & Adolescent Healthcare Services' ? true : false;
    }
  }
}
