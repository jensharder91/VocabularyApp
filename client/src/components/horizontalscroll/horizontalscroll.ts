import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Item{
  name:string;
  shortName:string;
  image?:string;
}

@Component({
  selector: 'horizontalscroll-component',
  templateUrl: 'horizontalscroll.html'

})
export class HorizontalscrollComponent {

  @Input("items") myItems:Item[];
  @Output() clickEvent = new EventEmitter();

  constructor() {

  }

  itemClick(key:string){
    this.clickEvent.emit(key);
  }

}
