"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, Home, BookOpen, UserPlus, LogIn, Users, GraduationCap, LogOut, LayoutDashboard, ListChecks, BookOpenText, CheckCheck, ClipboardEdit } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;
  const isStudent = user?.roles?.includes('ROLE_STUDENT') ?? false;
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      // router.push("/login"); // AuthContext usually handles redirect
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
    setIsSheetOpen(false); // Close sheet on logout
  };

  // Helper for desktop nav items
  const NavMenuItem: React.FC<React.PropsWithChildren<{ href: string; icon?: React.ElementType }>> = ({ href, children, icon: Icon }) => {
    return (
      <Link href={href} passHref>
        <Button variant="ghost" className="hover:bg-gray-700 hover:text-white">
          {Icon && <Icon className="mr-2 h-4 w-4 inline" />} 
          {children}
        </Button>
      </Link>
    );
  };

  // Helper for mobile/sheet nav items
  const NavMenuItemSheet: React.FC<React.PropsWithChildren<{ href: string; icon?: React.ElementType }>> = ({ href, children, icon: Icon }) => {
    return (
      <SheetClose asChild>
        <Link href={href} passHref>
          <Button variant="ghost" className="w-full justify-start">
            {Icon && <Icon className="mr-2 h-4 w-4" />} 
            {children}
          </Button>
        </Link>
      </SheetClose>
    );
  };

  const commonLinks = (
    <>
      <Link href="/">
        <Button variant="ghost" className="w-full justify-start">
          <Home className="mr-2 h-4 w-4" /> Home
        </Button>
      </Link>
      {/* Add other common links here if needed, e.g., public course catalog */}
    </>
  );

  const authLinksMobile = (
    <>
      {isAdmin && (
        <>
          <Link href="/admin/students">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" /> Student Management
            </Button>
          </Link>
          <Link href="/admin/courses">
            <Button variant="ghost" className="w-full justify-start">
              <BookOpenText className="mr-2 h-4 w-4" /> Course Management
            </Button>
          </Link>
          <Link href="/admin/attendance">
            <Button variant="ghost" className="w-full justify-start">
              <CheckCheck className="mr-2 h-4 w-4" /> Attendance
            </Button>
          </Link>
          <Link href="/admin/grades">
            <Button variant="ghost" className="w-full justify-start">
              <ListChecks className="mr-2 h-4 w-4" /> Grade Management
            </Button>
          </Link>
          <Link href="/admin/dashboard">
             <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" /> Admin Dashboard
             </Button>
          </Link>
        </>
      )}
      {/* Add more role-specific or general authenticated user links here */}
      <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-100">
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </Button>
    </>
  );

  const unAuthLinksMobile = (
    <>
      <Link href="/login">
        <Button variant="ghost" className="w-full justify-start">
          <LogIn className="mr-2 h-4 w-4" /> Login
        </Button>
      </Link>
      <Link href="/register">
        <Button variant="ghost" className="w-full justify-start">
          <UserPlus className="mr-2 h-4 w-4" /> Register
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="bg-gray-800 text-white p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
          DerpERP
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-2 items-center">
          {isLoading ? (
            <p className="text-sm">Loading auth state...</p>
          ) : isAuthenticated && user ? (
            <>
              {isAdmin && (
                <>
                  <NavMenuItem href="/admin/dashboard" icon={LayoutDashboard}>Dashboard</NavMenuItem>
                  <NavMenuItem href="/admin/students" icon={Users}>Students</NavMenuItem>
                  <NavMenuItem href="/admin/courses" icon={BookOpenText}>Courses</NavMenuItem>
                  <NavMenuItem href="/admin/attendance" icon={CheckCheck}>Attendance</NavMenuItem>
                  <NavMenuItem href="/admin/grades" icon={ListChecks}>Grades</NavMenuItem>
                  <NavMenuItem href="/admin/timetable" icon={ClipboardEdit}>Timetable</NavMenuItem>
                </>
              )}
              {isStudent && (
                <NavMenuItem href="/student/my-grades" icon={GraduationCap}>My Grades</NavMenuItem>
              )}
              <span className="text-sm">Welcome, {user.username}!</span>
              <Button onClick={handleLogout} variant="outline" size="sm" className="text-white border-white hover:bg-red-600 hover:text-white hover:border-red-600">
                <LogOut className="mr-1 h-4 w-4 inline" /> Logout
              </Button>
            </>
          ) : (
            <>
              <NavMenuItem href="/login" icon={LogIn}>Login</NavMenuItem>
              <NavMenuItem href="/register" icon={UserPlus}>Register</NavMenuItem>
            </>
          )}
        </div>

        {/* Mobile Navigation Trigger (Hamburger Menu) */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="text-gray-800 hover:text-gray-600">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle>DerpERP Menu</SheetTitle>
                <SheetDescription className="sr-only">Mobile navigation menu</SheetDescription>
              </SheetHeader>
              <div className="mt-6 flex flex-col space-y-1">
                <NavMenuItemSheet href="/" icon={Home}>Home</NavMenuItemSheet>
                
                {/* Public links for mobile */}
                {!user && (
                  <>
                    <NavMenuItemSheet href="/login" icon={LogIn}>Login</NavMenuItemSheet>
                    <NavMenuItemSheet href="/register" icon={UserPlus}>Register</NavMenuItemSheet>
                  </>
                )}

                {/* Authenticated user links for mobile */}
                {user && (
                  <>
                    {/* Admin-specific links for mobile */}
                    {isAdmin && (
                      <>
                        <NavMenuItemSheet href="/admin/dashboard" icon={LayoutDashboard}>Dashboard</NavMenuItemSheet>
                        <NavMenuItemSheet href="/admin/students" icon={Users}>Students</NavMenuItemSheet>
                        <NavMenuItemSheet href="/admin/courses" icon={BookOpenText}>Courses</NavMenuItemSheet>
                        <NavMenuItemSheet href="/admin/attendance" icon={CheckCheck}>Attendance</NavMenuItemSheet>
                        <NavMenuItemSheet href="/admin/grades" icon={ListChecks}>Grades</NavMenuItemSheet>
                        <NavMenuItemSheet href="/admin/timetable" icon={ClipboardEdit}>Timetable</NavMenuItemSheet>
                      </>
                    )}
                    {isStudent && (
                      <NavMenuItemSheet href="/student/my-grades" icon={GraduationCap}>My Grades</NavMenuItemSheet>
                    )}
                    <SheetClose asChild>
                      <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100">
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 