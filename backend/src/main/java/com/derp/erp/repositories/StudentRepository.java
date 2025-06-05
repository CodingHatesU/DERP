package com.derp.erp.repositories;

import com.derp.erp.models.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByEmail(String email);
    Optional<Student> findByStudentIdNumber(String studentIdNumber);
    boolean existsByEmail(String email);
    boolean existsByStudentIdNumber(String studentIdNumber);
} 