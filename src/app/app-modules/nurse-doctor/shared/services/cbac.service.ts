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