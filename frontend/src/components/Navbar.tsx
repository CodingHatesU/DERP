"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, Home, BookOpen, UserPlus, LogIn, Users, GraduationCap, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();
  const isAdmin = user?.roles?.includes('ROLE_ADMIN') ?? false;

  const handleLogout = async () => {
    try {
      await logout();
      // router.push("/login"); // AuthContext usually handles redirect
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
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
              <GraduationCap className="mr-2 h-4 w-4" /> Course Management
            </Button>
          </Link>
           {/* Example: Dashboard link for admin */}
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
                  <Link href="/admin/students">
                    <Button variant="ghost" className="hover:bg-gray-700 hover:text-white">
                      <Users className="mr-1 h-4 w-4 inline" /> Students
                    </Button>
                  </Link>
                  <Link href="/admin/courses">
                    <Button variant="ghost" className="hover:bg-gray-700 hover:text-white">
                      <GraduationCap className="mr-1 h-4 w-4 inline" /> Courses
                    </Button>
                  </Link>
                  {/* Example: Admin Dashboard Link Desktop */}
                  <Link href="/admin/dashboard">
                     <Button variant="ghost" className="hover:bg-gray-700 hover:text-white">
                        <LayoutDashboard className="mr-1 h-4 w-4 inline" /> Dashboard
                     </Button>
                  </Link>
                </>
              )}
              <span className="text-sm">Welcome, {user.username}!</span>
              <Button onClick={handleLogout} variant="outline" size="sm" className="text-white border-white hover:bg-red-600 hover:text-white hover:border-red-600">
                <LogOut className="mr-1 h-4 w-4 inline" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hover:bg-gray-700 hover:text-white">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="default" className="bg-sky-600 hover:bg-sky-700 text-white">Register</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation Trigger (Hamburger Menu) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="text-white hover:text-gray-300 hover:bg-gray-700">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle>
                    <Link href="/" className="text-lg font-bold">
                        DerpERP Menu
                    </Link>
                </SheetTitle>
                {/* <SheetDescription>Navigate through the application.</SheetDescription> */} 
              </SheetHeader>
              <div className="mt-6 space-y-1">
                {commonLinks}
                {isLoading ? (
                  <p className="px-3 py-2 text-sm">Loading...</p>
                ) : isAuthenticated && user ? (
                  authLinksMobile
                ) : (
                  unAuthLinksMobile
                )}
              </div>
              <SheetClose asChild> 
                {/* Optional: Add a close button inside the sheet if needed */}
                {/* <Button variant="outline" className="mt-6 w-full">Close</Button> */}
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
} 