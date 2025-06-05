package com.derp.erp.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScheduledClassRequestDto {

    @NotBlank(message = "Course ID cannot be blank")
    private String courseId;

    @NotBlank(message = "Day of week cannot be blank")
    @Size(max = 10, message = "Day of week cannot exceed 10 characters") // e.g., MONDAY, TUESDAY
    private String dayOfWeek;

    @NotBlank(message = "Start time cannot be blank")
    @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "Start time must be in HH:mm format")
    private String startTime;

    @NotBlank(message = "End time cannot be blank")
    @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "End time must be in HH:mm format")
    private String endTime;

    @Size(max = 20, message = "Room number cannot exceed 20 characters")
    private String roomNumber; // Optional

    @Size(max = 100, message = "Instructor name cannot exceed 100 characters")
    private String instructorName; // Optional
} 