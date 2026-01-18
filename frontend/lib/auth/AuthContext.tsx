'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, sanctumClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  display_name: string;
  subscription_tier: string;
  notification_preferences: Record<string, unknown>;
  email_verified_at: string | null;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (
    email: string,
    password: string,
    password_confirmation: string,
    display_name: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userData = await apiClient.get<User>('/v1/user');
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email: string, password: string, remember: boolean = false) => {
    await sanctumClient.getCsrfToken();
    await apiClient.post('/v1/auth/login', { email, password, remember });
    await fetchUser();
  };

  const register = async (
    email: string,
    password: string,
    password_confirmation: string,
    display_name: string
  ) => {
    await sanctumClient.getCsrfToken();
    await apiClient.post('/v1/auth/register', {
      email,
      password,
      password_confirmation,
      display_name,
    });
    await fetchUser();
  };

  const logout = async () => {
    await apiClient.post('/v1/auth/logout');
    setUser(null);
  };

  const refetchUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
