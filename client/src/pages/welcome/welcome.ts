import {Component, ViewChild} from '@angular/core';
import {NavController, Platform, Slides} from 'ionic-angular';
import {Language, User, VocabProvider} from "../../providers/vocab/vocab";
import 'rxjs/add/operator/map';
import {MainPage} from "../main/main";

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'

})

export class WelcomePage {

  @ViewChild('mySlider') slides: Slides;

  private username: string = "";
  private user: User = { userName: "Mock", languages: [], currentLanguageId:"" };

  public availableLanguages: Language[] = [];

  constructor(public navCtrl: NavController,
    public vocabProvider: VocabProvider,
    public platform: Platform) {

    // TODO LOCK SLIDES
    //this.slides.lockSwipeToNext(true);

    this.availableLanguages = this.vocabProvider.getAvaiableLanguages();
  }

  saveUser() {

    // Slide 1
    // Save username
    this.vocabProvider.saveUserName(this.username);
    // Change to next slide
    this.slides.slideNext(500, true);

    // Slide 2
    this.user = this.vocabProvider.getUser();
  }

  saveLanguage(id){
    console.log(id + "selected");
    this.vocabProvider.addLanguageToUser(id);
    this.slides.slideNext(500, true);
  }

  showPrevSlide(){

    this.slides.slidePrev(500, false);
  }

  start(){
    this.navCtrl.setRoot(MainPage);
  }

  test(){
    console.log('test');
  }
}
