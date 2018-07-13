import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";
import { AlertController, ToastController } from "ionic-angular";
import * as papa from 'papaparse';
import { Http } from "@angular/http";
import { Card } from '../../../swagger/model/Card';
import { Bundle } from '../../../swagger/model/Bundle';
import { Topic } from '../../../swagger/model/Topic';
import { User } from '../../../swagger/model/User';
import { Language } from '../../../swagger/model/Language';


@Injectable()
export class LanguageService {


  constructor(private storage: Storage,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public http: Http) {

  }


  languagesAllGet():Promise<Language[]>{
    return new Promise((resolve, reject)=>{

      let languages: Language[] = [];
      languages.push(<Language>{ id: "esp-eng", name1: "Spanish", shortName1: "ESP", image1: "assets/imgs/home/spain.svg", name2: "English", shortName2: "ENG", image2: "assets/imgs/home/gb.svg" });
      languages.push(<Language>{ id: "esp-ger", name1: "Spanish", shortName1: "ESP", image1: "assets/imgs/home/spain.svg", name2: "German", shortName2: "GER", image2: "assets/imgs/home/german.svg" });
      languages.push(<Language>{ id: "ger-eng", name1: "German", shortName1: "GER", image1: "assets/imgs/home/german.svg", name2: "English", shortName2: "ENG", image2: "assets/imgs/home/gb.svg" });

      resolve(languages);
    })
  }
}
