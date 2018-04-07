import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Card } from '../../model/card';
import { VocabProvider } from "../providers/vocab/vocab";

import { HomePage } from '../pages/home/home';
import { SettingsPage } from '../pages/settings/settings';
import { StudyPhasePage } from '../pages/studyPhase/studyPhase'
import { OverviewPage } from '../pages/overview/overview'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

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
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openHomePage() {
    this.nav.setRoot(HomePage);
  }

  openSettingsPage() {
    this.nav.setRoot(SettingsPage);
  }

  showProgress() {
    this.nav.setRoot(OverviewPage);
  }

  startLearning() {
    let curCards: Card[] = this.vocabProvider.getCardsToLearn();

    if (curCards.length > 0) {
      this.nav.setRoot(StudyPhasePage, {
        cards: curCards
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
