import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { VocabProvider, Card } from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import { SelectStudyPage } from "../selectStudy/selectStudy";
import { ManageLanguagesPage } from "../manageLanguages/manageLanguages";


export interface MemoryCard {
  selected: boolean;
  showFront: boolean;
  dummy: boolean;
  card: Card;
}

@Component({
  selector: 'page-memory',
  templateUrl: 'memory.html'

})

export class MemoryPage {

  private source: Card[] = [];

  private activeCards: Card[] = [];
  private memoryCards: MemoryCard[] = [];
  private clickBlocked: boolean = false;
private dummyCounter:number = 0;

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider) {

    this.source = vocabProvider.getCardDeckAll();

    if (this.source.length < 1) {
      this.navCtrl.setRoot(SelectStudyPage);
    }

    this.fillActiveCards();
    while (this.memoryCards.length < 9) {
      this.memoryCards.push(this.getNewMemoryCard());
    }

  }

  fillActiveCards() {
    while (this.activeCards.length < 8 && this.source.length > 0) {
      let rand = Math.floor(Math.random() * Math.floor(this.source.length));

      this.activeCards.push(this.source[rand]);
      this.source.splice(rand, 1);
    }
  }

  getNewMemoryCard(): MemoryCard {
    this.activeCards = this.shuffle(this.activeCards);
    let counter: number = 0;
    let restarted:boolean = false;
    let memoryCardToReturn: MemoryCard;

    while (!memoryCardToReturn && this.activeCards.length > 0) {

      let card = this.activeCards[counter];

      let existFront: boolean = false;
      let existBack: boolean = false;

      this.memoryCards.forEach(memoryCard => {
        if (memoryCard.card.backSide == card.backSide && memoryCard.card.frontSide == card.frontSide && memoryCard.showFront) {
          existFront = true;
        }
        if (memoryCard.card.backSide == card.backSide && memoryCard.card.frontSide == card.frontSide && !memoryCard.showFront) {
          existBack = true;
        }
      });

      if (!existFront) {
        memoryCardToReturn = <MemoryCard>{ card: card, showFront: true };
      } else if (!existBack) {
        memoryCardToReturn = <MemoryCard>{ card: card, showFront: false };
      }

      counter++;
      if (counter >= this.activeCards.length) {
        counter = 0;
        if(restarted){
          if (!memoryCardToReturn) {
            memoryCardToReturn = <MemoryCard>{ card: <Card>{ frontSide: "string", backSide: "string" }, showFront: false, dummy: true };
            this.dummyCounter++;
          }
        }
        restarted = true;
      }
    }

    if (!memoryCardToReturn) {
      memoryCardToReturn = <MemoryCard>{ card: <Card>{ frontSide: "string", backSide: "string" }, showFront: false, dummy: true };
      this.dummyCounter++;
    }

    if (this.dummyCounter > 8) {
      this.navCtrl.setRoot(SelectStudyPage);
    }

    return memoryCardToReturn;
  }

  getMemoryCard(index): MemoryCard {
    let card: MemoryCard = this.memoryCards[index - 1];
    return card;
  }

  clickCard(index) {
    if (this.clickBlocked || this.memoryCards[index - 1].dummy) {
      return;
    }
    this.clickBlocked = true;

    this.memoryCards[index - 1].selected = !this.memoryCards[index - 1].selected;

    let selectedCards: MemoryCard[] = [];
    this.memoryCards.forEach(card => {
      if (card.selected) {
        selectedCards.push(card);
      }
    });
    if (selectedCards.length == 2) {
      setTimeout(() => {
        this.verify(selectedCards[0], selectedCards[1]);
      }, 1000)
    } else {
      this.clickBlocked = false;
    }
  }

  verify(cardA: MemoryCard, cardB: MemoryCard) {
    if (cardA.card.frontSide == cardB.card.frontSide && cardA.card.backSide == cardB.card.backSide) {
      let indexOfActiveCard: number = -1;
      for (let i = 0; i < this.activeCards.length; i++) {
        console.log("i ", i);
        console.log("this.activeCards.length ", this.activeCards.length);
        console.log("this.activeCards[i] ", this.activeCards[i]);
        if (this.activeCards[i].frontSide == cardB.card.frontSide && this.activeCards[i].backSide == cardB.card.backSide) {
          indexOfActiveCard = i;
        }
      }
      //increase level of correct card (ONLY UP TO LEVEL 2)
      this.vocabProvider.increaseCardLevelMax(this.activeCards[indexOfActiveCard], 2);

      //remove card and get new one
      if (indexOfActiveCard > -1) {
        this.activeCards.splice(indexOfActiveCard, 1);
        this.fillActiveCards();
      }

      let indexA = this.memoryCards.indexOf(cardA);
      if (indexA > -1) {
        let newCard: MemoryCard = this.getNewMemoryCard();
        this.memoryCards.splice(indexA, 1, newCard);
      }

      let indexB = this.memoryCards.indexOf(cardB);
      if (indexB > -1) {
        let newCard: MemoryCard = this.getNewMemoryCard();
        this.memoryCards.splice(indexB, 1, newCard);
      }
    } else {
      cardA.selected = false;
      cardB.selected = false;
    }

    this.clickBlocked = false;
    if (this.dummyCounter > 8) {
      this.navCtrl.setRoot(SelectStudyPage);
    }
  }

  shuffle(list: Array<any>): Array<any> {
    var j, x, i;
    for (i = list.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = list[i];
      list[i] = list[j];
      list[j] = x;
    }
    return list;
  }

}
