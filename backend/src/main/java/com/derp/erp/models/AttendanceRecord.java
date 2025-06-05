package com.derp.erp.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import java.time.LocalDate;

@Document(collection = "attendance_records")
@Getter
@Setter
@NoArgsConstructor
@CompoundIndex(name = "student_course_date_unique_idx", def = "{'student': 1, 'course': 1, 'attendanceDate': 1}", unique = true)
public class AttendanceRecord {

    @Id
    private String id;

    @DBRef
    private Student student;

    @DBRef
    private Course course;

    private LocalDate attendanceDate;

    // @Enumerated(EnumType.STRING) // Removed, Spring Data MongoDB handles Enum to String by default
    private AttendanceStatus status;

    public AttendanceRecord(Student student, Course course, LocalDate attendanceDate, AttendanceStatus status) {
        this.student = student;
        this.course = course;
        this.attendanceDate = attendanceDate;
        this.status = status;
    }
} 