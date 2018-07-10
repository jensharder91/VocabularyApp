import { Component } from '@angular/core';
import {ToastController, ViewController, AlertController, App, NavParams, PopoverController} from 'ionic-angular';

import { VocabProvider } from "../../providers/vocab/vocab";
import { StudyPhasePage } from "../studyPhase/studyPhase";
import { VocabularyListPage } from "../vocabularyList/vocabularyList";
import {MenuPopoverPage} from "../menuPopover/menuPopover";
import { Card } from '../../../swagger/model/Card';
import { Topic } from '../../../swagger/model/Topic';

@Component({
  selector: 'page-selectStudyPopover',
  templateUrl: 'selectStudyPopover.html',
})
export class SelectStudyPopoverPage {

  private mode: string;
  private topic: string;
  private level: number;
  private language1: string;
  private language2: string;

  constructor(protected app: App,
              private toastCtrl: ToastController,
              private navParams: NavParams,
              private viewCtrl: ViewController,
              private vocabProvider: VocabProvider,
              private alertCtrl: AlertController,
              private popoverCtrl: PopoverController) {

    this.level = this.navParams.get('level');
    this.topic = this.navParams.get('topic');
    this.mode = this.navParams.get('mode');
    this.language1 = this.navParams.get('language1');
    this.language2 = this.navParams.get('language2');
  }

  showTopicCardDeck(topic: string) {
    let curCards: Card[] = this.vocabProvider.getAllCardsByTopicId(topic);
    this.showCards(curCards);
  }

  showLevelCardDeck(level: number) {
    let curCards: Card[] = this.vocabProvider.getCardsByLevel(level - 1);
    this.showCards(curCards);
  }

  showCards(curCards: Card[]) {
    this.viewCtrl.dismiss().then(() => {
      if (curCards.length > 0) {
        this.app.getRootNav().setRoot(VocabularyListPage, {
          mode: this.mode,
          topic: this.topic,
          level: this.level,
          language1: this.language1,
          language2: this.language2
        });
      } else {
        this.toastCtrl.create({
          message: 'No cards in vocabulary list.',
          duration: 3000,
          position: 'bottom'
        }).present();
      }

    });
  }

  studyTopicCardDeck(topic: string) {
    let curCards: Card[] = this.vocabProvider.getActiveCardsByTopicId(topic);
    this.studyCards(curCards);
  }

  studyLevelCardDeck(level: number) {
    let curCards: Card[] = this.vocabProvider.getCardsByLevel(level - 1);
    this.studyCards(curCards);
  }

  studyCards(curCards: Card[]) {
    this.viewCtrl.dismiss().then(() => {
      if (curCards.length > 0) {
        this.app.getRootNav().setRoot(StudyPhasePage, {
          mode: this.mode,
          topic: this.topic,
          level: this.level
        });
      } else {
        this.toastCtrl.create({
          message: 'No cards for learning left! Try again later.',
          duration: 3000,
          position: 'bottom'
        }).present();
      }

    });
  }

  showRules(cardDeckId: number) {
    this.toastCtrl.create({
      message: 'Soon something great will happen here...',
      duration: 3000,
      position: 'bottom'
    }).present();

    this.viewCtrl.dismiss();
  }

  public loadCsvToDict() {
    this.viewCtrl.dismiss().then(() => {
      this.vocabProvider.addTenVocs(this.topic);
    });
  }

  addVocabulary(topic: string) {
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
            this.vocabProvider.createCard(topic, data.front, data.back);
          }
        }
      ]
    });

    prompt.present();
  }

}
