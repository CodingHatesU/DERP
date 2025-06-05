package com.derp.erp.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseRequestDto {

    @NotBlank(message = "Course code cannot be blank")
    @Size(min = 2, max = 20, message = "Course code must be between 2 and 20 characters")
    private String courseCode;

    @NotBlank(message = "Course name cannot be blank")
    @Size(min = 3, max = 100, message = "Course name must be between 3 and 100 characters")
    private String courseName;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description; // Description can be optional or blank

    @NotNull(message = "Credits cannot be null")
    @Min(value = 0, message = "Credits must be a positive value or zero")
    private Integer credits;
} 