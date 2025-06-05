# Derp ERP API Routes

This document outlines all the API routes available in the Derp ERP system.

**Common Headers:**
*   Most authenticated routes require an `Authorization` header: `Authorization: Basic <base64-encoded-username-password>`
*   For POST/PUT requests with a body, use `Content-Type: application/json`.

**Credentials for Testing:**
*   Admin: `adminuser:adminpass`
*   Student: `studentuser:studentpass`

---

## Authentication (`/api/auth`)

### 1. Register User
*   **Endpoint**: `/api/auth/register`
*   **Type**: `POST`
*   **Headers**: `Content-Type: application/json`
*   **Parameters**: None
*   **Body**: `RegisterRequest`
    ```json
    {
      "username": "newuser",
      "password": "password123",
      "role": "STUDENT" // Optional, defaults to STUDENT. Can be "ADMIN" or "STUDENT"
    }
    ```
*   **Sample Output (Success 200 OK)**:
    ```
    "User registered successfully!"
    ```
*   **Sample Output (Error 400 Bad Request - Username Taken)**:
    ```
    "Error: Username is already taken!"
    ```
*   **Sample Output (Error 400 Bad Request - Role Not Found)**:
    ```
    "Error: Role not found."
    ```

### 2. Login User
*   **Endpoint**: `/api/auth/login`
*   **Type**: `POST`
*   **Headers**: `Authorization: Basic <base64-encoded-username-password>`
*   **Parameters**: None
*   **Body**: None
*   **Sample Output (Success 200 OK)**:
    ```
    "Login successful"
    ```
    *(Spring Security handles authentication. A 401 Unauthorized response is returned for bad credentials.)*

### 3. Get Current User Information
*   **Endpoint**: `/api/auth/me`
*   **Type**: `GET`
*   **Headers**: `Authorization: Basic <base64-encoded-username-password>`
*   **Parameters**: None
*   **Body**: None
*   **Sample Output (Success 200 OK)**:
    ```
    "You are authenticated"
    ```

---

## Student Management (`/api/students`)
*All endpoints require `ADMIN` role and `Authorization: Basic <base64-encoded-username-password>` header.*

### 1. Create Student
*   **Endpoint**: `/api/students`
*   **Type**: `POST`
*   **Headers**: `Content-Type: application/json`, `Authorization: Basic ...`
*   **Parameters**: None
*   **Body**: `StudentRequestDto`
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "studentIdNumber": "S12345"
    }
    ```
*   **Sample Output (Success 201 CREATED)**: `StudentResponseDto`
    ```json
    {
      "id": "generated_student_id_string",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "studentIdNumber": "S12345"
    }
    ```

### 2. Get All Students
*   **Endpoint**: `/api/students`
*   **Type**: `GET`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: None
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `List<StudentResponseDto>`
    ```json
    [
      {
        "id": "student_id_1",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "studentIdNumber": "S12345"
      },
      {
        "id": "student_id_2",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane.smith@example.com",
        "studentIdNumber": "S67890"
      }
    ]
    ```

### 3. Get Student by ID
*   **Endpoint**: `/api/students/{id}`
*   **Type**: `GET`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the student.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `StudentResponseDto` (same structure as create student output)

### 4. Update Student
*   **Endpoint**: `/api/students/{id}`
*   **Type**: `PUT`
*   **Headers**: `Content-Type: application/json`, `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the student to update.
*   **Body**: `StudentRequestDto` (all fields for update)
    ```json
    {
      "firstName": "Johnathan",
      "lastName": "Doe",
      "email": "johnathan.doe@example.com",
      "studentIdNumber": "S12345"
    }
    ```
*   **Sample Output (Success 200 OK)**: `StudentResponseDto` (updated student record)

### 5. Delete Student
*   **Endpoint**: `/api/students/{id}`
*   **Type**: `DELETE`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the student to delete.
*   **Body**: None
*   **Sample Output (Success 204 NO CONTENT)**: Empty

---

## Course Management (`/api/courses`)
*Default Header: `Authorization: Basic <base64-encoded-username-password>`*

