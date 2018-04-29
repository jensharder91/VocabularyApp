import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { VocabProvider, Card } from "../providers/vocab/vocab";

import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { StudyPhasePage } from '../pages/studyPhase/studyPhase'
import { OverviewPage } from '../pages/overview/overview'
import { SelectStudyPage } from '../pages/selectStudy/selectStudy';
import { VocabularyListPage } from '../pages/vocabularyList/vocabularyList';
import { ManageTopicsPage } from '../pages/manageTopics/manageTopics';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SettingsPage;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public vocabProvider: VocabProvider, private toastCtrl: ToastController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }
      // { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      return this.vocabProvider.login();
    }).then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      console.log("logged in");
      this.nav.setRoot(HomePage);
    }).catch(() => {
      //error -> not logged in?
      console.log("error -> not logged in?");
    });
  }

  openHomePage() {
    this.nav.setRoot(HomePage);
  }

  openSelectStudyPage() {
    this.nav.setRoot(SelectStudyPage);
  }

  openSettingsPage() {
    this.nav.setRoot(SettingsPage);
  }

  showProgress() {
    this.nav.setRoot(OverviewPage);
  }

  manageTopics() {
    this.nav.setRoot(ManageTopicsPage);
  }

  showAllCards() {
    this.nav.setRoot(VocabularyListPage);
  }

  startLearning() {
    let curCards: Card[] = this.vocabProvider.getCardsToLearn();

    if (curCards.length > 0) {
      this.nav.setRoot(StudyPhasePage, {
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
}
