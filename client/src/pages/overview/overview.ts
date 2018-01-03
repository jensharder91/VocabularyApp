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


  showAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  openMainScreen(level){



    if(this.vocabProvider.levelsCounters[level] == 0){
      this.showAlert('No vocabulary!','This level is empty.')
    }else{
      this.navCtrl.push(StudyPhasePage, {
        levelPassed: level
      });
    }
  }

  createVocabCard() {
    let prompt = this.alertCtrl.create({
      title: 'Login',
      message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'front',
          placeholder: 'Frontside'
        },
        {
          name: 'back',
          placeholder: 'Backside'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.vocabProvider.createCard(data.front, data.back);
            this.showAlert("Successful!", "New vocabulary card created.")
          }
        }
      ]
    });
    prompt.present();
  }



}
