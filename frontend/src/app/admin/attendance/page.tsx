'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

import {
  AttendanceRecord,
  AttendanceFormData,
  AttendanceStatus,
  AggregatedCourseAttendance,
  AggregatedStudentAttendance
} from '@/types/attendance.types';
import { getAllAttendanceRecords, createAttendanceRecord, updateAttendanceRecord, deleteAttendanceRecord } from '@/services/attendanceService';
import { studentService } from '@/services/studentService'; // To fetch students for dropdown
import { getAllCourses } from '@/services/courseService';   // To fetch courses for dropdown
import type { Student } from '@/types/student.types';
import type { Course } from '@/types/course.types';
import { ApiError } from '@/lib/apiClient';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttendanceFormDialog } from '@/components/admin/attendance/AttendanceFormDialog';
import DeleteConfirmationDialog from '@/components/common/DeleteConfirmationDialog'; // Default import

export default function AttendanceManagementPage() {
  const { user, fetchWithAuth, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Pick<Student, 'id' | 'firstName' | 'lastName'>[]>([]);
  const [courses, setCourses] = useState<Pick<Course, 'id' | 'courseCode' | 'courseName'>[]>([]);
  
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<AttendanceRecord | null>(null);

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');

  const aggregatedAttendanceData = useMemo((): AggregatedCourseAttendance[] => {
    if (isLoadingData || students.length === 0 || courses.length === 0) {
      return [];
    }

    return courses.map(course => {
      const courseAttendance: AggregatedStudentAttendance[] = students.map(student => {
        const relevantRecords = attendanceRecords.filter(
          record => record.courseId === course.id && record.studentId === student.id
        );

        let presentCount = 0;
        relevantRecords.forEach(record => {
          if (record.status === 'PRESENT' || record.status === 'EXCUSED') {
            presentCount++;
          }
        });

        const totalRecords = relevantRecords.length;
        const attendancePercentage = totalRecords > 0 ? (presentCount / totalRecords) * 100 : 0;

        return {
          studentId: student.id,
          studentFirstName: student.firstName,
          studentLastName: student.lastName,
          presentCount,
          totalRecords,
          attendancePercentage: parseFloat(attendancePercentage.toFixed(1)), // Round to 1 decimal place
        };
      });

      return {
        courseId: course.id,
        courseCode: course.courseCode,
        courseName: course.courseName,
        studentsAttendance: courseAttendance,
      };
    });
  }, [attendanceRecords, students, courses, isLoadingData]);

  const loadInitialData = useCallback(async () => {
    if (!fetchWithAuth || !isAdmin) return;
    setIsLoadingData(true);
    try {
      const [recordsData, studentsData, coursesData] = await Promise.all([
        getAllAttendanceRecords(fetchWithAuth),
        studentService.getAllStudents(fetchWithAuth), // Assuming studentService uses fetchWithAuth
        getAllCourses(fetchWithAuth),
      ]);
      setAttendanceRecords(recordsData);
      setStudents(studentsData.map(s => ({ id: s.id, firstName: s.firstName, lastName: s.lastName })));
      setCourses(coursesData.map(c => ({ id: c.id, courseCode: c.courseCode, courseName: c.courseName })));
    } catch (error) {
      console.error('Failed to fetch initial data for attendance:', error);
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

  const handleSaveRecord = async (data: AttendanceFormData, recordId?: string) => {
    if (!fetchWithAuth) return;
    setIsSubmitting(true);
    try {
      if (recordId) {
        await updateAttendanceRecord(recordId, data, fetchWithAuth);
        toast.success('Attendance record updated successfully.');
      } else {
        await createAttendanceRecord(data, fetchWithAuth);
        toast.success('Attendance record created successfully.');
      }
      loadInitialData(); // Refresh list
      setIsFormOpen(false);
      setSelectedRecord(null);
    } catch (error) {
      console.error('Failed to save attendance record:', error);
      const errorMessage = error instanceof ApiError ? error.message : 'An unexpected error occurred.';
      toast.error('Failed to save record', { description: errorMessage });
      // Do not re-throw if dialog is expected to handle its own errors,
      // but ensure toast is shown here as a fallback.
    }
    setIsSubmitting(false);
  };

  const handleDeleteRecord = async () => {
    if (!fetchWithAuth || !recordToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteAttendanceRecord(recordToDelete.id, fetchWithAuth);
      toast.success(`Attendance record deleted successfully.`);
      loadInitialData(); // Refresh list
      setIsDeleteDialogOpen(false);
      setRecordToDelete(null);
    } catch (error) {
      console.error('Failed to delete attendance record:', error);
      toast.error('Failed to delete record', {
        description: error instanceof ApiError ? error.message : 'Please try again.'
      });
    }
    setIsSubmitting(false);
  };

  const openFormForCreate = () => {
    setSelectedRecord(null);
    setIsFormOpen(true);
  };

  const openFormForEdit = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (record: AttendanceRecord) => {
    setRecordToDelete(record);
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
            <CardTitle>Attendance Management</CardTitle>
            <CardDescription>View, add, edit, or delete attendance records. Switch between timeline and aggregate views.</CardDescription>
          </div>
          {isAdmin && (
            <Button onClick={openFormForCreate} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Record
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
              <TabsTrigger value="aggregate">Aggregate View</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              {isLoadingData ? (
                <p className="text-center py-4">Loading attendance records...</p>
              ) : attendanceRecords.length === 0 ? (
                <p className="text-center py-4">No attendance records found.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remarks</TableHead>
                      {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.studentFirstName} {record.studentLastName}</TableCell>
                        <TableCell>{record.courseCode} - {record.courseName}</TableCell>
                        <TableCell>
                          {record.date && typeof record.date === 'string' ? 
                            format(new Date(record.date), 'PPP') : 
                            'N/A'}
                        </TableCell>
                        <TableCell>{record.status}</TableCell>
                        <TableCell className="max-w-xs truncate">{record.remarks || 'N/A'}</TableCell>
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
                                <DropdownMenuItem onClick={() => openFormForEdit(record)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openDeleteDialog(record)} className="text-red-600">
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
            </TabsContent>
            <TabsContent value="aggregate">
              <Card>
                <CardHeader>
                  <CardTitle>Aggregate Attendance View</CardTitle>
                  <CardDescription>
                    View attendance percentages by course and student.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingData ? (
                    <p className="text-center py-4">Loading aggregate data...</p>
                  ) : aggregatedAttendanceData.length === 0 ? (
                    <p className="text-center py-4">No data available for aggregate view.</p>
                  ) : (
                    <div>
                      {aggregatedAttendanceData.map(courseData => (
                        <div key={courseData.courseId} className="mb-6 p-4 border rounded-lg">
                          <h3 className="text-xl font-semibold mb-2">{courseData.courseName} ({courseData.courseCode})</h3>
                          {courseData.studentsAttendance.length === 0 ? (
                            <p>No students found for this course in the current records.</p>
                          ) : (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Student</TableHead>
                                  <TableHead className="text-center">Present/Excused</TableHead>
                                  <TableHead className="text-center">Total Records</TableHead>
                                  <TableHead className="text-right">Attendance %</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {courseData.studentsAttendance.map(studentAtt => (
                                  <TableRow key={studentAtt.studentId}>
                                    <TableCell>{studentAtt.studentFirstName} {studentAtt.studentLastName}</TableCell>
                                    <TableCell className="text-center">{studentAtt.presentCount}</TableCell>
                                    <TableCell className="text-center">{studentAtt.totalRecords}</TableCell>
                                    <TableCell className="text-right">{studentAtt.attendancePercentage}%</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isAdmin && (
        <AttendanceFormDialog
          isOpen={isFormOpen}
          setIsOpen={setIsFormOpen}
          attendanceRecord={selectedRecord}
          students={students} 
          courses={courses}
          onSave={handleSaveRecord} 
          isLoading={isSubmitting}
        />
      )}

      {isAdmin && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteRecord}
          isLoading={isSubmitting}
          title="Confirm Delete Attendance Record"
          description={`Are you sure you want to delete this attendance record? This action cannot be undone.`}
        />
      )}
    </div>
  );
} 