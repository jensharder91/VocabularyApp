import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AlertController, ToastController } from "ionic-angular";
import { Card } from '../../../model/card';
import * as papa from 'papaparse';
import { Http } from "@angular/http";

export interface User{
  userName:string;
  languages: Language[];
}

export interface Language{
  name:string;
  shortName:string;
  image:string;
  topics: Topic[];
}

export interface Topic{
  name:string;
  cards: Card[];
}

@Injectable()
export class VocabProvider {

  private user:User;
  private currentLanguage:Language;

  // private dict: Card[] = [];
  private csvLoaded: Card[] = [];
  private MAX_LEVEL = 5;
  // private userName: string;

  //Storage
  private csv_loaded: string = "CSV_DATA";
  private dictionary_es: string = "dictionary_es";
  private user_name: string = "USER_NAME";

  private APP_USER:string ="APP_USER";

  constructor(private storage: Storage,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public http: Http) {

    // get boolean flag on csv loaded status
    this.storage.get(this.csv_loaded).then((val: Card[]) => {
      if (val != null) {
        this.csvLoaded = val;
      } else {
        this.importCSV();
      }
    });
  }

  login():Promise<any>{
    return new Promise((resolve, reject)=>{
      this.storage.get(this.APP_USER).then((myUser: User) => {
        if (myUser != null) {
          this.user = myUser;
          resolve();
        } else {
          this.mockUser().then(()=>{
            return this.saveUser();
          });
        }
      }).catch(()=>{
        reject();
      });
    });
  }

  mockUser():Promise<any>{
    return new Promise((resolve, reject)=>{
    this.storage.get(this.user_name).then((name:string)=>{
      let myUserName = "No name";
      if(name){
        myUserName = name;
      }
      this.storage.get(this.dictionary_es).then((val) => {
        let topic:Topic = <Topic>{name: "Vocabulary", cards: []};
        if (val != null) {
          topic.cards = val;
        }
        let lamguage: Language = <Language>{name:"Spanish", shortName:"ESP", topics: [topic], image: "assets/imgs/spain.svg"};
        this.user = <User>{userName: myUserName, languages: [lamguage]};
        resolve();
      });
    }).catch((err)=>{console.log("mockUser failed"); reject();});
    })

  }

  saveUserName(myUserName: string) {
    //set userName
    this.user.userName = myUserName;
    this.storage.set(this.user_name, myUserName);
  }

  getUserName(): string {
    if (this.user.userName) {
      return this.user.userName;
    } else {
      return "";
    }
  }

  getUser():User{
    return this.user;
  }

  setCurrentLanguage(name:string){
    this.user.languages.forEach((myLanguage)=>{
      if(myLanguage.name == name){
        this.currentLanguage = myLanguage;
      }
    });
  }

  getCurrentLanguage():Language{
    return this.currentLanguage;
  }

  // createCard(frontSideValue: string, backSideValue: string) {
  //
  //   let card: Card = {
  //     frontSide: frontSideValue,
  //     backSide: backSideValue,
  //     level: 0,
  //     dueDate: new Date().getTime()
  //   };
  //
  //   this.addCard(card);
  // }

