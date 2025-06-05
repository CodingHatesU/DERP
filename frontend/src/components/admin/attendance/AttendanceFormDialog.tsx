'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from '@/components/ui/textarea';
import { cn } from "@/lib/utils";
import { AttendanceFormData, attendanceFormSchema, AttendanceStatus, attendanceStatusEnum, AttendanceRecord } from '@/types/attendance.types';
import type { Student } from '@/types/student.types';
import type { Course } from '@/types/course.types';
import { ApiError } from '@/lib/apiClient';

interface AttendanceFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  attendanceRecord?: AttendanceRecord | null; 
  students: Pick<Student, 'id' | 'firstName' | 'lastName'>[]; // Simplified student type for dropdown
  courses: Pick<Course, 'id' | 'courseCode' | 'courseName'>[]; // Simplified course type for dropdown
  onSave: (data: AttendanceFormData, recordId?: string) => Promise<void>;
  isLoading: boolean;
}

export const AttendanceFormDialog: React.FC<AttendanceFormDialogProps> = ({
  isOpen,
  setIsOpen,
  attendanceRecord,
  students,
  courses,
  onSave,
  isLoading,
}) => {
  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      studentId: attendanceRecord?.studentId || '',
      courseId: attendanceRecord?.courseId || '',
      date: attendanceRecord?.date ? new Date(attendanceRecord.date) : new Date(),
      status: attendanceRecord?.status || undefined,
      remarks: attendanceRecord?.remarks || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        studentId: attendanceRecord?.studentId || '',
        courseId: attendanceRecord?.courseId || '',
        date: attendanceRecord?.date ? new Date(attendanceRecord.date) : new Date(), // Ensure date is a Date object
        status: attendanceRecord?.status || undefined,
        remarks: attendanceRecord?.remarks || '',
      });
    }
  }, [isOpen, attendanceRecord, form]);

  const onSubmit = async (data: AttendanceFormData) => {
    try {
      await onSave(data, attendanceRecord?.id);
      toast.success(attendanceRecord ? 'Attendance record updated!' : 'Attendance record created!');
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save attendance record:', error);
      const defaultMessage = attendanceRecord ? 'Failed to update record' : 'Failed to create record';
      if (error instanceof ApiError) {
        toast.error(error.message || defaultMessage, {
          description: error.data?.errors ? JSON.stringify(error.data.errors) : (error.data?.message || 'Please try again.')
        });
      } else {
        toast.error(defaultMessage, {
          description: (error as Error).message || 'An unexpected error occurred.'
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{attendanceRecord ? 'Edit Attendance Record' : 'Add Attendance Record'}</DialogTitle>
          <DialogDescription>
            {attendanceRecord ? 'Update the details of the attendance record.' : 'Enter the details for the new attendance record.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 pb-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.firstName} {student.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.courseCode} - {course.courseName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {attendanceStatusEnum.options.map(statusValue => (
                        <SelectItem key={statusValue} value={statusValue}>
                          {statusValue.charAt(0).toUpperCase() + statusValue.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter any remarks" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (attendanceRecord ? 'Saving...' : 'Creating...') : (attendanceRecord ? 'Save Changes' : 'Create Record')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 