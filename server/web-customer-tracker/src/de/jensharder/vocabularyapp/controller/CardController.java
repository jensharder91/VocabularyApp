package de.jensharder.vocabularyapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import de.jensharder.vocabularyapp.model.Card;
import de.jensharder.vocabularyapp.service.CardService;

@Controller
@RequestMapping("/card")
public class CardController {

	@Autowired
	private CardService cardService;

	@GetMapping("/show")
	public String showCardsByBundleId(@RequestParam("bundleId") int bundleId, Model model) {

		List<Card> cards = cardService.getCardsByBundleId(bundleId);
		model.addAttribute("cards", cards);
		model.addAttribute("bundleId", bundleId);

		return "list-cards";
	}

	@GetMapping("/addForm")
	public String showAddForm(@RequestParam("bundleId") int bundleId, Model model) {

		Card card = new Card();
		card.setBundleId(bundleId);
		model.addAttribute("card", card);

		return "form-card";
	}

	@GetMapping("/updateForm")
	public String showUpdateForm(@RequestParam("cardId") int cardId, Model model) {

		Card card = cardService.getCardById(cardId);
		model.addAttribute("card", card);

		return "form-card";
	}

	@PostMapping("/save")
	public String saveBundle(@ModelAttribute("card") Card card) {

		cardService.saveCard(card);
		return "redirect:/card/show?bundleId=" + card.getBundleId();
	}

	@GetMapping("/delete")
	public String deleteBundle(@RequestParam("cardId") int cardId, @RequestParam("bundleId") int bundleId,
			Model model) {

		cardService.deleteCardById(cardId);
		return "redirect:/card/show?bundleId=" + bundleId;
	}
	
	@GetMapping("/back")
	public String goBackToBundleList(@RequestParam("bundleId") int bundleId, Model model) {

		int groupId = cardService.getGroupIdByBundleId(bundleId);

		return "redirect:/bundle/show?groupId=" + groupId;
	}
}
