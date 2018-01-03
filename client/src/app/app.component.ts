import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import {VocabProvider} from "../providers/vocab/vocab";

import { OverviewPage } from '../pages/overview/overview';
import {HomePage} from "../pages/home/home";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;


  constructor(public sqlite: SQLite,
              platform: Platform,
              statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public vocabProvider: VocabProvider) {


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }


  /*
  private createDatabase(){
    this.sqlite.create({
      name: 'data.db',
      location: 'default' // the location field is required
    })
      .then((db) => {
        this.vocabProvider.setDatabase(db);
        return this.vocabProvider.createTable();
      })
      .then(() =>{
        this.splashScreen.hide();
        this.rootPage = 'HomePage';
      })
      .catch(error =>{
        console.error(error);
      });
  }

  */
}