### 1. Create Course
*   **Endpoint**: `/api/courses`
*   **Type**: `POST`
*   **Security**: Requires `ADMIN` role.
*   **Headers**: `Content-Type: application/json`, `Authorization: Basic ...`
*   **Parameters**: None
*   **Body**: `CourseRequestDto`
    ```json
    {
      "courseCode": "CS101",
      "courseName": "Introduction to Computer Science",
      "description": "Fundamentals of CS.",
      "credits": 3
    }
    ```
*   **Sample Output (Success 201 CREATED)**: `CourseResponseDto`
    ```json
    {
      "id": "generated_course_id_string",
      "courseCode": "CS101",
      "courseName": "Introduction to Computer Science",
      "description": "Fundamentals of CS.",
      "credits": 3
    }
    ```

### 2. Get All Courses
*   **Endpoint**: `/api/courses`
*   **Type**: `GET`
*   **Security**: Requires `ADMIN` or `STUDENT` role.
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: None
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `List<CourseResponseDto>`
    ```json
    [
      {
        "id": "course_id_1",
        "courseCode": "CS101",
        "courseName": "Introduction to Computer Science",
        "description": "Fundamentals of CS.",
        "credits": 3
      },
      {
        "id": "course_id_2",
        "courseCode": "MA201",
        "courseName": "Calculus I",
        "description": "Differential calculus.",
        "credits": 4
      }
    ]
    ```

### 3. Get Course by ID
*   **Endpoint**: `/api/courses/{id}`
*   **Type**: `GET`
*   **Security**: Requires `ADMIN` or `STUDENT` role.
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the course.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `CourseResponseDto` (same structure as create course output)

### 4. Update Course
*   **Endpoint**: `/api/courses/{id}`
*   **Type**: `PUT`
*   **Security**: Requires `ADMIN` role.
*   **Headers**: `Content-Type: application/json`, `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the course to update.
*   **Body**: `CourseRequestDto` (all fields for update)
    ```json
    {
      "courseCode": "CS101-Updated",
      "courseName": "Advanced Introduction to CS",
      "description": "More fundamentals of CS.",
      "credits": 4
    }
    ```
*   **Sample Output (Success 200 OK)**: `CourseResponseDto` (updated course record)

### 5. Delete Course
*   **Endpoint**: `/api/courses/{id}`
*   **Type**: `DELETE`
*   **Security**: Requires `ADMIN` role.
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the course to delete.
*   **Body**: None
*   **Sample Output (Success 204 NO CONTENT)**: Empty

---

## Attendance Tracking (`/api/attendance`)
*All endpoints require `ADMIN` role and `Authorization: Basic <base64-encoded-username-password>` header.*

### 1. Record Attendance
*   **Endpoint**: `/api/attendance`
*   **Type**: `POST`
*   **Headers**: `Content-Type: application/json`, `Authorization: Basic ...`
*   **Parameters**: None
*   **Body**: `AttendanceRecordRequestDto`
    ```json
    {
      "studentId": "student_id_string",
      "courseId": "course_id_string",
      "attendanceDate": "YYYY-MM-DD", // e.g., "2023-10-26"
      "status": "PRESENT" // Options: PRESENT, ABSENT, LATE, EXCUSED
    }
    ```
*   **Sample Output (Success 201 CREATED)**: `AttendanceRecordResponseDto`
    ```json
    {
      "id": "generated_attendance_id_string",
      "studentId": "student_id_string",
      "courseId": "course_id_string",
      "studentName": "John Doe", // Populated by service
      "courseName": "Introduction to CS", // Populated by service
      "attendanceDate": "2023-10-26",
      "status": "PRESENT"
    }
    ```

### 2. Get Attendance Record by ID
*   **Endpoint**: `/api/attendance/{id}`
*   **Type**: `GET`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the attendance record.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `AttendanceRecordResponseDto` (same structure as record attendance output)

### 3. Update Attendance Status
*   **Endpoint**: `/api/attendance/{id}`
*   **Type**: `PUT`
*   **Headers**: `Content-Type: application/json`, `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the attendance record to update.
*   **Body**: `AttendanceRecordRequestDto` (Primarily for `status`; other fields might be part of the DTO but only status is logically updated for an existing record)
    ```json
    {
      "studentId": "student_id_string", // Required by DTO validation
      "courseId": "course_id_string",   // Required by DTO validation
      "attendanceDate": "YYYY-MM-DD", // Required by DTO validation
      "status": "LATE"
    }
    ```
