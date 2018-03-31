package de.jensharder.vocabularyapp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import de.jensharder.vocabularyapp.model.Group;

@Service
public class GroupServiceImpl implements GroupService {

//	@Autowired
//	private GroupDAO groupDAO;

	@Override
//	@Transactional
	public List<Group> getGroupsByCategoryId(int categoryId) {
//		return groupDAO.getGroupsByCategoryId(categoryId);
		List<Group> list = new ArrayList<>();
		
		Group group1 = new Group();
		group1.setTitle("Group1");
		group1.setCategoryId(123);
		
		Group group2 = new Group();
		group2.setTitle("Group2");
		group2.setCategoryId(123);
		
		list.add(group1);
		list.add(group2);
		
		return list;
	}

	@Override
//	@Transactional
	public Group getGroupById(int groupId) {
//		return groupDAO.getGroupById(groupId);
		Group group1 = new Group();
		group1.setTitle("Group1");
		group1.setCategoryId(123);
		
		return group1;
	}

	@Override
//	@Transactional
	public void saveGroup(Group group) {
//		groupDAO.saveGroup(group);
	}

	@Override
//	@Transactional
	public void deleteGroupById(int groupId) {
//		groupDAO.deleteGroupById(groupId);
	}

//	@Override
//	@Transactional
//	public int getCategoryIdByGroupId(int groupId) {
//		return groupDAO.getCategoryIdByGroupId(groupId);
//	}


}
