import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'circleview-component',
  templateUrl: 'circleview.html'

})

export class CircleviewComponent {

  @Input("key") myKey;
  @Input("text") myText;
  @Input("subtext") mySubtext;
  @Input("image") myImage;
  @Input("disabled") disabled = false;
  @Input("showFavIcon") showFavIcon = false;
  @Input("favOption") favOption: boolean = false;
  @Output() favClickEvent = new EventEmitter();
  @Output() itemClickEvent = new EventEmitter();

  constructor() {

  }

  favClick(key: any) {
    this.favClickEvent.emit(key);
    console.log("favClickEvent");
  }

  itemClick(key: any) {
    this.itemClickEvent.emit(key);
    console.log("itemClickEvent");
  }
}
