import { Component } from '@angular/core';
import {NavController, ViewController} from "ionic-angular";
import {SettingsPage} from "../settings/settings";

interface FilterItems {
  state:boolean;
  level: number;
}

@Component({
  selector: 'page-filterPopover',
  templateUrl: 'filterPopover.html'
})

export class FilterPopoverPage {

  private filterArray: FilterItems[] = [{state:true, level:1}, {state:true, level:2}, {state:true, level:3}, {state:true, level:4}, {state:true, level:5},{state:true, level:6}];

  constructor(private navCtrl:NavController, private viewCtrl: ViewController) {}

  saveFilter(){
    this.viewCtrl.dismiss(this.filterArray);
  }

  openSettingsPage() {
    this.viewCtrl.dismiss().then(() => {
      this.navCtrl.setRoot(SettingsPage);
    });
  }
}
