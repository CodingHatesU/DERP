package com.derp.erp.services;

import com.derp.erp.dtos.AttendanceRecordRequestDto;
import com.derp.erp.dtos.AttendanceRecordResponseDto;
import com.derp.erp.exceptions.ResourceNotFoundException;
import com.derp.erp.models.AttendanceRecord;
import com.derp.erp.models.Course;
import com.derp.erp.models.Student;
import com.derp.erp.repositories.AttendanceRecordRepository;
import com.derp.erp.repositories.CourseRepository;
import com.derp.erp.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRecordRepository attendanceRecordRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Transactional
    public AttendanceRecordResponseDto recordAttendance(AttendanceRecordRequestDto requestDto) {
        Student student = studentRepository.findById(requestDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + requestDto.getStudentId()));
        Course course = courseRepository.findById(requestDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + requestDto.getCourseId()));

        if (attendanceRecordRepository.existsByStudent_IdAndCourse_IdAndAttendanceDate(
                requestDto.getStudentId(), requestDto.getCourseId(), requestDto.getAttendanceDate())) {
            throw new IllegalArgumentException("Attendance already recorded for this student, course, and date.");
        }

        AttendanceRecord attendanceRecord = new AttendanceRecord();
        attendanceRecord.setStudent(student);
        attendanceRecord.setCourse(course);
        attendanceRecord.setAttendanceDate(requestDto.getAttendanceDate());
        attendanceRecord.setStatus(requestDto.getStatus());

        AttendanceRecord savedRecord = attendanceRecordRepository.save(attendanceRecord);
        return mapToAttendanceRecordResponseDto(savedRecord);
    }

    @Transactional(readOnly = true)
    public AttendanceRecordResponseDto getAttendanceRecordById(String id) {
        AttendanceRecord record = attendanceRecordRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + id));
        return mapToAttendanceRecordResponseDto(record);
    }

    @Transactional(readOnly = true)
    public List<AttendanceRecordResponseDto> getAttendanceByStudent(String studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        return attendanceRecordRepository.findByStudent_Id(studentId).stream()
                .map(this::mapToAttendanceRecordResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceRecordResponseDto> getAttendanceByStudentAndCourse(String studentId, String courseId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
        return attendanceRecordRepository.findByStudent_IdAndCourse_Id(studentId, courseId).stream()
                .map(this::mapToAttendanceRecordResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AttendanceRecordResponseDto> getAttendanceByCourseAndDate(String courseId, LocalDate date) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
        return attendanceRecordRepository.findByCourse_IdAndAttendanceDate(courseId, date).stream()
                .map(this::mapToAttendanceRecordResponseDto)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<AttendanceRecordResponseDto> getAttendanceByCourse(String courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
        return attendanceRecordRepository.findByCourse_Id(courseId).stream()
                .map(this::mapToAttendanceRecordResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AttendanceRecordResponseDto updateAttendanceStatus(String attendanceRecordId, AttendanceRecordRequestDto requestDto) {
        AttendanceRecord attendanceRecord = attendanceRecordRepository.findById(attendanceRecordId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + attendanceRecordId));

        if (requestDto.getStatus() != null) {
            attendanceRecord.setStatus(requestDto.getStatus());
        }

        AttendanceRecord updatedRecord = attendanceRecordRepository.save(attendanceRecord);
        return mapToAttendanceRecordResponseDto(updatedRecord);
    }

    @Transactional
    public void deleteAttendanceRecord(String id) {
        if (!attendanceRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Attendance record not found with id: " + id);
        }
        attendanceRecordRepository.deleteById(id);
    }

    private AttendanceRecordResponseDto mapToAttendanceRecordResponseDto(AttendanceRecord record) {
        AttendanceRecordResponseDto dto = new AttendanceRecordResponseDto();
        dto.setId(record.getId());
        if (record.getStudent() != null) {
            dto.setStudentId(record.getStudent().getId());
            dto.setStudentFirstName(record.getStudent().getFirstName());
            dto.setStudentLastName(record.getStudent().getLastName());
        }
        if (record.getCourse() != null) {
            dto.setCourseId(record.getCourse().getId());
            dto.setCourseCode(record.getCourse().getCourseCode());
            dto.setCourseName(record.getCourse().getCourseName());
        }
        dto.setAttendanceDate(record.getAttendanceDate());
        dto.setStatus(record.getStatus());
        return dto;
    }
} 