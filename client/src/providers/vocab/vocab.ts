import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the VocabProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VocabProvider {

  dict: any
  levelsCounters = [0,0,0,0,0,0]

  constructor() {
    console.log('Hello VocabProvider Provider');
    this.dict = []
    this.createCard("laufen", "correr");
    this.createCard("schlafen", "dormir");
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



}
