package com.derp.erp.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "scheduled_classes")
@Getter
@Setter
@NoArgsConstructor
public class ScheduledClass {

    @Id
    private String id;

    @DBRef
    private Course course;

    private String dayOfWeek; // e.g., "MONDAY", "TUESDAY"

    private String startTime; // e.g., "09:00"

    private String endTime;   // e.g., "10:30"

    private String roomNumber;

    private String instructorName;

    public ScheduledClass(Course course, String dayOfWeek, String startTime, String endTime, String roomNumber, String instructorName) {
        this.course = course;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.roomNumber = roomNumber;
        this.instructorName = instructorName;
    }
} 