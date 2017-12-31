package de.jensharder.vocabularyapp.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import de.jensharder.vocabularyapp.model.Group;

@Repository
public class GroupDAOImpl implements GroupDAO {

	@Autowired
	private SessionFactory sessionFactory;

	@Override
	public List<Group> getGroupsByCategoryId(int categoryId) {
		Session session = sessionFactory.getCurrentSession();
		
		Query<Group> query = session.createQuery("from Group where categoryId=:categoryId");
		query.setParameter("categoryId", categoryId);
		
		List<Group> groups = query.getResultList();

		return groups;
	}

	@Override
	public Group getGroupById(int groupId) {
		Session session = sessionFactory.getCurrentSession();
		
		return session.get(Group.class, groupId);
	}

	@Override
	public void saveGroup(Group group) {
		Session session = sessionFactory.getCurrentSession();
		
		session.saveOrUpdate(group);
	}

	@Override
	public void deleteGroupById(int groupId) {
		Session session = sessionFactory.getCurrentSession();

		Query query = session.createQuery("delete from Group where id=:groupId");
		query.setParameter("groupId", groupId);

		query.executeUpdate();
	}

//	@Override
//	public int getCategoryIdByGroupId(int groupId) {
//		Session session = sessionFactory.getCurrentSession();
//		
//		Query query = session.createQuery("select categoryId from Group where id=:groupId");
//		query.setParameter("groupId", groupId);
//		
//		return query.getFirstResult();
//	}

}
