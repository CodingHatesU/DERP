import apiClient, { ApiError, type ApiErrorData } from '../lib/apiClient';
// Removed import for AuthContextType as it's not directly exported and no longer needed with the fetcher pattern
import type { Course, CourseFormData } from '../types/course.types';

const COURSE_API_BASE = '/courses';

// Type for the fetcher function, compatible with apiClient and fetchWithAuth from AuthContext
// apiClient itself is a generic function, so typeof apiClient is appropriate here.
// The fetchWithAuth provided by AuthContext is also compatible with this signature.
type FetcherType = typeof apiClient;

export const getAllCourses = async (fetcher: FetcherType = apiClient): Promise<Course[]> => {
  try {
    return await fetcher<Course[]>(COURSE_API_BASE);
  } catch (error) {
    console.error('Error fetching courses:', error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || 'An unexpected error occurred while fetching courses',
      0, // Default status for client-side/unexpected errors
      { message: err.message || 'An unexpected error occurred while fetching courses' } as ApiErrorData
    );
  }
};

export const createCourse = async (data: CourseFormData, fetcher: FetcherType = apiClient): Promise<Course> => {
  try {
    return await fetcher<Course>(COURSE_API_BASE, {
      method: 'POST',
      body: data, // apiClient handles JSON.stringify if body is an object
      headers: { 'Content-Type': 'application/json' }, // Still good practice to set Content-Type for object bodies
    });
  } catch (error) {
    console.error('Error creating course:', error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || 'An unexpected error occurred while creating the course',
      0,
      { message: err.message || 'An unexpected error occurred while creating the course' } as ApiErrorData
    );
  }
};

export const updateCourse = async (id: string, data: CourseFormData, fetcher: FetcherType = apiClient): Promise<Course> => {
  try {
    return await fetcher<Course>(`${COURSE_API_BASE}/${id}`, {
      method: 'PUT',
      body: data,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating course:', error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || 'An unexpected error occurred while updating the course',
      0,
      { message: err.message || 'An unexpected error occurred while updating the course' } as ApiErrorData
    );
  }
};

export const deleteCourse = async (id: string, fetcher: FetcherType = apiClient): Promise<void> => {
  try {
    await fetcher<void>(`${COURSE_API_BASE}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || 'An unexpected error occurred while deleting the course',
      0,
      { message: err.message || 'An unexpected error occurred while deleting the course' } as ApiErrorData
    );
  }
}; 