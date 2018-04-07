import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { StudyPhasePage } from '../studyPhase/studyPhase'
import { VocabProvider } from "../../providers/vocab/vocab";
import { VocabularyListPage } from "../vocabularyList/vocabularyList";
import 'rxjs/add/operator/map';
import { Card } from '../../../model/card';
import { OverviewPage } from "../overview/overview";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})

export class HomePage {

  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public vocabProvider: VocabProvider) {

    }



  startLearning() {
    let curCards: Card[] = this.vocabProvider.getCardsToLearn();

    if (curCards.length > 0) {
      this.navCtrl.setRoot(StudyPhasePage, {
        cards: curCards
      });
    } else {
      this.toastCtrl.create({
        message: 'No cards for learning left! Try again later.',
        duration: 3000,
        position: 'bottom'
      }).present();
    }
  }

  createCard() {
    let prompt = this.alertCtrl.create({
      title: 'Create new card',
      message: "Enter a new vocabulary!",
      inputs: [
        {
          name: 'front',
          placeholder: 'Front'
        },
        {
          name: 'back',
          placeholder: 'Back'
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
          }
        }
      ]
    });

    prompt.present();
  }

  resetAll() {
    this.vocabProvider.clearStorage();
  }

  public loadCsvToDict() {
    this.vocabProvider.addTenVocs();
  }

  showProgress() {
    this.navCtrl.setRoot(OverviewPage);
  }

}
