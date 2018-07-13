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
export class BundleService {

  private bundles: Bundle[] = [];


  constructor(private storage: Storage,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public http: Http) {

    this.initBundles();
  }


  bundlesAllGet(): Promise<Bundle[]> {
    return new Promise((resolve, reject) => {

      resolve(this.bundles);

    })
  }

  bundlesByLanguageIdGet(languageId: string): Promise<Bundle[]> {
    return new Promise((resolve, reject) => {
      let curBundles: Bundle[] = [];

      this.bundles.forEach((bundle) => {
        if (bundle.languageId == languageId) {
          curBundles.push(bundle);
        }
      })

      resolve(curBundles);
    })
  }

  bundleByBundleIdGet(bundleId: string): Promise<Bundle> {
    return new Promise((resolve, reject) => {
      
      this.bundles.forEach((bundle) => {
        if (bundle.id == bundleId) {
          resolve(bundle);
        }
      })

    })
  }


  private initBundles() {
    this.bundles = [];

    this.bundles.push(<Bundle>{ id: "esp-eng_1", languageId: "esp-eng", name: "test_1" });
    this.bundles.push(<Bundle>{ id: "esp-eng_2", languageId: "esp-eng", name: "test_2" });
    this.bundles.push(<Bundle>{ id: "esp-eng_3", languageId: "esp-eng", name: "test_3" });
    this.bundles.push(<Bundle>{ id: "esp-eng_4", languageId: "esp-eng", name: "test_4" });
    this.bundles.push(<Bundle>{ id: "esp-eng_5", languageId: "esp-eng", name: "test_5" });

    this.bundles.push(<Bundle>{ id: "esp-ger_1", languageId: "esp-ger", name: "test_1" });
    this.bundles.push(<Bundle>{ id: "esp-ger_2", languageId: "esp-ger", name: "test_2" });
    this.bundles.push(<Bundle>{ id: "esp-ger_3", languageId: "esp-ger", name: "test_3" });

    this.bundles.push(<Bundle>{ id: "ger-eng_1", languageId: "ger-eng", name: "test_1" });
    this.bundles.push(<Bundle>{ id: "ger-eng_2", languageId: "ger-eng", name: "test_2" });

  }
}
