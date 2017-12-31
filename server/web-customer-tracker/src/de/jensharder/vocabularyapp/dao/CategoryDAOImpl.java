package de.jensharder.vocabularyapp.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import de.jensharder.vocabularyapp.model.CardCategory;

@Repository
public class CategoryDAOImpl implements CategoryDAO {

	@Autowired
	private SessionFactory sessionFactory;

	@Override
	public List<CardCategory> getAllCategories() {
		Session session = sessionFactory.getCurrentSession();

		Query<CardCategory> query = session.createQuery("from CardCategory order by id", CardCategory.class);

		List<CardCategory> cardCategories = query.getResultList();

		return cardCategories;
	}

	@Override
	public void saveCategory(CardCategory category) {
		Session session = sessionFactory.getCurrentSession();
		
		session.saveOrUpdate(category);
	}

	@Override
	public CardCategory getCategoryById(int categoryId) {
		Session session = sessionFactory.getCurrentSession();
		
		return session.get(CardCategory.class, categoryId);
	}

	@Override
	public void deleteCategoryById(int categoryId) {
		Session session = sessionFactory.getCurrentSession();
		
		Query query = session.createQuery("delete from CardCategory where id=:categoryId");
		query.setParameter("categoryId", categoryId);

		query.executeUpdate();
	}

}
