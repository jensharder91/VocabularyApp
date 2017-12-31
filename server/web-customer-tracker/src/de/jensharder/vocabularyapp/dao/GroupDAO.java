package de.jensharder.vocabularyapp.dao;

import java.util.List;

import de.jensharder.vocabularyapp.model.CardCategory;
import de.jensharder.vocabularyapp.model.Group;

public interface GroupDAO {

	List<Group> getGroupsByCategoryId(int categoryId);

	Group getGroupById(int groupId);

	void saveGroup(Group group);

	void deleteGroupById(int groupId);

//	int getCategoryIdByGroupId(int groupId);

}
