package de.jensharder.vocabularyapp.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import de.jensharder.vocabularyapp.model.Bundle;

@Service
public class BundleServiceImpl implements BundleService{
	
//	@Autowired
//	private BundleDAO bundleDAO;

	@Override
//	@Transactional
	public List<Bundle> getBundlesByGroupId(int groupId) {
//		return bundleDAO.getBundlesByGroupId(groupId);
		List<Bundle> list = new ArrayList<>();
		Bundle bundle1 = new Bundle();
		bundle1.setGroupId(123);
		bundle1.setTitle("Bundle 1");
		Bundle bundle2 = new Bundle();
		bundle2.setGroupId(456);
		bundle2.setTitle("Bundle 2");
		
		list.add(bundle1);
		list.add(bundle2);
		
		return list;
	}

	@Override
//	@Transactional
	public Bundle getBundleById(int bundleId) {
//		return bundleDAO.getBundleById(bundleId);
		Bundle bundle1 = new Bundle();
		bundle1.setGroupId(123);
		bundle1.setTitle("Bundle 1");
		
		return bundle1;
	}

	@Override
//	@Transactional
	public void saveBundle(Bundle bundle) {
//		bundleDAO.saveBundle(bundle);
	}

	@Override
//	@Transactional
	public void deleteBundleById(int bundleId) {
//		bundleDAO.deleteBundleById(bundleId);
	}
	
	@Override
//	@Transactional
	public int getCategoryIdByGroupId(int groupId) {
		
		return 123;
//		return bundleDAO.getCategoryIdByGroupId(groupId);
	}

}
