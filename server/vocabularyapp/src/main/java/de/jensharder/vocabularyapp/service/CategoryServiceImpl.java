package de.jensharder.vocabularyapp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import de.jensharder.vocabularyapp.model.CardCategory;

@Service
public class CategoryServiceImpl implements CategoryService {

//	@Autowired
//	private CategoryDAO categoryDAO;

	@Override
//	@Transactional
	public List<CardCategory> getAllCategories() {
//		return categoryDAO.getAllCategories();
		CardCategory category1 = new CardCategory();
		category1.setTitle("Category 1");
		
		CardCategory category2 = new CardCategory();
		category2.setTitle("Category 2");
		
		CardCategory category3 = new CardCategory();
		category3.setTitle("Category 3");
		
		List<CardCategory> list = new ArrayList<>();
		list.add(category1);
		list.add(category2);
		list.add(category3);
		
		return list;
	}

	@Override
//	@Transactional
	public void saveCategory(CardCategory category) {
//		categoryDAO.saveCategory(category);
	}

	@Override
//	@Transactional
	public CardCategory getCategoryById(int categoryId) {
//		return categoryDAO.getCategoryById(categoryId);
		
		CardCategory category3 = new CardCategory();
		category3.setTitle("Category 3");
		
		return category3;
		
	}

	@Override
//	@Transactional
	public void deleteCategoryById(int categoryId) {
//		categoryDAO.deleteCategoryById(categoryId);
	}

}
