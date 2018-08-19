import { Component } from '@angular/core';
import { AlertController, NavController, PopoverController, ToastController, ViewController, NavParams } from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";
import { MenuPopoverPage } from "../menuPopover/menuPopover";
import { VocabularyListPage } from "../vocabularyList/vocabularyList";
import { Card } from '../../../swagger/model/Card';
import { Bundle } from '../../../swagger/model/Bundle';
import { Language } from '../../../swagger/model/Language';
import { LibraryTopicsPage } from '../libraryTopics/libraryTopics';
import * as _ from 'lodash';


export interface ToggleBundle {
  state: boolean;
  originState: boolean;
  bundle: Bundle;
}

@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html'
})

export class FavoritesPage {

    public toggleBundles: ToggleBundle[] = [];
    private favoritesOnly: boolean = false;

    constructor(public vocabProvider: VocabProvider,
      private navCtrl: NavController,
      private alertCtrl: AlertController,
      private toastCtrl: ToastController,
      private popoverCtrl: PopoverController,
      private viewCtrl: ViewController,
      private navParams: NavParams) {


    }

    ionViewWillEnter() {

      this.toggleBundles = [];

      this.vocabProvider.getBundlesFromCurrentLanguage().forEach(bundle => {
        this.toggleBundles.push({ state: true, originState: true, bundle: bundle });
      });
    }

    save() {

      //// TODO:
      console.log("save clicked");

      // let deleteTopicList: Topic[] = [];
      // this.toggleItems.forEach(toggleItem => {
      //   if (toggleItem.originState && !toggleItem.state) {
      //     deleteTopicList.push(toggleItem.topic);
      //   }
      // });
      //
      // let topicList: string = "";
      // deleteTopicList.forEach((topic) => {
      //   topicList += topic.name + " ";
      // });
      //
      // if (deleteTopicList.length == 0) {
      //   this.saveNow();
      // } else {
      //   this.alertCtrl.create({
      //     title: 'Warning!',
      //     message: 'The following topics incl. your progress will be removed: ' + topicList + '.',
      //     buttons: [
      //       {
      //         text: 'Cancel',
      //         role: 'cancel',
      //         handler: () => {
      //           console.log('Cancel clicked');
      //         }
      //       },
      //       {
      //         text: 'Okay',
      //         handler: () => {
      //           this.saveNow();
      //         }
      //       }
      //     ]
      //   }).present();
      // }

    }

    // saveToggleChange(item:ToggleBundle) {
    //
    //   if (!item.state) {
    //     this.vocabProvider.addBundleToUser(item.bundle);
    //     item.state = true;
    //   } else {
    //     this.alertCtrl.create({
    //       title: 'Warning!',
    //       message: 'The bundle ' + item.bundle.name + ' including your progress will be removed.',
    //       buttons: [
    //         {
    //           text: 'Cancel',
    //           role: 'cancel',
    //           handler: () => {
    //             item.state = item.originState;
    //           }
    //         },
    //         {
    //           text: 'Okay',
    //           handler: () => {
    //             this.vocabProvider.removeBundleFromUser(item.bundle.id);
    //             item.state = false;
    //           }
    //         }
    //       ]
    //     }).present();
    //   }
    //
    // }

    // saveNow() {
    //   let newTopicList: Topic[] = [];
    //   this.toggleItems.forEach(toggleItem => {
    //     if (toggleItem.state) {
    //       newTopicList.push(toggleItem.topic);
    //     }
    //   });
    //   //TODO
    //   // this.vocabProvider.addContentToUser(this.vocabProvider.getCurrentLanguage().id, newTopicList);
    // }

    addCustomTopic() {
      // this.alertCtrl.create({
      //   title: 'Create Topic',
      //   message: "Enter a new name for your topic!",
      //   inputs: [
      //     {
      //       name: 'name'
      //     }
      //   ],
      //   buttons: [
      //     {
      //       text: 'Cancel',
      //       handler: data => {
      //         console.log('Cancel clicked');
      //       }
      //     },
      //     {
      //       text: 'Save',
      //       handler: data => {
      //         let rnd = Math.floor((Math.random() * 10000) + 1);
      //         this.toggleItems.push(<ToggleItem>{ state: true, originState: false, topic: <Topic>{ id: "_" + data.name + rnd, name: data.name, customTopic: true, cards: [], waitingCards: [] } });
      //       }
      //     }
      //   ]
      // }).present();
    }

    editCustomTopic(toggleItem: ToggleBundle) {
      // if (!toggleItem.topic.customTopic) {
      //   this.toastCtrl.create({
      //     message: 'Default topics can not be edited.',
      //     duration: 2000,
      //     position: 'bottom'
      //   }).present();
      // } else {
      //   this.alertCtrl.create({
      //     title: 'Create Topic',
      //     message: "Enter a new name for your topic!",
      //     inputs: [
      //       {
      //         name: 'name',
      //         value: toggleItem.topic.name
      //       }
      //     ],
      //     buttons: [
      //       {
      //         text: 'Cancel',
      //         handler: data => {
      //           console.log('Cancel clicked');
      //         }
      //       },
      //       {
      //         text: 'Save',
      //         handler: data => {
      //           toggleItem.topic.name = data.name;
      //         }
      //       }
      //     ]
      //   }).present();
      // }
    }

    toggleFav(bundleId: string) {
      let toggleBundle = _.find(this.toggleBundles, function(o) { return (o.bundle.id == bundleId); });
      if (toggleBundle.bundle.favorite) {
        this.vocabProvider.removeBundleFromUser(bundleId);
      } else {
        this.vocabProvider.addBundleToUser(toggleBundle.bundle);
      }
    }

    showTopicCardDecks(bundleId: string) {
      this.navCtrl.setRoot(LibraryTopicsPage, {
        bundleId: bundleId
      });
    }

  }
