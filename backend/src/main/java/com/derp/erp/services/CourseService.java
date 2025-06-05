package com.derp.erp.services;

import com.derp.erp.dtos.CourseRequestDto;
import com.derp.erp.dtos.CourseResponseDto;
import com.derp.erp.exceptions.ResourceNotFoundException;
import com.derp.erp.models.Course;
import com.derp.erp.repositories.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    @Transactional
    public CourseResponseDto createCourse(CourseRequestDto courseRequestDto) {
        if (courseRepository.existsByCourseCode(courseRequestDto.getCourseCode())) {
            throw new IllegalArgumentException("Error: Course Code is already in use!");
        }

        Course course = new Course();
        course.setCourseCode(courseRequestDto.getCourseCode());
        course.setCourseName(courseRequestDto.getCourseName());
        course.setDescription(courseRequestDto.getDescription());
        course.setCredits(courseRequestDto.getCredits());

        Course savedCourse = courseRepository.save(course);
        return mapToCourseResponseDto(savedCourse);
    }

    @Transactional(readOnly = true)
    public List<CourseResponseDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToCourseResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CourseResponseDto getCourseById(String id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        return mapToCourseResponseDto(course);
    }

    @Transactional
    public CourseResponseDto updateCourse(String id, CourseRequestDto courseRequestDto) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        if (!course.getCourseCode().equals(courseRequestDto.getCourseCode()) && courseRepository.existsByCourseCode(courseRequestDto.getCourseCode())) {
            throw new IllegalArgumentException("Error: New Course Code is already in use!");
        }

        course.setCourseCode(courseRequestDto.getCourseCode());
        course.setCourseName(courseRequestDto.getCourseName());
        course.setDescription(courseRequestDto.getDescription());
        course.setCredits(courseRequestDto.getCredits());

        Course updatedCourse = courseRepository.save(course);
        return mapToCourseResponseDto(updatedCourse);
    }

    @Transactional
    public void deleteCourse(String id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    private CourseResponseDto mapToCourseResponseDto(Course course) {
        CourseResponseDto dto = new CourseResponseDto();
        dto.setId(course.getId());
        dto.setCourseCode(course.getCourseCode());
        dto.setCourseName(course.getCourseName());
        dto.setDescription(course.getDescription());
        dto.setCredits(course.getCredits());
        return dto;
    }
} 