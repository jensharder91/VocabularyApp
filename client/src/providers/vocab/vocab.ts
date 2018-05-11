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

  getTopicByName(topicName: string): Topic {
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
              err => {
                console.log("Error with csv");
                console.log("could not get csv ", topic.csvStringUrl); reject();
              }
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
      topics.push(<Topic>{ id: "_unit_1_basics1", name: "Unit 1 Basics 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_1_Basics 1.csv" });
      topics.push(<Topic>{ id: "_unit_2_commonphrases", name: "Unit 2 Common Phrases", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_2_Common Phrases.csv" });
      topics.push(<Topic>{ id: "_unit_3_basics2", name: "Unit 3 Basics 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_3_Basics 2.csv" });
      topics.push(<Topic>{ id: "_unit_4_food(part1)", name: "Unit 4 Food (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_4_Food (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_5_food(part2)", name: "Unit 5 Food (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_5_Food (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_6_animals", name: "Unit 6 Animals", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_6_Animals.csv" });
      topics.push(<Topic>{ id: "_unit_7_possessives", name: "Unit 7 Possessives", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_7_Possessives.csv" });
      topics.push(<Topic>{ id: "_unit_8_clothing", name: "Unit 8 Clothing", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_8_Clothing.csv" });
      topics.push(<Topic>{ id: "_unit_9_questions", name: "Unit 9 Questions", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_9_Questions.csv" });
      topics.push(<Topic>{ id: "_unit_10_verbspresent1", name: "Unit 10 Verbs  Present 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_10_Verbs  Present 1.csv" });
      topics.push(<Topic>{ id: "_unit_11_food2", name: "Unit 11 Food 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_11_Food 2.csv" });
      topics.push(<Topic>{ id: "_unit_12_family(part1)", name: "Unit 12 Family (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_12_Family (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_13_family(part2)", name: "Unit 13 Family (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_13_Family (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_14_sizes", name: "Unit 14 Sizes", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_14_Sizes.csv" });
      topics.push(<Topic>{ id: "_unit_15_household(part1)", name: "Unit 15 Household (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_15_Household (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_16_household(part2)", name: "Unit 16 Household (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_16_Household (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_17_occupations(part1)", name: "Unit 17 Occupations (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_17_Occupations (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_18_occupations(part2)", name: "Unit 18 Occupations (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_18_Occupations (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_19_datesandtime(part1)", name: "Unit 19 Dates and Time (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_19_Dates and Time (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_20_datesandtime(part2)", name: "Unit 20 Dates and Time (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_20_Dates and Time (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_21_adjectives1(part1)", name: "Unit 21 Adjectives 1 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_21_Adjectives 1 (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_22_adjectives1(part2)", name: "Unit 22 Adjectives 1 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_22_Adjectives 1 (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_23_adjectives1(part3)", name: "Unit 23 Adjectives 1 (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_23_Adjectives 1 (Part 3).csv" });
      topics.push(<Topic>{ id: "_unit_24_verbspresent2(part1)", name: "Unit 24 Verbs  Present 2 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_24_Verbs  Present 2 (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_25_verbspresent2(part2)", name: "Unit 25 Verbs  Present 2 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_25_Verbs  Present 2 (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_26_determiners", name: "Unit 26 Determiners", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_26_Determiners.csv" });
      topics.push(<Topic>{ id: "_unit_27_adverbs(part1)", name: "Unit 27 Adverbs (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_27_Adverbs (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_28_adverbs(part2)", name: "Unit 28 Adverbs (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_28_Adverbs (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_29_adverbs(part3)", name: "Unit 29 Adverbs (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_29_Adverbs (Part 3).csv" });
      topics.push(<Topic>{ id: "_unit_30_objects(part1)", name: "Unit 30 Objects (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_30_Objects (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_31_objects(part2)", name: "Unit 31 Objects (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_31_Objects (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_32_objects(part3)", name: "Unit 32 Objects (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_32_Objects (Part 3).csv" });
      topics.push(<Topic>{ id: "_unit_33_tobeserestar", name: "Unit 33 To Be  Ser Estar", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_33_To Be  Ser Estar.csv" });
      topics.push(<Topic>{ id: "_unit_34_places(part1)", name: "Unit 34 Places (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_34_Places (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_35_places(part2)", name: "Unit 35 Places (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_35_Places (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_36_places(part3)", name: "Unit 36 Places (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_36_Places (Part 3).csv" });
      topics.push(<Topic>{ id: "_unit_37_people", name: "Unit 37 People", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_37_People.csv" });
      topics.push(<Topic>{ id: "_unit_38_objectpronouns", name: "Unit 38 Object Pronouns", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_38_Object Pronouns.csv" });
      topics.push(<Topic>{ id: "_unit_39_numbers", name: "Unit 39 Numbers", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_39_Numbers.csv" });
      topics.push(<Topic>{ id: "_unit_40_pasttense", name: "Unit 40 Past Tense", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_40_Past Tense.csv" });
      topics.push(<Topic>{ id: "_unit_41_verbspresent3(part1)", name: "Unit 41 Verbs  Present 3 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_41_Verbs  Present 3 (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_42_verbspresent3(part2)", name: "Unit 42 Verbs  Present 3 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_42_Verbs  Present 3 (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_43_verbspresent3(part3)", name: "Unit 43 Verbs  Present 3 (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_43_Verbs  Present 3 (Part 3).csv" });
      topics.push(<Topic>{ id: "_unit_44_verbsinfinitive1", name: "Unit 44 Verbs  Infinitive 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_44_Verbs  Infinitive 1.csv" });
      topics.push(<Topic>{ id: "_unit_45_phrasalfuturetense", name: "Unit 45 Phrasal Future Tense", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_45_Phrasal Future Tense.csv" });
      topics.push(<Topic>{ id: "_unit_46_countries", name: "Unit 46 Countries", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_46_Countries.csv" });
      topics.push(<Topic>{ id: "_unit_47_adjectives2(part1)", name: "Unit 47 Adjectives 2 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_47_Adjectives 2 (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_48_adjectives2(part2)", name: "Unit 48 Adjectives 2 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_48_Adjectives 2 (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_49_adjectives2(part3)", name: "Unit 49 Adjectives 2 (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_49_Adjectives 2 (Part 3).csv" });
      topics.push(<Topic>{ id: "_unit_50_pronouns", name: "Unit 50 Pronouns", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_50_Pronouns.csv" });
      topics.push(<Topic>{ id: "_unit_51_directions", name: "Unit 51 Directions", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_51_Directions.csv" });
      topics.push(<Topic>{ id: "_unit_52_education", name: "Unit 52 Education", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_52_Education.csv" });
      topics.push(<Topic>{ id: "_unit_53_vocabulary1(part1)", name: "Unit 53 Vocabulary 1 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_53_Vocabulary 1 (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_54_vocabulary1(part2)", name: "Unit 54 Vocabulary 1 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_54_Vocabulary 1 (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_55_vocabulary1(part3)", name: "Unit 55 Vocabulary 1 (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_55_Vocabulary 1 (Part 3).csv" });
      topics.push(<Topic>{ id: "_unit_56_verbsparticiple", name: "Unit 56 Verbs  Participle", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_56_Verbs  Participle.csv" });
      topics.push(<Topic>{ id: "_unit_57_feelings", name: "Unit 57 Feelings", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_57_Feelings.csv" });
      topics.push(<Topic>{ id: "_unit_58_verbspresentperfect", name: "Unit 58 Verbs  Present Perfect", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_58_Verbs  Present Perfect.csv" });
      topics.push(<Topic>{ id: "_unit_59_verbspastperfect", name: "Unit 59 Verbs  Past Perfect", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_59_Verbs  Past Perfect.csv" });
      topics.push(<Topic>{ id: "_unit_60_nature(part1)", name: "Unit 60 Nature (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_60_Nature (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_61_nature(part2)", name: "Unit 61 Nature (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_61_Nature (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_62_vocabulary2(part1)", name: "Unit 62 Vocabulary 2 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_62_Vocabulary 2 (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_63_vocabulary2(part2)", name: "Unit 63 Vocabulary 2 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_63_Vocabulary 2 (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_64_vocabulary2(part3)", name: "Unit 64 Vocabulary 2 (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_64_Vocabulary 2 (Part 3).csv" });
      topics.push(<Topic>{ id: "_unit_65_verbsinfinitive2", name: "Unit 65 Verbs  Infinitive 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_65_Verbs  Infinitive 2.csv" });
      topics.push(<Topic>{ id: "_unit_66_sports", name: "Unit 66 Sports", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_66_Sports.csv" });
      topics.push(<Topic>{ id: "_unit_67_medical(part1)", name: "Unit 67 Medical (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_67_Medical (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_68_medical(part2)", name: "Unit 68 Medical (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_68_Medical (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_69_medical(part3)", name: "Unit 69 Medical (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_69_Medical (Part 3).csv" });
      topics.push(<Topic>{ id: "_unit_70_business(part1)", name: "Unit 70 Business (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_70_Business (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_71_business(part2)", name: "Unit 71 Business (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_71_Business (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_72_communication", name: "Unit 72 Communication", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_72_Communication.csv" });
      topics.push(<Topic>{ id: "_unit_73_spiritual", name: "Unit 73 Spiritual", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_73_Spiritual.csv" });
      topics.push(<Topic>{ id: "_unit_74_arts(part1)", name: "Unit 74 Arts (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_74_Arts (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_75_arts(part2)", name: "Unit 75 Arts (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_75_Arts (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_76_politics(part1)", name: "Unit 76 Politics (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_76_Politics (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_77_politics(part2)", name: "Unit 77 Politics (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_77_Politics (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_78_politics(part3)", name: "Unit 78 Politics (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_78_Politics (Part 3).csv" });
      topics.push(<Topic>{ id: "_unit_79_science(part1)", name: "Unit 79 Science (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_79_Science (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_80_science(part2)", name: "Unit 80 Science (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_80_Science (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_81_vocabulary3(part1)", name: "Unit 81 Vocabulary 3 (Part 1)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_81_Vocabulary 3 (Part 1).csv" });
      topics.push(<Topic>{ id: "_unit_82_vocabulary3(part2)", name: "Unit 82 Vocabulary 3 (Part 2)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_82_Vocabulary 3 (Part 2).csv" });
      topics.push(<Topic>{ id: "_unit_83_vocabulary3(part3)", name: "Unit 83 Vocabulary 3 (Part 3)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-eng/Unit_83_Vocabulary 3 (Part 3).csv" });

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

      topics.push(<Topic>{ id: "_unit_1_básico1", name: "Unit 1 Básico 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_1_Básico 1.csv" });
      topics.push(<Topic>{ id: "_unit_2_básico2", name: "Unit 2 Básico 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_2_Básico 2.csv" });
      topics.push(<Topic>{ id: "_unit_3_frases", name: "Unit 3 Frases", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_3_Frases.csv" });
      topics.push(<Topic>{ id: "_unit_4_comida", name: "Unit 4 Comida", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_4_Comida.csv" });
      topics.push(<Topic>{ id: "_unit_5_comidaplural", name: "Unit 5 Comida  plural", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_5_Comida  plural.csv" });
      topics.push(<Topic>{ id: "_unit_6_animales", name: "Unit 6 Animales", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_6_Animales.csv" });
      topics.push(<Topic>{ id: "_unit_7_animalesplural", name: "Unit 7 Animales  plural", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_7_Animales  plural.csv" });
      topics.push(<Topic>{ id: "_unit_8_adjetivos", name: "Unit 8 Adjetivos", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_8_Adjetivos.csv" });
      topics.push(<Topic>{ id: "_unit_9_verbospresente1(infinitivos)", name: "Unit 9 Verbos  Presente 1 (infinitivos)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_9_Verbos  Presente 1 (infinitivos).csv" });
      topics.push(<Topic>{ id: "_unit_11_ropa", name: "Unit 11 Ropa", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_11_Ropa.csv" });
      topics.push(<Topic>{ id: "_unit_12_ropa(plural)", name: "Unit 12 Ropa (plural)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_12_Ropa (plural).csv" });
      topics.push(<Topic>{ id: "_unit_13_pronombesnominativo", name: "Unit 13 Pronombes Nominativo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_13_Pronombes Nominativo.csv" });
      topics.push(<Topic>{ id: "_unit_14_pronombresacusativos", name: "Unit 14 Pronombres Acusativos", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_14_Pronombres Acusativos.csv" });
      topics.push(<Topic>{ id: "_unit_15_familia", name: "Unit 15 Familia", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_15_Familia.csv" });
      topics.push(<Topic>{ id: "_unit_16_familia(plural)", name: "Unit 16 Familia (plural)", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_16_Familia (plural).csv" });
      topics.push(<Topic>{ id: "_unit_17_conjunción", name: "Unit 17 Conjunción", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_17_Conjunción.csv" });
      topics.push(<Topic>{ id: "_unit_18_doméstico", name: "Unit 18 doméstico", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_18_doméstico.csv" });
      topics.push(<Topic>{ id: "_unit_19_preguntas", name: "Unit 19 Preguntas", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_19_Preguntas.csv" });
      topics.push(<Topic>{ id: "_unit_20_números", name: "Unit 20 Números", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_20_Números.csv" });
      topics.push(<Topic>{ id: "_unit_21_negativos", name: "Unit 21 Negativos", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_21_Negativos.csv" });
      topics.push(<Topic>{ id: "_unit_22_pronombresdativos", name: "Unit 22 Pronombres Dativos", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_22_Pronombres Dativos.csv" });
      topics.push(<Topic>{ id: "_unit_23_gente", name: "Unit 23 Gente", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_23_Gente.csv" });
      topics.push(<Topic>{ id: "_unit_24_viajes", name: "Unit 24 Viajes", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_24_Viajes.csv" });
      topics.push(<Topic>{ id: "_unit_25_colores", name: "Unit 25 Colores", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_25_Colores.csv" });
      topics.push(<Topic>{ id: "_unit_26_usted", name: "Unit 26 Usted", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_26_Usted.csv" });
      topics.push(<Topic>{ id: "_unit_27_ocupaciones", name: "Unit 27 Ocupaciones", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_27_Ocupaciones.csv" });
      topics.push(<Topic>{ id: "_unit_28_comparar", name: "Unit 28 Comparar", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_28_Comparar.csv" });
      topics.push(<Topic>{ id: "_unit_29_calificadores", name: "Unit 29 Calificadores", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_29_Calificadores.csv" });
      topics.push(<Topic>{ id: "_unit_30_adjetivospredicativo2", name: "Unit 30 Adjetivos  Predicativo 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_30_Adjetivos  Predicativo 2.csv" });
      topics.push(<Topic>{ id: "_unit_31_preposiciones", name: "Unit 31 Preposiciones", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_31_Preposiciones.csv" });
      topics.push(<Topic>{ id: "_unit_32_medicina", name: "Unit 32 Medicina", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_32_Medicina.csv" });
      topics.push(<Topic>{ id: "_unit_33_presente2", name: "Unit 33 Presente 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_33_Presente 2.csv" });
      topics.push(<Topic>{ id: "_unit_34_fechasytiempo", name: "Unit 34 Fechas y Tiempo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_34_Fechas y Tiempo.csv" });
      topics.push(<Topic>{ id: "_unit_35_sentimientos", name: "Unit 35 Sentimientos", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_35_Sentimientos.csv" });
      topics.push(<Topic>{ id: "_unit_36_adverbios1", name: "Unit 36 Adverbios 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_36_Adverbios 1.csv" });
      topics.push(<Topic>{ id: "_unit_37_frecuencia", name: "Unit 37 Frecuencia", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_37_Frecuencia.csv" });
      topics.push(<Topic>{ id: "_unit_38_verbosmodales", name: "Unit 38 Verbos  Modales", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_38_Verbos  Modales.csv" });
      topics.push(<Topic>{ id: "_unit_39_naturaleza", name: "Unit 39 Naturaleza", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_39_Naturaleza.csv" });
      topics.push(<Topic>{ id: "_unit_40_casogenetivo", name: "Unit 40 Caso Genetivo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_40_Caso Genetivo.csv" });
      topics.push(<Topic>{ id: "_unit_41_adjetivosnominativo1", name: "Unit 41 Adjetivos  Nominativo 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_41_Adjetivos  Nominativo 1.csv" });
      topics.push(<Topic>{ id: "_unit_42_adjetivosacusativo", name: "Unit 42 Adjetivos  Acusativo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_42_Adjetivos  Acusativo.csv" });
      topics.push(<Topic>{ id: "_unit_43_lugares", name: "Unit 43 Lugares", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_43_Lugares.csv" });
      topics.push(<Topic>{ id: "_unit_44_adjetivosdativo", name: "Unit 44 Adjetivos  Dativo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_44_Adjetivos  Dativo.csv" });
      topics.push(<Topic>{ id: "_unit_45_adjetivosnominativo2", name: "Unit 45 Adjetivos  Nominativo 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_45_Adjetivos  Nominativo 2.csv" });
      topics.push(<Topic>{ id: "_unit_46_adverbios2", name: "Unit 46 Adverbios 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_46_Adverbios 2.csv" });
      topics.push(<Topic>{ id: "_unit_47_elpretérito", name: "Unit 47 El Pretérito", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_47_El Pretérito.csv" });
      topics.push(<Topic>{ id: "_unit_48_verbospresenteperfecto", name: "Unit 48 Verbos  Presente Perfecto", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_48_Verbos  Presente Perfecto.csv" });
      topics.push(<Topic>{ id: "_unit_49_verbospasadoperfecto", name: "Unit 49 Verbos  Pasado Perfecto", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_49_Verbos  Pasado Perfecto.csv" });
      topics.push(<Topic>{ id: "_unit_50_objetos", name: "Unit 50 Objetos", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_50_Objetos.csv" });
      topics.push(<Topic>{ id: "_unit_51_comunicación", name: "Unit 51 Comunicación", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_51_Comunicación.csv" });
      topics.push(<Topic>{ id: "_unit_52_verbosfuturo1", name: "Unit 52 Verbos Futuro 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_52_Verbos Futuro 1.csv" });
      topics.push(<Topic>{ id: "_unit_53_educación", name: "Unit 53 Educación", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_53_Educación.csv" });
      topics.push(<Topic>{ id: "_unit_54_ciencia", name: "Unit 54 Ciencia", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_54_Ciencia.csv" });
      topics.push(<Topic>{ id: "_unit_55_verbosfuturoperfecto", name: "Unit 55 Verbos  Futuro Perfecto", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_55_Verbos  Futuro Perfecto.csv" });
      topics.push(<Topic>{ id: "_unit_56_verbosreflexivo", name: "Unit 56 Verbos reflexivo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_56_Verbos reflexivo.csv" });
      topics.push(<Topic>{ id: "_unit_57_negocios", name: "Unit 57 Negocios", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_57_Negocios.csv" });
      topics.push(<Topic>{ id: "_unit_58_idioma", name: "Unit 58 Idioma", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_58_Idioma.csv" });
      topics.push(<Topic>{ id: "_unit_59_objetosabstractos1", name: "Unit 59 Objetos Abstractos 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_59_Objetos Abstractos 1.csv" });
      topics.push(<Topic>{ id: "_unit_60_verbospresente3", name: "Unit 60 Verbos  Presente 3", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_60_Verbos  Presente 3.csv" });
      topics.push(<Topic>{ id: "_unit_61_verbosfuturo2", name: "Unit 61 Verbos  Futuro 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_61_Verbos  Futuro 2.csv" });
      topics.push(<Topic>{ id: "_unit_62_verboscondicional", name: "Unit 62 Verbos  Condicional", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_62_Verbos  Condicional.csv" });
      topics.push(<Topic>{ id: "_unit_63_objetosabstractos2", name: "Unit 63 Objetos Abstractos 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_63_Objetos Abstractos 2.csv" });
      topics.push(<Topic>{ id: "_unit_64_verboscondicionalperfecto", name: "Unit 64 Verbos  Condicional Perfecto", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_64_Verbos  Condicional Perfecto.csv" });
      topics.push(<Topic>{ id: "_unit_65_negocios2", name: "Unit 65 Negocios 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_65_Negocios 2.csv" });
      topics.push(<Topic>{ id: "_unit_66_deportes", name: "Unit 66 Deportes", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_66_Deportes.csv" });
      topics.push(<Topic>{ id: "_unit_67_espiritual", name: "Unit 67 Espiritual", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_67_Espiritual.csv" });
      topics.push(<Topic>{ id: "_unit_68_artes", name: "Unit 68 Artes", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_68_Artes.csv" });
      topics.push(<Topic>{ id: "_unit_69_vozpasiva", name: "Unit 69 Voz Pasiva", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_69_Voz Pasiva.csv" });
      topics.push(<Topic>{ id: "_unit_70_imperativo", name: "Unit 70 Imperativo", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_70_Imperativo.csv" });
      topics.push(<Topic>{ id: "_unit_71_política", name: "Unit 71 Política", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_71_Política.csv" });
      topics.push(<Topic>{ id: "_unit_72_objetosabstractos3", name: "Unit 72 Objetos Abstractos 3", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_72_Objetos Abstractos 3.csv" });
      topics.push(<Topic>{ id: "_unit_73_objetosabstractos4", name: "Unit 73 Objetos Abstractos 4", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_73_Objetos Abstractos 4.csv" });
      topics.push(<Topic>{ id: "_unit_74_verboscondicional2", name: "Unit 74 Verbos  Condicional 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_74_Verbos  Condicional 2.csv" });
      topics.push(<Topic>{ id: "_unit_75_verbospresente4", name: "Unit 75 Verbos  Presente 4", cards: [], waitingCards: [], csvStringUrl: "assets/data/esp-ger/Unit_75_Verbos  Presente 4.csv" });

      return topics;
    }
    if (languageId == "ger-eng") {
      let topics: Array<Topic> = [];
      topics.push(<Topic>{ id: "_unit_1_basics1", name: "Unit 1 Basics 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_1_Basics 1.csv" });
      topics.push(<Topic>{ id: "_unit_2_basics2", name: "Unit 2 Basics 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_2_Basics 2.csv" });
      topics.push(<Topic>{ id: "_unit_3_commonphrases", name: "Unit 3 Common Phrases", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_3_Common Phrases.csv" });
      topics.push(<Topic>{ id: "_unit_4_food", name: "Unit 4 Food", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_4_Food.csv" });
      topics.push(<Topic>{ id: "_unit_5_animals", name: "Unit 5 Animals", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_5_Animals.csv" });
      topics.push(<Topic>{ id: "_unit_6_adjectivespredicative", name: "Unit 6 Adjectives  Predicative", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_6_Adjectives  Predicative.csv" });
      topics.push(<Topic>{ id: "_unit_7_verbspresent1", name: "Unit 7 Verbs  Present 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_7_Verbs  Present 1.csv" });
      topics.push(<Topic>{ id: "_unit_8_clothing", name: "Unit 8 Clothing", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_8_Clothing.csv" });
      topics.push(<Topic>{ id: "_unit_9_nominativepronouns", name: "Unit 9 Nominative Pronouns", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_9_Nominative Pronouns.csv" });
      topics.push(<Topic>{ id: "_unit_10_family", name: "Unit 10 Family", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_10_Family.csv" });
      topics.push(<Topic>{ id: "_unit_11_accusativepronouns", name: "Unit 11 Accusative Pronouns", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_11_Accusative Pronouns.csv" });
      topics.push(<Topic>{ id: "_unit_12_conjunctions", name: "Unit 12 Conjunctions", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_12_Conjunctions.csv" });
      topics.push(<Topic>{ id: "_unit_13_household", name: "Unit 13 Household", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_13_Household.csv" });
      topics.push(<Topic>{ id: "_unit_14_questions", name: "Unit 14 Questions", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_14_Questions.csv" });
      topics.push(<Topic>{ id: "_unit_15_dativecase", name: "Unit 15 Dative Case", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_15_Dative Case.csv" });
      topics.push(<Topic>{ id: "_unit_16_numbers", name: "Unit 16 Numbers", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_16_Numbers.csv" });
      topics.push(<Topic>{ id: "_unit_17_dativepronouns", name: "Unit 17 Dative Pronouns", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_17_Dative Pronouns.csv" });
      topics.push(<Topic>{ id: "_unit_18_negatives", name: "Unit 18 Negatives", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_18_Negatives.csv" });
      topics.push(<Topic>{ id: "_unit_19_people", name: "Unit 19 People", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_19_People.csv" });
      topics.push(<Topic>{ id: "_unit_20_travel", name: "Unit 20 Travel", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_20_Travel.csv" });
      topics.push(<Topic>{ id: "_unit_21_colors", name: "Unit 21 Colors", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_21_Colors.csv" });
      topics.push(<Topic>{ id: "_unit_22_occupations", name: "Unit 22 Occupations", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_22_Occupations.csv" });
      topics.push(<Topic>{ id: "_unit_23_qualifiers", name: "Unit 23 Qualifiers", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_23_Qualifiers.csv" });
      topics.push(<Topic>{ id: "_unit_24_adjectivespredicative2", name: "Unit 24 Adjectives  Predicative 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_24_Adjectives  Predicative 2.csv" });
      topics.push(<Topic>{ id: "_unit_25_prepositions", name: "Unit 25 Prepositions", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_25_Prepositions.csv" });
      topics.push(<Topic>{ id: "_unit_26_medical", name: "Unit 26 Medical", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_26_Medical.csv" });
      topics.push(<Topic>{ id: "_unit_27_verbspresent2", name: "Unit 27 Verbs  Present 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_27_Verbs  Present 2.csv" });
      topics.push(<Topic>{ id: "_unit_28_datesandtime", name: "Unit 28 Dates and Time", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_28_Dates and Time.csv" });
      topics.push(<Topic>{ id: "_unit_29_feelings", name: "Unit 29 Feelings", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_29_Feelings.csv" });
      topics.push(<Topic>{ id: "_unit_30_adverbs1", name: "Unit 30 Adverbs 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_30_Adverbs 1.csv" });
      topics.push(<Topic>{ id: "_unit_31_frequency", name: "Unit 31 Frequency", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_31_Frequency.csv" });
      topics.push(<Topic>{ id: "_unit_32_verbsmodal", name: "Unit 32 Verbs  Modal", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_32_Verbs  Modal.csv" });
      topics.push(<Topic>{ id: "_unit_33_nature", name: "Unit 33 Nature", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_33_Nature.csv" });
      topics.push(<Topic>{ id: "_unit_34_adjectivesnominative1", name: "Unit 34 Adjectives  Nominative 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_34_Adjectives  Nominative 1.csv" });
      topics.push(<Topic>{ id: "_unit_35_places", name: "Unit 35 Places", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_35_Places.csv" });
      topics.push(<Topic>{ id: "_unit_36_adjectivesnominative2", name: "Unit 36 Adjectives  Nominative 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_36_Adjectives  Nominative 2.csv" });
      topics.push(<Topic>{ id: "_unit_37_adverbs2", name: "Unit 37 Adverbs 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_37_Adverbs 2.csv" });
      topics.push(<Topic>{ id: "_unit_38_objects", name: "Unit 38 Objects", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_38_Objects.csv" });
      topics.push(<Topic>{ id: "_unit_39_communication", name: "Unit 39 Communication", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_39_Communication.csv" });
      topics.push(<Topic>{ id: "_unit_40_verbsfuture1", name: "Unit 40 Verbs  Future 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_40_Verbs  Future 1.csv" });
      topics.push(<Topic>{ id: "_unit_41_education", name: "Unit 41 Education", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_41_Education.csv" });
      topics.push(<Topic>{ id: "_unit_42_science", name: "Unit 42 Science", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_42_Science.csv" });
      topics.push(<Topic>{ id: "_unit_43_verbsreflexive", name: "Unit 43 Verbs Reflexive", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_43_Verbs Reflexive.csv" });
      topics.push(<Topic>{ id: "_unit_44_business1", name: "Unit 44 Business 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_44_Business 1.csv" });
      topics.push(<Topic>{ id: "_unit_45_language", name: "Unit 45 Language", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_45_Language.csv" });
      topics.push(<Topic>{ id: "_unit_46_abstractobjects1", name: "Unit 46 Abstract Objects 1", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_46_Abstract Objects 1.csv" });
      topics.push(<Topic>{ id: "_unit_47_verbspresent3", name: "Unit 47 Verbs  Present 3", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_47_Verbs  Present 3.csv" });
      topics.push(<Topic>{ id: "_unit_48_verbsconditional", name: "Unit 48 Verbs  Conditional", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_48_Verbs  Conditional.csv" });
      topics.push(<Topic>{ id: "_unit_49_abstractobjects2", name: "Unit 49 Abstract Objects 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_49_Abstract Objects 2.csv" });
      topics.push(<Topic>{ id: "_unit_50_business2", name: "Unit 50 Business 2", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_50_Business 2.csv" });
      topics.push(<Topic>{ id: "_unit_51_sports", name: "Unit 51 Sports", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_51_Sports.csv" });
      topics.push(<Topic>{ id: "_unit_52_spiritual", name: "Unit 52 Spiritual", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_52_Spiritual.csv" });
      topics.push(<Topic>{ id: "_unit_53_arts", name: "Unit 53 Arts", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_53_Arts.csv" });
      topics.push(<Topic>{ id: "_unit_54_politics", name: "Unit 54 Politics", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_54_Politics.csv" });
      topics.push(<Topic>{ id: "_unit_55_abstractobjects3", name: "Unit 55 Abstract Objects 3", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_55_Abstract Objects 3.csv" });
      topics.push(<Topic>{ id: "_unit_56_abstractobjects4", name: "Unit 56 Abstract Objects 4", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_56_Abstract Objects 4.csv" });
      topics.push(<Topic>{ id: "_unit_57_verbspresent4", name: "Unit 57 Verbs  Present 4", cards: [], waitingCards: [], csvStringUrl: "assets/data/ger-eng/Unit_57_Verbs  Present 4.csv" });

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
