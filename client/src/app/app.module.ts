import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule, NavController} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MainPagePage } from '../pages/mainPage/mainPage';
import { VocabProvider } from '../providers/vocab/vocab';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MainPagePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MainPagePage
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
