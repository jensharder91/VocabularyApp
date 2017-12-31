package de.jensharder.vocabularyapp.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import de.jensharder.vocabularyapp.model.Card;

@Repository
public class CardDAOImpl implements CardDAO {

	@Autowired
	private SessionFactory sessionFactory;

	@Override
	public List<Card> getCardsByBundleId(int bundleId) {
		Session session = sessionFactory.getCurrentSession();
		
		Query<Card> query = session.createQuery("from Card where bundleId=:bundleId");
		query.setParameter("bundleId", bundleId);
		
		List<Card> cards = query.getResultList();

		return cards;
	}

	@Override
	public Card getCardById(int cardId) {
		Session session = sessionFactory.getCurrentSession();
		return session.get(Card.class, cardId);
	}

	@Override
	public void saveCard(Card card) {
		Session session = sessionFactory.getCurrentSession();
		
		session.saveOrUpdate(card);
	}

	@Override
	public void deleteCardById(int cardId) {
		Session session = sessionFactory.getCurrentSession();
		
		Query<Card> query = session.createQuery("delete from Card where id=:cardId");
		query.setParameter("cardId", cardId);
		
		query.executeUpdate();

	}

}
