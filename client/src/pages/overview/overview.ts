import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams} from 'ionic-angular';
import { StudyPhasePage } from '../studyPhase/studyPhase'
import { VocabProvider } from "../../providers/vocab/vocab";
import { VocabularyListPage } from "../vocabularyList/vocabularyList";
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import * as papa from 'papaparse';

@Component({
  selector: 'page-overview',
  templateUrl: 'overview.html'
})

export class OverviewPage {

  public language: String;
  csvData: any[] = [];
  headerRow: any[] = [];

  constructor(public alertCtrl: AlertController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public vocabProvider: VocabProvider,
              public http: Http) {

    this.language = navParams.get('language');
    this.readCsvData('assets/data/test.csv');
  }

  getNumbersOfCards(arr, value) {

    let counter = 0;
    for (let i = 0, iLen = arr.length; i < iLen; i++) {

      if (arr[i].level == value){

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

  startLevel(level){

    if(this.vocabProvider.levelsCounters[level] != 0){

      this.navCtrl.push(StudyPhasePage, {
        level: level
      });
    }
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
            this.vocabProvider.createCard(data.front, data.back, true);
          }
        }
      ]
    });

    prompt.present();
  }

  showAllVocabulary(){

    this.navCtrl.push(VocabularyListPage);
  }

  resetAll() {

    this.vocabProvider.clearStorage();
  }

  private readCsvData(url) {

    this.http.get(url)
      .subscribe(
        data => this.extractData(data),
        err => this.handleError(err)
      );
  }

  private extractData(res){
    let csvData = res['_body'] || '';
    let parsedData = papa.parse(csvData).data;

    this.headerRow = parsedData[0];

    parsedData.splice(0, 1);
    this.csvData = parsedData;
  }

  private handleError(err) {

    console.log('An error occured: ', err);
  }

  public loadCsvToDict(){

    let loading = this.loadingCtrl.create();

    loading.present();

    if (this.csvData != null) {
      for (let j = 0; j < this.csvData.length; j++) {
        this.vocabProvider.dict.push({
          frontSide: this.csvData[j][0],
          backSide: this.csvData[j][1],
          level: 0
        });
        this.vocabProvider.levelsCounters[0]++;
      }

      this.vocabProvider.storeDict();

      this.vocabProvider.setCsvLoaded(true);
    }

    loading.dismiss();
  }
}
