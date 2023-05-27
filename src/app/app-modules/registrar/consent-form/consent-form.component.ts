import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MD_DIALOG_DATA, MdDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import {Consent, SearchComponent} from '../search/search.component';



@Component({
  selector: 'app-consent-form',
  templateUrl: './consent-form.component.html',
  styleUrls: ['./consent-form.component.css']
})
export class ConsentFormComponent implements OnInit {
  currentLanguageSet: any;

  constructor(@Inject(MD_DIALOG_DATA) public data: Consent,
  private router: Router,
  public httpServiceService: HttpServiceService,
  public mdDialogRef: MdDialogRef<ConsentFormComponent>
) {}

  ngOnInit(): void {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.httpServiceService);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
    }
 
  closeConsent(grant: string){
    this.router.navigate([
        "/registrar/search/"
      ]);
      this.mdDialogRef.close(grant);
  }

  acceptConsent(grant: string){
    this.router.navigate([
        "/registrar/registration"
    ]);
    this.mdDialogRef.close(grant);
  }
}
