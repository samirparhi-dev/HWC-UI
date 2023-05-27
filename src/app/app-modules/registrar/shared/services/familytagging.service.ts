import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { environment } from "environments/environment";



@Injectable()
export class FamilyTaggingService {

    constructor(private http: Http) { }

    
    getRelationShips(servicePointID) {
      let tmpSPID = { "spID": servicePointID };
      return this.http.post(environment.relationShipUrl, tmpSPID)
      .map((res) => res.json());
  }

  
  saveFamilyTagging(requestObj) {
    return this.http.post(environment.saveFamilyTaggingUrl, requestObj).map((res) => res.json())
  }

  editFamilyTagging(requestObj) {
    return this.http.post(environment.editFamilyTaggingUrl, requestObj).map((res) => res.json())
  }



  untagFamilyMember(requestObj) {
    return this.http.post(environment.untagFamilyUrl, requestObj).map((res) => res.json())
  }

  benFamilySearch(requestObj) {
    return this.http.post(environment.familySearchUrl, requestObj).map((res) => res.json())
  }

  createFamilyTagging(reqObject){
    return this.http.post(environment.createFamilyUrl, reqObject).map((res) => res.json())
  }

  getFamilyMemberDetails(reqObject) {
    return this.http.post(environment.getFamilyMemberUrl, reqObject).map((res) => res.json())
  }

}