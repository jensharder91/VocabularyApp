package de.jensharder.vocabularyapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.jensharder.vocabularyapp.dao.GroupDAO;
import de.jensharder.vocabularyapp.model.Group;

@Service
public class GroupServiceImpl implements GroupService {

	@Autowired
	private GroupDAO groupDAO;

	@Override
	@Transactional
	public List<Group> getGroupsByCategoryId(int categoryId) {
		return groupDAO.getGroupsByCategoryId(categoryId);
	}

	@Override
	@Transactional
	public Group getGroupById(int groupId) {
		return groupDAO.getGroupById(groupId);
	}

	@Override
	@Transactional
	public void saveGroup(Group group) {
		groupDAO.saveGroup(group);
	}

	@Override
	@Transactional
	public void deleteGroupById(int groupId) {
		groupDAO.deleteGroupById(groupId);
	}


}
