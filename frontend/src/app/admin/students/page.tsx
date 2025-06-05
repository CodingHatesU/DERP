"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Student } from "@/types/student.types";
import { studentService } from "@/services/studentService";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient, { ApiError } from '@/lib/apiClient';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StudentFormDialog from "@/components/admin/students/StudentFormDialog";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";

export default function StudentManagementPage() {
  const { user, isAuthenticated, isLoading: authLoading, fetchWithAuth } = useAuth();
  const router = useRouter();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for dialogs
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  const userRoles = user?.roles || [];
  const isAdmin = userRoles.includes('ROLE_ADMIN');

  const fetchStudents = useCallback(async () => {
    if (isAuthenticated && isAdmin) {
      setIsLoadingData(true);
      setError(null);
      try {
        const data = await studentService.getAllStudents(fetchWithAuth as typeof apiClient);
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        const apiError = err as ApiError;
        setError(apiError.message || "Failed to load students. Please try again.");
      } finally {
        setIsLoadingData(false);
      }
    }
  }, [isAuthenticated, isAdmin, fetchWithAuth]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace("/login?message=Please login to access this page.");
        return;
      } else if (!isAdmin) {
        toast.error("Access Denied: You do not have permission to view this page.");
        router.replace("/");
        return;
      }
      fetchStudents();
    }
  }, [isAuthenticated, isAdmin, authLoading, router, fetchStudents]);

  const handleAddStudent = () => {
    setEditingStudent(null); 
    setIsFormDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsFormDialogOpen(true);
  };

  const handleDeleteStudentClick = (studentId: string) => {
    setDeletingStudentId(studentId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteStudent = async () => {
    if (!deletingStudentId) return;
    setIsProcessingDelete(true);
    try {
      await studentService.deleteStudent(deletingStudentId, fetchWithAuth as typeof apiClient);
      toast.success("Student deleted successfully!");
      fetchStudents(); // Refresh list
    } catch (error) {
      console.error("Failed to delete student:", error);
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to delete student. Please try again.");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingStudentId(null);
      setIsProcessingDelete(false);
    }
  };

  const onStudentFormSuccess = () => {
    fetchStudents(); 
    setIsFormDialogOpen(false); // Close dialog on success
  };

  if (authLoading || (!isAuthenticated && !authLoading) || (!isAdmin && isAuthenticated && !authLoading) ) {
    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
            <p className="text-xl">Loading page & verifying permissions...</p>
        </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Management</h1>
        <Button onClick={handleAddStudent}>
          Add New Student
        </Button>
      </div>

      {isLoadingData && <div className="text-center py-4"><p>Loading students...</p></div>}
      {error && <div className="text-center py-4 text-red-500"><p>Error: {error}</p></div>}

      {!isLoadingData && !error && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>
              A list of all students in the DerpERP system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No students found. Click &quot;Add New Student&quot; to create one.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.studentIdNumber}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditStudent(student)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteStudentClick(student.id)}
                              className="text-red-600 hover:!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-700/20"
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Render the StudentFormDialog */}
      <StudentFormDialog 
        isOpen={isFormDialogOpen} 
        onClose={() => setIsFormDialogOpen(false)} 
        studentData={editingStudent}
        onSuccess={onStudentFormSuccess} 
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteStudent}
        title="Confirm Student Deletion"
        description={`Are you sure you want to delete this student? This action cannot be undone.`}
        isLoading={isProcessingDelete}
      />
    </div>
  );
} 