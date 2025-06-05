package com.derp.erp.controllers;

import com.derp.erp.dtos.AttendanceRecordRequestDto;
import com.derp.erp.dtos.AttendanceRecordResponseDto;
import com.derp.erp.services.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Default authorization for all methods in this controller
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<AttendanceRecordResponseDto> recordAttendance(@Valid @RequestBody AttendanceRecordRequestDto requestDto) {
        AttendanceRecordResponseDto responseDto = attendanceService.recordAttendance(requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceRecordResponseDto> getAttendanceRecordById(@PathVariable String id) {
        AttendanceRecordResponseDto responseDto = attendanceService.getAttendanceRecordById(id);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceRecordResponseDto> updateAttendanceStatus(@PathVariable String id, @Valid @RequestBody AttendanceRecordRequestDto requestDto) {
        // Assuming requestDto here is primarily for the 'status' field for an update
        AttendanceRecordResponseDto responseDto = attendanceService.updateAttendanceStatus(id, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendanceRecord(@PathVariable String id) {
        attendanceService.deleteAttendanceRecord(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceRecordResponseDto>> getAttendanceByStudent(@PathVariable String studentId) {
        List<AttendanceRecordResponseDto> responseDtos = attendanceService.getAttendanceByStudent(studentId);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<List<AttendanceRecordResponseDto>> getAttendanceByStudentAndCourse(
            @PathVariable String studentId, @PathVariable String courseId) {
        List<AttendanceRecordResponseDto> responseDtos = attendanceService.getAttendanceByStudentAndCourse(studentId, courseId);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AttendanceRecordResponseDto>> getAttendanceByCourse(@PathVariable String courseId) {
        List<AttendanceRecordResponseDto> responseDtos = attendanceService.getAttendanceByCourse(courseId);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/course/{courseId}/date/{dateString}")
    public ResponseEntity<List<AttendanceRecordResponseDto>> getAttendanceByCourseAndDate(
            @PathVariable String courseId, 
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateString) {
        List<AttendanceRecordResponseDto> responseDtos = attendanceService.getAttendanceByCourseAndDate(courseId, dateString);
        return ResponseEntity.ok(responseDtos);
    }
} 