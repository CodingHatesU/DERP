import { z } from 'zod';

// Zod schema for student form data validation (matches backend StudentRequestDto)
export const studentFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }).max(50, { message: "First name must be 50 characters or less." }),
  lastName: z.string().min(1, { message: "Last name is required." }).max(50, { message: "Last name must be 50 characters or less." }),
  email: z.string().email({ message: "Invalid email address." }).max(100, { message: "Email must be 100 characters or less." }),
  studentIdNumber: z.string().min(1, { message: "Student ID number is required." }).max(20, { message: "Student ID must be 20 characters or less." }),
});

// Type for student form data (used in react-hook-form)
export type StudentFormData = z.infer<typeof studentFormSchema>;

// Interface for student data received from the backend (matches backend StudentResponseDto)
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentIdNumber: string;
} 