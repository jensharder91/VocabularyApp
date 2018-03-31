package de.jensharder.vocabularyapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import com.fasterxml.jackson.annotation.JsonInclude;

@Configuration
@EnableWebMvc
@ComponentScan(basePackages = "de.jensharder.vocabularyapp")
public class DemoAppConfig implements WebMvcConfigurer{

	@Bean
	public ViewResolver viewResolver() {
		InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
		viewResolver.setPrefix("/WEB-INF/view/");
		viewResolver.setSuffix(".jsp");

		return viewResolver;
	}
	
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
    }
    
    @Bean
    public Jackson2ObjectMapperBuilder objectMapperBuilder() {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
        builder.serializationInclusion(JsonInclude.Include.NON_NULL);
        return builder;
    }
    
//Jackson Mapper... (Converter)
//	@Override
//	public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
//	    final MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
//	    final ObjectMapper objectMapper = new ObjectMapper();
//	    objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
//	    converter.setObjectMapper(objectMapper);
//	    converters.add(converter);
////	    super.configureMessageConverters(converters);
//	}
}
