import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {StudyPhasePage} from '../studyPhase/studyPhase'

@Component({
  selector: 'page-home',
  templateUrl: 'overview.html'
})
export class OverviewPage {

  levelsCounters = [0,0,0,0,0,0]

  constructor(public navCtrl: NavController) {

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


  openMainScreen(level){

    this.navCtrl.push(StudyPhasePage, {
      levelPassed: level
    });

  }

}
