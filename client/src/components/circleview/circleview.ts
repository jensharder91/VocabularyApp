import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'circleview-component',
  templateUrl: 'circleview.html'

})

export class CircleviewComponent {

  @Input("text") myText;
  @Input("image") myImage;

  constructor() {

  }

}
