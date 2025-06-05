package com.derp.erp.services;

import com.derp.erp.dtos.GradeRequestDto;
import com.derp.erp.dtos.GradeResponseDto;
import com.derp.erp.exceptions.ResourceNotFoundException;
import com.derp.erp.models.Course;
import com.derp.erp.models.Grade;
import com.derp.erp.models.Student;
import com.derp.erp.repositories.CourseRepository;
import com.derp.erp.repositories.GradeRepository;
import com.derp.erp.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GradeService {

    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public GradeResponseDto createGrade(GradeRequestDto requestDto) {
        Student student = studentRepository.findById(requestDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + requestDto.getStudentId()));
        Course course = courseRepository.findById(requestDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + requestDto.getCourseId()));

        if (gradeRepository.existsByStudent_IdAndCourse_IdAndAssessmentType(
                requestDto.getStudentId(), requestDto.getCourseId(), requestDto.getAssessmentType())) {
            throw new IllegalArgumentException(
                    "Grade already exists for this student, course, and assessment type: " + requestDto.getAssessmentType());
        }

        Grade grade = new Grade();
        grade.setStudent(student);
        grade.setCourse(course);
        grade.setAssessmentType(requestDto.getAssessmentType());
        grade.setGradeValue(requestDto.getGradeValue());
        grade.setAssessmentDate(requestDto.getAssessmentDate());
        grade.setComments(requestDto.getComments());

        Grade savedGrade = gradeRepository.save(grade);
        return mapToGradeResponseDto(savedGrade);
    }

    @Transactional(readOnly = true)
    public GradeResponseDto getGradeById(String id) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + id));
        return mapToGradeResponseDto(grade);
    }

    @Transactional(readOnly = true)
    public List<GradeResponseDto> getGradesByStudentId(String studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        return gradeRepository.findByStudent_Id(studentId).stream()
                .map(this::mapToGradeResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GradeResponseDto> getGradesByStudentIdAndCourseId(String studentId, String courseId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
        return gradeRepository.findByStudent_IdAndCourse_Id(studentId, courseId).stream()
                .map(this::mapToGradeResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<GradeResponseDto> getGradesByCourseId(String courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
        return gradeRepository.findByCourse_Id(courseId).stream()
                .map(this::mapToGradeResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public GradeResponseDto updateGrade(String id, GradeRequestDto requestDto) {
        Grade grade = gradeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with id: " + id));

        // Student and Course references generally shouldn't change for an existing grade record.
        // Assessment type might also be fixed once a grade is created.
        // We'll primarily allow updating gradeValue, assessmentDate, and comments.

        if (requestDto.getGradeValue() != null) {
            grade.setGradeValue(requestDto.getGradeValue());
        }
        if (requestDto.getAssessmentDate() != null) {
            grade.setAssessmentDate(requestDto.getAssessmentDate());
        }
        if (requestDto.getComments() != null) {
            grade.setComments(requestDto.getComments());
        }
        // Optionally, if assessmentType can be changed and needs to maintain uniqueness:
        // if (requestDto.getAssessmentType() != null && !requestDto.getAssessmentType().equals(grade.getAssessmentType())) {
        //     if (gradeRepository.existsByStudent_IdAndCourse_IdAndAssessmentType(
        // grade.getStudent().getId(), grade.getCourse().getId(), requestDto.getAssessmentType())) {
        // throw new IllegalArgumentException("Another grade already exists for the new assessment type.");
        //     }
        // grade.setAssessmentType(requestDto.getAssessmentType());
        // }

        Grade updatedGrade = gradeRepository.save(grade);
        return mapToGradeResponseDto(updatedGrade);
    }

    @Transactional
    public void deleteGrade(String id) {
        if (!gradeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Grade not found with id: " + id);
        }
        gradeRepository.deleteById(id);
    }

    private GradeResponseDto mapToGradeResponseDto(Grade grade) {
        GradeResponseDto dto = new GradeResponseDto();
        dto.setId(grade.getId());
        if (grade.getStudent() != null) {
            dto.setStudentId(grade.getStudent().getId());
            dto.setStudentFirstName(grade.getStudent().getFirstName());
            dto.setStudentLastName(grade.getStudent().getLastName());
        }
        if (grade.getCourse() != null) {
            dto.setCourseId(grade.getCourse().getId());
            dto.setCourseCode(grade.getCourse().getCourseCode());
            dto.setCourseName(grade.getCourse().getCourseName());
        }
        dto.setAssessmentType(grade.getAssessmentType());
        dto.setGradeValue(grade.getGradeValue());
        dto.setAssessmentDate(grade.getAssessmentDate());
        dto.setComments(grade.getComments());
        return dto;
    }
} 