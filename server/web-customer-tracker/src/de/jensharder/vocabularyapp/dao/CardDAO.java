package de.jensharder.vocabularyapp.dao;

import java.util.List;

import de.jensharder.vocabularyapp.model.Card;

public interface CardDAO {

	List<Card> getCardsByBundleId(int bundleId);

	Card getCardById(int cardId);

	void saveCard(Card card);

	void deleteCardById(int cardId);


}
