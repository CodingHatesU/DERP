"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Student, StudentFormData, studentFormSchema } from '@/types/student.types';
import { studentService } from '@/services/studentService';
import { useAuth } from '@/contexts/AuthContext';
import apiClient, { ApiError } from '@/lib/apiClient';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface StudentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  studentData?: Student | null; // For editing, null for adding
  onSuccess: () => void; // Callback to refresh student list
}

export default function StudentFormDialog({
  isOpen,
  onClose,
  studentData,
  onSuccess,
}: StudentFormDialogProps) {
  const { fetchWithAuth } = useAuth();
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      studentIdNumber: "",
    },
  });

  const { handleSubmit, reset, formState: { isSubmitting, errors } } = form;

  useEffect(() => {
    if (studentData) {
      reset({
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        studentIdNumber: studentData.studentIdNumber,
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        studentIdNumber: "",
      });
    }
  }, [studentData, reset, isOpen]); // Also reset when dialog opens

  const processSubmit = async (data: StudentFormData) => {
    try {
      let response;
      if (studentData?.id) {
        // Update existing student
        response = await studentService.updateStudent(studentData.id, data, fetchWithAuth as typeof apiClient);
        toast.success("Student updated successfully!");
      } else {
        // Create new student
        response = await studentService.createStudent(data, fetchWithAuth as typeof apiClient);
        toast.success("Student created successfully!");
      }
      onSuccess(); // Call callback to refresh list / other actions
      onClose(); // Close dialog
    } catch (error) {
      console.error("Failed to save student:", error);
      const apiError = error as ApiError;
      toast.error(apiError.message || "Failed to save student. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{studentData?.id ? "Edit Student" : "Add New Student"}</DialogTitle>
          <DialogDescription>
            {studentData?.id ? "Update the student details below." : "Fill in the details to add a new student."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="studentIdNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID Number</FormLabel>
                  <FormControl>
                    <Input placeholder="S12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (studentData?.id ? "Saving..." : "Creating...") : (studentData?.id ? "Save Changes" : "Create Student")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 