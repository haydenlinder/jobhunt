'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SignInResponse, SignUpResponse } from '@nhost/nhost-js';
import { nhost } from '@/lib/nhost-client';

// Auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<SignInResponse>;
  signUp: (formData: SignUpFormData) => Promise<SignUpResponse>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
  refreshToken: () => Promise<void>;
}

// Sign up form data type
interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName?: string;
  companyWebsite?: string;
  createCompany?: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize authentication state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if user is already signed in
      const { session, error } = await nhost.auth.refreshSession();

      if (session) {
        setUser(session.user);
      } else {
        console.log('No active session:', error?.message);
        setUser(null);
      }

      setLoading(false);
    };

    initializeAuth();

    // Set up auth state change listener
    const unsubscribe = nhost.auth.onAuthStateChanged((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Clean up subscription
    return () => {
      unsubscribe();
    };
  }, []);

  // Log in with email and password
  const login = async (email: string, password: string) => {
    const response = await nhost.auth.signIn({
      email,
      password,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response;
  };

  // Sign up a new user
  const signUp = async (formData: SignUpFormData) => {
    const { firstName, lastName, email, password, companyName, companyWebsite, createCompany } =
      formData;

    // Prepare metadata for user registration
    const metadata = {
      firstName,
      lastName,
      ...(createCompany && companyName
        ? {
            companyName,
            companyWebsite: companyWebsite || '',
          }
        : {}),
    };

    const response = await nhost.auth.signUp({
      email,
      password,
      options: {
        displayName: `${firstName} ${lastName}`,
        metadata,
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response;
  };

  // Log out
  const logout = async () => {
    await nhost.auth.signOut();
  };

  // Get current access token
  const getToken = async () => {
    return nhost.auth.getAccessToken();
  };

  // Refresh token
  const refreshToken = async () => {
    const { session, error } = await nhost.auth.refreshSession();

    if (error) {
      throw new Error(error.message);
    }
  };

  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    signUp,
    logout,
    getToken,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
