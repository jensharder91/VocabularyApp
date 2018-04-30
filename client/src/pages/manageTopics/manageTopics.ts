import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
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

  constructor(public vocabProvider: VocabProvider, private navCtrl: NavController, private alertCtrl: AlertController) {

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
}
