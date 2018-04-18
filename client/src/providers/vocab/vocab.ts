import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AlertController, ToastController } from "ionic-angular";
import { Card } from '../../../model/card';
import * as papa from 'papaparse';
import { Http } from "@angular/http";

@Injectable()
export class VocabProvider {

  private dict: Card[] = [];
  private csvLoaded: Card[] = [];
  private MAX_LEVEL = 5;
  private userName: string;

  //Storage
  private csv_loaded: string = "CSV_DATA";
  private dictionary_es: string = "dictionary_es";
  private user_name: string = "USER_NAME";
  private asked_for_username:string = "ASKED_FOR_USER_NAME";

  constructor(private storage: Storage,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public http: Http) {

    // get dictionary from storage
    this.storage.get(this.dictionary_es).then((val) => {
      if (val != null) {
        this.dict = val;
      }
    });

    // get boolean flag on csv loaded status
    this.storage.get(this.csv_loaded).then((val: Card[]) => {
      if (val != null) {
        this.csvLoaded = val;
      } else {
        this.importCSV();
      }
    });

    // get boolean flag on csv loaded status
    this.storage.get(this.user_name).then((myUserName: string) => {
      if (myUserName) {
        this.userName = myUserName;
      }else{
        this.storage.get(this.asked_for_username).then((askedForUserName: boolean) => {
          if(!askedForUserName){
            this.alertCtrl.create({
              title: 'Hello!',
              message: "Would you mind sharing your username? :)",
              inputs: [
                {
                  name: 'name',
                  placeholder: 'Username'
                }
              ],
              buttons: [
                {
                  text: 'Ok',
                  handler: data => {
                    this.saveUserName(data.name);
                  }
                }
              ]
            }).present();
            this.storage.set(this.asked_for_username, true);
          }
        });
      }
    });
  }

  saveUserName(myUserName: string) {
    //set userName
    this.userName = myUserName;
    this.storage.set(this.user_name, myUserName);
  }

  getUserName(): string {
    if (this.userName) {
      return this.userName;
    } else {
      return "";
    }
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
    this.dict[index].frontSide = frontSideValue;
    this.dict[index].backSide = backSideValue;

    this.storeDict();

  }

  deleteCard(card: any) {

    let index = this.dict.indexOf(card);
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
            this.csvLoaded = null;
            this.storeDict();
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

  // Getting the card decks based on the ID (level or topic) chosen by the user.
  getCardDeckForId(id: number): Card[] {

    let result: Card[] = [];

    this.dict.forEach((card: Card) => {
      // todo: add list of cardDeckIds to Card model
      // (one card can belong to several decks)
      if (card.level == id) {
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
    // store dict
    this.storage.set(this.dictionary_es, this.dict);

    //set csvLoaded
    this.storage.set(this.csv_loaded, this.csvLoaded);
  }



  increaseCardLevel(card: Card) {
    //only if it is not to early to study this cards
    if (card.dueDate <= new Date().getTime()) {
      //increase card level
      if (card.level < this.MAX_LEVEL) {
        card.level++;
      }

      //set dueDate (for now level * 1hh)
      card.dueDate = new Date().getTime() + 1000 * 60 * 60 * 18 * card.level; //18h

      //save
      this.storeDict();
    }
  }

  resetCardLevel(card: Card) {
    //reset card level
    card.level = 0;

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

  public importCSV(): Promise<any> {

    return new Promise((resolve, reject) => {
      let url: string = 'assets/data/test.csv';

      this.http.get(url)
        .subscribe(
        data => this.extractData(data, resolve),
        err => { console.log("Error with csv"); reject(); }
        );
    });

  }

  private extractData(res, resolve) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;

    parsedData.splice(0, 1);

    this.csvLoaded = [];

    for (let j = 0; j < parsedData.length; j++) {
      this.csvLoaded.push({
        frontSide: parsedData[j][0],
        backSide: parsedData[j][1],
        level: 0,
        dueDate: new Date().getTime()
      });
    }

    this.storeDict();

    resolve();
  }

  public addTenVocs() {

    if (this.csvLoaded == null) {
      this.importCSV().then(() => {
        this.addTenVocsNow();
      })
    } else {
      this.addTenVocsNow();
    }
  }

  private addTenVocsNow() {

    let max = 10;
    if (max > this.csvLoaded.length) {
      max = this.csvLoaded.length;
    }

    for (let i = 0; i < max; i++) {
      let card: Card = this.csvLoaded[0];//get the first item
      this.csvLoaded.splice(0, 1);//delete the first items
      this.dict.push(card);//add it to dictionary
    }

    this.storeDict();

    let toast = this.toastCtrl.create({
      message: max + ' cards added to the first level',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

}
