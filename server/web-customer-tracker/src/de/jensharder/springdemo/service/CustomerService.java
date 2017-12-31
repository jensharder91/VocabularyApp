package de.jensharder.springdemo.service;

import java.util.List;

import de.jensharder.springdemo.entity.Customer;

public interface CustomerService {

	List<Customer> getCustomers();

	void saveCustomer(Customer customer);

	Customer getCustomerById(int customerId);

	void deleteCustomerById(int customerId);
}
