package com.derp.erp.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class GradeRequestDto {
    @NotBlank(message = "Student ID cannot be blank")
    private String studentId;

    @NotBlank(message = "Course ID cannot be blank")
    private String courseId;

    @NotBlank(message = "Assessment type cannot be blank")
    @Size(max = 50, message = "Assessment type cannot exceed 50 characters")
    private String assessmentType;

    @NotBlank(message = "Grade value cannot be blank")
    @Size(max = 20, message = "Grade value cannot exceed 20 characters") // Adjusted size for flexibility (e.g., "Pass with Distinction", "85/100")
    private String gradeValue;

    private LocalDate assessmentDate; // Optional, can be null

    @Size(max = 255, message = "Comments cannot exceed 255 characters")
    private String comments; // Optional, can be null
} 