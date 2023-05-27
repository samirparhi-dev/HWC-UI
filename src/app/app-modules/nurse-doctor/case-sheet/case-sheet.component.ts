import { Component, OnInit, Injector } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MD_DIALOG_DATA } from "@angular/material";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";

@Component({
  selector: "app-case-sheet",
  templateUrl: "./case-sheet.component.html",
  styleUrls: ["./case-sheet.component.css"]
})
export class CaseSheetComponent implements OnInit {
  QC: boolean = false;
  General: boolean = false;
  NCDScreening: boolean = false;

  preview: any;
  previous: any;
  serviceType: any;
  language: any;
  current_language_set: any;
  language_file_path: any = "./assets/";
  constructor(
    private route: ActivatedRoute,
    private injector: Injector,

    public httpServiceService: HttpServiceService
  ) {}

  ngOnInit() {
   
    this.caseSheetCategory();
    this.serviceType = this.route.snapshot.params["serviceType"];
    console.log("route1" + this.route.snapshot.params["serviceType"]);

    let input = this.injector.get(MD_DIALOG_DATA, null);
    if (input) {
      this.previous = input.previous;
      this.serviceType = input.serviceType;
    }
    
    this.assignSelectedLanguage();
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
    // localStorage.removeItem('caseSheetVisitCategory');
    // localStorage.removeItem('previousCaseSheetVisitCategory')
  }

  caseSheetCategory() {
    let dataStore = this.route.snapshot.params["printablePage"] || "previous";

    let type;
    if (this.previous) {
      if (dataStore == "previous") {
        type = localStorage.getItem("previousCaseSheetVisitCategory");
      }
    } else {
      if (dataStore == "current") {
        type = localStorage.getItem("caseSheetVisitCategory");
      }
      if (dataStore == "previous") {
        type = localStorage.getItem("previousCaseSheetVisitCategory");
      }
    }

    if (type) {
      switch (type) {
        case "General OPD (QC)":
        case "General OPD":
        case "NCD care":
        case "PNC":
        case "ANC":
        case "COVID-19 Screening":
        case 'NCD screening':  
        case 'FP & Contraceptive Services':
        case 'Neonatal and Infant Health Care Services':
        case 'Childhood & Adolescent Healthcare Services':
          this.General = true;
          break;

        default:
          this.QC = false;
          // this.NCDScreening = false;
          this.General = false;
          break;
      }
    }
  }
}
