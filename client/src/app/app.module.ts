import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule, NavController} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { OverviewPage } from '../pages/overview/overview';
import { StudyPhasePage } from '../pages/studyPhase/studyPhase';
import { VocabProvider } from '../providers/vocab/vocab';
import {HomePage} from "../pages/home/home";

@NgModule({
  declarations: [
    MyApp,
    OverviewPage,
    StudyPhasePage,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OverviewPage,
    StudyPhasePage,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    VocabProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    VocabProvider
  ]
})
export class AppModule {}
