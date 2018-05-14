import { Component } from '@angular/core';
import {
  AlertController, PopoverController, ToastController, NavController, NavParams,
  ViewController
} from 'ionic-angular';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';
import { VocabProvider, Language, Card } from "../../providers/vocab/vocab";

import { LibraryDecksPage } from "../libraryDecks/libraryDecks";
import { StudyPhasePage } from "../studyPhase/studyPhase";
import { SelectStudyPopoverPage } from "../selectStudyPopover/selectStudyPopover";
import { VocabularyListPage } from '../vocabularyList/vocabularyList';
import { MenuPopoverPage } from "../menuPopover/menuPopover";

@Component({
  selector: 'page-vocabBox',
  templateUrl: 'vocabBox.html'
})

export class VocabBoxPage {

  public language: Language;

  constructor(public alertCtrl: AlertController,
    public navCtrl: NavController,
    public vocabProvider: VocabProvider,
    public http: Http,
    private toastCtrl: ToastController) {

    this.language = vocabProvider.getCurrentLanguage();
  }

  showAllCards() {
    this.navCtrl.setRoot(VocabularyListPage);
  }

  studyDueCards() {
    let curCards: Card[] = this.vocabProvider.getCardsToLearn();

    if (curCards.length > 0) {
      this.navCtrl.setRoot(StudyPhasePage, {
        mode: "due"
      });
    } else {
      this.toastCtrl.create({
        message: 'No cards for learning left! Try again later.',
        duration: 3000,
        position: 'bottom'
      }).present();
    }
  }

  public addMultipleVocsToBox() {
    // TODO: switch to next possible topic in list
    if (this.language.topics.length > 0) {
      this.vocabProvider.addTenVocs(this.language.topics[0].name);
    } else {
      this.alertCtrl.create({
        title: 'No cards left to upload!',
        subTitle: 'Add more topics to your favorites to continue studying!',
        buttons: ['OK']
      }).present();
    }
  }

  addVocabulary(topic: string) {
    let prompt = this.alertCtrl.create({
      title: 'Create New Card',
      inputs: [
        {
          name: 'front',
          placeholder: this.language.name1
        },
        {
          name: 'back',
          placeholder: this.language.name2
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.vocabProvider.createCard(topic, data.front, data.back);
          }
        }
      ]
    });

    prompt.present();
  }

  openManage() {
    this.navCtrl.setRoot(LibraryDecksPage);
  }
}
