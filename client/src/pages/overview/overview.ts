import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {StudyPhasePage} from '../studyPhase/studyPhase'
import {VocabProvider} from "../../providers/vocab/vocab";

@Component({
  selector: 'page-overview',
  templateUrl: 'overview.html'
})
export class OverviewPage {


  constructor(public alertCtrl: AlertController,public navCtrl: NavController, public vocabProvider: VocabProvider) {



    //for(var i = 0; i < this.levelsCounters.length; i++){

      //this.levelsCounters[i] = this.returnNumbersOfCards(this.studyPhase.dict, i)
    //}

  }

  returnNumbersOfCards(arr, value) {

    var counter;
    for (var i=0, iLen=arr.length; i<iLen; i++) {

      if (arr[i].level == value){

        counter++;

      }
    }

    return counter;
  }


  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'No vocabulary!',
      subTitle: 'This level is empty.',
      buttons: ['OK']
    });
    alert.present();
  }

  openMainScreen(level){



    if(this.vocabProvider.levelsCounters[level] == 0){
      this.showAlert()
    }else{
      this.navCtrl.push(StudyPhasePage, {
        levelPassed: level
      });
    }
  }

}
