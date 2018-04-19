import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
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

  public language: String = "Spanish";
  csvData: any[] = [];
  // headerRow: any[] = [];

  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public vocabProvider: VocabProvider) {
  }

  getCardsOfLevel(level: number): Card[] {
    return this.vocabProvider.getCardDeckForId(level);
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
      this.navCtrl.setRoot(StudyPhasePage, { level: level});
  }

  displayLevel(level) {
    this.navCtrl.push(VocabularyListPage, { level: level });
  }

  displayAll() {
    this.navCtrl.push(VocabularyListPage);
  }

  createCard() {
    let prompt = this.alertCtrl.create({
      title: 'Create new card',
      message: "Enter a new vocabulary!",
      inputs: [
        {
          name: 'front',
          placeholder: 'Front'
        },
        {
          name: 'back',
          placeholder: 'Back'
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
            this.vocabProvider.createCard(data.front, data.back);
          }
        }
      ]
    });

    prompt.present();
  }

  resetAll() {
    this.vocabProvider.clearStorage();
  }

  public loadCsvToDict() {
    this.vocabProvider.addTenVocs();
  }

}
