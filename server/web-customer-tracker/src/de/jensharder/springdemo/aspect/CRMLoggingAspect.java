package de.jensharder.springdemo.aspect;

import java.util.logging.Logger;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class CRMLoggingAspect {

	private Logger logger = Logger.getLogger(getClass().getName());

	@Pointcut("execution(* de.jensharder.springdemo.controller.*.*(..))")
	private void forControllerPackage() {
	}

	@Pointcut("execution(* de.jensharder.springdemo.service.*.*(..))")
	private void forServicePackage() {
	}

	@Pointcut("execution(* de.jensharder.springdemo.dao.*.*(..))")
	private void forDaoPackage() {
	}

	@Pointcut("forControllerPackage() || forServicePackage() || forDaoPackage()")
	private void forAppFlow() {
	}

	@Before("forAppFlow()")
	public void before(JoinPoint joinPoint) {
		String method = joinPoint.getSignature().toShortString();

		logger.info("@Before methode: " + method);

		Object[] agruments = joinPoint.getArgs();
		for (Object arg : agruments) {
			logger.info("@Before argument: " + arg.toString());
		}
	}

	@AfterReturning(pointcut = "forAppFlow()", returning = "result")
	public void after(JoinPoint joinPoint, Object result) {
		String method = joinPoint.getSignature().toShortString();

		logger.info("@AfterReturning methode: " + method);

		logger.info("@AfterReturning result: " + result);
	}
}
