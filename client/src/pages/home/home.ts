import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {StudyPhasePage} from '../studyPhase/studyPhase'
import {VocabProvider} from "../../providers/vocab/vocab";
import {OverviewPage} from "../overview/overview";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})

export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  startStudy(){

    this.navCtrl.push(OverviewPage)
  }
}
