import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import {OverviewPage} from "../overview/overview";
import {StudyPhasePage} from "../studyPhase/studyPhase";
import {ToastController} from "ionic-angular";
import {LoadingController} from "ionic-angular";
import {Card} from "../../../model/card";

@Component({
  selector: 'page-overview',
  templateUrl: 'selectStudy.html'
})

export class SelectStudyPage {

  public language: String;

  constructor(public alertCtrl: AlertController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public vocabProvider: VocabProvider,
              public http: Http,
              private toastCtrl: ToastController,
              public loadingCtrl: LoadingController,) {

    this.language = navParams.get('language');
  }

  startLearningVoc() {
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

  createCardVoc() {
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

  showProgressVoc() {
    this.navCtrl.setRoot(OverviewPage);
  }

}
