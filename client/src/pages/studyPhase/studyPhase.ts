import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";
import { Card } from '../../../model/card';
import { HomePage } from "../home/home";

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
  private repeatLevel:boolean = false;
  private cardDeckId:number;

  input_value: String;

  counter: number = 0; //Pay attention: Level 1 in the UI is level 0 for the developer due to 0-based array

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public vocabProvider: VocabProvider) {

    this.cardDeckId = navParams.get('cardDeckId');
    if (this.cardDeckId != null && this.cardDeckId != undefined) {
      // this.currentCardDeck = this.vocabProvider.getCardDeckForId(this.cardDeckId);
      this.repeatLevel = true;
    }
    else {
      this.currentCardDeck = this.vocabProvider.getCardsToLearn();
      this.repeatLevel = false;
    }
    this.currentCardDeck = this.shuffle(this.currentCardDeck);
    this.currentCard = this.currentCardDeck[this.counter];
    this.randCardSide();
  }

  getProgressImage(level: number): string {
    if (!level) level = 0;
    return "assets/imgs/progress/progress" + level + ".svg";
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
    this.input_value = null;

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
              this.navCtrl.setRoot(HomePage);
            }
          }
        ]
      });

      prompt.present();
    } else {
      this.counter++;
    }

    this.currentCard = this.currentCardDeck[this.counter];

    this.randCardSide();
  }

  randCardSide() {

    // Randomize which side to show
    if (this.currentCard != null) {
      let rand = (Math.floor(Math.random() * 6) + 1) % 2;
      if (rand == 0) {
        this.frontCard = this.currentCard.frontSide;
        this.backCard = this.currentCard.backSide;

      } else {
        this.frontCard = this.currentCard.backSide;
        this.backCard = this.currentCard.frontSide;
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
