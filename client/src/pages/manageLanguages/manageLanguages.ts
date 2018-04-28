import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { VocabProvider, Language, Topic } from "../../providers/vocab/vocab";
import { HomePage } from '../home/home'


export interface ToggleItem {
  state: boolean;
  originState: boolean;
  language: Language;
}

@Component({
  selector: 'page-manageLanguages',
  templateUrl: 'manageLanguages.html'
})

export class ManageLanguagesPage {

  public toggleItems: ToggleItem[] = [];

  constructor(public vocabProvider: VocabProvider, private navCtrl: NavController, private alertCtrl: AlertController) {

    vocabProvider.getUser().languages.forEach(language => {
      this.toggleItems.push({ state: true, originState: true, language: language });
    });

    vocabProvider.getAvaiableLanguages().forEach(language => {
      let isActiveLanguage: boolean = false;
      this.toggleItems.forEach((toggleItem) => {
        if (toggleItem.language.id == language.id) {
          isActiveLanguage = true;
        }
      });

      if (!isActiveLanguage) {
        this.toggleItems.push({ state: false, originState: false, language: language });
      }
    })
  }

  save() {

    let deleteLanguageList: Language[] = [];
    this.toggleItems.forEach(toggleItem => {
      if (toggleItem.originState && !toggleItem.state) {
        deleteLanguageList.push(toggleItem.language);
      }
    });

    let languageList: string = "";
    deleteLanguageList.forEach((language) => {
      languageList += language.shortName1 + "/" + language.shortName2 + "  ";
    });

    if (deleteLanguageList.length == 0) {
      this.saveNow();
    } else {
      this.alertCtrl.create({
        title: 'Warning!',
        message: 'The following languages incl. your progress will be removed: ' + languageList + '.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Okay',
            handler: () => {
              this.saveNow();
            }
          }
        ]
      }).present();
    }

  }

  saveNow() {
    let newLanguageList: Language[] = [];
    this.toggleItems.forEach(toggleItem => {
      if (toggleItem.state) {
        newLanguageList.push(toggleItem.language);
      }
    });
    this.vocabProvider.addLanguagesToUser(newLanguageList);
    this.navCtrl.setRoot(HomePage);
  }
}
