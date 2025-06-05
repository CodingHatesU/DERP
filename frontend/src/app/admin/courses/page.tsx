'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { z } from 'zod';

import { Course, CourseFormData, CourseSubmitData } from '@/types/course.types';
import { getAllCourses, createCourse, updateCourse, deleteCourse } from '@/services/courseService';
import { ApiError } from '@/lib/apiClient';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CourseFormDialog } from '@/components/admin/courses/CourseFormDialog';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog';

export default function CourseManagementPage() {
  const { user, fetchWithAuth, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const loadCourses = useCallback(async () => {
    if (!fetchWithAuth) return;
    setIsLoadingData(true);
    try {
      const data = await getAllCourses(fetchWithAuth);
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses', {
        description: error instanceof ApiError ? error.message : 'Please try again later.'
      });
    }
    setIsLoadingData(false);
  }, [fetchWithAuth]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      loadCourses();
    }
  }, [user, authLoading, router, loadCourses]);

  const handleSaveCourse = async (data: CourseSubmitData, courseId?: string) => {
    if (!fetchWithAuth) return;
    setIsSubmitting(true);
    try {
      // Convert CourseSubmitData (credits: number) to CourseFormData (credits: string | undefined)
      // for the service layer, as services expect form data structure.
      const formDataPayload: CourseFormData = {
        ...data,
        credits: data.credits.toString(), // Convert number back to string for service
      };

      if (courseId) {
        await updateCourse(courseId, formDataPayload, fetchWithAuth);
      } else {
        await createCourse(formDataPayload, fetchWithAuth);
      }
      loadCourses(); // Refresh list
      setIsFormOpen(false);
      setSelectedCourse(null);
      // Success toast is handled by the dialog, but we could add one here if dialog didn't
    } catch (error) {
      // Error toast should be handled by the CourseFormDialog itself.
      // If it reaches here, it means the dialog re-threw it, or it's an unexpected error.
      console.error('Error saving course in page level catch:', error);
      if (!(error instanceof ApiError || error instanceof z.ZodError)) {
        toast.error("An unexpected error occurred while saving the course.");
      }
      // Do not setIsOpen(false) here if error, let dialog manage its state on error.
    }
    setIsSubmitting(false);
  };

  const handleDeleteCourse = async () => {
    if (!fetchWithAuth || !courseToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteCourse(courseToDelete.id, fetchWithAuth);
      toast.success(`Course '${courseToDelete.courseName}' deleted successfully.`);
      loadCourses(); // Refresh list
      setIsDeleteDialogOpen(false);
      setCourseToDelete(null);
    } catch (error) {
      console.error('Failed to delete course:', error);
      toast.error('Failed to delete course', {
        description: error instanceof ApiError ? error.message : 'Please try again.'
      });
    }
    setIsSubmitting(false);
  };

  const openFormForCreate = () => {
    setSelectedCourse(null);
    setIsFormOpen(true);
  };

  const openFormForEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteDialogOpen(true);
  };

  if (authLoading || (!user && !authLoading)) {
    return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Course Management</CardTitle>
            <CardDescription>View, add, edit, or delete courses.</CardDescription>
          </div>
          {isAdmin && (
            <Button onClick={openFormForCreate} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Course
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isLoadingData ? (
            <p>Loading courses...</p>
          ) : courses.length === 0 ? (
            <p>No courses found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Credits</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.courseCode}</TableCell>
                    <TableCell>{course.courseName}</TableCell>
                    <TableCell className="max-w-xs truncate">{course.description || 'N/A'}</TableCell>
                    <TableCell className="text-right">{course.credits}</TableCell>
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
                            <DropdownMenuItem onClick={() => openFormForEdit(course)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openDeleteDialog(course)} className="text-red-600">
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
        <CourseFormDialog
          isOpen={isFormOpen}
          setIsOpen={setIsFormOpen}
          course={selectedCourse}
          onSave={handleSaveCourse} 
          isLoading={isSubmitting}
        />
      )}

      {isAdmin && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteCourse}
          isLoading={isSubmitting}
          title="Confirm Deletion"
          description={`Are you sure you want to delete the course "${courseToDelete?.courseName || 'this course'}"? This action cannot be undone.`}
        />
      )}
    </div>
  );
} 