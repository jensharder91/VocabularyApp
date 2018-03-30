package de.jensharder.vocabularyapp.service;

import java.util.List;

import de.jensharder.vocabularyapp.model.CardCategory;

public interface CategoryService {

	List<CardCategory> getAllCategories();

	void saveCategory(CardCategory category);

	CardCategory getCategoryById(int categoryId);

	void deleteCategoryById(int categoryId);

}
