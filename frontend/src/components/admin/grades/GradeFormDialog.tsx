'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from '@/components/ui/textarea';
import { cn } from "@/lib/utils";
import { GradeFormData, gradeFormSchema, Grade } from '@/types/grade.types';
import type { Student } from '@/types/student.types'; // Assuming you have a simplified Student type for dropdowns
import type { Course } from '@/types/course.types';   // Assuming you have a simplified Course type for dropdowns
import { ApiError } from '@/lib/apiClient';

interface GradeFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  grade?: Grade | null; 
  students: Pick<Student, 'id' | 'firstName' | 'lastName'>[];
  courses: Pick<Course, 'id' | 'courseCode' | 'courseName'>[];
  onSave: (data: GradeFormData, recordId?: string) => Promise<void>;
  isLoading: boolean;
}

export const GradeFormDialog: React.FC<GradeFormDialogProps> = ({
  isOpen,
  setIsOpen,
  grade,
  students,
  courses,
  onSave,
  isLoading,
}) => {
  const form = useForm<GradeFormData>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      studentId: '',
      courseId: '',
      assessmentType: '',
      gradeValue: '',
      assessmentDate: null, // Default to null, can be set to new Date() if preferred for new entries
      comments: '',
    },
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (grade) {
        form.reset({
          studentId: grade.studentId || '',
          courseId: grade.courseId || '',
          assessmentType: grade.assessmentType || '',
          gradeValue: grade.gradeValue || '',
          assessmentDate: grade.assessmentDate ? parseISO(grade.assessmentDate) : null,
          comments: grade.comments || '',
        });
      } else {
        form.reset({
          studentId: '',
          courseId: '',
          assessmentType: '',
          gradeValue: '',
          assessmentDate: null, // Or new Date() if you want it to default to today for new grades
          comments: '',
        });
      }
    }
  }, [isOpen, grade, form]);

  const onSubmit = async (data: GradeFormData) => {
    try {
      await onSave(data, grade?.id);
      // Toast handled by parent page to allow for different success messages
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to save grade:', error);
      const defaultMessage = grade ? 'Failed to update grade' : 'Failed to create grade';
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
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{grade ? 'Edit Grade' : 'Add Grade'}</DialogTitle>
          <DialogDescription>
            {grade ? 'Update the details of this grade.' : 'Enter the details for the new grade.'}
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
              name="assessmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assessment Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Midterm, Final, Assignment 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gradeValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Value</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A, 85%, Pass" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assessmentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Assessment Date (Optional)</FormLabel>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsCalendarOpen((prev) => !prev);
                          }}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value === null ? undefined : field.value}
                        onSelect={(dateValue) => {
                          field.onChange(dateValue || null);
                          setIsCalendarOpen(false);
                        }}
                        disabled={(date: Date) => date > new Date()} // Allow future dates for assessment scheduling
                        // initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comments (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter any comments" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (grade ? 'Saving...' : 'Creating...') : (grade ? 'Save Changes' : 'Create Grade')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 