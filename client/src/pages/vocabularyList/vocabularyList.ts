import { Component } from '@angular/core';
import { AlertController, NavParams } from 'ionic-angular';
import { VocabProvider, Card } from "../../providers/vocab/vocab";

@Component({
  selector: 'page-vocabularyList',
  templateUrl: 'vocabularyList.html'
})

export class VocabularyListPage {

  dict: Card[] = [];
  private cardDeckTitle: String;

  private mode: string;
  private topic: string;
  private level: number;

  listLowerLimit = 0;
  listUpperLimit = 10;

  constructor(public alertCtrl: AlertController,
    public navParams: NavParams,
    public vocabProvider: VocabProvider) {

    this.level = this.navParams.get('level');
    this.topic = this.navParams.get('topic');
    this.mode = this.navParams.get('mode');

    this.getCards();

    this.listLowerLimit = 0;
    this.listUpperLimit = 10;

    if (this.listUpperLimit >= this.dict.length) {
      this.listUpperLimit = this.dict.length;
    }
  }

  getCards() {
    if (this.mode == "topic") {
      this.dict = this.vocabProvider.getCardDeckForTopic(this.topic);
      this.cardDeckTitle = this.topic;
    } else if (this.mode == "levels") {
      this.dict = this.vocabProvider.getCardDeckForLevel(this.level - 1);
      this.cardDeckTitle = "" + this.level;
    } else {
      this.dict = this.vocabProvider.getCardDeckAll();
      this.cardDeckTitle = "All Cards";
    }
  }

  getProgressImage(level: number): string {
    if (!level) level = 0;
    return "assets/imgs/level/level_" + (level + 1) + ".svg";
  }

  deleteCard(card: any) {

    this.vocabProvider.deleteCard(this.topic, card);
    //update list
    this.getCards();

  }

  changeCard(card: Card) {

    let prompt = this.alertCtrl.create({
      title: 'Change card',
      message: "Enter your modifications!",
      inputs: [
        {
          name: 'front',
          value: card.frontSide
        },
        {
          name: 'back',
          value: card.backSide
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
            this.vocabProvider.changeCard(card, data.front, data.back);
          }
        }
      ]
    });

    prompt.present();
  }

  addCard() {

    let prompt = this.alertCtrl.create({
      title: 'Create New Card',
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
            this.vocabProvider.createCard(this.topic, data.front, data.back);
          }
        }
      ]
    });

    prompt.present();
  }

  showNextList() {

    if (this.listUpperLimit < this.dict.length) {

      this.listLowerLimit += 10;
      this.listUpperLimit += 10;

      if (this.listUpperLimit > this.dict.length) {
        this.listUpperLimit = this.dict.length;
      }
    }
  }

  showPrevList() {

    if (this.listLowerLimit > 0) {

      this.listLowerLimit -= 10;
      this.listUpperLimit = this.listLowerLimit + 10;

      if (this.listUpperLimit > this.dict.length) {
        this.listUpperLimit = this.dict.length;
      }
    }
  }
}
