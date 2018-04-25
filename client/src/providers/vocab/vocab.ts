import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AlertController, ToastController } from "ionic-angular";
import { Card } from '../../../model/card';
import * as papa from 'papaparse';
import { Http } from "@angular/http";

export interface User {
  userName: string;
  languages: Language[];
}

export interface Language {
  id: number;
  name1: string;
  shortName1: string;
  image1: string;
  name2: string;
  shortName2: string;
  image2: string;
  topics: Topic[];
}

export interface Topic {
  name: string;
  cards: Card[];
  waitingCards: Card[];
  csvStringUrl: string;
}

@Injectable()
export class VocabProvider {

  private user: User;
  private currentLanguage: Language;

  // private dict: Card[] = [];
  // private csvLoaded: Card[] = [];
  private MAX_LEVEL = 5;
  // private userName: string;

  //Storage
  private csv_loaded: string = "CSV_DATA";
  private dictionary_es: string = "dictionary_es";
  private user_name: string = "USER_NAME";

  private APP_USER: string = "APP_USER";

  constructor(private storage: Storage,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public http: Http) {

    // get boolean flag on csv loaded status
    // this.storage.get(this.csv_loaded).then((val: Card[]) => {
    //   if (val != null && val.length > 0) {
    //     this.csvLoaded = val;
    //   } else {
    //     this.importCSV();
    //   }
    // });
  }

