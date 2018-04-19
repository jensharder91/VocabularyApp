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
    { key: 11, text: "Animals", image: "assets/imgs/topic/topics_animals.png", amount: "-1" },
    { key: 12, text: "Holidays", image: "assets/imgs/topic/topics_holidays.png", amount: "-1" },
    { key: 13, text: "TEST", image: "", amount: "-1" }
  ];

  // level ids start with 0
  private levels = [
    { key: 0, text: "Level 1", image: "assets/imgs/level/level_1.png", amount: "-1" },
    { key: 1, text: "Level 2", image: "assets/imgs/level/level_2.png", amount: "-1" },
    { key: 2, text: "Level 3", image: "assets/imgs/level/level_3.png", amount: "-1" },
    { key: 3, text: "Level 4", image: "assets/imgs/level/level_4.png", amount: "-1" },
    { key: 4, text: "Level 5", image: "assets/imgs/level/level_5.png", amount: "-1" },
    { key: 5, text: "Level 6", image: "assets/imgs/level/level_6.png", amount: "-1" }
  ];

  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public vocabProvider: VocabProvider,
    public http: Http,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController) {

    this.language = navParams.get('language');

    this.updateDeckSize();
  }

  updateDeckSize() {

    // get amount of cards for each deck
    Object.keys(this.levels).forEach(i => {
      let cardDeck: Card[] = this.vocabProvider.getCardDeckForId(this.levels[i].key);
      this.levels[i].amount = cardDeck.length;
    });
    Object.keys(this.topics).forEach(i => {
      let cardDeck: Card[] = this.vocabProvider.getCardDeckForId(this.topics[i].key);
      this.topics[i].amount = cardDeck.length;
    });
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
    // get title for popover
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

    let prompt = this.alertCtrl.create({
      title: 'Deleting all cards',
      message: "Are you sure that you want to remove all cards?",
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            this.vocabProvider.clearStorage();
            this.updateDeckSize();
          }
        }
      ]
    });

    prompt.present();
  }

  public loadCsvToDict() {
    this.vocabProvider.addTenVocs();
    this.updateDeckSize();
  }

  showProgress() {
    this.navCtrl.setRoot(OverviewPage);
  }

}
