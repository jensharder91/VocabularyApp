import { Pipe, PipeTransform } from '@angular/core';
import { Card } from '../../swagger/model/Card';

@Pipe({
  name: 'filterCardsPipe'
})
export class FilterCardsPipe implements PipeTransform {
  transform(cards: Card[], searchText: string): any[] {
    if (!cards) return [];
    if (!searchText) return cards;
    searchText = searchText.toLowerCase();
    return cards.filter(card => {
      return card.frontSide.toLowerCase().includes(searchText) || card.backSide.toLowerCase().includes(searchText);
    });
  }
}
