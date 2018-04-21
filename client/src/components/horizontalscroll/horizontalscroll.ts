import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VocabProvider } from "../../providers/vocab/vocab";

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
  @Input("mode") mode:string;
  @Output() clickEvent = new EventEmitter();

  constructor(public vocabProvider: VocabProvider) {

  }

  itemClick(key:any){
    this.clickEvent.emit(key);
  }

}
