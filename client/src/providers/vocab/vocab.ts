import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AlertController } from "ionic-angular";
import { Card } from '../../../model/card';
import * as papa from 'papaparse';
import { Http } from "@angular/http";

@Injectable()
export class VocabProvider {

  private dict: Card[] = [];
  private levelsCounters = [0, 0, 0, 0, 0, 0];
  csvLoaded = false;
  private MAX_LEVEL = 5;

  constructor(private storage: Storage,
    public alertCtrl: AlertController,
    public http: Http) {

    // get dictionary from storage
    this.storage.get('dictionary_es').then((val) => {
      if (val != null) {
        this.dict = val;
      }
    });

    // get level counter from storage
    this.storage.get('level_es').then((val) => {
      if (val != null) {
        this.levelsCounters = val;
      }
    });

    // get boolean flag on csv loaded status
    this.storage.get('csv_loaded').then((val) => {
      if (val != null) {
        this.csvLoaded = val;
      }
    });
  }

  createCard(frontSideValue: string, backSideValue: string) {

    let card: Card = {
      frontSide: frontSideValue,
      backSide: backSideValue,
      level: 0,
      dueDate: new Date().getTime()
    };

    this.addCard(card);
  }

  addCard(card: Card) {

    if (card.frontSide != null && card.backSide != null) {
      if (card.level == null) {
        card.level = 0;
      }

      if (!this.cardExists(card)) {
        this.dict.push(card);
        this.levelsCounters[card.level]++;
        // store dict
        this.storeDict();
      } else {

        this.promptCardExists(card);
      }
    }
  }

  private forceAddCard(card: any) {

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

  cardExists(card: any) {

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

  promptCardExists(card: any) {

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

  changeCard(card: any, frontSideValue, backSideValue) {

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

  deleteCard(card: any) {

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

  // Getting all cards
  getCardDeckAll(): Card[] {

    return this.dict;
  }

  // Getting the card decks based on the level chosen by the user.
  getCardDeckForLevel(level: number): Card[] {

    let result: Card[] = [];

    this.dict.forEach((card: Card) => {
      if (card.level == level) {
        result.push(card);
      }
    });

    return result;
  }

  //get all cards which we need to learn right known
  getCardsToLearn() {
    let result: Card[] = [];

    this.dict.forEach((card: Card) => {
      if (card.dueDate <= new Date().getTime()) {
        result.push(card);
      }
    });

    return result;
  }

  storeDict() {

    // store level counter
    this.storage.set('level_es', this.levelsCounters);

    // store dict
    this.storage.set('dictionary_es', this.dict);
  }



  increaseCardLevel(card: Card) {
    //only if it is not to early to study this cards
    if (card.dueDate <= new Date().getTime()) {
      //decrease counter of current level
      this.levelsCounters[card.level]--;
      //increase card level
      if (card.level < this.MAX_LEVEL) {
        card.level++;
      }
      //increase level counter of new level
      this.levelsCounters[card.level]++;

      //set dueDate (for now level * 1hh)
      card.dueDate = new Date().getTime() + 1000 * 60 * 60 * card.level; //1h

      //save
      this.storeDict();
    }
  }

  resetCardLevel(card: Card) {
    //decrease counter of current level
    this.levelsCounters[card.level]--;
    //reset card level
    card.level = 0;
    //increase level counter of new level
    this.levelsCounters[card.level]++;

    //dueDate is now (in level 0)
    card.dueDate = new Date().getTime();

    //save
    this.storeDict();
  }




  /**************************
  **                       **
  **    MOCK, csv csvData  **
  **                       **
  **************************/

  public importCSV() {

    let url: string = 'assets/data/test.csv';

    this.http.get(url)
      .subscribe(
      data => this.extractData(data),
      err => console.log("Error with csv")
      );
  }

  private extractData(res) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;

    parsedData.splice(0, 1);

    for (let j = 0; j < parsedData.length; j++) {
      this.dict.push({
        frontSide: parsedData[j][0],
        backSide: parsedData[j][1],
        level: 0,
        dueDate: new Date().getTime()
      });
      this.levelsCounters[0]++;
    }

    this.storeDict();

    this.setCsvLoaded(true);
  }

  private setCsvLoaded(loaded) {

    this.csvLoaded = loaded;
    this.storage.set("csv_loaded", loaded);
  }


}
