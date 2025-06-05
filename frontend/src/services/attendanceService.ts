import apiClient, { ApiError, type ApiErrorData } from '../lib/apiClient';
import type { AttendanceRecord, AttendanceFormData, AttendanceStatus } from '../types/attendance.types';

const ATTENDANCE_API_BASE = '/attendance';
type FetcherType = typeof apiClient;

// Define a type for the backend response DTO if it differs significantly in field names
// For this case, only 'attendanceDate' vs 'date' is the main difference.
interface AttendanceRecordResponseBackendDto {
  id: string;
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  // studentEmail?: string; // if backend DTO provides it
  courseId: string;
  courseCode: string;
  courseName: string;
  attendanceDate: string; // Backend sends this
  status: AttendanceStatus;
  remarks?: string;
}

// Helper function to map backend DTO to frontend AttendanceRecord type
const mapBackendDtoToFrontendRecord = (dto: AttendanceRecordResponseBackendDto): AttendanceRecord => {
  return {
    ...dto,
    date: dto.attendanceDate, // Map attendanceDate to date
  };
};

/**
 * Fetches all attendance records.
 * TODO: Implement query parameters for filtering (e.g., studentId, courseId, date, dateRange).
 */
export const getAllAttendanceRecords = async (fetcher: FetcherType = apiClient): Promise<AttendanceRecord[]> => {
  try {
    const backendRecords = await fetcher<AttendanceRecordResponseBackendDto[]>(ATTENDANCE_API_BASE);
    return backendRecords.map(mapBackendDtoToFrontendRecord);
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
    const payload = {
        studentId: data.studentId,
        courseId: data.courseId,
        attendanceDate: data.date.toISOString().split('T')[0],
        status: data.status,
    };
    const backendRecord = await fetcher<AttendanceRecordResponseBackendDto>(ATTENDANCE_API_BASE, {
      method: 'POST',
      body: payload,
    });
    return mapBackendDtoToFrontendRecord(backendRecord);
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
        studentId: data.studentId,
        courseId: data.courseId,
        attendanceDate: data.date.toISOString().split('T')[0],
        status: data.status,
    };
    const backendRecord = await fetcher<AttendanceRecordResponseBackendDto>(`${ATTENDANCE_API_BASE}/${id}`, {
      method: 'PUT',
      body: payload,
    });
    return mapBackendDtoToFrontendRecord(backendRecord);
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
//     const backendRecord = await fetcher<AttendanceRecordResponseBackendDto>(`${ATTENDANCE_API_BASE}/${id}`);
//     return mapBackendDtoToFrontendRecord(backendRecord);
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