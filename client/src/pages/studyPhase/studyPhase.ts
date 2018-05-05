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
      this.markStringDiff(this.backCard, this.myInput);
      this.lcs(this.backCard, this.myInput);
    } else {
      this.markStringDiff(this.frontCard, this.myInput);
    }
  }

  // Mark differences between two strings
  markStringDiff(string1: string, string2: string){

    if (this.seeBackside) {

      // Indices of LCS
      let diff = this.lcs(string1, string2);

      // string as base of comparison
      let string;
      let stringIndex = 0;

      // choose longer string as base of comparison
      if (string1.length > string2.length) string = string1;
      else string = string2;

      // HTML element to write solution
      let solutionSpan = document.getElementById("solution");

      if (solutionSpan != null) {

        solutionSpan.innerHTML = '';
        for (let i = 0; i < string.length; i++){
          let newSpan = document.createElement('span');

          // matching character
          if (diff[i] == 1){
            newSpan.style.color = "#00df53";
            newSpan.innerHTML = string[stringIndex];
            stringIndex++;
          } else {
            // mark disjunct characters in red
            newSpan.style.color = "#f0513c";
            newSpan.style.textDecoration = "underline";
            if (string[stringIndex]) {
              newSpan.innerHTML = string[stringIndex];
              stringIndex++;
            }
            else newSpan.innerHTML = "_";
          }

          // add formatted control string to HTML
          solutionSpan.appendChild(newSpan);
        }

      } else {
        // reset solution field to blank
        this.resetSolution();
      }
    }
  }

  // Find Longest Common Subsequence and
  // return indices of common character positions
  lcs(string1:string, string2: string){

    let m = string1.length;
    let n = string2.length;

    let L = [];

    // dynamically compute LCS
    for (let i = 0; i <= m; i++) {
      L[i] = [];
      for (let j = 0; j <= n; j++) {
        if (i == 0 || j == 0){
          L[i][j] = 0;
        } else if (string1[i-1] == string2[j-1]) {
          L[i][j] = L[i - 1][j - 1] + 1;
        } else {
          L[i][j] = this.max(L[i - 1][j], L[i][j - 1]);
        }
      }
    }

    // Backtracking to find indices of LCS characters
    // initialise arrays to store indices
    let commonCharsIndices1 = [];
    let commonCharsIndices2 = [];
    for (let i = 0; i < m; i++) {
      commonCharsIndices1[i] = 0;
    }
    for (let i = 0; i < n; i++) {
      commonCharsIndices2[i] = 0;
    }

    // Start from the right-most-bottom-most corner
    // and one by one store character indices of lcs
    let i = m, j = n;
    while (i > 0 && j > 0) {
      // If current character in string1 and string2 are same,
      // then current character is part of LCS
      if (string1[i-1] == string2[j-1]) {
        // Add current index to result
        commonCharsIndices1[i-1] = 1;
        commonCharsIndices2[j-1] = 1;

        i--;
        j--;
      }

      // If not same, then find the larger of two
      // and go in the direction of larger value
      else if (L[i-1][j] > L[i][j-1]) i--;
      else j--;
    }

    // return longer sequence of indices
    if (m > n) return commonCharsIndices1;
    else return commonCharsIndices2;
  }

  // return maximum of two numbers
  max(a:number, b: number) {
    return (a > b)? a : b;
  }

  // reset HTML field for solution display
  resetSolution(){
    let solutionSpan = document.getElementById("solution");
    if (solutionSpan != null) solutionSpan.innerHTML = '&ensp;';
  }
}
