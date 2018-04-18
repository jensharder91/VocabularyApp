import { Component } from '@angular/core';
import { AlertController, PopoverController, ToastController, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';

import { Card } from "../../../model/card";
import { VocabProvider } from "../../providers/vocab/vocab";

import { OverviewPage } from "../overview/overview";
import { StudyPhasePage } from "../studyPhase/studyPhase";
import { SelectStudyPopoverPage } from "../selectStudyPopover/selectStudyPopover";

@Component({
  selector: 'page-selectStudy',
  templateUrl: 'selectStudy.html'
})

export class SelectStudyPage {

  public language: String;
  public studyType: String = 'vocabulary'; // voc or grammar

  // topic keys are 2 digits or more
  private topics = [
    { key: 11, text: "Animals", image: "" },
    { key: 12, text: "Holidays", image: "" },
    { key: 13, text: "TEST", image: "" }
  ];

  // level ids start with 0
  private levels = [
    { key: 0, text: "Level 1", image: "assets/imgs/progress/progress0.svg" },
    { key: 1, text: "Level 2", image: "assets/imgs/progress/progress1.svg" },
    { key: 2, text: "Level 3", image: "assets/imgs/progress/progress2.svg" },
    { key: 3, text: "Level 4", image: "assets/imgs/progress/progress3.svg" },
    { key: 4, text: "Level 5", image: "assets/imgs/progress/progress4.svg" },
    { key: 5, text: "Level 6", image: "assets/imgs/progress/progress5.svg" }
  ];

  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public vocabProvider: VocabProvider,
    public http: Http,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController) {

    this.language = navParams.get('language');
  }

  studyDueCards() {
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

  presentPopover(event: any) {
    let cardDeckTitle = null;
    if (event > 9) { // topic chosen
      Object.keys(this.topics).forEach(i => {
        if (this.topics[i].key === event) {
          cardDeckTitle = this.topics[i].text;
        }
      });
    } else { // level chosen
      Object.keys(this.levels).forEach(i => {
        if (this.levels[i].key === event) {
          cardDeckTitle = this.levels[i].text;
        }
      });
    }

    let popover = this.popoverCtrl.create(SelectStudyPopoverPage,
      {cardDeckId: event, cardDeckTitle: cardDeckTitle});
    popover.present();
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

  showProgressVoc() {
    this.navCtrl.setRoot(OverviewPage);
  }

}