  login(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get(this.APP_USER).then((myUser: User) => {
        if (myUser != null) {
          this.user = myUser;
          resolve();
        } else {
          this.mockUser().then(() => {
            return this.saveUser();
          });
        }
      }).catch(() => {
        reject();
      });
    });
  }

  mockUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.storage.get(this.user_name).then((name: string) => {
        let myUserName = "No name";
        if (name) {
          myUserName = name;
        }
        this.storage.get(this.dictionary_es).then((val) => {
          let topic: Topic = <Topic>{ name: "Vocabulary", cards: [], waitingCards: [], csvStringUrl: "assets/data/test.csv" };
          if (val != null) {
            topic.cards = val;
          }
          let lamguage: Language = <Language>{ id: 1, name1: "Spanish", shortName1: "ESP", image1: "assets/imgs/home/spain.svg", name2: "English", shortName2: "ENG", image2: "assets/imgs/home/gb.svg", topics: [topic] };
          this.user = <User>{ userName: myUserName, languages: [lamguage] };
          this.importCSV();
          resolve();
        });
      }).catch((err) => { console.log("mockUser failed"); reject(); });
    });
  }

  saveUserName(myUserName: string) {
    //set userName
    this.user.userName = myUserName;
    this.saveUser();
  }

  getUserName(): string {
    if (this.user && this.user.userName) {
      return this.user.userName;
    } else {
      return "";
    }
  }

  getUser(): User {
    return this.user;
  }

  setCurrentLanguage(id: number) {
    this.currentLanguage = null;
    this.user.languages.forEach((myLanguage) => {
      if (myLanguage.id == id) {
        this.currentLanguage = myLanguage;
      }
    });
  }

  getCurrentLanguage(): Language {
    if (this.currentLanguage) {
      return this.currentLanguage;
    }
    else {
      return <Language>{};
    }
  }

  createCard(topicString: string, frontSideValue: string, backSideValue: string) {

    let card: Card = {
      frontSide: frontSideValue,
      backSide: backSideValue,
      level: 0,
      dueDate: new Date().getTime()
    };

    let topic: Topic;

    if (this.currentLanguage) {
      this.currentLanguage.topics.forEach((myTopic) => {
        if (topicString == myTopic.name) {
          topic = myTopic;
        }
      });
    }

    if (topic && frontSideValue && backSideValue) {
      topic.cards.push(card);
      this.saveUser();
    }
  }

  changeCard(card: Card, frontSideValue: string, backSideValue: string) {

    card.frontSide = frontSideValue;
    card.backSide = backSideValue;

    this.saveUser();
  }

  deleteCard(topicString: string, card: Card) {

    let topic: Topic;

    if (this.currentLanguage) {
      this.currentLanguage.topics.forEach((myTopic) => {
        if (topicString == myTopic.name) {
          topic = myTopic;
        }
      });
    }

    if (topic) {
      let index = topic.cards.indexOf(card);
      if (index > -1) {
        topic.cards.splice(index, 1);
      }
      this.saveUser();
    }
  }

  // Getting all cards from the current language
  getCardDeckAll(): Card[] {

    let allCards: Card[] = [];

    this.currentLanguage.topics.forEach((topic) => {
      topic.cards.forEach((card) => {
        allCards.push(card);
      });
    });

    return allCards;
  }

  // Getting the card from the current lamguagedecks in level
  getCardDeckForLevel(level: number): Card[] {

    let result: Card[] = [];
    if (this.currentLanguage) {
      this.currentLanguage.topics.forEach((topic) => {
        topic.cards.forEach((card) => {
          if (level == card.level) {
            result.push(card);
          }
        });
      });
    }
    return result;
  }

  // Getting the card from the current lamguagedecks in topic
  getCardDeckForTopic(topic: string): Card[] {

    let result: Card[] = [];
    if (this.currentLanguage) {
      this.currentLanguage.topics.forEach((myTopic) => {
        if (topic == myTopic.name) {
          result = myTopic.cards;
        }
      });
    }
    return result;
  }

  //get all cards which we need to learn right known
  getCardsToLearn() {
    let result: Card[] = [];

    if (this.currentLanguage) {
      this.currentLanguage.topics.forEach((topic) => {
        topic.cards.forEach((card) => {
          if (card.dueDate <= new Date().getTime()) {
            result.push(card);
          }
        });
      });
    }
    return result;
  }

  saveUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      let promises = [];

      // store dict
      promises.push(this.storage.set(this.APP_USER, this.user));

      //set csvLoaded
      // promises.push(this.storage.set(this.csv_loaded, this.csvLoaded));

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

    let allLoaded = [];

    this.user.languages.forEach((language) => {
      language.topics.forEach((topic) => {
        allLoaded.push(new Promise((resolve, reject) => {
          // let url: string = 'assets/data/test.csv';

          this.http.get(topic.csvStringUrl)
            .subscribe(
              data => this.extractData(topic, data, resolve),
              err => { console.log("Error with csv"); reject(); }
            );
        }));
      })
    })

    return Promise.all(allLoaded);

    // return new Promise((resolve, reject) => {
    //   let url: string = 'assets/data/test.csv';
    //
    //   this.http.get(url)
    //     .subscribe(
    //       data => this.extractData(data, resolve),
    //       err => { console.log("Error with csv"); reject(); }
    //     );
    // });

  }

  private extractData(topic, res, resolve) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;

    parsedData.splice(0, 1);

    topic.waitingCards = [];

    for (let j = 0; j < parsedData.length; j++) {
      topic.waitingCards.push({
        frontSide: parsedData[j][0],
        backSide: parsedData[j][1],
        level: 0,
        dueDate: new Date().getTime()
      });
    }

    this.saveUser();

    resolve();
  }

  public addTenVocs(topicName: string) {

    let topic: Topic;
    this.currentLanguage.topics.forEach((myTopic) => {
      if (myTopic.name == topicName) {
        topic = myTopic;
      }
    });

    if (topic) {
      if (topic.waitingCards == null) {
        this.importCSV().then(() => {
          this.addTenVocsNow(topic);
        })
      } else {
        this.addTenVocsNow(topic);
      }
    }
  }

  private addTenVocsNow(topic: Topic) {

    let max = 10;
    if (max > topic.waitingCards.length) {
      max = topic.waitingCards.length;
    }

    // let currentTopic: Topic = { name: "Mock", cards: [] };

    // this.currentLanguage.topics.forEach((myTopic) => {
    //   if (myTopic.name == "Vocabulary") {
    //     currentTopic = myTopic;
    //   }
    // });

    for (let i = 0; i < max; i++) {
      let card: Card = topic.waitingCards[0];//get the first item
      topic.waitingCards.splice(0, 1);//delete the first items
      topic.cards.push(card);
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
