import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { MasterdataService } from "../../shared/services";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { NcdScreeningService } from "../../shared/services/ncd-screening.service";

@Component({
  selector: "app-general-case-record",
  templateUrl: "./general-case-record.component.html",
  styleUrls: ["./general-case-record.component.css"],
})
export class GeneralCaseRecordComponent implements OnInit {
  @Input("generalCaseRecordForm")
  generalCaseRecordForm: FormGroup;
  
  @Input('provideCounselling')
  provideCounselling: FormGroup

  @Input("currentVitals")
  currentVitals: any;

  @Input("caseRecordMode")
  caseRecordMode: string;

  @Input("visitCategory")
  visitCategory: string;

  @Input("visitReason")
  visitReason: string;

  @Input("findings")
  findings: any;
  current_language_set: any;
  // enablingFindingsSectionSubscription: any;
  hideFindings: boolean = false;

  constructor(public httpServiceService: HttpServiceService) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    console.log(this.visitReason);
    console.log(this.visitCategory);
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }
  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.current_language_set = getLanguageJson.currentLanguageObject;
  }
}
