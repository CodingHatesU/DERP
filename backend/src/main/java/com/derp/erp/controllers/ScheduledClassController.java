package com.derp.erp.controllers;

import com.derp.erp.dtos.ScheduledClassRequestDto;
import com.derp.erp.dtos.ScheduledClassResponseDto;
import com.derp.erp.services.ScheduledClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@RequiredArgsConstructor
public class ScheduledClassController {

    private final ScheduledClassService scheduledClassService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ScheduledClassResponseDto> createScheduledClass(@Valid @RequestBody ScheduledClassRequestDto requestDto) {
        ScheduledClassResponseDto responseDto = scheduledClassService.createScheduledClass(requestDto);
        return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<ScheduledClassResponseDto> getScheduledClassById(@PathVariable String id) {
        ScheduledClassResponseDto responseDto = scheduledClassService.getScheduledClassById(id);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<List<ScheduledClassResponseDto>> getAllScheduledClasses() {
        List<ScheduledClassResponseDto> responseDtos = scheduledClassService.getAllScheduledClasses();
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<List<ScheduledClassResponseDto>> getScheduledClassesByCourseId(@PathVariable String courseId) {
        List<ScheduledClassResponseDto> responseDtos = scheduledClassService.getScheduledClassesByCourseId(courseId);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/day/{dayOfWeek}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<List<ScheduledClassResponseDto>> getScheduledClassesByDay(@PathVariable String dayOfWeek) {
        List<ScheduledClassResponseDto> responseDtos = scheduledClassService.getScheduledClassesByDay(dayOfWeek.toUpperCase()); // Convert to uppercase for consistency
        return ResponseEntity.ok(responseDtos);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ScheduledClassResponseDto> updateScheduledClass(@PathVariable String id, @Valid @RequestBody ScheduledClassRequestDto requestDto) {
        ScheduledClassResponseDto responseDto = scheduledClassService.updateScheduledClass(id, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteScheduledClass(@PathVariable String id) {
        scheduledClassService.deleteScheduledClass(id);
        return ResponseEntity.noContent().build();
    }
} 