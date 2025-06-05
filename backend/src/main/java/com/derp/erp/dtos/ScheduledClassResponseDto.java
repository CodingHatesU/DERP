package com.derp.erp.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduledClassResponseDto {
    private String id;
    private String courseId;
    private String courseCode;
    private String courseName;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private String roomNumber;
    private String instructorName;
} 