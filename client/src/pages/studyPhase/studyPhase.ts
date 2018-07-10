import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";
import { VocabBoxPage } from "../vocabBox/vocabBox";
import { Card } from '../../../swagger/model/Card';

@Component({
  selector: 'page-studyPhase',
  templateUrl: 'studyPhase.html'
})

export class StudyPhasePage {

  currentCard: Card;
  frontCard: String;
  backCard: String;
  currentCardDeck: Card[];
  private seeBackside: boolean = false;
  private repeatLevel: boolean = false;

  private mode: string;
  private topic: string;
  private level: number;

  private myInput: String;
  private inputfieldVisible: Boolean = true;

  counter: number = 0; //Pay attention: Level 1 in the UI is level 0 for the developer due to 0-based array

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public vocabProvider: VocabProvider) {

    this.level = this.navParams.get('level');
    this.topic = this.navParams.get('topic');
    this.mode = this.navParams.get('mode');

    if (this.mode == "topic") {
      this.currentCardDeck = this.vocabProvider.getActiveCardsByTopicId(this.topic);
      this.repeatLevel = true;
    } else if (this.mode == "levels") {
      this.currentCardDeck = this.vocabProvider.getCardsByLevel(this.level - 1);
      this.repeatLevel = true;
    } else if (this.mode == "due"){
      this.currentCardDeck = this.vocabProvider.getCardsToLearn();
    }else {
      this.currentCardDeck = this.vocabProvider.getCardsAll();
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
              this.navCtrl.setRoot(VocabBoxPage);
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
  }
}