*   **Sample Output (Success 200 OK)**: `AttendanceRecordResponseDto` (updated attendance record)

### 4. Delete Attendance Record
*   **Endpoint**: `/api/attendance/{id}`
*   **Type**: `DELETE`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the attendance record to delete.
*   **Body**: None
*   **Sample Output (Success 204 NO CONTENT)**: Empty

### 5. Get Attendance by Student
*   **Endpoint**: `/api/attendance/student/{studentId}`
*   **Type**: `GET`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `studentId` (String, Path Variable) - The ID of the student.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `List<AttendanceRecordResponseDto>`

### 6. Get Attendance by Student and Course
*   **Endpoint**: `/api/attendance/student/{studentId}/course/{courseId}`
*   **Type**: `GET`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**:
    *   `studentId` (String, Path Variable) - The ID of the student.
    *   `courseId` (String, Path Variable) - The ID of the course.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `List<AttendanceRecordResponseDto>`

### 7. Get Attendance by Course
*   **Endpoint**: `/api/attendance/course/{courseId}`
*   **Type**: `GET`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `courseId` (String, Path Variable) - The ID of the course.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `List<AttendanceRecordResponseDto>`

### 8. Get Attendance by Course and Date
*   **Endpoint**: `/api/attendance/course/{courseId}/date/{dateString}`
*   **Type**: `GET`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**:
    *   `courseId` (String, Path Variable) - The ID of the course.
    *   `dateString` (String, Path Variable) - The date in YYYY-MM-DD format.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `List<AttendanceRecordResponseDto>`

---

## Grade Management (`/api/grades`)
*All endpoints require `ADMIN` role and `Authorization: Basic <base64-encoded-username-password>` header.*

### 1. Create Grade
*   **Endpoint**: `/api/grades`
*   **Type**: `POST`
*   **Headers**: `Content-Type: application/json`, `Authorization: Basic ...`
*   **Parameters**: None
*   **Body**: `GradeRequestDto`
    ```json
    {
      "studentId": "student_id_string",
      "courseId": "course_id_string",
      "assessmentType": "Midterm Exam",
      "gradeValue": "A+",
      "assessmentDate": "YYYY-MM-DD", // e.g., "2023-10-15"
      "comments": "Excellent performance."
    }
    ```
*   **Sample Output (Success 201 CREATED)**: `GradeResponseDto`
    ```json
    {
      "id": "generated_grade_id_string",
      "studentId": "student_id_string",
      "courseId": "course_id_string",
      "studentName": "John Doe", // Populated by service
      "courseName": "Introduction to CS", // Populated by service
      "assessmentType": "Midterm Exam",
      "gradeValue": "A+",
      "assessmentDate": "2023-10-15",
      "comments": "Excellent performance."
    }
    ```

### 2. Get Grade by ID
*   **Endpoint**: `/api/grades/{id}`
*   **Type**: `GET`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the grade.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `GradeResponseDto` (same structure as create grade output)

