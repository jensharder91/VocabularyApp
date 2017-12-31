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

import de.jensharder.vocabularyapp.model.Bundle;
import de.jensharder.vocabularyapp.service.BundleService;

@Controller
@RequestMapping("/bundle")
public class BundleController {

	@Autowired
	private BundleService bundleService;

	@GetMapping("/show")
	public String showBundlesByGroupId(@RequestParam("groupId") int groupId, @RequestParam("categoryId") int categoryId,
			Model model) {

		List<Bundle> bundles = bundleService.getBundlesByGroupId(groupId);
		model.addAttribute("bundles", bundles);
		model.addAttribute("groupId", groupId);
		model.addAttribute("categoryId", categoryId);

		return "list-bundles";
	}
	
	@GetMapping("/addForm")
	public String showAddForm(@RequestParam("categoryId") int categoryId,@RequestParam("groupId") int groupId, Model model) {

		Bundle bundle = new Bundle();
		model.addAttribute("bundle", bundle);
		model.addAttribute("categoryId", categoryId);
		model.addAttribute("groupId", groupId);

		return "form-bundle";
	}

	@GetMapping("/updateForm")
	public String showUpdateForm(@RequestParam("categoryId") int categoryId,@RequestParam("groupId") int groupId, @RequestParam("bundleId") int bundleId,
			Model model) {

		Bundle bundle = bundleService.getBundleById(bundleId);
		model.addAttribute("bundle", bundle);
		model.addAttribute("categoryId", categoryId);
		model.addAttribute("groupId", groupId);

		return "form-bundle";
	}

	@PostMapping("/save")
	public String saveBundle(@ModelAttribute("bundle") Bundle bundle) {

		bundleService.saveBundle(bundle);
		return "redirect:/bundle/show?groupId=" + bundle.getGroupId();
	}

	@GetMapping("/delete")
	public String deleteBundle(@RequestParam("categoryId") int categoryId,@RequestParam("groupId") int groupId,@RequestParam("bundleId") int bundleId, Model model) {

		bundleService.deleteBundleById(bundleId);
		return "redirect:/bundle/show?categoryId=" + categoryId+"&groupId=" + groupId;
	}
}
