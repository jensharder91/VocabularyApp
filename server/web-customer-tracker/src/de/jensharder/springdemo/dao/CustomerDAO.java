package de.jensharder.springdemo.dao;

import java.util.List;

import de.jensharder.springdemo.entity.Customer;

public interface CustomerDAO {

	List<Customer> getCustomers();

	void saveCustomer(Customer customer);

	Customer getCustomerById(int customerId);

	void deleteCustomerById(int customerId);
}
