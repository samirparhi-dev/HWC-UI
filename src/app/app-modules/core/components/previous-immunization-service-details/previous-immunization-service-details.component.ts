import { Component, Inject, OnInit } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from '../../services/http-service.service';
import { SetLanguageComponent } from '../set-language.component';

@Component({
  selector: 'app-previous-immunization-service-details',
  templateUrl: './previous-immunization-service-details.component.html',
  styleUrls: ['./previous-immunization-service-details.component.css']
})
export class PreviousImmunizationServiceDetailsComponent implements OnInit {
  currentLanguageSet: any;
  familyDetails = [];
  dataList = [];
  filteredDataList = [];

  constructor(
    public dialogRef: MdDialogRef<PreviousImmunizationServiceDetailsComponent>,
    @Inject(MD_DIALOG_DATA) public input: any,
    public httpServiceService: HttpServiceService
  ) { }

  ngOnInit() {
    this.assignSelectedLanguage()
    this.dataList = this.input.dataList
    this.filteredDataList = this.dataList.slice();

  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  filterPreviousData(searchTerm) {
    console.log("searchTerm", searchTerm);
    if (!searchTerm)
      this.filteredDataList = this.dataList;
    else {
      this.filteredDataList = [];
      this.dataList.forEach((item) => {
        for (let key in item) {
          let value: string = '' + item[key];
          if (value.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) {
            this.filteredDataList.push(item); break;
          }
        }
      });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
