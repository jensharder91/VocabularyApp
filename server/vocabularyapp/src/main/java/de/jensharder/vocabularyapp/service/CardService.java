package de.jensharder.vocabularyapp.service;

import java.util.List;

import de.jensharder.vocabularyapp.model.Card;

public interface CardService {

	List<Card> getCardsByBundleId(int bundleId);

	Card getCardById(int cardId);

	void saveCard(Card card);

	void deleteCardById(int cardId);

	int getGroupIdByBundleId(int bundleId);

}
