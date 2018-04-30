import { Component } from '@angular/core';
import { ToastController, ViewController, App, NavParams } from 'ionic-angular';

import { VocabProvider, Card } from "../../providers/vocab/vocab";
import { StudyPhasePage } from "../studyPhase/studyPhase";
import { VocabularyListPage } from "../vocabularyList/vocabularyList";

@Component({
  selector: 'page-selectStudyPopover',
  templateUrl: 'selectStudyPopover.html',
})
export class SelectStudyPopoverPage {

  private mode: string;
  private topic: string;
  private level: number;

  constructor(protected app: App,
    private toastCtrl: ToastController,
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private vocabProvider: VocabProvider) {

    this.level = this.navParams.get('level');
    this.topic = this.navParams.get('topic');
    this.mode = this.navParams.get('mode');
  }

  showTopicCardDeck(topic: string) {
    let curCards: Card[] = this.vocabProvider.getCardDeckForTopic(topic);
    this.showCards(curCards);
  }

  showLevelCardDeck(level: number) {
    let curCards: Card[] = this.vocabProvider.getCardDeckForLevel(level - 1);
    this.showCards(curCards);
  }

  showCards(curCards: Card[]) {
    this.viewCtrl.dismiss().then(() => {
      if (curCards.length > 0) {
        this.app.getRootNav().setRoot(VocabularyListPage, {
          mode: this.mode,
          topic: this.topic,
          level: this.level
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
    let curCards: Card[] = this.vocabProvider.getCardDeckForTopic(topic);
    this.studyCards(curCards);
  }

  studyLevelCardDeck(level: number) {
    let curCards: Card[] = this.vocabProvider.getCardDeckForLevel(level - 1);
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

}
