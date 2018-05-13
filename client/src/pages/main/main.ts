import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { User } from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import { SelectStudyPage } from "../selectStudy/selectStudy";
import { ManageTopicsPage } from "../manageTopics/manageTopics";
import { VocabProvider, Language, Card } from "../../providers/vocab/vocab";


@Component({
  selector: 'page-main',
  templateUrl: 'main.html'

})

export class MainPage {

  private tab1Root;
  private tab2Root;

  public language: Language;

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider,
    public platform: Platform) {

    this.language = vocabProvider.getCurrentLanguage();
    this.tab1Root = SelectStudyPage;
    this.tab2Root = ManageTopicsPage;
  }
}
