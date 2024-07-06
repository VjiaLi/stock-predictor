package com.example.spring_boot;

import com.baomidou.mybatisplus.core.toolkit.Assert;
import com.example.spring_boot.dao.User;
import com.example.spring_boot.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class ApplicationTests {

	@Autowired
	private UserMapper userMapper;

	@Test
	public void testSelect() {
		System.out.println(("----- selectAll method test ------"));
		List<User> userList = userMapper.selectList(null);
		Assert.isTrue(3 == userList.size(), "");
		userList.forEach(System.out::println);
	}

}
