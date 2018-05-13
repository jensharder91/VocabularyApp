import { Component } from '@angular/core';
import {NavController, ViewController} from "ionic-angular";
import {SettingsPage} from "../settings/settings";

@Component({
  selector: 'page-menuPopover',
  templateUrl: 'menuPopover.html'
})

export class MenuPopoverPage {

  constructor(private navCtrl:NavController, private viewCtrl: ViewController) {}

  openSettingsPage() {
    this.viewCtrl.dismiss().then(() => {
      this.navCtrl.setRoot(SettingsPage);
    });
  }
}
