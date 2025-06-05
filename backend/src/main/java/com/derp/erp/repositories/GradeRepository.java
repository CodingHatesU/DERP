package com.derp.erp.repositories;

import com.derp.erp.models.Grade;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository extends MongoRepository<Grade, String> {

    // Find a specific grade entry
    Optional<Grade> findByStudent_IdAndCourse_IdAndAssessmentType(String studentId, String courseId, String assessmentType);

    // Check if a specific grade entry exists (useful for validation before creating)
    boolean existsByStudent_IdAndCourse_IdAndAssessmentType(String studentId, String courseId, String assessmentType);

    // Find all grades for a specific student
    List<Grade> findByStudent_Id(String studentId);

    // Find all grades for a specific student in a specific course
    List<Grade> findByStudent_IdAndCourse_Id(String studentId, String courseId);

    // Find all grades for a specific course
    List<Grade> findByCourse_Id(String courseId);
} 