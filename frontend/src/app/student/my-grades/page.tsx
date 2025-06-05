'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { BookOpenCheck, AlertCircle, Loader2 } from 'lucide-react';

import type { Grade } from '@/types/grade.types';
import { getMyGrades } from '@/services/gradeService';
import { ApiError } from '@/lib/apiClient';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';

interface GroupedGrades {
  [courseKey: string]: {
    courseId: string;
    courseCode: string;
    courseName: string;
    grades: Grade[];
  };
}

export default function MyGradesPage() {
  const { user, fetchWithAuth, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isStudent = user?.roles?.includes('ROLE_STUDENT');

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (!user) {
      router.push('/login');
      return;
    }
    if (!isStudent) {
      // Or redirect to a generic dashboard / show access denied
      setError("Access Denied: This page is for students only.");
      setIsLoadingData(false);
      return;
    }

    if (fetchWithAuth) {
      getMyGrades(fetchWithAuth)
        .then(setGrades)
        .catch(err => {
          console.error('Failed to fetch grades:', err);
          let errorMessage = 'Failed to load your grades.';
          if (err instanceof ApiError) {
            errorMessage = err.message || errorMessage;
            if (err.data?.message) {
              errorMessage += `: ${err.data.message}`;
            }
          }
          setError(errorMessage);
          toast.error('Error fetching grades', { description: errorMessage });
        })
        .finally(() => setIsLoadingData(false));
    }
  }, [user, fetchWithAuth, authLoading, router, isStudent]);

  const groupedGrades = useMemo(() => {
    return grades.reduce<GroupedGrades>((acc, grade) => {
      const courseKey = grade.courseId; // Using courseId as key
      if (!acc[courseKey]) {
        acc[courseKey] = {
          courseId: grade.courseId,
          courseCode: grade.courseCode,
          courseName: grade.courseName,
          grades: [],
        };
      }
      acc[courseKey].grades.push(grade);
      // Sort grades within each course, e.g., by assessment date or type (optional)
      acc[courseKey].grades.sort((a, b) => {
        if (a.assessmentDate && b.assessmentDate) {
          return new Date(a.assessmentDate).getTime() - new Date(b.assessmentDate).getTime();
        }
        return (a.assessmentType || '').localeCompare(b.assessmentType || '');
      });
      return acc;
    }, {});
  }, [grades]);

  if (authLoading || (isLoadingData && !error)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading your grades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-2xl font-semibold text-destructive">Error</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
        <Button onClick={() => router.push('/')} className="mt-6">Go to Homepage</Button>
      </div>
    );
  }
  
  if (!isStudent && !authLoading) {
     // This case should ideally be caught by the useEffect redirect or error setting
     return (
      <div className="container mx-auto py-10 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h1 className="mt-4 text-2xl font-semibold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Grades</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          View a summary of your academic performance across all courses.
        </p>
      </div>

      {Object.keys(groupedGrades).length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <BookOpenCheck className="mx-auto h-16 w-16 text-muted-foreground" />
            <CardTitle className="mt-4">No Grades Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              It seems there are no grades recorded for you yet. Please check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.values(groupedGrades).map(({ courseId, courseCode, courseName, grades: courseGrades }) => (
            <Card key={courseId} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">
                  {courseCode} - {courseName}
                </CardTitle>
                <CardDescription>Assessments and grades for this course.</CardDescription>
              </CardHeader>
              <CardContent>
                {courseGrades.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Assessment Type</TableHead>
                        <TableHead className="w-1/4 text-center">Grade</TableHead>
                        <TableHead className="w-1/4 text-center">Assessment Date</TableHead>
                        <TableHead className="w-1/3">Comments</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseGrades.map(grade => (
                        <TableRow key={grade.id}>
                          <TableCell className="font-medium">{grade.assessmentType}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="text-sm">{grade.gradeValue}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {grade.assessmentDate ? format(parseISO(grade.assessmentDate), 'MMM d, yyyy') : 'N/A'}
                          </TableCell>
                          <TableCell className="text-muted-foreground italic">
                            {grade.comments || '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No grades recorded for this course yet.</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 