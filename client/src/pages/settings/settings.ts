import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { VocabProvider } from "../../providers/vocab/vocab";
import { HomePage } from '../home/home'

@Component({
  selector: 'settings',
  templateUrl: 'settings.html'

})

export class SettingsPage {

  private username: string = "";

  constructor(public navCtrl: NavController, public vocabProvider: VocabProvider) {

    this.username = vocabProvider.getUserName();
  }


  save() {
    this.vocabProvider.saveUserName(this.username);

    this.navCtrl.setRoot(HomePage);
  }

}
