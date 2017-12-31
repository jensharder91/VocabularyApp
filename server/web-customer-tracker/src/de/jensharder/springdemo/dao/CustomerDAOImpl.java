package de.jensharder.springdemo.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import de.jensharder.springdemo.entity.Customer;

@Repository
public class CustomerDAOImpl implements CustomerDAO {

	@Autowired
	private SessionFactory sessionFactory;

	@Override
	public List<Customer> getCustomers() {

		Session session = sessionFactory.getCurrentSession();

		Query<Customer> query = session.createQuery("from Customer order by lastName", Customer.class);

		List<Customer> customers = query.getResultList();

		return customers;

	}

	@Override
	public void saveCustomer(Customer customer) {
		Session session = sessionFactory.getCurrentSession();

		session.saveOrUpdate(customer);
	}

	@Override
	public Customer getCustomerById(int customerId) {
		Session session = sessionFactory.getCurrentSession();

		Customer customer = session.get(Customer.class, customerId);

		return customer;
	}

	@Override
	public void deleteCustomerById(int customerId) {
		Session session = sessionFactory.getCurrentSession();

		Query query = session.createQuery("delete from Customer where id=:customerId");
		query.setParameter("customerId", customerId);

		query.executeUpdate();
	}

}
