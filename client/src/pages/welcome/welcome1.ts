import {Component, ViewChild} from '@angular/core';
import {NavController, Platform, Slides} from 'ionic-angular';
import {Language, User, VocabProvider} from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import {Welcome2Page} from "./welcome2";

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome1.html'

})

export class Welcome1Page {

  private username: string = "";

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider,
    public platform: Platform) {
  }

  saveUser() {

    // Slide 1
    // Save username
    this.vocabProvider.saveUserName(this.username);
    this.navCtrl.push(Welcome2Page);
  }

}
