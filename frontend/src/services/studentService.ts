import apiClient, { ApiError } from "@/lib/apiClient";
import { Student, StudentFormData } from "@/types/student.types";

// We'll assume that the component calling these service functions will use
// the `fetchWithAuth` method from `useAuth` context, which is an authenticated `apiClient` instance.

const STUDENT_API_BASE = "/students";

export const studentService = {
  getAllStudents: async (fetcher: typeof apiClient = apiClient): Promise<Student[]> => {
    return fetcher<Student[]>(STUDENT_API_BASE);
  },

  getStudentById: async (id: string, fetcher: typeof apiClient = apiClient): Promise<Student> => {
    return fetcher<Student>(`${STUDENT_API_BASE}/${id}`);
  },

  createStudent: async (data: StudentFormData, fetcher: typeof apiClient = apiClient): Promise<Student> => {
    return fetcher<Student>(STUDENT_API_BASE, {
      method: "POST",
      body: data,
    });
  },

  updateStudent: async (id: string, data: StudentFormData, fetcher: typeof apiClient = apiClient): Promise<Student> => {
    return fetcher<Student>(`${STUDENT_API_BASE}/${id}`, {
      method: "PUT",
      body: data,
    });
  },

  deleteStudent: async (id: string, fetcher: typeof apiClient = apiClient): Promise<void> => {
    return fetcher<void>(`${STUDENT_API_BASE}/${id}`, {
      method: "DELETE",
    });
  },
}; 