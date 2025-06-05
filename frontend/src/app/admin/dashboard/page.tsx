'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function AdminDashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && !user.roles?.includes('ROLE_ADMIN')) {
      // Optional: Redirect if not an admin, or show an unauthorized message
      // For now, let's assume admins are the only ones seeing the link, 
      // but direct access should still be handled.
      toast.error('Access Denied', { description: 'You do not have permission to view this page.'});
      router.push('/'); 
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;
  }
  
  // Additional check in case useEffect redirect hasn't fired or is bypassed
  if (!user.roles?.includes('ROLE_ADMIN')) {
     return <div className="flex items-center justify-center h-screen"><p>Access Denied. Redirecting...</p></div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Welcome to the Admin Dashboard. More features coming soon!</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the Admin Dashboard.</p>
          {/* You can add more placeholder content or links to other admin sections here */}
        </CardContent>
      </Card>
    </div>
  );
} 