package de.jensharder.vocabularyapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.jensharder.vocabularyapp.dao.CardDAO;
import de.jensharder.vocabularyapp.model.Card;

@Service
public class CardServiceImpl implements CardService{
	
	@Autowired
	private CardDAO cardDAO;

	@Override
	@Transactional
	public List<Card> getCardsByBundleId(int bundleId) {
		return cardDAO.getCardsByBundleId(bundleId);
	}

	@Override
	@Transactional
	public Card getCardById(int cardId) {
		return cardDAO.getCardById(cardId);
	}

	@Override
	@Transactional
	public void saveCard(Card card) {
		cardDAO.saveCard(card);
	}

	@Override
	@Transactional
	public void deleteCardById(int cardId) {
		cardDAO.deleteCardById(cardId);
	}



}
