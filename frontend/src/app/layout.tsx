import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner"; // For displaying notifications

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Derp ERP",
  description: "College ERP System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto p-4">
            {children}
          </main>
          <Toaster richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
