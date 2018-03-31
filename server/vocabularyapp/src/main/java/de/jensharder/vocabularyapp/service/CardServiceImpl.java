package de.jensharder.vocabularyapp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import de.jensharder.vocabularyapp.model.Card;

@Service
public class CardServiceImpl implements CardService {

	// @Autowired
	// private CardDAO cardDAO;

	@Override
	// @Transactional
	public List<Card> getCardsByBundleId(int bundleId) {
		// return cardDAO.getCardsByBundleId(bundleId);
		List<Card> list = new ArrayList<>();
		Card card1 = new Card();
		card1.setAnswer("Answer 1");
		card1.setQuestion("Queston 1");
		card1.setBundleId(123);
		card1.setReversable(false);

		Card card2 = new Card();
		card2.setAnswer("Answer 2");
		card2.setQuestion("Queston 2");
		card2.setBundleId(123);
		card2.setReversable(false);

		Card card3 = new Card();
		card3.setAnswer("Answer 3");
		card3.setQuestion("Queston 3");
		card3.setBundleId(123);
		card3.setReversable(false);

		Card card4 = new Card();
		card4.setAnswer("Answer 4");
		card4.setQuestion("Queston 4");
		card4.setBundleId(123);
		card4.setReversable(false);

		list.add(card1);
		list.add(card2);
		list.add(card3);
		list.add(card4);
		return list;
	}

	@Override
	// @Transactional
	public Card getCardById(int cardId) {
		// return cardDAO.getCardById(cardId);
		Card card3 = new Card();
		card3.setAnswer("Answer 3");
		card3.setQuestion("Queston 3");
		card3.setBundleId(123);
		card3.setReversable(false);
		
		return card3;
	}

	@Override
	// @Transactional
	public void saveCard(Card card) {
		// cardDAO.saveCard(card);
	}

	@Override
	// @Transactional
	public void deleteCardById(int cardId) {
		// cardDAO.deleteCardById(cardId);
	}

	@Override
	// @Transactional
	public int getGroupIdByBundleId(int bundleId) {
		// return cardDAO.getGroupIdByBundleId(bundleId);
		return 123;
	}

}
