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
