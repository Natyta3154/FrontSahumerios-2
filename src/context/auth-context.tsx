"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

const API_BASE_URL_RENDER = process.env.NEXT_PUBLIC_API_BASE_URL_RENDER;

interface AuthContextType {
  user: User | null;
  token?: string;
  loading: boolean;
  error: string | null;
  login: (email: string, password?: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // ⚡ inicia en false
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // ✅ checkAuth opcional, solo intenta si ya hay sesión
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL_RENDER}/usuarios/perfil`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.usuario);
      } else {
        // no rompe si no hay sesión
        setUser(null);
      }
    } catch (err) {
      console.error("Error verificando autenticación", err);
    }
  };

  const login = useCallback(async (email: string, password?: string): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL_RENDER}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en login");
      }

      const data = await response.json();
      setUser(data.usuario);
      return data.usuario; // 👈 devuelve User
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL_RENDER}/usuarios/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error en registro");
      }

      const data = await response.json();
      setUser(data.usuario);
      return data.usuario; // 👈 devuelve User
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL_RENDER}/usuarios/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      console.error("Error logout backend", e);
    } finally {
      setUser(null);
      router.push("/");
    }
  }, [router]);

  const value = useMemo(
    () => ({ user, loading, error, login, signup, logout }),
    [user, loading, error, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
