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
import { FormBuilder } from "@angular/forms";

export class FamilyPlanningUtils {

    constructor(private fb: FormBuilder) { }

    createFamilyPlanningForm() {
        return this.fb.group({
            dispensationDetailsForm: this.createDipensationDetailsForm(),
            familyPlanningAndReproductiveForm: this.createFamilyPlanningAndReproductiveForm(),
            IecCounsellingForm: this.createIecCounsellingDetails()
        })
    }

    createDipensationDetailsForm(){
        return this.fb.group({
            id: null,
            typeOfContraceptivePrescribed : null,
            otherTypeOfContraceptivePrescribed: null,
            dosesTaken: null,
            dateOfLastDoseTaken: null,
            qtyPrescribed : null,
            nextVisitForRefill : null,
            typeOfIUCDInsertedId : null,
            typeOfIUCDInserted: null,
            dateOfIUCDInsertion : null,
            iucdInsertionDoneBy : null,
            processed: null,
            deleted: null,
        })
    }

    /**
     * FP & Reproductive Details Form ** Part of FP & Reproductive Form
     **/
       createFamilyPlanningAndReproductiveForm() {
        return this.fb.group({
          id: null,
          fertilityStatusID: null,
          fertilityStatus: null,
          parity: null,
          totalNoOfChildrenBorn: null,
          totalNoOfChildrenBornFemale: null,
          totalNoOfChildrenBornMale: null,
          numberOfLiveChildren: null,
          numberOfLiveChildrenFemale: null,
          numberOfLiveChildrenMale: null,
          ageOfYoungestChild: null,
          unitOfAge: null,
          youngestChildGender: null,
          currentlyUsingFpMethod: null,
          dateOfSterilization: null,
          placeOfSterilization: null,
          dosesTaken: null,
          dateOfLastDoseTaken: null,
          otherCurrentlyUsingFpMethod: null,
          processed: null,
          deleted: null,
        })
      }



    createIecCounsellingDetails(){
        return this.fb.group({
            id: null,
            counselledOn : null,
            otherTypeOfContraceptiveOpted : null,
            typeOfContraceptiveOpted : null,
            otherCounselledOn: null,
            processed: null,
            deleted: null,
        })
    }
   
}