package com.example.spring_boot.dao;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Json {
    // Getters and setters
    @Getter
    private String name;

    @Setter
    private List<DataPoint> datas;

    private Integer n_predictions;

}
