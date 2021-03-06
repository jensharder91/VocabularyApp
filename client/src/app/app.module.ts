import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from "@ionic/storage";

import { MyApp } from './app.component';
import { VocabProvider } from '../providers/vocab/vocab';

import { OverviewPage } from '../pages/overview/overview';
import { StudyPhasePage } from '../pages/studyPhase/studyPhase';
import { HomePage } from "../pages/home/home";
import { VocabularyListPage } from "../pages/vocabularyList/vocabularyList";
import { HttpModule } from "@angular/http";

@NgModule({
  declarations: [
    MyApp,
    OverviewPage,
    StudyPhasePage,
    HomePage,
    VocabularyListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OverviewPage,
    StudyPhasePage,
    HomePage,
    VocabularyListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    VocabProvider,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
