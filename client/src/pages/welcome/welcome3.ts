import {Component, ViewChild} from '@angular/core';
import {NavController, Platform, Slides} from 'ionic-angular';
import { VocabProvider} from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import {MainPage} from "../main/main";
import {Welcome2Page} from './welcome2';
import { User } from '../../../swagger/model/User';
import { Language } from '../../../swagger/model/Language';

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome3.html'

})

export class Welcome3Page {

  private user: User = { userId: "_mock", userName: "Mock", languages: [], currentLanguageId:"" };

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider,
    public platform: Platform) {

  }

  start(){
    this.navCtrl.setRoot(MainPage);
  }
}
