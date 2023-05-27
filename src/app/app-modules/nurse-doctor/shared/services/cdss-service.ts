import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { environment } from "environments/environment";
import { BehaviorSubject } from "rxjs";



@Injectable()
export class CDSSService {

constructor(private http: Http) {}


getCdssQuestions(reqObject){
    return this.http.post(environment.getCdssQuestionsUrl, reqObject)
    .map((res) => res.json());   
}

getCdssAnswers(reqObject){
    return this.http.post(environment.getCdssAnswersUrl, reqObject)
    .map((res) => res.json());   
}

getSnomedCtRecord(reqObject){
    return this.http.post(environment.getSnomedCtRecordUrl, reqObject)
    .map((res) => res.json());   
}

getcheifComplaintSymptoms(reqObject){
    return this.http.post(environment.getCheifComplaintsSymptomsUrl, reqObject)
    .map((res) => res.json());   
}

getActionMaster(){
    return this.http.get(environment.getActionMasterUrl)
    .map((res) => res.json());   
}

saveCheifComplaints(reqObject){
    return this.http.post(environment.closeVisitSaveComplaintsUrl, reqObject)
    .map((res) => res.json());
}

}