import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";

@Component({
  selector: 'page-overview',
  templateUrl: 'vocabularyList.html'
})

export class VocabularyListPage {

  dict: any = [];

  listLowerLimit = 0;
  listUpperLimit = 10;

  constructor(public alertCtrl: AlertController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public vocabProvider: VocabProvider) {

    this.dict = vocabProvider.dict;

    // get limits to show part of vocabulary list
    if (this.navParams.get('lowerLimit') != null && this.navParams.get('upperLimit') != null) {

      this.listLowerLimit = this.navParams.get('lowerLimit');
      this.listUpperLimit = this.navParams.get('upperLimit');
    }
  }

  deleteCard(card: any){

    this.vocabProvider.deleteCard(card);
  }

  changeCard(card:any){

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

  addCard(){

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
            this.vocabProvider.createCard(data.front, data.back, true);
          }
        }
      ]
    });

    prompt.present();
  }

  showNextList() {

    if (this.listUpperLimit + 10 < this.dict.length) {

      this.listLowerLimit += 10;
      this.listUpperLimit += 10;
      this.navCtrl.push(VocabularyListPage, {'lowerLimit': this.listLowerLimit, 'upperLimit': this.listUpperLimit});
    }
  }

  showPrevList() {

    if (this.listLowerLimit - 10 >= 0) {

      this.listLowerLimit -= 10;
      this.listUpperLimit -= 10;
      this.navCtrl.push(VocabularyListPage, {'lowerLimit': this.listLowerLimit, 'upperLimit': this.listUpperLimit});
    }
  }
}
