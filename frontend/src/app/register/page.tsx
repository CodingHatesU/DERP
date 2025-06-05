"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerFormSchema, RegisterFormInput, RoleEnum, RegisterRequestPayload } from "@/types/auth.types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiError } from "@/lib/apiClient";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";

export default function RegisterPage() {
  const { register, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const form = useForm<RegisterFormInput>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "STUDENT",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/'); // Redirect if already authenticated
    }
  }, [isAuthenticated, router]);

  async function onSubmit(data: RegisterFormInput) {
    const payload: RegisterRequestPayload = {
      username: data.username,
      password: data.password,
      role: data.role || "STUDENT",
    };
    try {
      await register(payload);
      // AuthContext handles redirection on successful registration to login page with a query param
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.data && error.data.message) {
            toast.error(error.data.message); 
        } else {
            toast.error("Registration failed. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred during registration.");
      }
      console.error("Registration error:", error);
    }
  }
  
  if (isAuthenticated) {
    return <p className="text-center mt-8">Redirecting...</p>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Fill in the details below to register for DerpERP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={RoleEnum.enum.STUDENT}>Student</SelectItem>
                        {/* <SelectItem value={RoleEnum.enum.ADMIN}>Admin</SelectItem> */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || form.formState.isSubmitting}>
                {isLoading || form.formState.isSubmitting ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 