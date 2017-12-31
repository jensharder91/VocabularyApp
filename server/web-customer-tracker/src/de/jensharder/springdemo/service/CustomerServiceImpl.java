package de.jensharder.springdemo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.jensharder.springdemo.dao.CustomerDAO;
import de.jensharder.springdemo.entity.Customer;

@Service
public class CustomerServiceImpl implements CustomerService {

	@Autowired
	private CustomerDAO customerDAO;

	@Override
	@Transactional
	public List<Customer> getCustomers() {
		return customerDAO.getCustomers();
	}

	@Override
	@Transactional
	public void saveCustomer(Customer customer) {
		customerDAO.saveCustomer(customer);
	}

	@Override
	@Transactional
	public Customer getCustomerById(int customerId) {
		return customerDAO.getCustomerById(customerId);
	}

	@Override
	@Transactional
	public void deleteCustomerById(int customerId) {
		customerDAO.deleteCustomerById(customerId);
	}

}
