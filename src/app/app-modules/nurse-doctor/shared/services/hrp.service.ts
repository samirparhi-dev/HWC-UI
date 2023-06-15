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
import { BehaviorSubject } from "rxjs";



@Injectable()
export class HrpService {
    
    comorbidityConcurrentCondition: any = [];
    heightValue: any = null;
    bloodGroup: any = null;
    hemoglobin: any = null;
    pastIllness:any = [];
    pastObstetric: any = [];
    checkHrpStatus: boolean = false;

    constructor(
    private http: Http
    ) { }
    
    getHRPStatus(reqObj) {
        console.log("req",reqObj);
        return this.http
        .post(environment.getHrpStatusURL, reqObj)
        .map((res) => res.json());
    }

    getHrpForFollowUP(reqObj){
        return this.http
        .post(environment.getHrpFollowUpURL, reqObj)
        .map((res) => res.json());
    }

    setcomorbidityConcurrentConditions(value){
    this.comorbidityConcurrentCondition = value;
    }

    setPastIllness(value)
    {
        this.pastIllness=value;
    }
    setHeightFromVitals(value){
        this.heightValue = value;
    }

    setBloodGroup(value){
        this.bloodGroup = value;
    }

    setPastObstetric(value){
        this.pastObstetric = value;
    }

    setHemoglobinValue(value){
        this.hemoglobin = value;
    }
}
