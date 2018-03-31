import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OverviewPage } from "../overview/overview";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})

export class HomePage {


  constructor(public navCtrl: NavController) {
  }

  startStudy(language: String) {

    switch (language) {
      case 'Spanish':
        this.navCtrl.push(OverviewPage, {
          language: language
        });
        break;
    }
  }

  addNewLanguage() {

  }
}
