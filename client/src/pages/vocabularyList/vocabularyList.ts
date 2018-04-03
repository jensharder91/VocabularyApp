import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";
import { Card } from '../../../model/card';

@Component({
  selector: 'page-overview',
  templateUrl: 'vocabularyList.html'
})

export class VocabularyListPage {

  dict: Card[] = [];

  listLowerLimit = 0;
  listUpperLimit = 10;

  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public vocabProvider: VocabProvider) {

    this.dict = this.navParams.get('cards');

    this.listLowerLimit = 0;
    this.listUpperLimit = 10;

    if (this.listUpperLimit >= this.dict.length) {
      this.listUpperLimit = this.dict.length;
    }
  }

  getProgressImage(level: number): string {
    if (!level) level = 0;
    return "assets/imgs/progress/progress" + level + ".svg";
  }

  deleteCard(card: any) {

    this.vocabProvider.deleteCard(card);
  }

  changeCard(card: any) {

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
            this.vocabProvider.createCard(data.front, data.back);
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
