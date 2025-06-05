package com.derp.erp.dtos;

import com.derp.erp.models.AttendanceStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AttendanceRecordRequestDto {

    @NotBlank(message = "Student ID cannot be blank")
    private String studentId;

    @NotBlank(message = "Course ID cannot be blank")
    private String courseId;

    @NotNull(message = "Attendance date cannot be null")
    private LocalDate attendanceDate;

    @NotNull(message = "Attendance status cannot be null")
    private AttendanceStatus status;
} 