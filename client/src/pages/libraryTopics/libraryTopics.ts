import { Component } from '@angular/core';
import { AlertController, NavController, PopoverController, ToastController, ViewController, NavParams } from 'ionic-angular';
import { VocabProvider } from "../../providers/vocab/vocab";
import { MenuPopoverPage } from "../menuPopover/menuPopover";
import { VocabularyListPage } from "../vocabularyList/vocabularyList";
import { Card } from '../../../swagger/model/Card';
import { Topic } from '../../../swagger/model/Topic';
import { Language } from '../../../swagger/model/Language';
import { Bundle } from '../../../swagger/model/bundle';
import * as _ from 'lodash';


export interface ToggleTopic {
  state: boolean;
  originState: boolean;
  topic: Topic;
}

@Component({
  selector: 'page-manageTopics',
  templateUrl: 'libraryTopics.html'
})

export class LibraryTopicsPage {

  public toggleTopics: ToggleTopic[] = [];
  private curBundle: Bundle = <Bundle>{};

  constructor(public vocabProvider: VocabProvider,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
    private viewCtrl: ViewController,
    private navParams: NavParams) {


  }

  ionViewWillEnter() {
    let bundleId: string = this.navParams.get("bundleId");

    this.toggleTopics = [];
    this.curBundle = <Bundle>{};

    this.vocabProvider.getAvaiableBundleById(bundleId).then((bundle) => {
      this.curBundle = bundle;
    })

    this.vocabProvider.getTopicsByBundleId(bundleId).forEach(topic => {
      this.toggleTopics.push({ state: true, originState: true, topic: topic });
    });

    this.vocabProvider.getAvailableTopicsByBundleId(bundleId).then((topics) => {
      topics.forEach(topic => {
        let isActiveTopic: boolean = false;
        this.toggleTopics.forEach((toggleItem) => {
          if (toggleItem.topic.id == topic.id) {
            isActiveTopic = true;
          }
        });

        if (!isActiveTopic) {
          this.toggleTopics.push({ state: false, originState: false, topic: topic });
        }
      })
    })
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

  saveToggleChange(item) {

    // if (item.state) {
    //   this.saveNow();
    // } else {
    //   this.alertCtrl.create({
    //     title: 'Warning!',
    //     message: 'The topic ' + item.topic.name + ' including your progress will be removed.',
    //     buttons: [
    //       {
    //         text: 'Cancel',
    //         role: 'cancel',
    //         handler: () => {
    //           item.state = item.originState;
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

  editCustomTopic(toggleItem: ToggleTopic) {
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

  toggleFav(topicId: string) {
    let toggleTopic = _.find(this.toggleTopics, function(o) { return (o.topic.id == topicId); });
    if (toggleTopic.topic.favorite) {
      this.vocabProvider.removeTopicFromUser(topicId);
    } else {
      this.vocabProvider.addTopicToUser(toggleTopic.topic);
    }
  }

  showTopicCardDeck(topicId: string) {
    console.log("see all vocs from topic id: " + topicId)
    this.navCtrl.setRoot(VocabularyListPage, {
      mode: "topic",
      topicId: topicId
    });
  }
}
