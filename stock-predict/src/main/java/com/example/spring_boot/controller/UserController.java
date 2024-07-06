package com.example.spring_boot.controller;

import com.example.spring_boot.dao.User;
import com.example.spring_boot.mapper.UserMapper;

import com.example.spring_boot.dao.Json;
import com.example.spring_boot.dao.LstmInterface;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;

import org.springframework.web.bind.annotation.*;
import java.io.File;
import java.io.IOException;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    @Resource
    UserMapper userMapper;

    @RequestMapping("/login")
    public boolean login(@RequestBody User userinfo) {
        /* 登录处理逻辑 */
        User dbuser = userMapper.getUserByUsername(userinfo.getName(), userinfo.getPassword());
        return dbuser != null;
    }

    @RequestMapping("/register")
    public int register(@RequestBody User userinfo) {
        /* 注册处理逻辑 */
        return userMapper.RegisterUser(userinfo.getName(), userinfo.getPassword());
    }

    @RequestMapping("/predict")
    public JsonNode predict(@RequestBody Json request) {

        String receivedDataFilePath = "src/main/jsonfile/received_data.json";
        String predictedJsonFilePath = "src/main/jsonfile/predict.json";

        ObjectMapper objectMapper = new ObjectMapper();

        try {
            File file = new File(receivedDataFilePath);
            objectMapper.writeValue(file, request);
        } catch (IOException e) {
            e.printStackTrace();
        }

        JsonNode jsonObject = null;

        try {
            LstmInterface executor = new LstmInterface();
            executor.executePredictScript(receivedDataFilePath);

            jsonObject = objectMapper.readTree(new File(predictedJsonFilePath));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return jsonObject;
    }
}
