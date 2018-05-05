import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, ToastController } from 'ionic-angular';
import { VocabProvider, Language, Topic } from "../../providers/vocab/vocab";
import { SelectStudyPage } from '../selectStudy/selectStudy'


export interface ToggleItem {
  state: boolean;
  originState: boolean;
  topic: Topic;
}

@Component({
  selector: 'page-manageTopics',
  templateUrl: 'manageTopics.html'
})

export class ManageTopicsPage {

  public toggleItems: ToggleItem[] = [];

  constructor(public vocabProvider: VocabProvider, private navCtrl: NavController, private alertCtrl: AlertController, private toastCtrl: ToastController) {

    vocabProvider.getCurrentLanguage().topics.forEach(topic => {
      this.toggleItems.push({ state: true, originState: true, topic: topic });
    });

    vocabProvider.getAvailableContent(vocabProvider.getCurrentLanguage().id).forEach(topic => {
      let isActiveTopic: boolean = false;
      this.toggleItems.forEach((toggleItem) => {
        if (toggleItem.topic.id == topic.id) {
          isActiveTopic = true;
        }
      });

      if (!isActiveTopic) {
        this.toggleItems.push({ state: false, originState: false, topic: topic });
      }
    })
  }

  save() {

    let deleteTopicList: Topic[] = [];
    this.toggleItems.forEach(toggleItem => {
      if (toggleItem.originState && !toggleItem.state) {
        deleteTopicList.push(toggleItem.topic);
      }
    });

    let topicList: string = "";
    deleteTopicList.forEach((topic) => {
      topicList += topic.name + " ";
    });

    if (deleteTopicList.length == 0) {
      this.saveNow();
    } else {
      this.alertCtrl.create({
        title: 'Warning!',
        message: 'The following topics incl. your progress will be removed: ' + topicList + '.',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Okay',
            handler: () => {
              this.saveNow();
            }
          }
        ]
      }).present();
    }

  }

  saveNow() {
    let newTopicList: Topic[] = [];
    this.toggleItems.forEach(toggleItem => {
      if (toggleItem.state) {
        newTopicList.push(toggleItem.topic);
      }
    });
    this.vocabProvider.addContentToUser(this.vocabProvider.getCurrentLanguage().id, newTopicList);
    this.navCtrl.setRoot(SelectStudyPage);
  }

  addCustomTopic() {
    this.alertCtrl.create({
      title: 'Create Topic',
      message: "Enter a new name for your topic!",
      inputs: [
        {
          name: 'name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            let rnd = Math.floor((Math.random() * 10000) + 1);
            this.toggleItems.push(<ToggleItem>{ state: true, originState: false, topic: <Topic>{ id: "_" + data.name + rnd, name: data.name, customTopic: true, cards: [], waitingCards: [] } });
          }
        }
      ]
    }).present();
  }

  editCustomTopic(toggleItem: ToggleItem) {
    if (!toggleItem.topic.customTopic) {
      this.toastCtrl.create({
        message: 'Default topics can not be edited.',
        duration: 2000,
        position: 'bottom'
      }).present();
    } else {
      this.alertCtrl.create({
        title: 'Create Topic',
        message: "Enter a new name for your topic!",
        inputs: [
          {
            name: 'name',
            value: toggleItem.topic.name
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Save',
            handler: data => {
              toggleItem.topic.name = data.name;
            }
          }
        ]
      }).present();
    }
  }
}
