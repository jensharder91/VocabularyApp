import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { VocabProvider, User } from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import { SelectStudyPage } from "../selectStudy/selectStudy";

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'

})

export class StartPage {


  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider) {


  }

}
