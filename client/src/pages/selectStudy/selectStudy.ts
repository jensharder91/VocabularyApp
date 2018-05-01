import { Component } from '@angular/core';
import { AlertController, PopoverController, ToastController, NavController, NavParams } from 'ionic-angular';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { VocabProvider, Language, Card } from "../../providers/vocab/vocab";

import { ManageTopicsPage } from "../manageTopics/manageTopics";
import { StudyPhasePage } from "../studyPhase/studyPhase";
import { SelectStudyPopoverPage } from "../selectStudyPopover/selectStudyPopover";
import { VocabularyListPage } from '../vocabularyList/vocabularyList';
import { MemoryPage } from '../memory/memory';

@Component({
  selector: 'page-selectStudy',
  templateUrl: 'selectStudy.html'
})

export class SelectStudyPage {

  public language: Language;
  public studyType: String = 'vocabulary'; // voc or grammar

  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public vocabProvider: VocabProvider,
    public http: Http,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController) {

    this.language = vocabProvider.getCurrentLanguage();
  }

  showAllCards() {
    this.navCtrl.setRoot(VocabularyListPage);
  }

  studyDueCards() {
    let curCards: Card[] = this.vocabProvider.getCardsToLearn();

    if (curCards.length > 0) {
      this.navCtrl.setRoot(StudyPhasePage, {
        mode: "due"
      });
    } else {
      this.toastCtrl.create({
        message: 'No cards for learning left! Try again later.',
        duration: 3000,
        position: 'bottom'
      }).present();
    }
  }

  presentTopicPopover(topic: any) {

    this.popoverCtrl.create(SelectStudyPopoverPage,
      { topic: topic, mode: "topic" }).present();
  }

  presentLevelPopover(level: number) {
    this.popoverCtrl.create(SelectStudyPopoverPage,
      { level: level, mode: "levels" }).present();
  }

  openManage() {
    this.navCtrl.setRoot(ManageTopicsPage);
  }

  showMemory() {
    this.navCtrl.setRoot(MemoryPage);
  }

}
