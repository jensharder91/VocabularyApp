import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import { SelectStudyPage } from "../selectStudy/selectStudy";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})

export class HomePage {

  private languages = [
    { key: "English", text: "ENG", image: "assets/imgs/home/gb.svg" },
    { key: "Spanish", text: "ESP", image: "assets/imgs/home/spain.svg" },
    { key: "Test", text: "TEST", image: "" },
    { key: "Test2", text: "TEST2", image: "assets/imgs/home/gb.svg" },
    { key: "German", text: "GER", image: "assets/imgs/home/german.svg" }
  ];

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider) {

  }

  protected language: String;

  start(key: string) {
    this.navCtrl.setRoot(SelectStudyPage, {
      language: key
    });
  }
}
