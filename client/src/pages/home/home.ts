import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { VocabProvider, User } from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import { SelectStudyPage } from "../selectStudy/selectStudy";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})

export class HomePage {

  // private languages = [
  //   { key: "English", text: "ENG", image: "assets/imgs/gb.svg" },
  //   { key: "Spanish", text: "ESP", image: "assets/imgs/spain.svg" },
  //   { key: "Test", text: "TEST", image: "" },
  //   { key: "Test2", text: "TEST2", image: "assets/imgs/gb.svg" },
  //   { key: "German", text: "GER", image: "assets/imgs/german.svg" }
  // ];

  private user:User = {userName:"Mock", languages:[]};

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider) {


      this.user = vocabProvider.getUser();
  }

  protected language: String;

  start(name: string) {
    this.vocabProvider.setCurrentLanguage(name);
    this.navCtrl.setRoot(SelectStudyPage);
  }
}
