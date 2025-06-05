'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';

import type { Grade, GradeFormData } from '@/types/grade.types';
import { getAllGrades, createGrade, updateGrade, deleteGrade } from '@/services/gradeService';
import { studentService } from '@/services/studentService'; // To fetch students for dropdown
import { getAllCourses } from '@/services/courseService';   // Corrected: Import specific function
import type { Student } from '@/types/student.types';
import type { Course } from '@/types/course.types';
import { ApiError } from '@/lib/apiClient';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { GradeFormDialog } from '@/components/admin/grades/GradeFormDialog';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog';

export default function GradeManagementPage() {
  const { user, fetchWithAuth, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [grades, setGrades] = useState<Grade[]>([]);
  const [students, setStudents] = useState<Pick<Student, 'id' | 'firstName' | 'lastName'>[]>([]);
  const [courses, setCourses] = useState<Pick<Course, 'id' | 'courseCode' | 'courseName'>[]>([]);
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [gradeToDelete, setGradeToDelete] = useState<Grade | null>(null);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const loadInitialData = useCallback(async () => {
    if (!fetchWithAuth || !isAdmin) return;
    setIsLoadingData(true);
    try {
      const [gradesData, studentsData, coursesData] = await Promise.all([
        getAllGrades(fetchWithAuth),
        studentService.getAllStudents(fetchWithAuth),
        getAllCourses(fetchWithAuth), // Corrected: Use imported function
      ]);
      setGrades(gradesData);
      setStudents(studentsData.map((s: Student) => ({ id: s.id, firstName: s.firstName, lastName: s.lastName }))); // Added type for s
      setCourses(coursesData.map((c: Course) => ({ id: c.id, courseCode: c.courseCode, courseName: c.courseName }))); // Added type for c
    } catch (error) {
      console.error('Failed to fetch initial data for grades:', error);
      toast.error('Failed to load data', {
        description: error instanceof ApiError ? error.message : 'Please try again later.'
      });
    }
    setIsLoadingData(false);
  }, [fetchWithAuth, isAdmin]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user && !isAdmin) {
      toast.error('Access Denied');
      router.push('/');
    } else if (user && isAdmin) {
      loadInitialData();
    }
  }, [user, authLoading, router, isAdmin, loadInitialData]);

  const handleSaveGrade = async (data: GradeFormData, gradeId?: string) => {
    if (!fetchWithAuth) return;
    setIsSubmitting(true);
    try {
      if (gradeId) {
        await updateGrade(gradeId, data, fetchWithAuth);
        toast.success('Grade updated successfully.');
      } else {
        await createGrade(data, fetchWithAuth);
        toast.success('Grade created successfully.');
      }
      loadInitialData(); // Refresh list
      // setIsFormOpen(false); // Dialog will close itself via its onSave prop
      // setSelectedGrade(null); // Dialog will reset itself
    } catch (error) {
      // Error is handled by the GradeFormDialog itself, which shows a toast.
      // No need to re-throw or show another toast here if dialog handles it.
      console.error('Error saving grade (caught in page):', error); 
    }
    setIsSubmitting(false);
  };

  const handleDeleteGrade = async () => {
    if (!fetchWithAuth || !gradeToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteGrade(gradeToDelete.id, fetchWithAuth);
      toast.success('Grade deleted successfully.');
      loadInitialData(); // Refresh list
      setIsDeleteDialogOpen(false);
      setGradeToDelete(null);
    } catch (error) {
      console.error('Failed to delete grade:', error);
      toast.error('Failed to delete grade', {
        description: error instanceof ApiError ? error.message : 'Please try again.'
      });
    }
    setIsSubmitting(false);
  };

  const openFormForCreate = () => {
    setSelectedGrade(null);
    setIsFormOpen(true);
  };

  const openFormForEdit = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (grade: Grade) => {
    setGradeToDelete(grade);
    setIsDeleteDialogOpen(true);
  };

  if (authLoading || (!user && !authLoading) || (user && !isAdmin && !authLoading) ) {
    return <div className="flex items-center justify-center h-screen"><p>Loading or Access Denied...</p></div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Grade Management</CardTitle>
            <CardDescription>View, add, edit, or delete student grades.</CardDescription>
          </div>
          {isAdmin && (
            <Button onClick={openFormForCreate} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Grade
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoadingData ? (
            <p className="text-center py-4">Loading grades...</p>
          ) : grades.length === 0 ? (
            <p className="text-center py-4">No grades found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Assessment Type</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Comments</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell>{grade.studentFirstName} {grade.studentLastName}</TableCell>
                    <TableCell>{grade.courseCode} - {grade.courseName}</TableCell>
                    <TableCell>{grade.assessmentType}</TableCell>
                    <TableCell>{grade.gradeValue}</TableCell>
                    <TableCell>
                      {grade.assessmentDate ? format(parseISO(grade.assessmentDate), 'PPP') : 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{grade.comments || 'N/A'}</TableCell>
                    {isAdmin && (
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
                            <DropdownMenuItem onClick={() => openFormForEdit(grade)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDeleteDialog(grade)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <GradeFormDialog
          isOpen={isFormOpen}
          setIsOpen={setIsFormOpen}
          grade={selectedGrade}
          students={students}
          courses={courses}
          onSave={handleSaveGrade}
          isLoading={isSubmitting}
        />
      )}

      {isAdmin && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteGrade}
          isLoading={isSubmitting}
          title="Confirm Delete Grade"
          description={`Are you sure you want to delete this grade record? This action cannot be undone.`}
        />
      )}
    </div>
  );
} 