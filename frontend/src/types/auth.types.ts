import { z } from 'zod';

// For form selection and API request payload for role
export const RoleEnum = z.enum(["ADMIN", "STUDENT"]);
export type Role = z.infer<typeof RoleEnum>;

// For the User object, matching backend's ROLE_ADMIN, ROLE_STUDENT
export const BackendRoleEnum = z.enum(["ROLE_ADMIN", "ROLE_STUDENT"]);
export type BackendRole = z.infer<typeof BackendRoleEnum>;

export interface User {
  id: string; // Assuming id is available, typically from a /me or profile endpoint
  username: string;
  roles: BackendRole[];
}

// Schema for the form's input state
const registerFormInputSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
  confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters long." }),
  role: RoleEnum.optional(), // Role is optional here for the form's input type
});

// Type for react-hook-form's state
export type RegisterFormInput = z.infer<typeof registerFormInputSchema>;

// Schema for validation, including the default for 'role' and refinement
export const registerFormSchema = registerFormInputSchema.extend({
  role: RoleEnum.optional().default("STUDENT"), // .default() applies during parsing
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don\'t match.",
  path: ["confirmPassword"], // Point error to confirmPassword field
});

// Type for data after successful validation (role will be non-optional)
export type RegisterFormData = z.infer<typeof registerFormSchema>;

// Type for the data sent to the /api/auth/register endpoint
export interface RegisterRequestPayload {
  username: string;
  password: string;
  role?: Role; // "ADMIN" or "STUDENT" - This matches backend which expects optional role, defaulting to STUDENT
}

export const loginFormSchema = z.object({
  username: z.string().nonempty({ message: "Username is required." }),
  password: z.string().nonempty({ message: "Password is required." }),
});

export type LoginFormData = z.infer<typeof loginFormSchema>; 