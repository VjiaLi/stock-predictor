package com.example.spring_boot.dao;

import java.io.BufferedReader;
import java.io.InputStreamReader;


public class LstmInterface {
    /**
     * 调用 Python 脚本进行预测
     *
     * @param jsonFilePath 输入 JSON 文件路径
     * @throws Exception 如果调用失败
     */
    public void executePredictScript(String jsonFilePath) throws Exception {
        // need conda virtual env
//        String[] command = new String[]{"conda run -n torch_env python ../ST2-Iter/model_predict.py", jsonFilePath, String.valueOf(predictDays)};
        // 启动进程
        String command = "conda run -n yolo-track python ./src/main/ST2-Iter/model_predict.py " + jsonFilePath;
        System.out.println(command);
        String currentPath = System.getProperty("user.dir");
        // 打印当前工作目录路径
        System.out.println("Current working directory: " + currentPath);
//        ProcessBuilder pb = new ProcessBuilder(command);
//        Runtime.getRuntime().exec(command);
        Process process = Runtime.getRuntime().exec(command);

        // 获取输出
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line).append(System.lineSeparator());
        }

        // 获取错误输出
        BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        StringBuilder errorOutput = new StringBuilder();
        while ((line = errorReader.readLine()) != null) {
            errorOutput.append(line).append(System.lineSeparator());
        }

        // 等待进程完成
        int exitCode = process.waitFor();
        if (exitCode != 0) {
            throw new RuntimeException("Python script execution failed with exit code " + exitCode + " and error: " + errorOutput.toString());
        }
        System.out.println(output);
    }
}
