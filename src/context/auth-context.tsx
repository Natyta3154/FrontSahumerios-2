// --- context/auth-context.tsx ---
"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { loginAction, signupAction } from "@/app/admin/(protected)/dashboard/actions";

const API_BASE_URL_GOOGLE = process.env.URL_BASE_GOOGLE;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("Error leyendo authUser del localStorage", e);
      localStorage.removeItem("authUser");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };

  const login = useCallback(async (email: string, password?: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user: userData } = await loginAction(email, password);
      handleAuthSuccess(userData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user: userData } = await signupAction(name, email, password);
      handleAuthSuccess(userData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL_GOOGLE}/usuarios/logout`, { method: 'POST' });
    } catch (e) {
      console.error("Error logout backend", e);
    } finally {
      setUser(null);
      localStorage.removeItem("authUser");
      router.push('/');
    }
  }, [router]);

  const value = useMemo(() => ({ user, loading, error, login, signup, logout }), [user, loading, error, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
