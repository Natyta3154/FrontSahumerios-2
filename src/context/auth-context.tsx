"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { loginAction, signupAction } from "@/app/admin/(protected)/dashboard/actions";

const API_BASE_URL_GOOGLE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password?: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// 🔹 Asegúrate de declarar el contexto antes de usarlo
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuthSuccess = (userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("authUser", JSON.stringify(userData));
    localStorage.setItem("authToken", tokenData);
  };

  const login = useCallback(async (email: string, password?: string) => {
    setLoading(true);
    setError(null);
    try {
      const { user: userData, token: tokenData } = await loginAction(email, password);
      handleAuthSuccess(userData, tokenData);
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
      const { user: userData, token: tokenData } = await signupAction(name, email, password);
      handleAuthSuccess(userData, tokenData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL_GOOGLE}/usuarios/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error("Error logout backend", e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
      router.push('/');
    }
  }, [router]);

  const value = useMemo(
    () => ({ user, token, loading, error, login, signup, logout }),
    [user, token, loading, error, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
