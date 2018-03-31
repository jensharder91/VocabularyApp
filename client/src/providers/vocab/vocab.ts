import {Injectable} from '@angular/core';
import { Storage } from "@ionic/storage";
import {AlertController} from "ionic-angular";

@Injectable()
export class VocabProvider {

  dict: any = [];
  levelsCounters = [0, 0, 0, 0, 0, 0];
  csvLoaded = false;

  constructor(private storage: Storage,
              public alertCtrl: AlertController) {

    // get dictionary from storage
    this.storage.get('dictionary_es').then((val) => {
      if (val != null){
        this.dict = val;
      }
    });

    // get level counter from storage
    this.storage.get('level_es').then((val) => {
      if (val != null){
        this.levelsCounters = val;
      }
    });

    // get boolean flag on csv loaded status
    this.storage.get('csv_loaded').then((val) => {
      if (val != null){
        this.csvLoaded = val;
      }
    });
  }

  createCard(frontSideValue:String, backSideValue:String, prompt:boolean){

    let card = {
      frontSide: frontSideValue,
      backSide: backSideValue,
      level: 0
    };

    this.addCard(card, prompt);
  }

  addCard(card:any, prompt:boolean) {

    if (card.frontSide != null && card.backSide != null) {
      if (card.level ==  null) {
        card.level = 0;
      }

      if (!this.cardExists(card)) {
        this.dict.push(card);
        this.levelsCounters[card.level]++;
        // store dict
        this.storeDict();
      } else if (prompt){

        this.promptCardExists(card);
      }
    }
  }

  private forceAddCard(card:any) {

    if (card.frontSide != null && card.backSide != null) {
      if (card.level == null) {
        card.level = 0;
      }

      this.dict.push(card);
      this.levelsCounters[card.level]++;
      // store dict
      this.storeDict();
    }
  }

  cardExists(card:any){

    if (card != null) {
      for (let existingCard of this.dict) {

        if (card.frontSide == existingCard.frontSide
          && card.backSide == existingCard.backSide) {
          return true;
        }
      }
    }

    return false;
  }

  promptCardExists(card:any){

    let prompt = this.alertCtrl.create({
      title: 'Card already exists',
      message: "Do you want to add the card \"" + card.frontSide + " - " + card.backSide + "\" anyways?",
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
            this.forceAddCard(card);
          }
        }
      ]
    });

    prompt.present();
  }

  changeCard(card:any, frontSideValue, backSideValue) {

    let index = this.dict.indexOf(card);
    let newCard = this.dict[index];
    newCard.frontSide = frontSideValue;
    newCard.backSide = backSideValue;

    if (!this.cardExists(newCard)) {
      this.storeDict();
    } else {
      this.promptCardExists(newCard);
    }

  }

  deleteCard(card:any){

    this.levelsCounters[card.level]--;

    let index = this.dict.indexOf(card, 0);
    if (index > -1) {
      this.dict.splice(index, 1);
    }

    // store dict
    this.storeDict();
  }

  clearStorage() {

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

            this.dict = [];
            this.levelsCounters = [0, 0, 0, 0, 0, 0];
            this.storeDict();
            this.setCsvLoaded(false);
          }
        }
      ]
    });

    prompt.present();
  }

  // Getting the card decks based on the level chosen by the user.
  getCardDeck(arr, value) {

    let result = [];
    for (let i = 0, iLen = arr.length; i < iLen; i++) {

      if (arr[i].level == value){

        result.push(arr[i]);
      }
    }

    return result;
  }

  storeDict(){

    // store level counter
    this.storage.set('level_es', this.levelsCounters);

    // store dict
    this.storage.set('dictionary_es', this.dict);
  }

  setCsvLoaded(loaded){

    this.csvLoaded = loaded;
    this.storage.set("csv_loaded", loaded);
  }
}
