import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import { SelectStudyPage } from "../selectStudy/selectStudy";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})

export class HomePage {

  private languages = [
    { key: "English", displayName: "ENG", "displayImage": "gb.svg" },
    { key: "Spanish", displayName: "ESP", "displayImage": "spain.svg" },
    { key: "Test", displayName: "TEST", "displayImage": "" },
    { key: "German", displayName: "DEU", "displayImage": "german.svg" }
  ];

  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public vocabProvider: VocabProvider) {

  }

  protected language: String;

  start(key: string) {
    this.navCtrl.setRoot(SelectStudyPage, {
      language: key
    });
  }
}
