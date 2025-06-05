package com.derp.erp.dtos;

import com.derp.erp.models.AttendanceStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AttendanceRecordResponseDto {
    private String id;
    private String studentId;
    private String studentFirstName;
    private String studentLastName;
    private String courseId;
    private String courseCode;
    private String courseName;
    private LocalDate attendanceDate;
    private AttendanceStatus status;
} 