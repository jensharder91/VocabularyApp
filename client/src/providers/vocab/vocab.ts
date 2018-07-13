import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AlertController, ToastController } from "ionic-angular";
import * as papa from 'papaparse';
import { Http } from "@angular/http";
import { Card } from '../../../swagger/model/Card';
import { Bundle } from '../../../swagger/model/Bundle';
import { Topic } from '../../../swagger/model/Topic';
import { User } from '../../../swagger/model/User';
import { Language } from '../../../swagger/model/Language';
import { BundleService } from '../servermock/bundleService';
import { LanguageService } from '../servermock/languageService';
import { TopicService } from '../servermock/topicService';


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
    public http: Http,
    private topicService: TopicService,
    private bundleService: BundleService,
    private languageService: LanguageService) {

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

      this.user = <User>{ userName: myUserName, languages: [], bundles: [], topics: [], currentLanguageId: "esp-eng" };

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
      return "Unknown";
    }
  }

  getUser(): User {
    console.log(this.user);
    return this.user;
  }

  setCurrentLanguage(id: string) {
    this.user.currentLanguageId = id;
    this.saveUser();
  }

  getLanguageById(languageId: string): Language {
    let language: Language;
    this.user.languages.forEach((myLanguage) => {
      if (myLanguage.id == languageId) {
        language = myLanguage;
      }
    });
    return language;
  }

  getCurrentLanguage(): Language {
    return this.getLanguageById(this.user.currentLanguageId);
  }

  generateCustomCardId(): string {
    return this.user.userId + "_c_" + Math.floor((Math.random() * 99999999) + 1);
  }

  createCard(topicId: string, frontSideValue: string, backSideValue: string) {
    let topic: Topic = this.getTopicById(topicId);
    let card: Card = {
      id: this.generateCustomCardId(),
      topicId: topicId,
      bundleId: topic.bundleId,
      languageId: topic.languageId,
      frontSide: frontSideValue,
      backSide: backSideValue,
      level: 0,
      customCard: true,
      dueDate: new Date().getTime(),
      nextTimeInverse: false
    };
    topic.cards.push(card);
    this.saveUser();
  }

  changeCard(cardId: string, frontSideValue: string, backSideValue: string) {

    let card: Card = this.getCardById(cardId);

    card.frontSide = frontSideValue;
    card.backSide = backSideValue;

    this.saveUser();
  }

  deleteCard(cardId: string) {

    let card: Card = this.getCardById(cardId);

    let topic: Topic = this.getTopicById(card.topicId);

    if (topic) {
      let index = topic.cards.indexOf(card);
      if (index > -1) {
        topic.cards.splice(index, 1);
      }
      this.saveUser();
    }
  }

  getTopicsFromCurrentLanguage(): Topic[] {

    let topics: Topic[] = [];

    this.user.topics.forEach((topic) => {
      if (topic.languageId == this.user.currentLanguageId) {
        topics.push(topic);
      }
    });

    return topics;
  }

  getBundlesFromCurrentLanguage(): Bundle[] {

    let bundles: Bundle[] = [];

    this.user.bundles.forEach((bundle) => {
      if (bundle.languageId == this.user.currentLanguageId) {
        bundles.push(bundle);
      }
    });

    return bundles;
  }


  // getTopicByName(topicName: string): Topic {
  //   let topic: Topic = <Topic>{ id: "_mock", languageId: "_mock", bundleId: "_mock", name: "mock", customTopic: true, cards: [], waitingCards: [] };
  //   this.getCurrentLanguage().topics.forEach((myTopic) => {
  //     if (myTopic.name == topicName) {
  //       topic = myTopic;
  //     }
  //   });
  //   return topic;
  // }

  // Getting all cards from the current language
  getCardsAll(): Card[] {

    let allCards: Card[] = [];

    this.getTopicsFromCurrentLanguage().forEach((topic) => {
      topic.cards.forEach((card) => {
        allCards.push(card);
      });
    });

    return allCards;
  }

  getCardById(cardId: string): Card {
    let card: Card = <Card>{};
    this.getCardsAll().forEach((myCard) => {
      if (myCard.id == cardId) {
        card = myCard;
      }
    });
    return card;
  }

  // Getting the card from the current lamguagedecks in level
  getCardsByLevel(level: number): Card[] {

    let result: Card[] = [];

    this.getCardsAll().forEach((card) => {
      if (level == card.level) {
        result.push(card);
      }
    });
    return result;
  }

  getTopicById(topicId: string): Topic {
    let topic: Topic = <Topic>{};
    this.user.topics.forEach((myTopic) => {
      if (myTopic.id == topicId) {
        topic = myTopic;
      }
    });
    return topic;
  }

  getTopicsByBundleId(bundleId: string): Topic[] {
    let topics: Topic[] = [];

    this.user.topics.forEach((topic) => {
      if (topic.bundleId == bundleId) {
        topics.push(topic);
      }
    });

    return topics;
  }


  // Getting the card from the current language decks in topic
  getActiveCardsByTopicId(topicId: string): Card[] {
    return this.getTopicById(topicId).cards;
  }

  // Getting the waiting card from the current language decks in topic
  getWaitingCardsByTopicId(topicId: string): Card[] {
    return this.getTopicById(topicId).cards;
  }

  getAllCardsByTopicId(topicId: string): Card[] {
    let topic: Topic = this.getTopicById(topicId);
    return topic.cards.concat(topic.waitingCards);
  }

  //get all cards which we need to learn right known
  getCardsToLearn() {
    let result: Card[] = [];

    this.getCardsAll().forEach((card) => {
      if (card.dueDate <= new Date().getTime()) {
        result.push(card);
      }
    })
    return result;
  }

  getBundleById(bundleId: string): Bundle {
    let bundle: Bundle = <Bundle>{};
    this.user.bundles.forEach((myBundle) => {
      if (myBundle.id == bundleId) {
        bundle = myBundle;
      }
    });
    return bundle;
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






  public addTenVocs(topicId: string) {

    let topic: Topic = this.getTopicById(topicId);

    if (topic) {
      if (topic.waitingCards == null) {
        // this.importCsvByTopics([topic]).then(() => {
        //   this.addTenVocsNow(topic, 10);
        // })
      } else {
        this.addTenVocsNow(topic, 10);
      }
    }
  }

  addTenVocsAutomatically(): number {
    let numberToAdd = 10;

    this.getTopicsFromCurrentLanguage().forEach((topic) => {
      if (topic.waitingCards && topic.waitingCards.length > 0 && numberToAdd > 0) {
        numberToAdd = numberToAdd - this.addTenVocsNow(topic, numberToAdd);
      }
    });

    return numberToAdd;
  }

  private addTenVocsNow(topic: Topic, max: number): number {

    if (max > topic.waitingCards.length) {
      max = topic.waitingCards.length;
    }

    for (let i = 0; i < max; i++) {
      let card: Card = topic.waitingCards[0];//get the first item
      topic.waitingCards.splice(0, 1);//delete the first items
      topic.cards.push(card);
    }

    this.saveUser();

    if (max < 1) {
      this.alertCtrl.create({
        title: 'No cards left to upload!',
        subTitle: 'Add more topics to your favorites to continue studying!',
        buttons: ['OK']
      }).present();
    } else {
      this.alertCtrl.create({
        title: max + ' cards added to the first level.',
        buttons: ['OK']
      }).present();
    }
    return max;
  }

  getAvailableTopics(): Promise<Topic[]> {

    return this.topicService.topicsAllGet();

  }

  getAvailableTopicsByTopicId(topicId:string): Promise<Topic>{
      return this.topicService.topicByTopicIdGet(topicId);
  }

  getAvailableTopicsByBundleId(bundleId: string): Promise<Topic[]> {

    return this.topicService.topicsByBundleIdGet(bundleId);

  }

  addTopicToUser(topic: Topic, bundle: Bundle) {
    this.user.topics.push(topic);
    if (this.getBundleById(topic.bundleId) == null) {
      this.user.bundles.push(bundle);
    }
    // this.importCsvByTopics([topic]).then(() => {
    this.saveUser();
    // });
  }

  removeTopicFromUser(topicId: string) {
    let topic: Topic = this.getTopicById(topicId);

    if (topic) {
      let index = this.user.topics.indexOf(topic);
      if (index > -1) {
        this.user.topics.splice(index, 1);
      }
      //TODO check if bundle can be removed (no more topics there)
      this.saveUser();
    }
  }

  getAvaiableLanguages(): Promise<Language[]> {
    // let languages: Language[] = [];
    // languages.push(<Language>{ id: "esp-eng", name1: "Spanish", shortName1: "ESP", image1: "assets/imgs/home/spain.svg", name2: "English", shortName2: "ENG", image2: "assets/imgs/home/gb.svg", topics: [] });
    // languages.push(<Language>{ id: "esp-ger", name1: "Spanish", shortName1: "ESP", image1: "assets/imgs/home/spain.svg", name2: "German", shortName2: "GER", image2: "assets/imgs/home/german.svg", topics: [] });
    // languages.push(<Language>{ id: "ger-eng", name1: "German", shortName1: "GER", image1: "assets/imgs/home/german.svg", name2: "English", shortName2: "ENG", image2: "assets/imgs/home/gb.svg", topics: [] });
    //
    // return languages;
    return this.languageService.languagesAllGet();
  }

  addLanguageToUser(languageId: string) {

    this.getAvaiableLanguages().then((languages) => {
      languages.forEach((language) => {
        if (language.id == languageId) {
          this.user.languages.push(language);
          this.setCurrentLanguage(languageId);
          this.saveUser();
        }
      })
    })


  }

  removeLanguageFromUser(languageId: string) {
    let language: Language = this.getLanguageById(languageId);

    if (language) {
      let index = this.user.languages.indexOf(language);
      if (index > -1) {
        this.user.languages.splice(index, 1);
      }
      //TODO remove all bundles and topics related to this language
      this.saveUser();
    }
  }

  getAvaiableBundles(): Promise<Bundle[]> {

    return this.bundleService.bundlesAllGet();

  }

  getAvaiableBundlesByLanguageId(languageId: string): Promise<Bundle[]> {

    return this.bundleService.bundlesByLanguageIdGet(languageId);

  }

  addBundleToUser(bundle: Bundle) {

    this.user.bundles.push(bundle);
    this.saveUser();
  }

  removeBundleFromUser(bundleId: string) {
    let bundle: Bundle = this.getBundleById(bundleId);

    if (bundle) {
      let index = this.user.bundles.indexOf(bundle);
      if (index > -1) {
        this.user.bundles.splice(index, 1);
      }
      //TODO remove all topics and topics related to this bundle
      this.saveUser();
    }
  }
}
