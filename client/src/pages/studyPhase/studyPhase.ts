import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";
import { OverviewPage } from "../overview/overview";

@Component({
  selector: 'page-studyPhase',
  templateUrl: 'studyPhase.html'
})

export class StudyPhasePage {

  currentCard: any;
  frontCard: String;
  backCard: String;
  currentCardDeck: any;
  level: number;

  input_value: String;

  counter: number = 0; //Pay attention: Level 1 in the UI is level 0 for the developer due to 0-based array

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              public vocabProvider: VocabProvider) {

    this.level = navParams.get('level');
    this.currentCardDeck = this.vocabProvider.getCardDeck(this.vocabProvider.dict, this.level);
    this.currentCardDeck = this.shuffle(this.currentCardDeck);
    this.currentCard = this.currentCardDeck[this.counter];
    this.randCardSide();
  }

  showVocab(id){

    let levelsCounters = this.vocabProvider.levelsCounters;
    let currentVocab = this.currentCardDeck[this.counter];

    if (id == "known") { // Correct
      console.log(currentVocab.level);
      // Remove card from currently assigned level
      if (levelsCounters[currentVocab.level] > 0 && currentVocab.level < 5) {
        levelsCounters[currentVocab.level]--;
      }

      // Update card level to next level
      if (currentVocab.level < 5) {
        currentVocab.level++;
        levelsCounters[currentVocab.level]++;
      }
    } else { // Wrong

      // Delete card from previously assigned level
      if(levelsCounters[currentVocab.level] > 0){
        levelsCounters[currentVocab.level]--;
      }

      // Assign card to level 1
      levelsCounters[0]++;
      currentVocab.level = 0;
    }

    // store changes
    this.vocabProvider.levelsCounters = levelsCounters;
    this.vocabProvider.storeDict();

    // reset input field
    this.input_value = null;

    // show next card
    this.nextCard();
  }

  nextCard(){

    if (this.counter == this.currentCardDeck.length - 1) {


      let prompt = this.alertCtrl.create({
        title: 'All done!',
        message: "Congratulations! You studied all cards of this level.",
        buttons: [
          {
            text: 'Try again',
            handler: data => {
              this.counter = 0;
            }
          },
          {
            text: 'Go Back',
            handler: data => {
              this.navCtrl.pop();
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

    let card = document.getElementsByClassName("card")[0];
    card.classList.toggle("flipped");
  }
}
