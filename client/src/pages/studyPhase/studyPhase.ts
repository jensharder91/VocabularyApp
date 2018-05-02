import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { VocabProvider, Card } from "../../providers/vocab/vocab";
import { SelectStudyPage } from "../selectStudy/selectStudy";

@Component({
  selector: 'page-studyPhase',
  templateUrl: 'studyPhase.html'
})

export class StudyPhasePage {

  currentCard: Card;
  frontCard: string;
  backCard: string;
  currentCardDeck: Card[];
  private seeBackside: boolean = false;
  private repeatLevel: boolean = false;

  private mode: string;
  private topic: string;
  private level: number;

  private myInput: string = "";
  private inputfieldVisible: boolean = true;

  counter: number = 0; //Pay attention: Level 1 in the UI is level 0 for the developer due to 0-based array

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public vocabProvider: VocabProvider) {

    this.level = this.navParams.get('level');
    this.topic = this.navParams.get('topic');
    this.mode = this.navParams.get('mode');

    if (this.mode == "topic") {
      this.currentCardDeck = this.vocabProvider.getCardDeckForTopic(this.topic);
      this.repeatLevel = true;
    } else if (this.mode == "levels") {
      this.currentCardDeck = this.vocabProvider.getCardDeckForLevel(this.level - 1);
      this.repeatLevel = true;
    } else if (this.mode == "due"){
      this.currentCardDeck = this.vocabProvider.getCardsToLearn();
    }else {
      this.currentCardDeck = this.vocabProvider.getCardDeckAll();
    }


    this.counter = 0;
    this.currentCardDeck = this.shuffle(this.currentCardDeck);
    this.currentCard = this.currentCardDeck[this.counter];
    this.chooseCardSide();
  }

  getProgressImage(level: number): string {
    if (!level) level = 0;
    return "assets/imgs/level/level_" + level + ".svg";
  }

  // display or hide input field
  showInputfield(){
    this.inputfieldVisible = !this.inputfieldVisible;
  }

  showVocab(id) {

    // let levelsCounters = this.vocabProvider.levelsCounters;
    let currentVocab: Card = this.currentCardDeck[this.counter];

    if (id == "known") { // Correct

      this.vocabProvider.increaseCardLevel(currentVocab);
    } else { // Wrong

      this.vocabProvider.resetCardLevel(currentVocab);
    }

    // reset input field
    this.myInput = "";

    // show next card
    this.nextCard();
  }

  nextCard() {

    if (this.counter >= this.currentCardDeck.length - 1) {

      let prompt = this.alertCtrl.create({
        title: 'All done!',
        message: "Congratulations! You studied all cards of this level.",
        buttons: [
          {
            text: 'Go Back',
            handler: data => {
              this.navCtrl.setRoot(SelectStudyPage);
            }
          }
        ]
      });

      prompt.present();
    } else {
      this.counter++;
    }

    this.currentCard = this.currentCardDeck[this.counter];

    this.chooseCardSide();

    this.resetSolution();
  }

  chooseCardSide() {

    // Randomize which side to show
    if (this.currentCard != null) {
      if (this.currentCard.nextTimeInverse) {
        this.frontCard = this.currentCard.backSide;
        this.backCard = this.currentCard.frontSide;
      } else {
        this.frontCard = this.currentCard.frontSide;
        this.backCard = this.currentCard.backSide;
      }

      this.seeBackside = false;
    }
  }

  // Shuffle the order of objects in the array.
  shuffle(array) {

    let m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

      // Pick a remaining element…
      i = Math.floor(Math.random() * m--);

      // And swap it with the current element.
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  // Show other side of card
  flip() {

    let card = document.getElementsByClassName("vocCard")[0];
    card.classList.toggle("flipped");
    this.seeBackside = !this.seeBackside;

    if (card.classList.contains("flipped")) {
      this.stringDiff(this.backCard, this.myInput);
    } else {
      this.stringDiff(this.frontCard, this.myInput);
    }
  }

  // mark differences between two strings
  stringDiff(string1: string, string2: string){

    if (this.seeBackside) {

      // HTML element to write solution
      let span = document.getElementById("solution");
      span.innerHTML = '';

      // Parse first string and compare with second string character wise
      let i = 0;
      string1.split('').forEach(function (elem) {
        let newSpan = document.createElement('span');
        if (elem != string2[i]) {
          // mark differences in red
          newSpan.style.color = "#f0513c";
          newSpan.style.textDecoration = "underline";
        } else {
          newSpan.style.color = "#00df53";
        }

        newSpan.innerHTML = elem;
        span.appendChild(newSpan);
        i++;
      });

      // if second string is longer than the first, mark difference with underscores
      if (string2.length > string1.length){
        for (let i = 0; i < (string2.length - string1.length); i++){
          let newSpan = document.createElement('span');
          newSpan.style.color = "#f0513c";
          newSpan.innerHTML = "&ensp;";
          newSpan.style.textDecoration = "underline";
          span.appendChild(newSpan);
        }
      }

    } else {

      this.resetSolution();
    }
  }

  // reset HTML field for solution display
  resetSolution(){
    let span = document.getElementById("solution");
    span.innerHTML = '&ensp;';
  }
}
