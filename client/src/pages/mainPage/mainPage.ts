import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-mainPage',
  templateUrl: 'mainPage.html'
})
export class MainPagePage {

  dict: any;
  card1:any;
  card2:any;
  vocab: String;
  counter: number = 0;

  constructor(public navCtrl: NavController) {
    
    this.card2 = {
      frontSide: "laufen",
      backSide: "correr",
      level: 1
    }
    this.card1 = {
      frontSide: "schlafen",
      backSide: "dormir",
      level: 1
    };
    this.dict = [this.card1, this.card2]
    this.vocab = this.dict[this.counter].frontSide;
  }

  showVocab(){

    console.log(this.counter)
    console.log(this.dict[this.counter])
    if(this.vocab == this.dict[this.counter].frontSide){
      this.vocab = this.dict[this.counter].backSide;
    }else{
      this.vocab = this.dict[this.counter].frontSide;
    }
  }

  nextVocab(){

    this.counter++;
    this.showVocab()

  }

}
