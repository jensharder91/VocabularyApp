import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AlertController, ToastController } from "ionic-angular";
import * as papa from 'papaparse';
import { Http } from "@angular/http";

export interface User {
  userName: string;
  languages: Language[];
}

export interface Language {
  id: string;
  name1: string;
  shortName1: string;
  image1: string;
  name2: string;
  shortName2: string;
  image2: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  cards: Card[];
  waitingCards: Card[];
  csvStringUrl: string;
}

export interface Card {
  frontSide: string;
  backSide: string;
  level: number;
  nextTimeInverse: boolean;
  dueDate: number;
}

@Injectable()
export class VocabProvider {

  private user: User;
  private currentLanguage: Language;
  private MAX_LEVEL = 5;

  //Storage
  private csv_loaded: string = "CSV_DATA";
  private dictionary_es: string = "dictionary_es";
  private user_name: string = "USER_NAME";

  private APP_USER: string = "APP_USER";

  constructor(private storage: Storage,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public http: Http) {

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
          // this.user = <User>{ userName: "", languages: [] };
          // this.saveUser();
        }
      }).catch(() => {
        reject();
      });
    });
  }

  mockUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      // this.storage.get(this.user_name).then((name: string) => {
      let myUserName = "No name";
      if (name) {
        myUserName = name;
      }

      this.user = <User>{ userName: myUserName, languages: [] };

      resolve();
      // });
      // }).catch((err) => { console.log("mockUser failed"); reject(); });
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

  setCurrentLanguage(id: string) {
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
      dueDate: new Date().getTime(),
      nextTimeInverse: false
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

    if (this.currentLanguage) {
      this.currentLanguage.topics.forEach((topic) => {
        topic.cards.forEach((card) => {
          allCards.push(card);
        });
      });
    }

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
    //next time, learn the opposite backSide
    if (card.nextTimeInverse) {
      card.nextTimeInverse = false;
    } else {
      card.nextTimeInverse = true;
    }

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

  public importCsvByTopics(topics: Topic[]) {

    let allLoaded = [];

    topics.forEach((topic) => {
      allLoaded.push(new Promise((resolve, reject) => {
        // let url: string = 'assets/data/test.csv';

        this.http.get(topic.csvStringUrl)
          .subscribe(
            data => this.extractData(topic, data, resolve),
            err => { console.log("Error with csv"); reject(); }
          );
      }));
    })

    return Promise.all(allLoaded);
  }

  private extractData(topic: Topic, res, resolve) {
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;

    parsedData.splice(0, 1);

    if (!topic.waitingCards || topic.waitingCards.length == 0) {
      topic.waitingCards = [];

      for (let j = 0; j < parsedData.length; j++) {
        topic.waitingCards.push({
          frontSide: parsedData[j][0],
          backSide: parsedData[j][1],
          level: 0,
          dueDate: new Date().getTime(),
          nextTimeInverse: false
        });
      }

      this.saveUser();
    }
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
        this.importCsvByTopics([topic]).then(() => {
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

  getAvailableContent(languageId: string): Topic[] {
    if (languageId == "esp-eng") {
      let topic_extended: Topic = <Topic>{ id: "_extended", name: "Extended", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng-extended.csv" };
      let topic_basic: Topic = <Topic>{ id: "_basic", name: "Basic", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng-basic.csv" };
      return [topic_basic, topic_extended];
    }
    if (languageId == "esp-ger") {
      let topic_basic: Topic = <Topic>{ id: "_basic", name: "Basic", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger.csv" };
      let topic_duolingo: Topic = <Topic>{ id: "_duolingo", name: "Duolingo", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-esp-duolingo.csv" };
      return [topic_basic, topic_duolingo];
    }
    if (languageId == "ger-eng") {
      let topic_phrases: Topic = <Topic>{ id: "_phrases", name: "Phrases", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng-useful-phrases.csv" };
      let topic_around: Topic = <Topic>{ id: "_around", name: "Getting Around", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng-getting-around.csv" };
      let topic_money: Topic = <Topic>{ id: "_money", name: "Money", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng-money.csv" };
      return [topic_phrases, topic_around, topic_money];
    }
    return [];
  }

  addContentToUser(languageId: string, topics: Topic[]) {
    this.user.languages.forEach(language => {
      if (language.id == languageId) {
        language.topics = topics;
        this.importCsvByTopics(language.topics).then(() => {
          this.saveUser();
        });
      }
    });
  }

  getAvaiableLanguages(): Language[] {
    let languages: Language[] = [];
    languages.push(<Language>{ id: "esp-eng", name1: "Spanish", shortName1: "ESP", image1: "assets/imgs/home/spain.svg", name2: "English", shortName2: "ENG", image2: "assets/imgs/home/gb.svg", topics: [] });
    languages.push(<Language>{ id: "esp-ger", name1: "Spanish", shortName1: "ESP", image1: "assets/imgs/home/spain.svg", name2: "German", shortName2: "GER", image2: "assets/imgs/home/german.svg", topics: [] });
    languages.push(<Language>{ id: "ger-eng", name1: "German", shortName1: "GER", image1: "assets/imgs/home/german.svg", name2: "English", shortName2: "ENG", image2: "assets/imgs/home/gb.svg", topics: [] });

    return languages;
  }

  addLanguagesToUser(languages: Language[]) {
    this.user.languages = languages;
    this.saveUser();
  }
}
