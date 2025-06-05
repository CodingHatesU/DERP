import apiClient, { ApiError, type ApiErrorData } from '../lib/apiClient';
import type { Grade, GradeFormData } from '../types/grade.types';

const GRADE_API_BASE = '/grades';
type FetcherType = typeof apiClient;

// Interface for the backend response DTO, if it differs (e.g. date field name)
// Assuming GradeResponseDto from backend has 'assessmentDate' as string | null
// and other fields match the frontend Grade interface after mapping.
interface GradeResponseBackendDto extends Omit<Grade, 'assessmentDate'> {
  assessmentDate?: string | null; // This is what backend sends for date
}

// Helper function to map backend DTO to frontend Grade type
const mapBackendDtoToFrontendGrade = (dto: GradeResponseBackendDto): Grade => {
  return {
    ...dto,
    // assessmentDate is already string | null | undefined, matching Grade type if backend sends it correctly
    // No specific mapping needed here if names align for other fields
    // and frontend Grade.assessmentDate expects string | null.
  };
};

export const getAllGrades = async (fetcher: FetcherType = apiClient): Promise<Grade[]> => {
  try {
    const backendGrades = await fetcher<GradeResponseBackendDto[]>(GRADE_API_BASE);
    return backendGrades.map(mapBackendDtoToFrontendGrade);
  } catch (error) {
    console.error('Error fetching grades:', error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || 'An unexpected error occurred while fetching grades',
      0,
      { message: err.message || 'An unexpected error occurred' } as ApiErrorData
    );
  }
};

export const getGradeById = async (id: string, fetcher: FetcherType = apiClient): Promise<Grade> => {
  try {
    const backendGrade = await fetcher<GradeResponseBackendDto>(`${GRADE_API_BASE}/${id}`);
    return mapBackendDtoToFrontendGrade(backendGrade);
  } catch (error) {
    console.error(`Error fetching grade ${id}:`, error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || `An unexpected error occurred while fetching grade ${id}`,
      0,
      { message: err.message || 'An unexpected error occurred' } as ApiErrorData
    );
  }
};

export const createGrade = async (data: GradeFormData, fetcher: FetcherType = apiClient): Promise<Grade> => {
  try {
    const payload = {
      ...data,
      assessmentDate: data.assessmentDate ? data.assessmentDate.toISOString().split('T')[0] : null,
    };
    const backendGrade = await fetcher<GradeResponseBackendDto>(GRADE_API_BASE, {
      method: 'POST',
      body: payload,
    });
    return mapBackendDtoToFrontendGrade(backendGrade);
  } catch (error) {
    console.error('Error creating grade:', error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || 'An unexpected error occurred while creating the grade',
      0,
      { message: err.message || 'An unexpected error occurred' } as ApiErrorData
    );
  }
};

export const updateGrade = async (id: string, data: GradeFormData, fetcher: FetcherType = apiClient): Promise<Grade> => {
  try {
    const payload = {
      ...data,
      assessmentDate: data.assessmentDate ? data.assessmentDate.toISOString().split('T')[0] : null,
    };
    const backendGrade = await fetcher<GradeResponseBackendDto>(`${GRADE_API_BASE}/${id}`, {
      method: 'PUT',
      body: payload,
    });
    return mapBackendDtoToFrontendGrade(backendGrade);
  } catch (error) {
    console.error(`Error updating grade ${id}:`, error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || `An unexpected error occurred while updating grade ${id}`,
      0,
      { message: err.message || 'An unexpected error occurred' } as ApiErrorData
    );
  }
};

export const deleteGrade = async (id: string, fetcher: FetcherType = apiClient): Promise<void> => {
  try {
    await fetcher<void>(`${GRADE_API_BASE}/${id}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(`Error deleting grade ${id}:`, error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || `An unexpected error occurred while deleting grade ${id}`,
      0,
      { message: err.message || 'An unexpected error occurred' } as ApiErrorData
    );
  }
};

// New function to fetch grades for the logged-in student
export const getMyGrades = async (fetcher: FetcherType = apiClient): Promise<Grade[]> => {
  try {
    const backendGrades = await fetcher<GradeResponseBackendDto[]>(`${GRADE_API_BASE}/my-grades`);
    return backendGrades.map(mapBackendDtoToFrontendGrade);
  } catch (error) {
    console.error('Error fetching my grades:', error);
    if (error instanceof ApiError) throw error;
    const err = error as Error;
    throw new ApiError(
      err.message || 'An unexpected error occurred while fetching your grades',
      0, // Status code might not be available or accurate here, relying on ApiError's handling
      { message: err.message || 'An unexpected error occurred' } as ApiErrorData
    );
  }
}; 