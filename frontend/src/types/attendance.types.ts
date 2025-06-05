import { z } from 'zod';
// We don't need full Student/Course imports if the DTO is flat

// 1. AttendanceStatus Enum
export const attendanceStatusEnum = z.enum([
  "PRESENT",
  "ABSENT",
  "LATE",
  "EXCUSED"
]);
export type AttendanceStatus = z.infer<typeof attendanceStatusEnum>;

// 2. AttendanceRecord Interface (aligns with backend AttendanceRecordResponseDto)
export interface AttendanceRecord {
  id: string;
  // Student details (flat structure from DTO)
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  // studentEmail?: string; // Add if backend DTO provides it
  
  // Course details (flat structure from DTO)
  courseId: string;
  courseCode: string;
  courseName: string;

  date: string; // ISO date string e.g., "2023-10-26"
  status: AttendanceStatus;
  remarks?: string;
}

// 3. Zod Schema for Attendance Form Data (matches AttendanceRecordRequestDto on backend for create/update)
export const attendanceFormSchema = z.object({
  studentId: z.string().min(1, { message: "Student is required." }),
  courseId: z.string().min(1, { message: "Course is required." }),
  date: z.date({
    required_error: "Date is required.",
    invalid_type_error: "That's not a valid date!",
  }),
  status: attendanceStatusEnum,
  remarks: z.string().max(500, { message: "Remarks must be 500 characters or less." }).optional(),
});

// 4. AttendanceFormData Type (inferred from the schema for use in forms)
export type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

// 5. Types for Aggregated Attendance View
export interface AggregatedStudentAttendance {
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  presentCount: number;    // Count of PRESENT or EXCUSED
  totalRecords: number;    // Total records for this student in this course
  attendancePercentage: number; // (presentCount / totalRecords) * 100
}

export interface AggregatedCourseAttendance {
  courseId: string;
  courseCode: string;
  courseName: string;
  studentsAttendance: AggregatedStudentAttendance[];
} 