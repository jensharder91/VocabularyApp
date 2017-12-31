package de.jensharder.vocabularyapp.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import de.jensharder.vocabularyapp.model.Bundle;

@Repository
public class BundleDAOImpl implements BundleDAO {

	@Autowired
	private SessionFactory sessionFactory;

	@Override
	public List<Bundle> getBundlesByGroupId(int groupId) {
		Session session = sessionFactory.getCurrentSession();
		
		Query<Bundle> query = session.createQuery("from Bundle where groupId=:groupId");
		query.setParameter("groupId", groupId);
		
		List<Bundle> bundles = query.getResultList();

		return bundles;
	}

	@Override
	public Bundle getBundleById(int bundleId) {
		Session session = sessionFactory.getCurrentSession();
		
		return session.get(Bundle.class, bundleId);
	}

	@Override
	public void saveBundle(Bundle bundle) {
		Session session = sessionFactory.getCurrentSession();
		
		session.saveOrUpdate(bundle);
	}

	@Override
	public void deleteBundleById(int bundleId) {
		Session session = sessionFactory.getCurrentSession();

		Query<Bundle> query = session.createQuery("delete from Bundle where id=:bundleId");
		query.setParameter("bundleId", bundleId);

		query.executeUpdate();
	}

}
