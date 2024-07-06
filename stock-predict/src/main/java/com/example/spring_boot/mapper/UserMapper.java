package com.example.spring_boot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.spring_boot.dao.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

public interface UserMapper extends BaseMapper<User> {

    @Select("SELECT * from user where name = #{name} and password = #{password}")
    User getUserByUsername(@Param("name") String username, @Param("password") String password);  // 查看账号密码是否正确

    @Insert("INSERT INTO user(name, password) VALUES (#{name},  #{password})")
    int RegisterUser(@Param("name") String username, @Param("password") String password); // 注册用户

    @Select("SELECT * FROM user WHERE name = #{name}")
    User CheckUser(@Param("name") String username); // 判断用户名是否重复

}
