import { Component } from '@angular/core';
import { ToastController, ViewController, App, NavParams } from 'ionic-angular';

import { Card } from "../../../model/card";
import { VocabProvider } from "../../providers/vocab/vocab";
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
    console.log("popup");
    console.log(this.mode);
    console.log(this.topic);
    console.log(this.level);
  }

  showCardDeck(cardDeckId: number) {
    // let curCards: Card[] = this.vocabProvider.getCardDeckForId(cardDeckId);

    // if (curCards.length > 0) {
    //   this.app.getRootNav().setRoot(VocabularyListPage, {
    //     cardDeckId: this.cardDeckId,
    //     cardDeckTitle: this.cardDeckTitle
    //   });
    // } else {
    //   this.toastCtrl.create({
    //     message: 'No cards in vocabulary list.',
    //     duration: 3000,
    //     position: 'bottom'
    //   }).present();
    // }
    //
    // this.viewCtrl.dismiss();
  }

  studyCardDeck(cardDeckId: number) {
    // let curCards: Card[] =  this.vocabProvider.getCardDeckForId(cardDeckId);
    //
    // if (curCards.length > 0) {
    //   this.app.getRootNav().setRoot(StudyPhasePage, {
    //     cardDeckId: this.cardDeckId
    //   });
    // } else {
    //   this.toastCtrl.create({
    //     message: 'No cards for learning left! Try again later.',
    //     duration: 3000,
    //     position: 'bottom'
    //   }).present();
    // }
    //
    // this.viewCtrl.dismiss();
  }

  showRules(cardDeckId: number) {
    this.toastCtrl.create({
      message: 'Soon something great will happen here...',
      duration: 3000,
      position: 'bottom'
    }).present();

    this.viewCtrl.dismiss();
  }

}
