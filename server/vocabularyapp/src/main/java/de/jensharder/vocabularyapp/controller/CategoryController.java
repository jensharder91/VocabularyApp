package de.jensharder.vocabularyapp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import de.jensharder.vocabularyapp.model.CardCategory;
import de.jensharder.vocabularyapp.service.CategoryService;

@Controller
@RequestMapping("/category")
public class CategoryController {
  
	@Autowired
	private CategoryService categoryService;

	@GetMapping("/getAll")
	public String listCustomer(Model model) {
		List<CardCategory> categories = categoryService.getAllCategories();
		model.addAttribute("categories", categories);
		return "list-categories";
	}
	
	@GetMapping("/addForm")
	public String showAddForm(Model model) {
		
		CardCategory category = new CardCategory();
		model.addAttribute("category", category);
		
		return "form-category";
	}
	
	@PostMapping("/save")
	public String saveCategory(@ModelAttribute("category") CardCategory category) {
		
		categoryService.saveCategory(category);
		return "redirect:/category/getAll";
	}
	
	@GetMapping("/updateForm")
	public String showUpdateForm(@RequestParam("categoryId") int categoryId, Model model) {
		
		CardCategory category = categoryService.getCategoryById(categoryId);
		model.addAttribute("category", category);
		
		return "form-category";
	}
	
	@GetMapping("/delete")
	public String deleteCategory(@RequestParam("categoryId") int categoryId, Model model) {
		
		categoryService.deleteCategoryById(categoryId);
		return "redirect:/category/getAll";
	}
}
