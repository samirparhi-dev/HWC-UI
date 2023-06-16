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