import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { environment } from "environments/environment";
import { BehaviorSubject } from "rxjs";



@Injectable()
export class CbacService {

    // CBACAgeScore= new BehaviorSubject(this.CBACAgeScore);
    // CBACAgeScore$ = this.CBACAgeScore.asObservable();

    // CBACSmokeScore = new BehaviorSubject(this.CBACSmokeScore);
    // CBACSmokeScore$ = this.CBACSmokeScore.asObservable();

    // CBACAlcoholScore = new BehaviorSubject(this.CBACAlcoholScore);
    // CBACAlcoholScore$ = this.CBACAlcoholScore.asObservable();

    // CBACWaistScore = new BehaviorSubject(this.CBACWaistScore);
    // CBACWaistScore$ = this.CBACWaistScore.asObservable();

    // CBACPaScore = new BehaviorSubject(this.CBACPaScore);
    // CBACPaScore$ = this.CBACPaScore.asObservable();

    // CBACFamilyHistoryScore = new BehaviorSubject(this.CBACFamilyHistoryScore);
    // CBACFamilyHistoryScore$ = this.CBACFamilyHistoryScore.asObservable();

    constructor(private http: Http) { }

    // setAgeScore(score) {
    //     this.CBACAgeScore = score;
    //     console.log("score", score);
    //     this.CBACAgeScore.next(score);
    //     console.log("score value", this.CBACAgeScore);
    // }

    // setSmokeScore(score) {
    //     this.CBACSmokeScore = score;
    //     console.log("score", score);
    //     this.CBACSmokeScore.next(score);
    //     console.log("score value", this.CBACSmokeScore);
    // }

    // setAlcoholScore(score) {
    //     this.CBACAlcoholScore = score;
    //     console.log("score", score);
    //     this.CBACAlcoholScore.next(score);
    //     console.log("score value", this.CBACAlcoholScore);
    // }

    // setWaistScore(score) {
    //     this.CBACWaistScore = score;
    //     console.log("score", score);
    //     this.CBACWaistScore.next(score);
    //     console.log("score value", this.CBACWaistScore);
    // }

    // setPaScore(score) {
    //     this.CBACPaScore = score;
    //     console.log("score", score);
    //     this.CBACPaScore.next(score);
    //     console.log("score value", this.CBACPaScore);
    // }

    // setFamilyHistoryScore(score) {
    //     this.CBACFamilyHistoryScore = score;
    //     console.log("score", score);
    //     this.CBACFamilyHistoryScore.next(score);
    //     console.log("score value", this.CBACFamilyHistoryScore);
    // }

    // cbacQuestions() {
    //     return this.http.get(`${environment.relationShipUrl}`)
    //     .map((res) => res.json());
    // }

    fetchCbacDetails(reqObject){
        return this.http.post(environment.getCbacDetailsUrl, reqObject)
        .map((res) => res.json());
        
    }

}