### 3. Update Grade
*   **Endpoint**: `/api/grades/{id}`
*   **Type**: `PUT`
*   **Headers**: `Content-Type: application/json`, `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the grade to update.
*   **Body**: `GradeRequestDto` (all fields for update)
    ```json
    {
      "studentId": "student_id_string",
      "courseId": "course_id_string",
      "assessmentType": "Final Exam",
      "gradeValue": "A",
      "assessmentDate": "YYYY-MM-DD",
      "comments": "Good work."
    }
    ```
*   **Sample Output (Success 200 OK)**: `GradeResponseDto` (updated grade record)

### 4. Delete Grade
*   **Endpoint**: `/api/grades/{id}`
*   **Type**: `DELETE`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the grade to delete.
*   **Body**: None
*   **Sample Output (Success 204 NO CONTENT)**: Empty

### 5. Get Grades by Student
*   **Endpoint**: `/api/grades/student/{studentId}`
*   **Type**: `GET`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `studentId` (String, Path Variable) - The ID of the student.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `List<GradeResponseDto>`

### 6. Get Grades by Course
*   **Endpoint**: `/api/grades/course/{courseId}`
*   **Type**: `GET`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `courseId` (String, Path Variable) - The ID of the course.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `List<GradeResponseDto>`

### 7. Get Grades by Student and Course
*   **Endpoint**: `/api/grades/student/{studentId}/course/{courseId}`
*   **Type**: `GET`
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**:
    *   `studentId` (String, Path Variable) - The ID of the student.
    *   `courseId` (String, Path Variable) - The ID of the course.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `List<GradeResponseDto>`

---

## Timetable Scheduling (`/api/timetable`)
*Default Header: `Authorization: Basic <base64-encoded-username-password>`*

### 1. Create Scheduled Class
*   **Endpoint**: `/api/timetable`
*   **Type**: `POST`
*   **Security**: Requires `ADMIN` role.
*   **Headers**: `Content-Type: application/json`, `Authorization: Basic ...`
*   **Parameters**: None
*   **Body**: `ScheduledClassRequestDto`
    ```json
    {
      "courseId": "course_id_string",
      "dayOfWeek": "MONDAY", // e.g., MONDAY, TUESDAY, ..., FRIDAY
      "startTime": "HH:MM",  // e.g., "09:00"
      "endTime": "HH:MM",    // e.g., "10:30"
      "roomNumber": "Room A101",
      "instructorName": "Dr. Smith"
    }
    ```
*   **Sample Output (Success 201 CREATED)**: `ScheduledClassResponseDto`
    ```json
    {
      "id": "generated_schedule_id_string",
      "courseId": "course_id_string",
      "courseName": "Introduction to CS", // Populated by service
      "dayOfWeek": "MONDAY",
      "startTime": "09:00",
      "endTime": "10:30",
      "roomNumber": "Room A101",
      "instructorName": "Dr. Smith"
    }
    ```

### 2. Get Scheduled Class by ID
*   **Endpoint**: `/api/timetable/{id}`
*   **Type**: `GET`
*   **Security**: Requires `ADMIN` or `STUDENT` role.
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the scheduled class.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `ScheduledClassResponseDto` (same structure as create output)

### 3. Get All Scheduled Classes
*   **Endpoint**: `/api/timetable`
*   **Type**: `GET`
*   **Security**: Requires `ADMIN` or `STUDENT` role.
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: None
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `List<ScheduledClassResponseDto>`

### 4. Get Scheduled Classes by Course ID
*   **Endpoint**: `/api/timetable/course/{courseId}`
*   **Type**: `GET`
*   **Security**: Requires `ADMIN` or `STUDENT` role.
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `courseId` (String, Path Variable) - The ID of the course.
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `List<ScheduledClassResponseDto>`

### 5. Get Scheduled Classes by Day of Week
*   **Endpoint**: `/api/timetable/day/{dayOfWeek}`
*   **Type**: `GET`
*   **Security**: Requires `ADMIN` or `STUDENT` role.
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `dayOfWeek` (String, Path Variable) - e.g., "MONDAY", "TUESDAY".
*   **Body**: None
*   **Sample Output (Success 200 OK)**: `List<ScheduledClassResponseDto>`

### 6. Update Scheduled Class
*   **Endpoint**: `/api/timetable/{id}`
*   **Type**: `PUT`
*   **Security**: Requires `ADMIN` role.
*   **Headers**: `Content-Type: application/json`, `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the scheduled class to update.
*   **Body**: `ScheduledClassRequestDto` (all fields for update)
    ```json
    {
      "courseId": "course_id_string",
      "dayOfWeek": "WEDNESDAY",
      "startTime": "14:00",
      "endTime": "15:30",
      "roomNumber": "Room B205",
      "instructorName": "Dr. Jones"
    }
    ```
*   **Sample Output (Success 200 OK)**: `ScheduledClassResponseDto` (updated record)

### 7. Delete Scheduled Class
*   **Endpoint**: `/api/timetable/{id}`
*   **Type**: `DELETE`
*   **Security**: Requires `ADMIN` role.
*   **Headers**: `Authorization: Basic ...`
*   **Parameters**: `id` (String, Path Variable) - The ID of the scheduled class to delete.
*   **Body**: None
*   **Sample Output (Success 204 NO CONTENT)**: Empty 