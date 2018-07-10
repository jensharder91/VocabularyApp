import { Component } from '@angular/core';
import {NavController, Platform, PopoverController} from 'ionic-angular';
import 'rxjs/add/operator/map';
import { VocabBoxPage } from "../vocabBox/vocabBox";
import { LibraryDecksPage } from "../libraryDecks/libraryDecks";
import { VocabProvider } from "../../providers/vocab/vocab";
import {FavoritesPage} from "../favorites/favorites";
import {MenuPopoverPage} from "../menuPopover/menuPopover";
import { Card } from '../../../swagger/model/Card';
import { User } from '../../../swagger/model/User';
import { Language } from '../../../swagger/model/Language';


@Component({
  selector: 'page-main',
  templateUrl: 'main.html'

})

export class MainPage {

  private tab1Root;
  private tab2Root;
  private tab3Root;

  public language: Language;
  private searchBtnClicked: boolean = false;
  private mySearchInput: string;

  constructor(public navCtrl: NavController,
              public vocabProvider: VocabProvider,
              public platform: Platform,
              public popoverCtrl: PopoverController) {

    this.language = vocabProvider.getCurrentLanguage();
    this.tab1Root = VocabBoxPage;
    this.tab2Root = FavoritesPage;
    this.tab3Root = LibraryDecksPage;
  }

  openSearchbar(){
    this.searchBtnClicked = true;
  }

  onSearchInput(event){
    console.log(this.mySearchInput);
  }

  onSearchCancel(event){
    this.searchBtnClicked = false;
  }

  presentMenuPopover(event) {
    let popover = this.popoverCtrl.create(MenuPopoverPage);
    popover.present({
      ev: event
    });
  }
}
