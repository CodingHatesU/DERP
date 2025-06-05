package com.derp.erp.services;

import com.derp.erp.dtos.ScheduledClassRequestDto;
import com.derp.erp.dtos.ScheduledClassResponseDto;
import com.derp.erp.exceptions.ResourceNotFoundException;
import com.derp.erp.models.Course;
import com.derp.erp.models.ScheduledClass;
import com.derp.erp.repositories.CourseRepository;
import com.derp.erp.repositories.ScheduledClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduledClassService {

    private final ScheduledClassRepository scheduledClassRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public ScheduledClassResponseDto createScheduledClass(ScheduledClassRequestDto requestDto) {
        Course course = courseRepository.findById(requestDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + requestDto.getCourseId()));

        // Basic validation for overlapping times for the same room/day could be added here if needed.
        // For now, we'll keep it simple and allow overlaps, relying on manual checks or future enhancements.

        ScheduledClass scheduledClass = new ScheduledClass();
        scheduledClass.setCourse(course);
        scheduledClass.setDayOfWeek(requestDto.getDayOfWeek());
        scheduledClass.setStartTime(requestDto.getStartTime());
        scheduledClass.setEndTime(requestDto.getEndTime());
        scheduledClass.setRoomNumber(requestDto.getRoomNumber());
        scheduledClass.setInstructorName(requestDto.getInstructorName());

        ScheduledClass savedScheduledClass = scheduledClassRepository.save(scheduledClass);
        return mapToScheduledClassResponseDto(savedScheduledClass);
    }

    @Transactional(readOnly = true)
    public ScheduledClassResponseDto getScheduledClassById(String id) {
        ScheduledClass scheduledClass = scheduledClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheduled class not found with id: " + id));
        return mapToScheduledClassResponseDto(scheduledClass);
    }

    @Transactional(readOnly = true)
    public List<ScheduledClassResponseDto> getAllScheduledClasses() {
        return scheduledClassRepository.findAll().stream()
                .map(this::mapToScheduledClassResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScheduledClassResponseDto> getScheduledClassesByCourseId(String courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
        return scheduledClassRepository.findByCourse_Id(courseId).stream()
                .map(this::mapToScheduledClassResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ScheduledClassResponseDto> getScheduledClassesByDay(String dayOfWeek) {
        return scheduledClassRepository.findByDayOfWeek(dayOfWeek).stream()
                .map(this::mapToScheduledClassResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ScheduledClassResponseDto updateScheduledClass(String id, ScheduledClassRequestDto requestDto) {
        ScheduledClass scheduledClass = scheduledClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Scheduled class not found with id: " + id));

        if (requestDto.getCourseId() != null) {
            Course course = courseRepository.findById(requestDto.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + requestDto.getCourseId()));
            scheduledClass.setCourse(course);
        }
        if (requestDto.getDayOfWeek() != null) {
            scheduledClass.setDayOfWeek(requestDto.getDayOfWeek());
        }
        if (requestDto.getStartTime() != null) {
            scheduledClass.setStartTime(requestDto.getStartTime());
        }
        if (requestDto.getEndTime() != null) {
            scheduledClass.setEndTime(requestDto.getEndTime());
        }
        if (requestDto.getRoomNumber() != null) {
            scheduledClass.setRoomNumber(requestDto.getRoomNumber());
        }
        if (requestDto.getInstructorName() != null) {
            scheduledClass.setInstructorName(requestDto.getInstructorName());
        }

        ScheduledClass updatedScheduledClass = scheduledClassRepository.save(scheduledClass);
        return mapToScheduledClassResponseDto(updatedScheduledClass);
    }

    @Transactional
    public void deleteScheduledClass(String id) {
        if (!scheduledClassRepository.existsById(id)) {
            throw new ResourceNotFoundException("Scheduled class not found with id: " + id);
        }
        scheduledClassRepository.deleteById(id);
    }

    private ScheduledClassResponseDto mapToScheduledClassResponseDto(ScheduledClass scheduledClass) {
        ScheduledClassResponseDto dto = new ScheduledClassResponseDto();
        dto.setId(scheduledClass.getId());
        if (scheduledClass.getCourse() != null) {
            dto.setCourseId(scheduledClass.getCourse().getId());
            dto.setCourseCode(scheduledClass.getCourse().getCourseCode());
            dto.setCourseName(scheduledClass.getCourse().getCourseName());
        }
        dto.setDayOfWeek(scheduledClass.getDayOfWeek());
        dto.setStartTime(scheduledClass.getStartTime());
        dto.setEndTime(scheduledClass.getEndTime());
        dto.setRoomNumber(scheduledClass.getRoomNumber());
        dto.setInstructorName(scheduledClass.getInstructorName());
        return dto;
    }
} 