import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { VocabProvider, User } from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import { SelectStudyPage } from "../selectStudy/selectStudy";
import { ManageLanguagesPage } from "../manageLanguages/manageLanguages";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})

export class HomePage {

  private user: User = { userName: "Mock", languages: [] };

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider) {


    this.user = vocabProvider.getUser();
  }

  ionViewWillEnter() {
    this.vocabProvider.setCurrentLanguage("-1");
  }

  openManage() {
    this.navCtrl.setRoot(ManageLanguagesPage);
  }

  start(id: string) {
    this.vocabProvider.setCurrentLanguage(id);
    this.navCtrl.setRoot(SelectStudyPage);
  }
}
