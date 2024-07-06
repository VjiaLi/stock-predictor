package com.example.spring_boot;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
/**
 * 1.创建HelloWorldMainApplication类,并声明这是一个主程序类也是个SpringBoot应用
 */
@SpringBootApplication
@MapperScan("com.example.spring_boot.mapper")
public class MainApplication {
	/**
	 * 2.编写main方法
	 */
	public static void main(String[] args) {
		//3.开始启动主程序类
		SpringApplication.run(MainApplication.class, args);
	}
}
