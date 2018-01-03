import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MainPagePage} from '../mainPage/mainPage'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {


  }

  openMainScreen(level){

    this.navCtrl.push(MainPagePage, {
      levelPassed: level
    });

  }

  startLevel1(){

    this.navCtrl.push(MainPagePage, {
      levelPassed: 0
    });
  }
}
