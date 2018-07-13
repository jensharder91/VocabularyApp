import { Component } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';

import { VocabProvider } from "../../providers/vocab/vocab";
import { MainPage } from "../main/main";
import { User } from '../../../swagger/model/User';
import { Language } from '../../../swagger/model/Language';


export interface ToggleItem {
  state: boolean;
  originState: boolean;
  language: Language;
}

@Component({
  selector: 'settings',
  templateUrl: 'settings.html'

})


export class SettingsPage {

  private username: string = "";
  private user: User = { userId: "_mock", userName: "Mock", languages: [], currentLanguageId: "" };

  public toggleItems: ToggleItem[] = [];
  private languageID: string;

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider,
    public alertCtrl: AlertController) {

    this.username = vocabProvider.getUserName();
    this.user = vocabProvider.getUser();

    this.user.languages.forEach(language => {
      this.toggleItems.push({ state: true, originState: true, language: language });
    });

    vocabProvider.getAvaiableLanguages().then((languages) => {
      languages.forEach(language => {
        let isActiveLanguage: boolean = false;
        this.toggleItems.forEach((toggleItem) => {
          if (toggleItem.language.id == language.id) {
            isActiveLanguage = true;
          }
        });

        if (!isActiveLanguage) {
          this.toggleItems.push({ state: false, originState: false, language: language });
        }
      });
    });
  }

  save() {

    // Save username
    this.vocabProvider.saveUserName(this.username);

    // Save current language
    this.vocabProvider.setCurrentLanguage(this.languageID);
    console.log(this.vocabProvider.getCurrentLanguage().id);

    // Save number of cards per upload

    // Save notifications

    // Return to main page (vocabulary box)
    this.navCtrl.setRoot(MainPage);
  }

  saveAvailableLanguages(item) {
    if (item.state) {
      if (!(this.user.languages.indexOf(item.language) > -1)) {
        this.vocabProvider.addLanguageToUser(item.language.id);
      }
    } else {
      this.alertCtrl.create({
        title: 'Warning!',
        message: 'The language ' + item.language.id + ' including your progress will be removed.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              item.state = item.originState;
            }
          },
          {
            text: 'Okay',
            handler: () => {
              this.vocabProvider.removeLanguageFromUser(item.language.id)
            }
          }
        ]
      }).present();
    }
  }

}
