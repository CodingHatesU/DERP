package com.derp.erp.controllers;

import com.derp.erp.dtos.GradeRequestDto;
import com.derp.erp.dtos.GradeResponseDto;
import com.derp.erp.services.GradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // All methods in this controller require ADMIN role
public class GradeController {

    private final GradeService gradeService;

    @PostMapping
    public ResponseEntity<GradeResponseDto> createGrade(@Valid @RequestBody GradeRequestDto gradeRequestDto) {
        GradeResponseDto createdGrade = gradeService.createGrade(gradeRequestDto);
        return new ResponseEntity<>(createdGrade, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GradeResponseDto> getGradeById(@PathVariable String id) {
        GradeResponseDto grade = gradeService.getGradeById(id);
        return ResponseEntity.ok(grade);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GradeResponseDto> updateGrade(@PathVariable String id, @Valid @RequestBody GradeRequestDto gradeRequestDto) {
        GradeResponseDto updatedGrade = gradeService.updateGrade(id, gradeRequestDto);
        return ResponseEntity.ok(updatedGrade);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGrade(@PathVariable String id) {
        gradeService.deleteGrade(id);
        return ResponseEntity.noContent().build();
    }

    // Additional endpoints for querying grades
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<GradeResponseDto>> getGradesByStudent(@PathVariable String studentId) {
        List<GradeResponseDto> grades = gradeService.getGradesByStudentId(studentId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<GradeResponseDto>> getGradesByCourse(@PathVariable String courseId) {
        List<GradeResponseDto> grades = gradeService.getGradesByCourseId(courseId);
        return ResponseEntity.ok(grades);
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<List<GradeResponseDto>> getGradesByStudentAndCourse(
            @PathVariable String studentId, @PathVariable String courseId) {
        List<GradeResponseDto> grades = gradeService.getGradesByStudentIdAndCourseId(studentId, courseId);
        return ResponseEntity.ok(grades);
    }
} 