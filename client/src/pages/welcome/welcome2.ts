import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, Slides } from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import { Welcome1Page } from "./welcome1";
import { Welcome3Page } from "./welcome3";
import { User } from '../../../swagger/model/User';
import { Language } from '../../../swagger/model/Language';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome2.html'

})

export class Welcome2Page {

  private userName: string = "Unknown";
  public availableLanguages: Language[] = [];

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider,
    public platform: Platform) {

    this.userName = this.vocabProvider.getUserName();
    this.vocabProvider.getAvaiableLanguages().then((languages) => {
      this.availableLanguages = languages;
    });
  }

  saveLanguage(id) {
    console.log(id + "selected");
    this.vocabProvider.addLanguageToUser(id);
    this.navCtrl.push(Welcome3Page);
  }
}
