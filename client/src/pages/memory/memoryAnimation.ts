import { Injectable, ElementRef, QueryList } from '@angular/core';
import * as _ from 'lodash';



@Injectable()
export class MemoryAnimationService {


  correctAnimation(containerA: ElementRef, containerB: ElementRef): Promise<any> {

    console.log("correct Animation");

    return new Promise((resolve, reject) => {

      let allAnimationPromises: Array<Promise<any>> = [];

      //animate and push the promise in array
      allAnimationPromises.push(this.rotateAndDisapear(containerA));
      allAnimationPromises.push(this.rotateAndDisapear(containerB));

      //resolve, when all promises are resolved
      Promise.all(allAnimationPromises).then(resolve).catch(reject);

    });
  }

  wrongAnimation(containerA: ElementRef, containerB: ElementRef): Promise<any> {

    console.log("wrong Animation");

    return new Promise((resolve, reject) => {

      let allAnimationPromises: Array<Promise<any>> = [];

      //animate and push the promise in array
      allAnimationPromises.push(this.shake(containerA));
      allAnimationPromises.push(this.shake(containerB));

      //resolve, when all promises are resolved
      Promise.all(allAnimationPromises).then(resolve).catch(reject);

    });
  }

  private rotateAndDisapear(cardItem: ElementRef): Promise<any> {
    return new Promise(function(resolve, reject) {
      console.log("#1");
      try {
        cardItem.nativeElement.animate([
          { opacity: 1, backgroundColor: 'orange', transform: 'rotateY(0)', offset: 0 },
          { opacity: 1, transform: 'rotateY(180deg)', offset: 0.5 },
          { opacity: 1, transform: 'rotateY(270deg)', offset: 0.6 },
          { opacity: 0.8, transform: 'rotateY(380deg)', offset: 0.7 },
          { opacity: 0.6, transform: 'rotateY(510deg)', offset: 0.8 },
          { opacity: 0.4, transform: 'rotateY(660deg)', offset: 0.9 },
          { opacity: 0.1, backgroundColor: '#00df53', transform: 'rotateY(850deg)', offset: 1 }
        ], {
            // duration: 1000,
            duration: 1000,
            // easing: 'ease'
            easing: 'linear'
          }).onfinish = function() {
            resolve();
          };
      } catch (e) {
        console.log("aniamtion error");
        reject(e);
      }
    })
  }

  private shake(cardItem: ElementRef): Promise<any> {
    return new Promise(function(resolve, reject) {
      console.log("#2");
      try {
        cardItem.nativeElement.animate([
          { backgroundColor: 'orange', transform: 'translateX(0) translateY(0)', offset: 0 },
          { transform: 'translateX(-10px) translateY(0)', offset: 0.1 },
          { transform: 'translateX(10px) translateY(0)', offset: 0.2 },
          { transform: 'translateX(-10px) translateY(0)', offset: 0.3 },
          { transform: 'translateX(10px) translateY(0)', offset: 0.4 },
          { transform: 'translateX(-10px) translateY(0)', offset: 0.5 },
          { transform: 'translateX(10px) translateY(0)', offset: 0.6 },
          { transform: 'translateX(-10px) translateY(0)', offset: 0.7 },
          { transform: 'translateX(10px) translateY(0)', offset: 0.8 },
          { transform: 'translateX(-10px) translateY(0)', offset: 0.9 },
          { backgroundColor: '#f0513c', transform: 'translateX(0) translateY(0)', offset: 1 }
        ], {
            // duration: 1000,
            duration: 500,
            // easing: 'ease'
            easing: 'linear'
          }).onfinish = function() {
            resolve();
          };
      } catch (e) {
        console.log("aniamtion error");
        reject(e);
      }
    })
  }
}
