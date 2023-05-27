import { Component, Inject, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material/dialog';
import { SetLanguageComponent } from 'app/app-modules/core/components/set-language.component';
import { ConfirmationService } from 'app/app-modules/core/services/confirmation.service';
import { HttpServiceService } from 'app/app-modules/core/services/http-service.service';
import { LocalDataSource } from 'ng2-smart-table/lib/data-source/local/local.data-source';
import { CDSSService } from '../../shared/services/cdss-service';

@Component({
  selector: 'app-cdss-form-result-popup',
  templateUrl: './cdss-form-result-popup.component.html',
  styleUrls: ['./cdss-form-result-popup.component.css']
})
export class CdssFormResultPopupComponent implements OnInit {

  currentLanguageSet: any;
  searchSymptom: any;
  constructor(
    @Inject(MD_DIALOG_DATA) public data: any,
    // private saved_data: dataService,
    private cdssService: CDSSService,
    public dialog: MdDialog,
    public HttpServices: HttpServiceService,
    private alertMessage: ConfirmationService,
    public dialogReff: MdDialogRef<CdssFormResultPopupComponent>
  ) {}

  ngOnInit() {
    this.assignSelectedLanguage();
    console.log(this.data)
    this.getQuestions();
  }

  ngDoCheck() {
    this.assignSelectedLanguage();
  }

  assignSelectedLanguage() {
    const getLanguageJson = new SetLanguageComponent(this.HttpServices);
    getLanguageJson.setLanguage();
    this.currentLanguageSet = getLanguageJson.currentLanguageObject;
  }

  emergency_transferToMo: any;
  page1: boolean = true;
  page2: boolean = false;
  page3: boolean = true;
  settings = {
    hideSubHeader: true,
    actions: false,
    columns: {
      Disease: {
        title: "Disease",
      },
      selected: {
        title: "UserInput",
      },
      percentage: {
        title: "Count",
      },
      Information: {
        title: "Information",
      },
      DoDonts: {
        title: "Dos & Donts",
      },
      SelfCare: {
        title: "SelfCare",
      },
      Action: {
        title: "Action",
      },
    },
  };

  showQuestions: boolean = true;

  questionid: any = [];
  questions: any;
  sizeQuestion: any = [];
  answers: any;

  result: any;
  formattedResult: any;
  formattedResult1: any[];

  getQuestions() {
    this.questionid = [];
    console.log(this.data.patientData, "data.patientData");
    this.cdssService
      .getCdssQuestions(this.data.patientData)
      .subscribe((any) => this.successHandeler(any));
  }

  getNextSet(value: any, id: any) {
    var questionSelected = {};
    questionSelected["complaintId"] = this.questions.id;
    questionSelected["selected"] = id;
    this.cdssService
      .getCdssAnswers(questionSelected)
      .subscribe((any) => this.assignresult(any));
  }

  assignresult(val: any) {
    this.result = val.data;
    if (val.length != 0) {
      this.page1 = false;
      this.page2 = true;
    }
    console.log("Data for inbetween model ", val);
  }

  getAnswers() {
    console.log(this.questionid);
    this.sizeQuestion = [];
    this.questions.Questions.forEach((element) => {
      console.log(element);

      this.getKeys(element).forEach((element1) => {
        console.log(Object.keys(element[element1]).length);
        this.sizeQuestion.push(Object.keys(element[element1]).length);
      });
    });

    var code = [];
    for (var index = 0; index < this.sizeQuestion.length; index++) {
      code[index] = 0;
      for (var indexj = 0; indexj <= index; indexj++) {
        code[index] += this.sizeQuestion[indexj];
      }
    }
    console.log(code);
    var answer = [];
    for (var index = 0; index < this.questionid.length; index++) {
      var element = this.questionid[index].split(".");
      console.log(element + ":" + index);
      if (Number(element[0]) > 1) {
        answer[index] = code[Number(element[0]) - 2] + Number(element[1]);
      } else {
        answer[index] = Number(element[1]);
      }
    }

    var response: any = {};
    console.log(this.questions);
    response["SymptomId"] = this.questions["id"];
    response["response"] = answer;
    console.log(response);

    this.cdssService
      .getCdssAnswers(response)
      .subscribe((any) => this.resultFunction(any));
  }

  toggle(element: any, value: any) {
    console.log(value);
    if (element.selected == undefined) {
      element.selected = [];
    }
    var index = element.selected.indexOf(value);
    if (index < 0) {
      element.selected.push(value);
    } else {
      element.selected.splice(index, 1);
    }
  }

  getresult() {
    this.formattedResult = new LocalDataSource(
      JSON.parse(JSON.stringify(this.result))
    );
    for (let index = 0; index < this.formattedResult.data.length; index++) {
      let selected = this.formattedResult.data[index].selected;
      let per = "";
      if (selected != undefined && selected.length != 0) {
        //this.formattedResult.data[index].selected.sort(this.sortn);
        per =
          this.formattedResult.data[index].selected.length +
          "/" +
          this.formattedResult.data[index].Symptoms.length;
        //per = Math.round(per * 1000) / 1000;
      }
      this.formattedResult.data[index].percentage = per;

      //  this.formattedResult.data
    }
    // this.formattedResult.data.selected.sort();
    this.formattedResult1 = JSON.parse(
      JSON.stringify(this.formattedResult.data)
    );
    console.log("formateed result 1", this.formattedResult1);
    this.formattedResult.load(this.formattedResult.data);
    if (this.formattedResult1.length != 0) {
      this.page2 = false;
      this.page3 = true;
    }
  }

  resetCount() {
    if (this.result.constructor === Array) {
      for (let i = 0; i < this.result.length; i++) {
        this.result[i].selected = undefined;
      }
    }
  }

  sortn(a, b) {
    return a - b;
  }

  getKeys(obj: any) {
    return Object.keys(obj);
  }

  getValue(obj, key): any {
    return obj[key];
  }

  resultFunction(data: any) {
    this.showQuestions = false;
    this.result = data;
    console.log(this.result);
    var diseases = Object.keys(this.result);
    this.formattedResult = [];
    for (var index = 0; index < diseases.length; index++) {
      var format = new ResultFormat();
      format["disease"] = diseases[index];
      format["input"] = this.result[diseases[index]]["input"];
      format["actual"] = this.result[diseases[index]]["acutal"];

      format["do"] = this.result[diseases[index]]["recommendation"]["Dos"];
      format["dont"] = this.result[diseases[index]]["recommendation"]["Donts"];

      this.formattedResult.push(format);
    }

    console.log(this.formattedResult);
  }
  diseasess: Array<any> = [];
  action: Array<any> = [];
  // action:any="";
  indexArray: Array<any> = [];
  getDiseaseName(val: any, i: any, action: any, symptoms, selectedIndexArray) {
    console.log(this.diseasess);

    let obj = {
      diseases: [],
      action: [],
      symptoms: [],
    };
    //filtering symptoms to selected symptoms array
    var tempArr = [];
    if (selectedIndexArray && selectedIndexArray.length > 0) {
      for (var j = 0; j < selectedIndexArray.length; j++) {
        tempArr.push(symptoms[selectedIndexArray[j] - 1]);
      }
    }

    if (this.diseasess.length == 0 && this.indexArray.length == 0) {
      obj = {
        diseases: val,
        action: action,
        symptoms: tempArr,
      };
      this.diseasess.push(obj);
      this.indexArray.push(i);
    } else {
      if (this.indexArray.includes(i)) {
        let a = this.indexArray.indexOf(i);
        this.diseasess.splice(a, 1);
        this.indexArray.splice(a, 1);
      } else {
        obj = {
          diseases: val,
          action: action,
          symptoms: tempArr,
        };
        this.diseasess.push(obj);
        this.indexArray.push(i);
      }
    }
    console.log(this.diseasess);
  }

  successHandeler(questions) {
    console.log("Get Questions:" + JSON.stringify(questions));
    this.questions = questions.data;
  }
  handleAnswers(answers) {
    console.log("answers", answers);
    this.answers = answers;
  }
  changePage(val) {
    this.diseasess = [];
    this.indexArray = [];
    if (val == 2) {
      this.page3 = false;
      this.page2 = true;
    }
    if (val == 1) {
      this.page2 = false;
      this.page1 = true;
    }
  }
  close() {
    this.alertMessage.confirm("info", this.currentLanguageSet.areYouSureWantToClose).subscribe((response) => {
      if (response) {
        this.dialogReff.close();
      }
    });
  }

  saveData(diseasess){
    this.dialogReff.close(diseasess);
  }

}

export class ResultFormat {
  Disease: string;
  Symptoms:any[];
  Information:String[];
  DoDonts:String[];
  SelfCare:String[];
  Action:String[];
  selected:number[];
  percentage:number;
}
