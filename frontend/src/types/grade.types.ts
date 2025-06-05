import { z } from 'zod';

// Assuming Student and Course types will be Picked or minimally defined as needed for Grade display
// For now, we'll rely on IDs and names that the backend DTO will provide for student/course context.

// 1. Grade Interface (represents data from backend - GradeResponseDto)
export interface Grade {
  id: string;
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  // studentEmail?: string; // If available and needed from backend response
  courseId: string;
  courseCode: string;
  courseName: string;
  assessmentType: string;
  gradeValue: string;
  assessmentDate?: string | null; // ISO date string e.g., "2023-10-26" or null
  comments?: string | null;
  // We might also have createdDate/lastModifiedDate from backend if using Auditable entities
}

// 2. Zod Schema for Grade Form Data (matches GradeRequestDto on backend)
export const gradeFormSchema = z.object({
  studentId: z.string().min(1, { message: "Student is required." }),
  courseId: z.string().min(1, { message: "Course is required." }),
  assessmentType: z.string()
    .min(1, { message: "Assessment type is required." })
    .max(50, { message: "Assessment type must be 50 characters or less." }),
  gradeValue: z.string()
    .min(1, { message: "Grade value is required." })
    .max(20, { message: "Grade value must be 20 characters or less." }), // e.g., "A+", "Pass", "85/100"
  assessmentDate: z.date().optional().nullable(), // Optional date from calendar picker
  comments: z.string()
    .max(255, { message: "Comments must be 255 characters or less." })
    .optional()
    .nullable(),
});

// 3. GradeFormData Type (inferred from the schema for use in forms)
export type GradeFormData = z.infer<typeof gradeFormSchema>; 