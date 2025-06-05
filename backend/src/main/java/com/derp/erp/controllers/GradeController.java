package com.derp.erp.controllers;

import com.derp.erp.dtos.GradeRequestDto;
import com.derp.erp.dtos.GradeResponseDto;
import com.derp.erp.exceptions.ResourceNotFoundException;
import com.derp.erp.models.Student;
import com.derp.erp.repositories.StudentRepository;
import com.derp.erp.services.GradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
public class GradeController {

    private final GradeService gradeService;
    private final StudentRepository studentRepository;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GradeResponseDto> createGrade(@Valid @RequestBody GradeRequestDto gradeRequestDto) {
        GradeResponseDto createdGrade = gradeService.createGrade(gradeRequestDto);
        return new ResponseEntity<>(createdGrade, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GradeResponseDto> getGradeById(@PathVariable String id) {
        GradeResponseDto grade = gradeService.getGradeById(id);
        return ResponseEntity.ok(grade);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GradeResponseDto>> getAllGrades() {
        List<GradeResponseDto> grades = gradeService.getAllGrades();
        return ResponseEntity.ok(grades);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GradeResponseDto> updateGrade(@PathVariable String id, @Valid @RequestBody GradeRequestDto gradeRequestDto) {
        GradeResponseDto updatedGrade = gradeService.updateGrade(id, gradeRequestDto);
        return ResponseEntity.ok(updatedGrade);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteGrade(@PathVariable String id) {
        gradeService.deleteGrade(id);
        return ResponseEntity.noContent().build();
    }

    // Additional endpoints for querying grades
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GradeResponseDto>> getGradesByStudent(@PathVariable String studentId) {
        List<GradeResponseDto> grades = gradeService.getGradesByStudentId(studentId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GradeResponseDto>> getGradesByCourse(@PathVariable String courseId) {
        List<GradeResponseDto> grades = gradeService.getGradesByCourseId(courseId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<GradeResponseDto>> getGradesByStudentAndCourse(
            @PathVariable String studentId, @PathVariable String courseId) {
        List<GradeResponseDto> grades = gradeService.getGradesByStudentIdAndCourseId(studentId, courseId);
        return ResponseEntity.ok(grades);
    }

    // New endpoint for students to get their own grades
    @GetMapping("/my-grades")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<GradeResponseDto>> getMyGrades(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = userDetails.getUsername();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for the logged-in user."));
        
        List<GradeResponseDto> grades = gradeService.getGradesByStudentId(student.getId());
        return ResponseEntity.ok(grades);
    }
} 