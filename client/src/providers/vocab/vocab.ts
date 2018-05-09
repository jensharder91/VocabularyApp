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
  customTopic?: boolean;
  csvStringUrl?: string;
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
      return <Language>{ topics: [] };
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

  getTopicByName(topicName:string):Topic{
    let topic: Topic = <Topic>{ id: "_mock", name: "mock", customTopic: true, cards: [], waitingCards: [] };
    this.currentLanguage.topics.forEach((myTopic) => {
      if (myTopic.name == topicName) {
        topic = myTopic;
      }
    });
    return topic;
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

        if (!topic.customTopic) {
          this.http.get(topic.csvStringUrl)
            .subscribe(
              data => this.extractData(topic, data, resolve),
              err => { console.log("Error with csv");
              console.log("could not get csv ",topic.csvStringUrl); reject(); }
            );
        } else {
          resolve();
        }
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

    if (max < 1) {
      this.toastCtrl.create({
        message: 'There are no cards to insert. Plesse add new cards in the topic list.',
        duration: 3000,
        position: 'bottom'
      }).present();
    } else {
      this.toastCtrl.create({
        message: max + ' cards added to the first level',
        duration: 3000,
        position: 'bottom'
      }).present();
    }
  }

  getAvailableContent(languageId: string): Topic[] {
    if (languageId == "esp-eng") {
      let topics: Array<Topic> = [];
      topics.push(<Topic>{ id: "_extended", name: "Extended", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/esp-eng-extended.csv" });
      topics.push(<Topic>{ id: "_adjectives1(part1)", name: "Adjectives 1 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Adjectives 1 (Part 1).csv" });
      topics.push(<Topic>{ id: "_adjectives1(part3)", name: "Adjectives 1 (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Adjectives 1 (Part 3).csv" });
      topics.push(<Topic>{ id: "_adjectives1(part2)", name: "Adjectives 1 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Adjectives 1 (Part 2).csv" });
      topics.push(<Topic>{ id: "_adjectives2(part1)", name: "Adjectives 2 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Adjectives 2 (Part 1).csv" });
      topics.push(<Topic>{ id: "_adjectives2(part3)", name: "Adjectives 2 (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Adjectives 2 (Part 3).csv" });
      topics.push(<Topic>{ id: "_adverbs(part2)", name: "Adverbs (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Adverbs (Part 2).csv" });
      topics.push(<Topic>{ id: "_adjectives2(part2)", name: "Adjectives 2 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Adjectives 2 (Part 2).csv" });
      topics.push(<Topic>{ id: "_adverbs(part1)", name: "Adverbs (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Adverbs (Part 1).csv" });
      topics.push(<Topic>{ id: "_adverbs(part3)", name: "Adverbs (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Adverbs (Part 3).csv" });
      topics.push(<Topic>{ id: "_animals", name: "Animals", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Animals.csv" });
      topics.push(<Topic>{ id: "_basics1", name: "Basics 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Basics 1.csv" });
      topics.push(<Topic>{ id: "_arts(part2)", name: "Arts (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Arts (Part 2).csv" });
      topics.push(<Topic>{ id: "_arts(part1)", name: "Arts (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Arts (Part 1).csv" });
      topics.push(<Topic>{ id: "_basics2", name: "Basics 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Basics 2.csv" });
      topics.push(<Topic>{ id: "_business(part1)", name: "Business (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Business (Part 1).csv" });
      topics.push(<Topic>{ id: "_business(part2)", name: "Business (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Business (Part 2).csv" });
      topics.push(<Topic>{ id: "_clothing", name: "Clothing", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Clothing.csv" });
      topics.push(<Topic>{ id: "_commonphrases", name: "Common Phrases", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Common Phrases.csv" });
      topics.push(<Topic>{ id: "_communication", name: "Communication", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Communication.csv" });
      topics.push(<Topic>{ id: "_datesandtime(part1)", name: "Dates and Time (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Dates and Time (Part 1).csv" });
      topics.push(<Topic>{ id: "_countries", name: "Countries", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Countries.csv" });
      topics.push(<Topic>{ id: "_datesandtime(part2)", name: "Dates and Time (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Dates and Time (Part 2).csv" });
      topics.push(<Topic>{ id: "_determiners", name: "Determiners", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Determiners.csv" });
      topics.push(<Topic>{ id: "_directions", name: "Directions", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Directions.csv" });
      topics.push(<Topic>{ id: "_education", name: "Education", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Education.csv" });
      topics.push(<Topic>{ id: "_family(part1)", name: "Family (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Family (Part 1).csv" });
      topics.push(<Topic>{ id: "_family(part2)", name: "Family (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Family (Part 2).csv" });
      topics.push(<Topic>{ id: "_feelings", name: "Feelings", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Feelings.csv" });
      topics.push(<Topic>{ id: "_food(part1)", name: "Food (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Food (Part 1).csv" });
      topics.push(<Topic>{ id: "_food(part2)", name: "Food (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Food (Part 2).csv" });
      topics.push(<Topic>{ id: "_food2", name: "Food 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Food 2.csv" });
      topics.push(<Topic>{ id: "_household(part1)", name: "Household (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Household (Part 1).csv" });
      topics.push(<Topic>{ id: "_household(part2)", name: "Household (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Household (Part 2).csv" });
      topics.push(<Topic>{ id: "_medical(part1)", name: "Medical (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Medical (Part 1).csv" });
      topics.push(<Topic>{ id: "_medical(part2)", name: "Medical (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Medical (Part 2).csv" });
      topics.push(<Topic>{ id: "_medical(part3)", name: "Medical (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Medical (Part 3).csv" });
      topics.push(<Topic>{ id: "_nature(part1)", name: "Nature (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Nature (Part 1).csv" });
      topics.push(<Topic>{ id: "_nature(part2)", name: "Nature (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Nature (Part 2).csv" });
      topics.push(<Topic>{ id: "_numbers", name: "Numbers", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Numbers.csv" });
      topics.push(<Topic>{ id: "_objectpronouns", name: "Object Pronouns", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Object Pronouns.csv" });
      topics.push(<Topic>{ id: "_objects(part1)", name: "Objects (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Objects (Part 1).csv" });
      topics.push(<Topic>{ id: "_objects(part2)", name: "Objects (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Objects (Part 2).csv" });
      topics.push(<Topic>{ id: "_objects(part3)", name: "Objects (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Objects (Part 3).csv" });
      topics.push(<Topic>{ id: "_occupations(part1)", name: "Occupations (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Occupations (Part 1).csv" });
      topics.push(<Topic>{ id: "_occupations(part2)", name: "Occupations (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Occupations (Part 2).csv" });
      topics.push(<Topic>{ id: "_pasttense", name: "Past Tense", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Past Tense.csv" });
      topics.push(<Topic>{ id: "_people", name: "People", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/People.csv" });
      topics.push(<Topic>{ id: "_phrasalfuturetense", name: "Phrasal Future Tense", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Phrasal Future Tense.csv" });
      topics.push(<Topic>{ id: "_places(part1)", name: "Places (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Places (Part 1).csv" });
      topics.push(<Topic>{ id: "_places(part2)", name: "Places (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Places (Part 2).csv" });
      topics.push(<Topic>{ id: "_places(part3)", name: "Places (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Places (Part 3).csv" });
      topics.push(<Topic>{ id: "_politics(part1)", name: "Politics (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Politics (Part 1).csv" });
      topics.push(<Topic>{ id: "_politics(part2)", name: "Politics (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Politics (Part 2).csv" });
      topics.push(<Topic>{ id: "_politics(part3)", name: "Politics (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Politics (Part 3).csv" });
      topics.push(<Topic>{ id: "_possessives", name: "Possessives", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Possessives.csv" });
      topics.push(<Topic>{ id: "_questions", name: "Questions", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Questions.csv" });
      topics.push(<Topic>{ id: "_pronouns", name: "Pronouns", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Pronouns.csv" });
      topics.push(<Topic>{ id: "_science(part1)", name: "Science (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Science (Part 1).csv" });
      topics.push(<Topic>{ id: "_science(part2)", name: "Science (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Science (Part 2).csv" });
      topics.push(<Topic>{ id: "_sizes", name: "Sizes", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Sizes.csv" });
      topics.push(<Topic>{ id: "_spiritual", name: "Spiritual", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Spiritual.csv" });
      topics.push(<Topic>{ id: "_sports", name: "Sports", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Sports.csv" });
      topics.push(<Topic>{ id: "_tobeserestar", name: "To Be  Ser Estar", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/To Be  Ser Estar.csv" });
      topics.push(<Topic>{ id: "_verbsinfinitive1", name: "Verbs  Infinitive 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Verbs  Infinitive 1.csv" });
      topics.push(<Topic>{ id: "_verbsinfinitive2", name: "Verbs  Infinitive 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Verbs  Infinitive 2.csv" });
      topics.push(<Topic>{ id: "_verbsparticiple", name: "Verbs  Participle", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Verbs  Participle.csv" });
      topics.push(<Topic>{ id: "_verbspastperfect", name: "Verbs  Past Perfect", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Verbs  Past Perfect.csv" });
      topics.push(<Topic>{ id: "_verbspresent1", name: "Verbs  Present 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Verbs  Present 1.csv" });
      topics.push(<Topic>{ id: "_verbspresent2(part1)", name: "Verbs  Present 2 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Verbs  Present 2 (Part 1).csv" });
      topics.push(<Topic>{ id: "_verbspresent2(part2)", name: "Verbs  Present 2 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Verbs  Present 2 (Part 2).csv" });
      topics.push(<Topic>{ id: "_verbspresent3(part1)", name: "Verbs  Present 3 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Verbs  Present 3 (Part 1).csv" });
      topics.push(<Topic>{ id: "_verbspresent3(part2)", name: "Verbs  Present 3 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Verbs  Present 3 (Part 2).csv" });
      topics.push(<Topic>{ id: "_verbspresent3(part3)", name: "Verbs  Present 3 (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Verbs  Present 3 (Part 3).csv" });
      topics.push(<Topic>{ id: "_verbspresentperfect", name: "Verbs  Present Perfect", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Verbs  Present Perfect.csv" });
      topics.push(<Topic>{ id: "_vocabulary1(part1)", name: "Vocabulary 1 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Vocabulary 1 (Part 1).csv" });
      topics.push(<Topic>{ id: "_vocabulary1(part2)", name: "Vocabulary 1 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Vocabulary 1 (Part 2).csv" });
      topics.push(<Topic>{ id: "_vocabulary1(part3)", name: "Vocabulary 1 (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Vocabulary 1 (Part 3).csv" });
      topics.push(<Topic>{ id: "_vocabulary2(part1)", name: "Vocabulary 2 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Vocabulary 2 (Part 1).csv" });
      topics.push(<Topic>{ id: "_vocabulary3(part1)", name: "Vocabulary 3 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Vocabulary 3 (Part 1).csv" });
      topics.push(<Topic>{ id: "_vocabulary2(part3)", name: "Vocabulary 2 (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Vocabulary 2 (Part 3).csv" });
      topics.push(<Topic>{ id: "_vocabulary3(part2)", name: "Vocabulary 3 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Vocabulary 3 (Part 2).csv" });
      topics.push(<Topic>{ id: "_vocabulary2(part2)", name: "Vocabulary 2 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Vocabulary 2 (Part 2).csv" });
      topics.push(<Topic>{ id: "_vocabulary3(part3)", name: "Vocabulary 3 (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Vocabulary 3 (Part 3).csv" });

      return topics;
    }
    if (languageId == "esp-ger") {
      let topics: Array<Topic> = [];
      topics.push(<Topic>{ id: "_caivocabno01", name: "CAI Vocab No 01", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/CAI Vocab No 01.csv" });
      topics.push(<Topic>{ id: "_caivocabno02", name: "CAI Vocab No 02", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/CAI Vocab No 02.csv" });
      topics.push(<Topic>{ id: "_caivocabno03", name: "CAI Vocab No 03", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/CAI Vocab No 03.csv" });
      topics.push(<Topic>{ id: "_caivocabno04", name: "CAI Vocab No 04", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/CAI Vocab No 04.csv" });
      topics.push(<Topic>{ id: "_caivocabno05", name: "CAI Vocab No 05", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/CAI Vocab No 05.csv" });
      topics.push(<Topic>{ id: "_caivocabno06", name: "CAI Vocab No 06", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/CAI Vocab No 06.csv" });
      topics.push(<Topic>{ id: "_caivocabno07", name: "CAI Vocab No 07", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/CAI Vocab No 07.csv" });
      topics.push(<Topic>{ id: "_caivocabno08", name: "CAI Vocab No 08", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/CAI Vocab No 08.csv" });
      topics.push(<Topic>{ id: "_caivocabno09", name: "CAI Vocab No 09", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/CAI Vocab No 09.csv" });
      topics.push(<Topic>{ id: "_caivocabno10", name: "CAI Vocab No 10", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/CAI Vocab No 10.csv" });
      topics.push(<Topic>{ id: "_caivocabno11", name: "CAI Vocab No 11", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/CAI Vocab No 11.csv" });
      topics.push(<Topic>{ id: "_caivocabno12", name: "CAI Vocab No 12", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/CAI Vocab No 12.csv" });
      topics.push(<Topic>{ id: "_adjetivosacusativo", name: "Adjetivos  Acusativo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Adjetivos  Acusativo.csv" });
      topics.push(<Topic>{ id: "_adjetivosnominativo2", name: "Adjetivos  Nominativo 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Adjetivos  Nominativo 2.csv" });
      topics.push(<Topic>{ id: "_adjetivosnominativo1", name: "Adjetivos  Nominativo 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Adjetivos  Nominativo 1.csv" });
      topics.push(<Topic>{ id: "_adjetivospredicativo2", name: "Adjetivos  Predicativo 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Adjetivos  Predicativo 2.csv" });
      topics.push(<Topic>{ id: "_adjetivos", name: "Adjetivos", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Adjetivos.csv" });
      topics.push(<Topic>{ id: "_adverbios2", name: "Adverbios 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Adverbios 2.csv" });
      topics.push(<Topic>{ id: "_adverbios1", name: "Adverbios 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Adverbios 1.csv" });
      topics.push(<Topic>{ id: "_animales", name: "Animales", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Animales.csv" });
      topics.push(<Topic>{ id: "_animalesplural", name: "Animales  plural", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Animales  plural.csv" });
      topics.push(<Topic>{ id: "_adjetivosdativo", name: "Adjetivos  Dativo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Adjetivos  Dativo.csv" });
      topics.push(<Topic>{ id: "_artes", name: "Artes", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Artes.csv" });
      topics.push(<Topic>{ id: "_básico1", name: "Básico 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Básico 1.csv" });
      topics.push(<Topic>{ id: "_básico2", name: "Básico 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Básico 2.csv" });
      topics.push(<Topic>{ id: "_calificadores", name: "Calificadores", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Calificadores.csv" });
      topics.push(<Topic>{ id: "_casogenetivo", name: "Caso Genetivo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Caso Genetivo.csv" });
      topics.push(<Topic>{ id: "_ciencia", name: "Ciencia", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Ciencia.csv" });
      topics.push(<Topic>{ id: "_colores", name: "Colores", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Colores.csv" });
      topics.push(<Topic>{ id: "_comidaplural", name: "Comida  plural", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Comida  plural.csv" });
      topics.push(<Topic>{ id: "_comida", name: "Comida", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Comida.csv" });
      topics.push(<Topic>{ id: "_comparar", name: "Comparar", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Comparar.csv" });
      topics.push(<Topic>{ id: "_comunicación", name: "Comunicación", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Comunicación.csv" });
      topics.push(<Topic>{ id: "_conjunción", name: "Conjunción", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Conjunción.csv" });
      topics.push(<Topic>{ id: "_deportes", name: "Deportes", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Deportes.csv" });
      topics.push(<Topic>{ id: "_doméstico", name: "doméstico", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/doméstico.csv" });
      topics.push(<Topic>{ id: "_educación", name: "Educación", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Educación.csv" });
      topics.push(<Topic>{ id: "_elpretérito", name: "El Pretérito", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/El Pretérito.csv" });
      topics.push(<Topic>{ id: "_espiritual", name: "Espiritual", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Espiritual.csv" });
      topics.push(<Topic>{ id: "_familia(plural)", name: "Familia (plural)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Familia (plural).csv" });
      topics.push(<Topic>{ id: "_familia", name: "Familia", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Familia.csv" });
      topics.push(<Topic>{ id: "_fechasytiempo", name: "Fechas y Tiempo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Fechas y Tiempo.csv" });
      topics.push(<Topic>{ id: "_frases", name: "Frases", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Frases.csv" });
      topics.push(<Topic>{ id: "_frecuencia", name: "Frecuencia", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Frecuencia.csv" });
      topics.push(<Topic>{ id: "_gente", name: "Gente", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Gente.csv" });
      topics.push(<Topic>{ id: "_idioma", name: "Idioma", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Idioma.csv" });
      topics.push(<Topic>{ id: "_imperativo", name: "Imperativo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Imperativo.csv" });
      topics.push(<Topic>{ id: "_lugares", name: "Lugares", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Lugares.csv" });
      topics.push(<Topic>{ id: "_medicina", name: "Medicina", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Medicina.csv" });
      topics.push(<Topic>{ id: "_naturaleza", name: "Naturaleza", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Naturaleza.csv" });
      topics.push(<Topic>{ id: "_negativos", name: "Negativos", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Negativos.csv" });
      topics.push(<Topic>{ id: "_negocios2", name: "Negocios 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Negocios 2.csv" });
      topics.push(<Topic>{ id: "_negocios", name: "Negocios", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Negocios.csv" });
      topics.push(<Topic>{ id: "_números", name: "Números", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Números.csv" });
      topics.push(<Topic>{ id: "_objetosabstractos1", name: "Objetos Abstractos 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Objetos Abstractos 1.csv" });
      topics.push(<Topic>{ id: "_objetosabstractos4", name: "Objetos Abstractos 4", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Objetos Abstractos 4.csv" });
      topics.push(<Topic>{ id: "_objetos", name: "Objetos", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Objetos.csv" });
      topics.push(<Topic>{ id: "_ocupaciones", name: "Ocupaciones", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Ocupaciones.csv" });
      topics.push(<Topic>{ id: "_objetosabstractos2", name: "Objetos Abstractos 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Objetos Abstractos 2.csv" });
      topics.push(<Topic>{ id: "_objetosabstractos3", name: "Objetos Abstractos 3", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Objetos Abstractos 3.csv" });
      topics.push(<Topic>{ id: "_política", name: "Política", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Política.csv" });
      topics.push(<Topic>{ id: "_preguntas", name: "Preguntas", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Preguntas.csv" });
      topics.push(<Topic>{ id: "_preposiciones", name: "Preposiciones", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Preposiciones.csv" });
      topics.push(<Topic>{ id: "_presente2", name: "Presente 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Presente 2.csv" });
      topics.push(<Topic>{ id: "_pronombesnominativo", name: "Pronombes Nominativo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Pronombes Nominativo.csv" });
      topics.push(<Topic>{ id: "_pronombresacusativos", name: "Pronombres Acusativos", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Pronombres Acusativos.csv" });
      topics.push(<Topic>{ id: "_pronombresdativos", name: "Pronombres Dativos", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Pronombres Dativos.csv" });
      topics.push(<Topic>{ id: "_ropa(plural)", name: "Ropa (plural)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Ropa (plural).csv" });
      topics.push(<Topic>{ id: "_ropa", name: "Ropa", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Ropa.csv" });
      topics.push(<Topic>{ id: "_sentimientos", name: "Sentimientos", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Sentimientos.csv" });
      topics.push(<Topic>{ id: "_usted", name: "Usted", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Usted.csv" });
      topics.push(<Topic>{ id: "_verboscondicional2", name: "Verbos  Condicional 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos  Condicional 2.csv" });
      topics.push(<Topic>{ id: "_verboscondicionalperfecto", name: "Verbos  Condicional Perfecto", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos  Condicional Perfecto.csv" });
      topics.push(<Topic>{ id: "_verboscondicional", name: "Verbos  Condicional", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos  Condicional.csv" });
      topics.push(<Topic>{ id: "_verbosfuturo2", name: "Verbos  Futuro 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos  Futuro 2.csv" });
      topics.push(<Topic>{ id: "_verbosfuturoperfecto", name: "Verbos  Futuro Perfecto", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos  Futuro Perfecto.csv" });
      topics.push(<Topic>{ id: "_verbosmodales", name: "Verbos  Modales", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos  Modales.csv" });
      topics.push(<Topic>{ id: "_verbospasadoperfecto", name: "Verbos  Pasado Perfecto", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos  Pasado Perfecto.csv" });
      topics.push(<Topic>{ id: "_verbospresente1(infinitivos)", name: "Verbos  Presente 1 (infinitivos)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos  Presente 1 (infinitivos).csv" });
      topics.push(<Topic>{ id: "_verbospresente3", name: "Verbos  Presente 3", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos  Presente 3.csv" });
      topics.push(<Topic>{ id: "_verbospresente4", name: "Verbos  Presente 4", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos  Presente 4.csv" });
      topics.push(<Topic>{ id: "_verbospresenteperfecto", name: "Verbos  Presente Perfecto", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos  Presente Perfecto.csv" });
      topics.push(<Topic>{ id: "_verbosfuturo1", name: "Verbos Futuro 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos Futuro 1.csv" });
      topics.push(<Topic>{ id: "_verbosreflexivo", name: "Verbos reflexivo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Verbos reflexivo.csv" });
      topics.push(<Topic>{ id: "_vozpasiva", name: "Voz Pasiva", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Voz Pasiva.csv" });
      topics.push(<Topic>{ id: "_viajes", name: "Viajes", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Viajes.csv" });
      return topics;
    }
    if (languageId == "ger-eng") {
      let topics: Array<Topic> = [];
      topics.push(<Topic>{ id: "_abstractobjects1", name: "Abstract Objects 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Abstract Objects 1.csv" });
      topics.push(<Topic>{ id: "_abstractobjects3", name: "Abstract Objects 3", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Abstract Objects 3.csv" });
      topics.push(<Topic>{ id: "_abstractobjects4", name: "Abstract Objects 4", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Abstract Objects 4.csv" });
      topics.push(<Topic>{ id: "_abstractobjects2", name: "Abstract Objects 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Abstract Objects 2.csv" });
      topics.push(<Topic>{ id: "_accusativepronouns", name: "Accusative Pronouns", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Accusative Pronouns.csv" });
      topics.push(<Topic>{ id: "_adjectivesnominative1", name: "Adjectives  Nominative 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Adjectives  Nominative 1.csv" });
      topics.push(<Topic>{ id: "_adjectivespredicative2", name: "Adjectives  Predicative 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Adjectives  Predicative 2.csv" });
      topics.push(<Topic>{ id: "_adjectivesnominative2", name: "Adjectives  Nominative 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Adjectives  Nominative 2.csv" });
      topics.push(<Topic>{ id: "_adjectivespredicative", name: "Adjectives  Predicative", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Adjectives  Predicative.csv" });
      topics.push(<Topic>{ id: "_adverbs1", name: "Adverbs 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Adverbs 1.csv" });
      topics.push(<Topic>{ id: "_arts", name: "Arts", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Arts.csv" });
      topics.push(<Topic>{ id: "_adverbs2", name: "Adverbs 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Adverbs 2.csv" });
      topics.push(<Topic>{ id: "_animals", name: "Animals", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Animals.csv" });
      topics.push(<Topic>{ id: "_basics1", name: "Basics 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Basics 1.csv" });
      topics.push(<Topic>{ id: "_basics2", name: "Basics 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Basics 2.csv" });
      topics.push(<Topic>{ id: "_business2", name: "Business 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Business 2.csv" });
      topics.push(<Topic>{ id: "_business1", name: "Business 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Business 1.csv" });
      topics.push(<Topic>{ id: "_clothing", name: "Clothing", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Clothing.csv" });
      topics.push(<Topic>{ id: "_communication", name: "Communication", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Communication.csv" });
      topics.push(<Topic>{ id: "_colors", name: "Colors", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Colors.csv" });
      topics.push(<Topic>{ id: "_commonphrases", name: "Common Phrases", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Common Phrases.csv" });
      topics.push(<Topic>{ id: "_conjunctions", name: "Conjunctions", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Conjunctions.csv" });
      topics.push(<Topic>{ id: "_datesandtime", name: "Dates and Time", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Dates and Time.csv" });
      topics.push(<Topic>{ id: "_dativecase", name: "Dative Case", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Dative Case.csv" });
      topics.push(<Topic>{ id: "_dativepronouns", name: "Dative Pronouns", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Dative Pronouns.csv" });
      topics.push(<Topic>{ id: "_education", name: "Education", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Education.csv" });
      topics.push(<Topic>{ id: "_family", name: "Family", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Family.csv" });
      topics.push(<Topic>{ id: "_feelings", name: "Feelings", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Feelings.csv" });
      topics.push(<Topic>{ id: "_frequency", name: "Frequency", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Frequency.csv" });
      topics.push(<Topic>{ id: "_food", name: "Food", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Food.csv" });
      topics.push(<Topic>{ id: "_household", name: "Household", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Household.csv" });
      topics.push(<Topic>{ id: "_medical", name: "Medical", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Medical.csv" });
      topics.push(<Topic>{ id: "_language", name: "Language", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Language.csv" });
      topics.push(<Topic>{ id: "_nature", name: "Nature", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Nature.csv" });
      topics.push(<Topic>{ id: "_negatives", name: "Negatives", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Negatives.csv" });
      topics.push(<Topic>{ id: "_nominativepronouns", name: "Nominative Pronouns", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Nominative Pronouns.csv" });
      topics.push(<Topic>{ id: "_numbers", name: "Numbers", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Numbers.csv" });
      topics.push(<Topic>{ id: "_objects", name: "Objects", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Objects.csv" });
      topics.push(<Topic>{ id: "_occupations", name: "Occupations", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Occupations.csv" });
      topics.push(<Topic>{ id: "_people", name: "People", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/People.csv" });
      topics.push(<Topic>{ id: "_places", name: "Places", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Places.csv" });
      topics.push(<Topic>{ id: "_politics", name: "Politics", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Politics.csv" });
      topics.push(<Topic>{ id: "_prepositions", name: "Prepositions", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Prepositions.csv" });
      topics.push(<Topic>{ id: "_qualifiers", name: "Qualifiers", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Qualifiers.csv" });
      topics.push(<Topic>{ id: "_science", name: "Science", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Science.csv" });
      topics.push(<Topic>{ id: "_questions", name: "Questions", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Questions.csv" });
      topics.push(<Topic>{ id: "_spiritual", name: "Spiritual", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Spiritual.csv" });
      topics.push(<Topic>{ id: "_sports", name: "Sports", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Sports.csv" });
      topics.push(<Topic>{ id: "_travel", name: "Travel", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Travel.csv" });
      topics.push(<Topic>{ id: "_verbsfuture1", name: "Verbs  Future 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Verbs  Future 1.csv" });
      topics.push(<Topic>{ id: "_verbsconditional", name: "Verbs  Conditional", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Verbs  Conditional.csv" });
      topics.push(<Topic>{ id: "_verbspresent1", name: "Verbs  Present 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Verbs  Present 1.csv" });
      topics.push(<Topic>{ id: "_verbspresent2", name: "Verbs  Present 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Verbs  Present 2.csv" });
      topics.push(<Topic>{ id: "_verbspresent3", name: "Verbs  Present 3", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Verbs  Present 3.csv" });
      topics.push(<Topic>{ id: "_verbsmodal", name: "Verbs  Modal", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Verbs  Modal.csv" });
      topics.push(<Topic>{ id: "_verbspresent4", name: "Verbs  Present 4", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Verbs  Present 4.csv" });
      topics.push(<Topic>{ id: "_verbsreflexive", name: "Verbs Reflexive", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Verbs Reflexive.csv" });
      return topics;
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
