package de.jensharder.vocabularyapp.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.apache.commons.io.IOUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import de.jensharder.vocabularyapp.model.Card;
import de.jensharder.vocabularyapp.service.CardService;
import de.jensharder.vocabularyapp.utils.FileHelper;

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

	@PostMapping("/uploadList")
	public String handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam("bundleId") int bundleId) {

		System.out.println("uloaded file!  " + file.getOriginalFilename());

		try {
			// TODO read and process
			String content = new String(file.getBytes());
			System.out.println(content);

			for (int i = 0; i < 25; i++) {
				Card card = new Card();
				card.setQuestion("question " + i);
				card.setAnswer("answer " + i);
				card.setBundleId(6);
				cardService.saveCard(card);
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return "redirect:/card/show?bundleId=" + bundleId;
	}

	@GetMapping("/downloadList")
	public ResponseEntity<byte[]> getPDF(@RequestParam("bundleId") int bundleId) {

		// get content
		List<Card> cards = cardService.getCardsByBundleId(bundleId);

		byte[] contents = FileHelper.genPdfFromCards(cards);

		if (contents == null) {
			return null;
		}

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.parseMediaType("application/pdf"));
		String filename = "output.pdf";
		headers.setContentDispositionFormData(filename, filename);
		headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
		ResponseEntity<byte[]> response = new ResponseEntity<byte[]>(contents, headers, HttpStatus.OK);
		return response;
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
