import {Component, ViewChild} from '@angular/core';
import {NavController, Platform, Slides} from 'ionic-angular';
import {Language, User, VocabProvider} from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import {MainPage} from "../main/main";
import {Welcome2Page} from './welcome2';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome3.html'

})

export class Welcome3Page {

  private user: User = { userName: "Mock", languages: [], currentLanguageId:"" };

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider,
    public platform: Platform) {

  }

  start(){
    this.navCtrl.setRoot(MainPage);
  }
}
