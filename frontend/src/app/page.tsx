"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <p className="text-xl">Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] text-center">
      <Card className="w-full max-w-lg p-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4">
            Welcome to DerpERP Portal
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Your integrated solution for college management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAuthenticated && user ? (
            <div className="mt-6">
              <p className="text-2xl mb-2">Hello, <span className="font-semibold">{user.username}</span>!</p>
              <p className="text-md mb-4">
                Your role is: <span className="font-semibold">{user.roles.join(", ").replace("ROLE_", "")}</span>
              </p>
              <p className="text-gray-700">
                You can now access the features relevant to your role.
              </p>
              {/* We will add navigation to modules here later */}
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-xl mb-4">Please log in or register to continue.</p>
              <div className="space-x-4">
                <Link href="/login">
                  <Button size="lg">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg">Register</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
