package com.derp.erp.services;

import com.derp.erp.dtos.StudentRequestDto;
import com.derp.erp.dtos.StudentResponseDto;
import com.derp.erp.exceptions.ResourceNotFoundException;
import com.derp.erp.models.Student;
import com.derp.erp.repositories.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    @Transactional
    public StudentResponseDto createStudent(StudentRequestDto studentRequestDto) {
        if (studentRepository.existsByEmail(studentRequestDto.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }
        if (studentRepository.existsByStudentIdNumber(studentRequestDto.getStudentIdNumber())) {
            throw new IllegalArgumentException("Error: Student ID Number is already in use!");
        }

        Student student = new Student();
        student.setFirstName(studentRequestDto.getFirstName());
        student.setLastName(studentRequestDto.getLastName());
        student.setEmail(studentRequestDto.getEmail());
        student.setStudentIdNumber(studentRequestDto.getStudentIdNumber());

        Student savedStudent = studentRepository.save(student);
        return mapToStudentResponseDto(savedStudent);
    }

    @Transactional(readOnly = true)
    public List<StudentResponseDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToStudentResponseDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudentResponseDto getStudentById(String id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToStudentResponseDto(student);
    }

    @Transactional
    public StudentResponseDto updateStudent(String id, StudentRequestDto studentRequestDto) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        // Check for email conflict if email is being changed
        if (!student.getEmail().equals(studentRequestDto.getEmail()) && studentRepository.existsByEmail(studentRequestDto.getEmail())) {
            throw new IllegalArgumentException("Error: New email is already in use!");
        }
        // Check for studentIdNumber conflict if it is being changed
        if (!student.getStudentIdNumber().equals(studentRequestDto.getStudentIdNumber()) && studentRepository.existsByStudentIdNumber(studentRequestDto.getStudentIdNumber())) {
            throw new IllegalArgumentException("Error: New Student ID Number is already in use!");
        }

        student.setFirstName(studentRequestDto.getFirstName());
        student.setLastName(studentRequestDto.getLastName());
        student.setEmail(studentRequestDto.getEmail());
        student.setStudentIdNumber(studentRequestDto.getStudentIdNumber());

        Student updatedStudent = studentRepository.save(student);
        return mapToStudentResponseDto(updatedStudent);
    }

    @Transactional
    public void deleteStudent(String id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    private StudentResponseDto mapToStudentResponseDto(Student student) {
        StudentResponseDto dto = new StudentResponseDto();
        dto.setId(student.getId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        dto.setStudentIdNumber(student.getStudentIdNumber());
        return dto;
    }
} 