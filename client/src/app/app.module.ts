import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from "@ionic/storage";

import { MyApp } from './app.component';
import { VocabProvider } from '../providers/vocab/vocab';
import { TopicService } from '../providers/servermock/topicService';
import { BundleService } from '../providers/servermock/bundleService';
import { LanguageService } from '../providers/servermock/languageService';

import { StudyPhasePage } from '../pages/studyPhase/studyPhase';
import { HomePage } from "../pages/home/home";
import { LibraryDecksPage } from "../pages/libraryDecks/libraryDecks";
import { LibraryTopicsPage } from "../pages/libraryTopics/libraryTopics";
import { ManageLanguagesPage } from "../pages/manageLanguages/manageLanguages";
import { SettingsPage } from "../pages/settings/settings";
import { VocabularyListPage } from "../pages/vocabularyList/vocabularyList";
import { HttpModule } from "@angular/http";
import { VocabBoxPage } from "../pages/vocabBox/vocabBox";

import {CircleviewComponent} from '../components/circleview/circleview';
import {LanguageSelectComponent} from '../components/languageselect/languageselect';
import {HorizontalscrollComponent} from '../components/horizontalscroll/horizontalscroll';
import {SelectStudyPopoverPage} from "../pages/selectStudyPopover/selectStudyPopover";
import {MainPage} from "../pages/main/main";
import {FavoritesPage} from "../pages/favorites/favorites";
import {MenuPopoverPage} from "../pages/menuPopover/menuPopover";
import {Welcome1Page} from "../pages/welcome/welcome1";
import {Welcome2Page} from "../pages/welcome/welcome2";
import {Welcome3Page} from "../pages/welcome/welcome3";


@NgModule({
  declarations: [
    MyApp,
    StudyPhasePage,
    Welcome1Page,
    Welcome2Page,
    Welcome3Page,
    VocabBoxPage,
    SelectStudyPopoverPage,
    MenuPopoverPage,
    HomePage,
    MainPage,
    LibraryDecksPage,
    LibraryTopicsPage,
    ManageLanguagesPage,
    FavoritesPage,
    SettingsPage,
    VocabularyListPage,
    CircleviewComponent,
    LanguageSelectComponent,
    HorizontalscrollComponent
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
    Welcome1Page,
    Welcome2Page,
    Welcome3Page,
    StudyPhasePage,
    VocabBoxPage,
    MainPage,
    MenuPopoverPage,
    FavoritesPage,
    SelectStudyPopoverPage,
    HomePage,
    LibraryDecksPage,
    LibraryTopicsPage,
    ManageLanguagesPage,
    SettingsPage,
    VocabularyListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    VocabProvider,
    TopicService,
    BundleService,
    LanguageService,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
