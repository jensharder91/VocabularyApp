package de.jensharder.vocabularyapp.service;

import java.util.List;

import de.jensharder.vocabularyapp.model.Bundle;
import de.jensharder.vocabularyapp.model.Group;

public interface BundleService {

	List<Bundle> getBundlesByGroupId(int groupId);

	Bundle getBundleById(int bundleId);

	void saveBundle(Bundle bundle);

	void deleteBundleById(int bundleId);
	
	int getCategoryIdByGroupId(int groupId);

}
