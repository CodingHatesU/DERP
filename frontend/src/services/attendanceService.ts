import apiClient, { ApiError, type ApiErrorData } from '../lib/apiClient';
import type { AttendanceRecord, AttendanceFormData } from '../types/attendance.types';

const ATTENDANCE_API_BASE = '/attendance';
type FetcherType = typeof apiClient;

/**
 * Fetches all attendance records.
 * TODO: Implement query parameters for filtering (e.g., studentId, courseId, date, dateRange).
 */
export const getAllAttendanceRecords = async (fetcher: FetcherType = apiClient): Promise<AttendanceRecord[]> => {
  try {
    // Example: /attendance?studentId=123&courseId=abc&startDate=2023-01-01&endDate=2023-01-31
    return await fetcher<AttendanceRecord[]>(ATTENDANCE_API_BASE);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || 'An unexpected error occurred while fetching attendance records',
      0,
      { message: err.message || 'An unexpected error occurred' } as ApiErrorData
    );
  }
};

export const createAttendanceRecord = async (data: AttendanceFormData, fetcher: FetcherType = apiClient): Promise<AttendanceRecord> => {
  try {
    // The date in AttendanceFormData is a Date object. The backend expects an ISO string.
    // apiClient should stringify the body, and Spring Boot should handle Date to LocalDate conversion.
    // If not, we might need to manually format data.date to 'yyyy-MM-dd' string here.
    const payload = {
        ...data,
        date: data.date.toISOString().split('T')[0], // Format date to YYYY-MM-DD string
    };
    return await fetcher<AttendanceRecord>(ATTENDANCE_API_BASE, {
      method: 'POST',
      body: payload,
      // headers: { 'Content-Type': 'application/json' }, // apiClient handles this for object bodies
    });
  } catch (error) {
    console.error('Error creating attendance record:', error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || 'An unexpected error occurred while creating the attendance record',
      0,
      { message: err.message || 'An unexpected error occurred' } as ApiErrorData
    );
  }
};

export const updateAttendanceRecord = async (id: string, data: AttendanceFormData, fetcher: FetcherType = apiClient): Promise<AttendanceRecord> => {
  try {
    const payload = {
        ...data,
        date: data.date.toISOString().split('T')[0], // Format date to YYYY-MM-DD string
    };
    return await fetcher<AttendanceRecord>(`${ATTENDANCE_API_BASE}/${id}`, {
      method: 'PUT',
      body: payload,
    });
  } catch (error) {
    console.error('Error updating attendance record:', error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || 'An unexpected error occurred while updating the attendance record',
      0,
      { message: err.message || 'An unexpected error occurred' } as ApiErrorData
    );
  }
};

export const deleteAttendanceRecord = async (id: string, fetcher: FetcherType = apiClient): Promise<void> => {
  try {
    await fetcher<void>(`${ATTENDANCE_API_BASE}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || 'An unexpected error occurred while deleting the attendance record',
      0,
      { message: err.message || 'An unexpected error occurred' } as ApiErrorData
    );
  }
};

// Optional: Get a single attendance record by ID if needed, though not always required if list view is primary.
// export const getAttendanceRecordById = async (id: string, fetcher: FetcherType = apiClient): Promise<AttendanceRecord> => {
//   try {
//     return await fetcher<AttendanceRecord>(`${ATTENDANCE_API_BASE}/${id}`);
//   } catch (error) {
//     console.error(`Error fetching attendance record ${id}:`, error);
//     if (error instanceof ApiError) throw error;
//     const err = error as Error;
//     throw new ApiError(
//       err.message || `An unexpected error occurred while fetching attendance record ${id}`,
//       0,
//       { message: err.message || 'An unexpected error occurred' } as ApiErrorData
//     );
//   }
// }; 