package de.jensharder.vocabularyapp.config;

import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;

public class MyDispatcherServletInitializer extends AbstractAnnotationConfigDispatcherServletInitializer {

	@Override
	protected String[] getServletMappings() {
		return new String[] { "/" };
	}

	@Override
	protected Class<?>[] getServletConfigClasses() {
		return new Class[] { VocabularyAppConfig.class };
	}

	@Override
	protected Class<?>[] getRootConfigClasses() {
		return null;
	}

}
