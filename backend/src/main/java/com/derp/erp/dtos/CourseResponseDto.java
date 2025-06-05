package com.derp.erp.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseResponseDto {
    private String id;
    private String courseCode;
    private String courseName;
    private String description;
    private Integer credits;
} 