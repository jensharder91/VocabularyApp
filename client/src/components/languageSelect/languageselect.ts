import { Component, Input } from '@angular/core';

@Component({
  selector: 'languageselect-component',
  templateUrl: 'languageselect.html'

})

export class LanguageSelectComponent {

  @Input("lang1_text") lang1_text;
  @Input("lang2_text") lang2_text;
  @Input("lang1_image") lang1_image;
  @Input("lang2_image") lang2_image;

  constructor() {

  }

}
