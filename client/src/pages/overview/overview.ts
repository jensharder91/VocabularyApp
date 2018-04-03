import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams } from 'ionic-angular';
import { StudyPhasePage } from '../studyPhase/studyPhase'
import { VocabProvider } from "../../providers/vocab/vocab";
import { VocabularyListPage } from "../vocabularyList/vocabularyList";
import 'rxjs/add/operator/map';
import { Card } from '../../../model/card';

@Component({
  selector: 'page-overview',
  templateUrl: 'overview.html'
})

export class OverviewPage {

  public language: String;
  csvData: any[] = [];
  // headerRow: any[] = [];

  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public vocabProvider: VocabProvider) {

    this.language = navParams.get('language');
  }

  getCardsOfLevel(level: number): Card[] {
    return this.vocabProvider.getCardDeckForLevel(level);
  }

  getCardsAll(): Card[] {
    return this.vocabProvider.getCardDeckAll();
  }

  getProgressImage(level: number): string {
    if (!level) level = 0;
    return "assets/imgs/progress/progress" + level + ".svg";
  }

  getNumbersOfCards(arr, value) {

    let counter = 0;
    for (let i = 0, iLen = arr.length; i < iLen; i++) {

      if (arr[i].level == value) {

        counter++;
      }
    }
    return counter;
  }

  showAlert(title, subtitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  startLevel(level) {
    let curCards: Card[] = this.vocabProvider.getCardDeckForLevel(level);

    if (curCards.length > 0) {
      this.navCtrl.push(StudyPhasePage, { cards: curCards, practise: true });
    }
  }

  displayLevel(level) {

    let curCards: Card[] = this.vocabProvider.getCardDeckForLevel(level);

    if (curCards.length > 0) {
      this.navCtrl.push(VocabularyListPage, { cards: curCards });
    }
  }

  displayAll() {
    this.navCtrl.push(VocabularyListPage, { cards: this.vocabProvider.getCardDeckAll() });
  }

}
