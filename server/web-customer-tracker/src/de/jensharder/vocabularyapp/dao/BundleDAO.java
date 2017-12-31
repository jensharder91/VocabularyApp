package de.jensharder.vocabularyapp.dao;

import java.util.List;

import de.jensharder.vocabularyapp.model.Bundle;

public interface BundleDAO {

	List<Bundle> getBundlesByGroupId(int groupId);

	Bundle getBundleById(int bundleId);

	void saveBundle(Bundle bundle);

	void deleteBundleById(int bundleId);

	int getCategoryIdByGroupId(int groupId);
}
