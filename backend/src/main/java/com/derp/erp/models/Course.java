package com.derp.erp.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "courses")
@Getter
@Setter
@NoArgsConstructor
public class Course {

    @Id
    private String id;

    @Indexed(unique = true)
    private String courseCode;

    private String courseName;

    private String description;

    private Integer credits;

    public Course(String courseCode, String courseName, String description, Integer credits) {
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.description = description;
        this.credits = credits;
    }
} 