  // addCard(card: Card) {
  //
  //   if (card.frontSide != null && card.backSide != null) {
  //     if (card.level == null) {
  //       card.level = 0;
  //     }
  //
  //     if (!this.cardExists(card)) {
  //       this.dict.push(card);
  //       // store dict
  //       this.storeDict();
  //     } else {
  //
  //       this.promptCardExists(card);
  //     }
  //   }
  // }
  //
  // private forceAddCard(card: any) {
  //
  //   if (card.frontSide != null && card.backSide != null) {
  //     if (card.level == null) {
  //       card.level = 0;
  //     }
  //
  //     this.dict.push(card);
  //     // store dict
  //     this.storeDict();
  //   }
  // }
  //
  // cardExists(card: any) {
  //
  //   if (card != null) {
  //     for (let existingCard of this.dict) {
  //
  //       if (card.frontSide == existingCard.frontSide
  //         && card.backSide == existingCard.backSide) {
  //         return true;
  //       }
  //     }
  //   }
  //
  //   return false;
  // }
  //
  // promptCardExists(card: any) {
  //
  //   let prompt = this.alertCtrl.create({
  //     title: 'Card already exists',
  //     message: "Do you want to add the card \"" + card.frontSide + " - " + card.backSide + "\" anyways?",
  //     buttons: [
  //       {
  //         text: 'No',
  //         handler: data => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'Yes',
  //         handler: data => {
  //           this.forceAddCard(card);
  //         }
  //       }
  //     ]
  //   });
  //
  //   prompt.present();
  // }
  //
  // changeCard(card: any, frontSideValue, backSideValue) {
  //
  //   let index = this.dict.indexOf(card);
  //   this.dict[index].frontSide = frontSideValue;
  //   this.dict[index].backSide = backSideValue;
  //
  //   this.storeDict();
  //
  // }

  // deleteCard(card: any) {
  //
  //   let index = this.dict.indexOf(card);
  //   if (index > -1) {
  //     this.dict.splice(index, 1);
  //   }
  //
  //   // store dict
  //   this.storeDict();
  // }

  // clearStorage() {
  //
  //   this.dict = [];
  //   this.csvLoaded = null;
  //   this.saveUser();
  // }

  // Getting all cards from the current language
  getCardDeckAll(): Card[] {

    let allCards: Card[] = [];

    this.currentLanguage.topics.forEach((topic)=>{
      topic.cards.forEach((card)=>{
        allCards.push(card);
      });
    });

    return allCards;
  }

  // Getting the card from the current lamguagedecks in level
  getCardDeckForLevel(level: number): Card[] {

    let result: Card[] = [];

    this.currentLanguage.topics.forEach((topic)=>{
      topic.cards.forEach((card)=>{
        if(level == card.level){
          result.push(card);
        }
      });
    });
    return result;
  }

  // Getting the card from the current lamguagedecks in topic
  getCardDeckForTopic(topic: string): Card[] {

    let result: Card[] = [];

    this.currentLanguage.topics.forEach((myTopic)=>{
      if(topic == myTopic.name){
        result = myTopic.cards;
      }
    });
    return result;
  }

  //get all cards which we need to learn right known
  getCardsToLearn() {
    let result: Card[] = [];

    this.currentLanguage.topics.forEach((topic)=>{
      topic.cards.forEach((card)=>{
        if (card.dueDate <= new Date().getTime()) {
          result.push(card);
        }
      });
    });

    return result;
  }

  saveUser():Promise<any> {
    return new Promise((resolve, reject)=>{
      let promises = [];

      // store dict
      promises.push(this.storage.set(this.APP_USER, this.user));

      //set csvLoaded
      promises.push(this.storage.set(this.csv_loaded, this.csvLoaded));

      Promise.all(promises).then(resolve, reject);
    });
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
      this.saveUser();
    }
  }

  resetCardLevel(card: Card) {
    //reset card level
    card.level = 0;

    //dueDate is now (in level 0)
    card.dueDate = new Date().getTime();

    //save
    this.saveUser();
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

    this.saveUser();

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

    let currentTopic:Topic = {name: "Mock", cards: []};

    this.currentLanguage.topics.forEach((myTopic)=>{
      if(myTopic.name == "Vocabulary"){
        currentTopic = myTopic;
      }
    });

    for (let i = 0; i < max; i++) {
      let card: Card = this.csvLoaded[0];//get the first item
      this.csvLoaded.splice(0, 1);//delete the first items
      currentTopic.cards.push(card);
    }

    this.saveUser();

    let toast = this.toastCtrl.create({
      message: max + ' cards added to the first level',
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }

}
