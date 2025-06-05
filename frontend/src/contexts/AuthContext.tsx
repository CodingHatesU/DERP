"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, LoginFormData, RegisterRequestPayload, BackendRole } from '@/types/auth.types';
import apiClient, { ApiError } from '@/lib/apiClient';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  register: (data: RegisterRequestPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchWithAuth: <T>(endpoint: string, options?: RequestInit) => Promise<T>; // Helper to make authenticated API calls
  activeUsername: string | null; // Store username for Basic Auth if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'derp-erp-user';
const CREDENTIALS_STORAGE_KEY = 'derp-erp-credentials'; // For username/password (use with caution)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeUsername, setActiveUsername] = useState<string | null>(null);
  const [activePassword, setActivePassword] = useState<string | null>(null); // Handled with care
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const clearAuthData = () => {
    setUser(null);
    setActiveUsername(null);
    setActivePassword(null);
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(CREDENTIALS_STORAGE_KEY);
  };

  const fetchAndSetUser = useCallback(async (username: string, authHeader: string) => {
    try {
      // Attempt to fetch from a proper /me endpoint first.
      // Replace '/users/me' with your actual endpoint if it exists.
      const fetchedUser = await apiClient<User>('/users/me', {
        headers: { 'Authorization': authHeader },
      });
      setUser(fetchedUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fetchedUser));
      setActiveUsername(fetchedUser.username); 
    } catch (meError) {
      console.warn("Failed to fetch detailed user info from /users/me. Using basic info.", meError);
      // Fallback: Construct user object with known username and inferred roles for test users
      let roles: BackendRole[] = [];
      if (username === 'adminuser') roles = ['ROLE_ADMIN'];
      else if (username === 'studentuser') roles = ['ROLE_STUDENT'];
      
      const fallbackUser: User = {
        id: 'unknown' , // ID is unknown without a proper /me response
        username,
        roles,
      };
      setUser(fallbackUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fallbackUser));
      setActiveUsername(username);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedCreds = localStorage.getItem(CREDENTIALS_STORAGE_KEY);
    
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setActiveUsername(parsedUser.username);
        // If creds are also stored, set them (for persistent Basic Auth header recreation)
        if(storedCreds) {
            const { u, p } = JSON.parse(storedCreds);
            // Check if username matches before setting password to avoid mismatch
            if(parsedUser.username === u) {
                setActivePassword(p);
            }
        }
        // Optionally: verify token/session with a silent API call here
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        clearAuthData();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginFormData) => {
    setIsLoading(true);
    try {
      const authHeader = 'Basic ' + btoa(`${credentials.username}:${credentials.password}`);
      await apiClient<string>('/auth/login', {
        method: 'POST',
        headers: { 'Authorization': authHeader },
      });
      
      // Store credentials for subsequent Basic Auth requests (consider security implications)
      localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify({ u: credentials.username, p: credentials.password }));
      setActivePassword(credentials.password); // Set password for current session

      await fetchAndSetUser(credentials.username, authHeader);
      router.push('/');
    } catch (error) {
      clearAuthData();
      console.error("Login failed:", error);
      if (error instanceof ApiError) throw error;
      throw new ApiError("Login failed. Please check your credentials.", 0, { message: "Login failed"});
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequestPayload) => {
    setIsLoading(true);
    try {
      await apiClient<string>('/auth/register', { method: 'POST', body: data });
      router.push('/login?registered=true');
    } catch (error) {
      console.error("Registration failed:", error);
      if (error instanceof ApiError) throw error;
      throw new ApiError("Registration failed. Please try again.", 0, { message: "Registration failed"});
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
        // Spring Security /logout is often a GET or POST. Assuming POST.
        await apiClient<void>('/logout', { 
            method: 'POST',
            // No specific auth header needed if Spring Security handles session invalidation via cookie
        });
    } catch (error) {
        console.warn("Backend logout call failed or /logout endpoint not configured:", error);
        // Continue with client-side logout regardless
    } finally {
        clearAuthData();
        router.push('/login');
        setIsLoading(false);
    }
  };
  
  // Helper function to make authenticated API calls using Basic Auth if available
  const fetchWithAuth = useCallback(async <T extends unknown>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    if (!activeUsername || !activePassword) {
        // This case should ideally not happen if routes are protected and user is not authenticated.
        // Or, it means we are trying to call an authenticated endpoint without being logged in.
        console.warn("fetchWithAuth called without active credentials. This might fail if endpoint is protected.");
        // Fallback to public request or let it fail if endpoint requires auth
         return apiClient<T>(endpoint, options);
    }
    const authHeader = 'Basic ' + btoa(`${activeUsername}:${activePassword}`);
    return apiClient<T>(endpoint, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': authHeader,
        },
    });
  }, [activeUsername, activePassword]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, fetchWithAuth, activeUsername }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 