package com.derp.erp.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class GradeResponseDto {
    private String id;
    private String studentId;
    private String studentFirstName;
    private String studentLastName;
    private String courseId;
    private String courseCode;
    private String courseName;
    private String assessmentType;
    private String gradeValue;
    private LocalDate assessmentDate;
    private String comments;
} 