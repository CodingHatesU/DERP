package com.derp.erp.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.LocalDate;

@Document(collection = "grades")
@Getter
@Setter
@NoArgsConstructor
@CompoundIndex(name = "student_course_assessment_unique_idx", def = "{'student': 1, 'course': 1, 'assessmentType': 1}", unique = true)
public class Grade {

    @Id
    private String id;

    @DBRef
    private Student student;

    @DBRef
    private Course course;

    private String assessmentType; // e.g., "Midterm", "Final Exam", "Assignment 1"

    private String gradeValue; // e.g., "A+", "85%", "Pass"

    private LocalDate assessmentDate;

    private String comments;

    public Grade(Student student, Course course, String assessmentType, String gradeValue, LocalDate assessmentDate, String comments) {
        this.student = student;
        this.course = course;
        this.assessmentType = assessmentType;
        this.gradeValue = gradeValue;
        this.assessmentDate = assessmentDate;
        this.comments = comments;
    }
} 