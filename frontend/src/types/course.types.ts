import { z } from 'zod';

// Schema for course data submission (credits is a required number)
export const courseSubmitSchema = z.object({
  courseCode: z.string().min(1, { message: "Course code is required." }).max(20, { message: "Course code must be 20 characters or less." }),
  courseName: z.string().min(1, { message: "Course name is required." }).max(100, { message: "Course name must be 100 characters or less." }),
  description: z.string().max(500, { message: "Description must be 500 characters or less." }).optional(),
  credits: z.number({ required_error: "Credits are required.", invalid_type_error: "Credits must be a number." })
    .min(0, { message: "Credits cannot be negative." })
    .max(10, { message: "Credits cannot be too high (max 10)." }),
});
export type CourseSubmitData = z.infer<typeof courseSubmitSchema>;

// Schema for form input validation. Credits is a string here for easier form handling.
// The actual numeric conversion and strict validation happens on submit using courseSubmitSchema.
export const courseFormSchema = z.object({
  courseCode: z.string().min(1, { message: "Course code is required." }).max(20, { message: "Course code must be 20 characters or less." }),
  courseName: z.string().min(1, { message: "Course name is required." }).max(100, { message: "Course name must be 100 characters or less." }),
  description: z.string().max(500, { message: "Description must be 500 characters or less." }).optional(),
  credits: z.string()
    .optional()
    .refine((val) => {
      if (val === undefined || val === "") return true; // Allow empty or undefined
      const num = Number(val);
      return !isNaN(num) && num >= 0 && num <= 10;
    }, { message: "Credits must be a number between 0 and 10." }),
});

// Type for course form data (used in react-hook-form), credits is string | undefined
export type CourseFormData = z.infer<typeof courseFormSchema>;

// Interface for course data received from the backend (matches backend CourseResponseDto)
export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  description?: string;
  credits: number; // Backend and display will use number
} 