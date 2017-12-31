package de.jensharder.vocabularyapp.service;

import java.util.List;

import de.jensharder.vocabularyapp.model.Group;

public interface GroupService {

	List<Group> getGroupsByCategoryId(int categoryId);

	Group getGroupById(int groupId);

	void saveGroup(Group group);

	void deleteGroupById(int groupId);

}
