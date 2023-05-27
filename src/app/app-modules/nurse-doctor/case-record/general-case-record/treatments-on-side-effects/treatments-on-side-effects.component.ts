import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SetLanguageComponent } from "app/app-modules/core/components/set-language.component";
import { HttpServiceService } from "app/app-modules/core/services/http-service.service";
import { DoctorService } from "app/app-modules/nurse-doctor/shared/services";
import { FamilyPlanningUtils } from "app/app-modules/nurse-doctor/shared/utility";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "app-treatments-on-side-effects",
  templateUrl: "./treatments-on-side-effects.component.html",
  styleUrls: ["./treatments-on-side-effects.component.css"],
})
export class TreatmentsOnSideEffectsComponent implements OnInit {
  currentLanguageSet: any;
  @Input('treatmentsOnSideEffectsForm')
  treatmentsOnSideEffectsForm: FormGroup

  @Input('caseRecordMode')
  caseRecordMode: String
  sideEffectsTretmentSubscription: Subscription;


  constructor(private fb: FormBuilder,
    private httpServiceService: HttpServiceService,
    private doctorService: DoctorService) {}

  ngOnInit() {
    this.assignSelectedLanguage();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  ngOnChanges()
  {
    if (this.caseRecordMode == 'view') {
      this.getSideEffectDetails();
    }
  }

 
  getSideEffectDetails() {
    this.sideEffectsTretmentSubscription = this.doctorService.populateCaserecordResponse$
      .subscribe(res => {
        if (res && res.statusCode == 200 && res.data && res.data.treatmentsOnSideEffects) {
          this.treatmentsOnSideEffectsForm.controls['treatmentsOnSideEffects'].setValue(res.data.treatmentsOnSideEffects);
        }
      })
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }
  ngOnDestroy() {
    if (this.sideEffectsTretmentSubscription) {
      this.sideEffectsTretmentSubscription.unsubscribe();
    }
  }
}
