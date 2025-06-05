'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Course, CourseFormData, courseFormSchema, CourseSubmitData, courseSubmitSchema } from '@/types/course.types';
import { ApiError } from '@/lib/apiClient';

interface CourseFormDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  course?: Course | null;
  onSave: (data: CourseSubmitData, courseId?: string) => Promise<void>;
  isLoading: boolean;
}

export const CourseFormDialog: React.FC<CourseFormDialogProps> = ({ isOpen, setIsOpen, course, onSave, isLoading }) => {
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      courseCode: course?.courseCode || '',
      courseName: course?.courseName || '',
      description: course?.description || '',
      credits: course?.credits?.toString() ?? '',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        courseCode: course?.courseCode || '',
        courseName: course?.courseName || '',
        description: course?.description || '',
        credits: course?.credits?.toString() ?? '',
      });
    }
  }, [isOpen, course, form]);

  const onSubmit = async (data: CourseFormData) => {
    try {
      const creditsString = data.credits;
      let creditsForSubmit: number | undefined = undefined;

      if (creditsString !== undefined && creditsString.trim() !== "") {
        const parsedCredits = parseFloat(creditsString);
        if (!isNaN(parsedCredits)) {
          creditsForSubmit = parsedCredits;
        }
      }
      
      const payloadToValidate = {
        ...data,
        credits: creditsForSubmit,
      };

      const validatedDataToSubmit = courseSubmitSchema.parse(payloadToValidate);
      
      await onSave(validatedDataToSubmit, course?.id);
      toast.success(course ? 'Course updated successfully!' : 'Course created successfully!');
      setIsOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error on submit:", error.flatten());
        const fieldErrors = error.flatten().fieldErrors;
        let errorMessage = "Please correct the form errors.";

        const prioritizedFields: (keyof CourseSubmitData)[] = ['credits', 'courseCode', 'courseName', 'description'];
        for (const field of prioritizedFields) {
          if (fieldErrors[field] && (fieldErrors[field] as string[])[0]) {
            errorMessage = (fieldErrors[field] as string[])[0];
            if (field === 'credits') {
                form.setError('credits', { type: 'manual', message: errorMessage});
            } else {
                 form.setError(field as keyof CourseFormData, { type: 'manual', message: errorMessage });
            }
            break; 
          }
        }
         toast.error("Validation Failed", { description: errorMessage });

      } else if (error instanceof ApiError) {
        console.error('API Error saving course:', error);
        const defaultMessage = course ? 'Failed to update course' : 'Failed to create course';
        toast.error(error.message || defaultMessage, {
          description: error.data?.errors ? JSON.stringify(error.data.errors) : (error.data?.message || 'Please try again.')
        });
      } else {
        console.error('Unexpected error saving course:', error);
        toast.error(course ? 'Failed to update course' : 'Failed to create course', {
          description: (error as Error).message || 'An unexpected error occurred.'
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          <DialogDescription>
            {course ? 'Update the details of the course.' : 'Enter the details for the new course.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2 pb-4">
            <FormField
              control={form.control}
              name="courseCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CS101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="courseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Introduction to Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter course description" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits</FormLabel>
                  <FormControl>
                    <Input 
                      type="number"
                      placeholder="e.g., 3" 
                      {...field}
                      value={field.value ?? ''}
                      onChange={e => field.onChange(e.target.value)}
                    />
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
                {isLoading ? (course ? 'Saving...' : 'Creating...') : (course ? 'Save Changes' : 'Create Course')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}; 