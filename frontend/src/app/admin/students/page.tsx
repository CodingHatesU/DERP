"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Student } from "@/types/student.types";
import { studentService } from "@/services/studentService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient, { ApiError } from '@/lib/apiClient';

export default function StudentManagementPage() {
  const { user, isAuthenticated, isLoading: authLoading, fetchWithAuth } = useAuth();
  const router = useRouter();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userRoles = user?.roles || [];
  const isAdmin = userRoles.includes('ROLE_ADMIN');

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace("/login?message=Please login to access this page.");
      } else if (!isAdmin) {
        toast.error("Access Denied: You do not have permission to view this page.");
        router.replace("/"); // Or a dedicated unauthorized page
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const fetchStudents = async () => {
        setIsLoadingData(true);
        setError(null);
        try {
          const data = await studentService.getAllStudents(fetchWithAuth as typeof apiClient);
          setStudents(data);
        } catch (err) {
          console.error("Failed to fetch students:", err);
          const apiError = err as ApiError;
          setError(apiError.message || "Failed to load students. Please try again.");
          toast.error(apiError.message || "Failed to load students.");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchStudents();
    }
  }, [isAuthenticated, isAdmin, fetchWithAuth]);

  if (authLoading || (!isAuthenticated && !authLoading) || (!isAdmin && isAuthenticated && !authLoading) ) {
    // Show loading spinner or a generic loading message while auth state is being determined or redirecting
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
            <p className="text-xl">Loading page & verifying permissions...</p>
        </div>
    );
  }
  
  // If checks passed and we are here, user is an admin
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Management</h1>
        <Button onClick={() => {/* Placeholder for Add Student functionality */ toast.info("Add Student functionality coming soon!") }}>
          Add New Student
        </Button>
      </div>

      {isLoadingData && <p>Loading students...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoadingData && !error && students.length === 0 && (
        <p>No students found. Add some!</p>
      )}

      {!isLoadingData && !error && students.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Student List (Simple)</h2>
          <ul className="divide-y divide-gray-200">
            {students.map((student) => (
              <li key={student.id} className="py-3">
                <p className="font-medium">{student.firstName} {student.lastName} ({student.studentIdNumber})</p>
                <p className="text-sm text-gray-500">{student.email}</p>
                {/* Placeholder for Edit/Delete buttons */}
              </li>
            ))}
          </ul>
        </div>
      )}
       {/* Placeholder for ShadCN Table implementation */}
    </div>
  );
} 