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

import de.jensharder.vocabularyapp.model.Group;
import de.jensharder.vocabularyapp.service.GroupService;

@Controller
@RequestMapping("/group")
public class GroupController {

	@Autowired
	private GroupService groupService;

	@GetMapping("/show")
	public String showGroupByCategoryId(@RequestParam("categoryId") int categoryId, Model model) {

		List<Group> groups = groupService.getGroupsByCategoryId(categoryId);
		model.addAttribute("groups", groups);
		model.addAttribute("categoryId", categoryId);

		return "list-groups";
	}

	@GetMapping("/addForm")
	public String showAddForm(@RequestParam("categoryId") int categoryId, Model model) {

		Group group = new Group();
		group.setCategoryId(categoryId);
		model.addAttribute("group", group);

		return "form-group";
	}

	@GetMapping("/updateForm")
	public String showUpdateForm(@RequestParam("groupId") int groupId,
			Model model) {

		Group group = groupService.getGroupById(groupId);
		model.addAttribute("group", group);

		return "form-group";
	}

	@PostMapping("/save")
	public String saveGroup(@ModelAttribute("group") Group group) {

		groupService.saveGroup(group);
		return "redirect:/group/show?categoryId=" + group.getCategoryId();
	}

	@GetMapping("/delete")
	public String deleteGroup(@RequestParam("categoryId") int categoryId,@RequestParam("groupId") int groupId, Model model) {

		groupService.deleteGroupById(groupId);
		return "redirect:/group/show?categoryId=" + categoryId;
	}
}
