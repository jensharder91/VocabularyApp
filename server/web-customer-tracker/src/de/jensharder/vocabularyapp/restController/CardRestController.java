package de.jensharder.vocabularyapp.restController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import de.jensharder.vocabularyapp.model.Card;
import de.jensharder.vocabularyapp.service.CardService;

@RestController
@RequestMapping("/rest/card")
public class CardRestController {

	@Autowired
	private CardService cardService;

	@GetMapping("/getCardById")
	public Card showCardsByBundleId(@RequestParam("cardId") int cardId) {
		
		System.out.println("revieved call... cardId: "+cardId);

		Card card = cardService.getCardById(cardId);
		
		return card;
	}


}
