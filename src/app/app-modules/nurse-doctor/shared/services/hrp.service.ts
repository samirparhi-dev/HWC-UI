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
