package de.jensharder.vocabularyapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import de.jensharder.vocabularyapp.dao.BundleDAO;
import de.jensharder.vocabularyapp.model.Bundle;

@Service
public class BundleServiceImpl implements BundleService{
	
	@Autowired
	private BundleDAO bundleDAO;

	@Override
	@Transactional
	public List<Bundle> getBundlesByGroupId(int groupId) {
		return bundleDAO.getBundlesByGroupId(groupId);
	}

	@Override
	@Transactional
	public Bundle getBundleById(int bundleId) {
		return bundleDAO.getBundleById(bundleId);
	}

	@Override
	@Transactional
	public void saveBundle(Bundle bundle) {
		bundleDAO.saveBundle(bundle);
	}

	@Override
	@Transactional
	public void deleteBundleById(int bundleId) {
		bundleDAO.deleteBundleById(bundleId);
	}

}
