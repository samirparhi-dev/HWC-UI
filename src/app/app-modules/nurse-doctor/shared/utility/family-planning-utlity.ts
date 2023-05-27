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