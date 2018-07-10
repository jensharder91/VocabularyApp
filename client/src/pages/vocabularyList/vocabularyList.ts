import { Component } from '@angular/core';
import {AlertController, NavParams, PopoverController} from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";
import {MenuPopoverPage} from "../menuPopover/menuPopover";
import { Card } from '../../../swagger/model/Card';

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
  private language1: string;
  private language2: string;

  listLowerLimit = 0;
  listUpperLimit = 5;
  listInterval = 5;

  constructor(public alertCtrl: AlertController,
              public navParams: NavParams,
              public vocabProvider: VocabProvider,
              public popoverCtrl: PopoverController) {

    this.level = this.navParams.get('level');
    this.topic = this.navParams.get('topic');
    this.mode = this.navParams.get('mode');
    this.language1 = this.navParams.get('language1');
    this.language2 = this.navParams.get('language2');

    this.getCards();

    this.listLowerLimit = 0;
    this.listUpperLimit = 5;
    this.listInterval = 5;

    if (this.listUpperLimit >= this.dict.length) {
      this.listUpperLimit = this.dict.length;
    }
  }

  getCards() {
    if (this.mode == "topic") {
      this.dict = this.vocabProvider.getActiveCardsByTopicId(this.topic);
      this.cardDeckTitle = this.topic;
    } else if (this.mode == "levels") {
      this.dict = this.vocabProvider.getCardsByLevel(this.level - 1);
      this.cardDeckTitle = "" + this.level;
    } else {
      this.dict = this.vocabProvider.getCardsAll();
      this.cardDeckTitle = "All Cards";
    }
  }

  getProgressImage(level: number): string {
    if (!level) level = 0;
    return "assets/imgs/level/level_" + (level + 1) + ".svg";
  }

  deleteCard(card: any) {

    this.vocabProvider.deleteCard(card.id);
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
            this.vocabProvider.changeCard(card.id, data.front, data.back);
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
          placeholder: this.language1
        },
        {
          name: 'back',
          placeholder: this.language2
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

      this.listLowerLimit += this.listInterval;
      this.listUpperLimit += this.listInterval;

      if (this.listUpperLimit > this.dict.length) {
        this.listUpperLimit = this.dict.length;
      }
    }
  }

  showPrevList() {

    if (this.listLowerLimit > 0) {

      this.listLowerLimit -= this.listInterval;
      this.listUpperLimit = this.listLowerLimit + this.listInterval;

      if (this.listUpperLimit > this.dict.length) {
        this.listUpperLimit = this.dict.length;
      }
    }
  }
}
