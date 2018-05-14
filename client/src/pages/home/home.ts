import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { VocabProvider, User } from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import { ManageLanguagesPage } from "../manageLanguages/manageLanguages";
import {MainPage} from "../main/main";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'

})

export class HomePage {

  public unregisterBackButtonAction: any;
  private user: User = { userName: "Mock", languages: [] };

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider,
    public platform: Platform) {

    this.user = vocabProvider.getUser();
  }

  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
      this.customHandleBackButton();
    }, 10);
  }

  private customHandleBackButton(): void {
    this.platform.exitApp();
  }

  ionViewWillEnter() {
    this.vocabProvider.setCurrentLanguage("-1");
  }

  openManage() {
    this.navCtrl.setRoot(ManageLanguagesPage);
  }

  start(id: string) {
    this.vocabProvider.setCurrentLanguage(id);
    //this.navCtrl.setRoot(SelectStudyPage);
    this.navCtrl.setRoot(MainPage);
  }
}
