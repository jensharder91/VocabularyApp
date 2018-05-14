import { Component } from '@angular/core';
import {AlertController, NavController, PopoverController, ToastController} from 'ionic-angular';
import 'rxjs/add/operator/map';
import {VocabProvider, Language, Topic, Card} from "../../providers/vocab/vocab";
import { MenuPopoverPage } from "../menuPopover/menuPopover";
import {StudyPhasePage} from "../studyPhase/studyPhase";
import {VocabularyListPage} from "../vocabularyList/vocabularyList";

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})

export class FavoritesPage {

  public language: Language;
  private topics: Topic[];

  constructor(public vocabProvider: VocabProvider,
              public navCtrl: NavController,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController) {

    this.language = vocabProvider.getCurrentLanguage();
    this.topics = this.language.topics;
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

  showAllCards() {
    this.navCtrl.setRoot(VocabularyListPage);
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
}
