import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-mainPage',
  templateUrl: 'mainPage.html'
})
export class MainPagePage {

  dict: any
  card1:any;
  card2:any;
  vocab: String;
  counter: number = 0;

  //Pay attention: Level 1 in the userface is level 0 for the developer due to 0-index based array.
  levelsCounters = [0,0,0,0,0,0]


  constructor(public navCtrl: NavController) {

    this.dict = []
    this.createCard("laufen", "correr");
    this.createCard("schlafen", "dormir");

    this.vocab = this.dict[this.counter].frontSide;

  }


  showVocab(id){

    console.log(id)

    var currentVocab = this.dict[this.counter];
    //The vocab was known
    if(id == "known"){

      console.log("Salam")
      //Tasks: 1. adjust number of vocabs in each level [levelCounter] 2.Adjust specific level of current vocab.

      //Task 1.
      //Test whether the levelCounter is not below 0.
      if(this.levelsCounters[currentVocab.level] > 0 && this.levelsCounters[currentVocab.level] < 6 ){

        //The vocab is known: Thus the vocab will be deleted from this level and added to the next one.
        this.levelsCounters[currentVocab.level]--;
      }
      //Add vocab to the next level


      //Task 2.
      if(currentVocab.level <6){
        currentVocab.level++;
        this.levelsCounters[currentVocab.level]++;
      }


    }
    //The vocab was not known.
    else{

      //If the vocab is not known, put it back into level 1.
      this.levelsCounters[0]++;

      if(this.levelsCounters[currentVocab.level] > 0){
        this.levelsCounters[currentVocab.level]--;
      }


      currentVocab.level = 0;


    }

    if(this.vocab == this.dict[this.counter].frontSide){
      this.vocab = this.dict[this.counter].backSide;
    }else{
      this.vocab = this.dict[this.counter].frontSide;
    }
  }

  createCard(frontSideValue, backSideValue){
    var card = {
      frontSide: frontSideValue,
      backSide: backSideValue,
      level: 0
    };
    //console.log(card.level-1)
    this.levelsCounters[card.level]++;
    this.dict.push(card)
  }

  nextVocab(){

    this.counter++;
    this.dict[this.counter].frontSide

  }

}
