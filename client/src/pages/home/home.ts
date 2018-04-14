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
    { key: "English", text: "ENG", image: "assets/imgs/gb.svg" },
    { key: "Spanish", text: "ESP", image: "assets/imgs/spain.svg" },
    { key: "Test", text: "TEST", image: "" },
    { key: "Test2", text: "TEST2", image: "assets/imgs/gb.svg" },
    { key: "German", text: "DEU", image: "assets/imgs/german.svg" }
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
