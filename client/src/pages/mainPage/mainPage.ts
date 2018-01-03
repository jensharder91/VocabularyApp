import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-mainPage',
  templateUrl: 'mainPage.html'
})
export class MainPagePage {

  dict: any
  card1:any;
  card2:any;
  currentVocab: String;
  counter: number = 0;
  currentCardDeck: any;

  //Pay attention: Level 1 in the userface is level 0 for the developer due to 0-index based array.
  levelsCounters = [0,0,0,0,0,0]


  levelPassed: number;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.levelPassed = navParams.get("levelPassed");


    this.dict = []
    this.createCard("laufen", "correr");
    this.createCard("schlafen", "dormir");



    this.currentCardDeck = this.getCardDeck(this.dict, this.levelPassed)
    /*if (this.currentCardDeck.length() == 0) {
        this.currentVocab = "There are no vocabularies in this level."
    }else{
      */  //Initialize the currentVocab, so the HTML-Filw knows what to diyplay.
        this.currentVocab = this.currentCardDeck[this.counter].frontSide;
    //}


  }

  //Getting the card decks based on the level chosen by the user.
  getCardDeck(arr, value) {

    var result =[];
    for (var i=0, iLen=arr.length; i<iLen; i++) {

      if (arr[i].level == value){

        result.push(arr[i]);

      }
    }

    return result;
  }

  showVocab(id){



    var currentVocab = this.currentCardDeck[this.counter];
    //The currentVocab was known
    if(id == "known"){

      //Tasks: 1. adjust number of vocabs in each level [levelCounter] 2.Adjust specific level of current currentVocab.

      //Task 1.
      //Test whether the levelCounter is not below 0.
      if(this.levelsCounters[currentVocab.level] > 0 && this.levelsCounters[currentVocab.level] < 6 ){

        //The currentVocab is known: Thus the currentVocab will be deleted from this level and added to the next one.
        this.levelsCounters[currentVocab.level]--;
      }
      //Add currentVocab to the next level


      //Task 2.
      if(currentVocab.level <6){
        currentVocab.level++;
        this.levelsCounters[currentVocab.level]++;
      }


    }
    //The currentVocab was not known.
    else{

      //If the currentVocab is not known, put it back into level 1.
      this.levelsCounters[0]++;

      if(this.levelsCounters[currentVocab.level] > 0){
        this.levelsCounters[currentVocab.level]--;
      }


      currentVocab.level = 0;


    }

    if(this.currentVocab == this.currentCardDeck[this.counter].frontSide){
      this.currentVocab = this.currentCardDeck[this.counter].backSide;
    }else{
      this.currentVocab = this.currentCardDeck[this.counter].frontSide;
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

    if(this.counter == 1){
      this.counter = 0;
    }else{
      this.counter++;
    }
    this.currentVocab = this.currentCardDeck[this.counter].frontSide

  }

}
