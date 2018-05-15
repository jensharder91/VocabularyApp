import {Component, ViewChild} from '@angular/core';
import {NavController, Platform, Slides} from 'ionic-angular';
import {Language, User, VocabProvider} from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import {Welcome1Page} from "./welcome1";
import {Welcome3Page} from "./welcome3";

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome2.html'

})

export class Welcome2Page {

  private userName:string = "Unknown";
  public availableLanguages: Language[] = [];

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider,
    public platform: Platform) {

this.userName = this.vocabProvider.getUserName();
    this.availableLanguages = this.vocabProvider.getAvaiableLanguages();
  }

  saveLanguage(id){
    console.log(id + "selected");
    this.vocabProvider.addLanguageToUser(id);
    this.navCtrl.push(Welcome3Page);
  }
}
