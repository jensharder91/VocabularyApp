import { Component, Input } from '@angular/core';

@Component({
  selector: 'circleview-component',
  templateUrl: 'circleview.html'

})

export class CircleviewComponent {

  @Input("text") myText;
  @Input("subtext") mySubtext;
  @Input("image") myImage;
  @Input("disabled") disabled = false;

  constructor() {

  }

}
