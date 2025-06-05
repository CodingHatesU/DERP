package com.derp.erp.repositories;

import com.derp.erp.models.AttendanceRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends MongoRepository<AttendanceRecord, String> {

    Optional<AttendanceRecord> findByStudent_IdAndCourse_IdAndAttendanceDate(String studentId, String courseId, LocalDate attendanceDate);

    boolean existsByStudent_IdAndCourse_IdAndAttendanceDate(String studentId, String courseId, LocalDate attendanceDate);

    List<AttendanceRecord> findByStudent_Id(String studentId);

    List<AttendanceRecord> findByStudent_IdAndCourse_Id(String studentId, String courseId);

    List<AttendanceRecord> findByCourse_IdAndAttendanceDate(String courseId, LocalDate attendanceDate);

    List<AttendanceRecord> findByCourse_Id(String courseId);
} 