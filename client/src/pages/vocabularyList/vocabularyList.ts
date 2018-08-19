import { Component } from '@angular/core';
import { AlertController, NavParams, PopoverController } from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";
import { MenuPopoverPage } from "../menuPopover/menuPopover";
import { Card } from '../../../swagger/model/Card';
import { Topic } from '../../../swagger/model/Topic';

@Component({
  selector: 'page-vocabularyList',
  templateUrl: 'vocabularyList.html'
})

export class VocabularyListPage {

  private dict: Card[] = [];
  private topic: Topic;
  private cardDeckTitle: String;

  private mode: string;
  private topicId: string;
  private level: number;
  private language1: string;
  private language2: string;


  listLowerLimit = 0;
  listUpperLimit = 5;
  listInterval = 5;

  constructor(public alertCtrl: AlertController,
    public navParams: NavParams,
    public vocabProvider: VocabProvider,
    public popoverCtrl: PopoverController) {

  }

  ionViewWillEnter() {
    this.level = this.navParams.get('level');
    this.topicId = this.navParams.get('topicId');
    this.mode = this.navParams.get('mode');
    this.language1 = this.vocabProvider.getCurrentLanguage().name1;
    this.language2 = this.vocabProvider.getCurrentLanguage().name2;

    this.dict = [];
    this.topic = null;
    this.cardDeckTitle = "";

    this.getCards().then(() => {
      this.listLowerLimit = 0;
      this.listUpperLimit = 5;
      this.listInterval = 5;

      if (this.listUpperLimit >= this.dict.length) {
        this.listUpperLimit = this.dict.length;
      }
    });
  }

  getCards(): Promise<any> {
    return new Promise((resolve, reject) => {

      if (this.mode == "topic") {
        let topic: Topic = this.vocabProvider.getTopicById(this.topicId);
        if (topic && (topic.cards || topic.waitingCards)) {
          this.topic = topic;
          if (this.topic.cards) {
            this.dict = this.topic.cards;
          }
          if (this.topic.waitingCards) {
            this.dict = this.topic.waitingCards;
          }
          if (this.topic.cards && this.topic.waitingCards) {
            this.dict = this.topic.cards.concat(this.topic.waitingCards);
          }

          this.cardDeckTitle = this.topicId;
          resolve();
        } else {
          this.vocabProvider.getAvailableTopicsByTopicId(this.topicId).then((myTopic) => {
            this.topic = myTopic;
            this.dict = myTopic.waitingCards;

            this.cardDeckTitle = this.topicId;
            resolve();
          })
        }

      } else if (this.mode == "levels") {
        this.dict = this.vocabProvider.getCardsByLevel(this.level - 1);
        this.cardDeckTitle = "" + this.level;
        resolve();
      } else {
        this.dict = this.vocabProvider.getCardsAll();
        this.cardDeckTitle = "All Cards";
        resolve();
      }
    })

  }

  getProgressImage(level: number): string {
    if (!level) level = 0;
    return "assets/imgs/level/level_" + (level + 1) + ".svg";
  }

  deleteCard(card: any) {

    this.vocabProvider.deleteCard(card.id);
    //update list
    this.getCards();

  }

  changeCard(card: Card) {

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
            this.vocabProvider.changeCard(card.id, data.front, data.back);
          }
        }
      ]
    });

    prompt.present();
  }

  addCard() {

    let prompt = this.alertCtrl.create({
      title: 'Create New Card',
      message: "Enter a new vocabulary!",
      inputs: [
        {
          name: 'front',
          placeholder: this.language1
        },
        {
          name: 'back',
          placeholder: this.language2
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
            this.vocabProvider.createCard(this.topicId, data.front, data.back);
          }
        }
      ]
    });

    prompt.present();
  }

  showNextList() {

    if (this.listUpperLimit < this.dict.length) {

      this.listLowerLimit += this.listInterval;
      this.listUpperLimit += this.listInterval;

      if (this.listUpperLimit > this.dict.length) {
        this.listUpperLimit = this.dict.length;
      }
    }
  }

  showPrevList() {

    if (this.listLowerLimit > 0) {

      this.listLowerLimit -= this.listInterval;
      this.listUpperLimit = this.listLowerLimit + this.listInterval;

      if (this.listUpperLimit > this.dict.length) {
        this.listUpperLimit = this.dict.length;
      }
    }
  }

  toggleFavorite() {
    if (this.topic.favorite) {
      this.vocabProvider.removeTopicFromUser(this.topic.id);
    } else {
      this.vocabProvider.addTopicToUser(this.topic);
    }
  }
}
