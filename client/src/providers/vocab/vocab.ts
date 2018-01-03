import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the VocabProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VocabProvider {

  dict: any
  levelsCounters = [0,0,0,0,0,0]

  //db: SQLiteObject = null;




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



  //*************** DATABASE Methods*******************

  /*
  setDatabase(db: SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  createTable(){
    let sql = 'CREATE TABLE IF NOT EXISTS vocabularies(id INTEGER PRIMARY KEY AUTOINCREMENT, front TEXT, back TEXT, level INTEGER)';
    return this.db.executeSql(sql, []);
  }

  getAll(){
    let sql = 'SELECT * FROM vocabularies';
    return this.db.executeSql(sql, [])
      .then(response => {
        let tasks = [];
        for (let index = 0; index < response.rows.length; index++) {
          tasks.push( response.rows.item(index) );
        }
        return Promise.resolve( tasks );
      })
      .catch(error => Promise.reject(error));
  }

  create(card: any){
    let sql = 'INSERT INTO vocabularies(front, back, level) VALUES(?,?,?)';
    return this.db.executeSql(sql, [card.front, card.back, card.level]);
  }

  update(card: any){
    let sql = 'UPDATE vocabularies SET front=?, back=?, level=? WHERE id=?';
    return this.db.executeSql(sql, [card.front, card.back, card.level]);
  }

  delete(card: any){
    let sql = 'DELETE FROM vocabularies WHERE id=?';
    return this.db.executeSql(sql, [card.id]);
  }

  */


}
