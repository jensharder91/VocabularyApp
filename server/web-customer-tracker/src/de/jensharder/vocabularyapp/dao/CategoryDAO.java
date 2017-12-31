package de.jensharder.vocabularyapp.dao;

import java.util.List;

import de.jensharder.vocabularyapp.model.CardCategory;

public interface CategoryDAO {

	List<CardCategory> getAllCategories();

	void saveCategory(CardCategory category);

	CardCategory getCategoryById(int categoryId);

	void deleteCategoryById(int categoryId);

}
