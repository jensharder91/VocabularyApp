package de.jensharder.vocabularyapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.jensharder.vocabularyapp.dao.CategoryDAO;
import de.jensharder.vocabularyapp.model.CardCategory;

@Service
public class CategoryServiceImpl implements CategoryService {

	@Autowired
	private CategoryDAO categoryDAO;

	@Override
	@Transactional
	public List<CardCategory> getAllCategories() {
		return categoryDAO.getAllCategories();
	}

	@Override
	@Transactional
	public void saveCategory(CardCategory category) {
		categoryDAO.saveCategory(category);
	}

	@Override
	@Transactional
	public CardCategory getCategoryById(int categoryId) {
		return categoryDAO.getCategoryById(categoryId);
	}

	@Override
	@Transactional
	public void deleteCategoryById(int categoryId) {
		categoryDAO.deleteCategoryById(categoryId);
	}

}
