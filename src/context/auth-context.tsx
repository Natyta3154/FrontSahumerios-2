
"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { loginAction, signupAction } from "@/app/admin/(protected)/dashboard/actions";


// --- React Context ---

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password?: string, isAdminLogin?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse auth data from localStorage", e);
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuthSuccess = (userData: User, userToken: string) => {
    const userToStore: User = {
      id: userData.id,
      nombre: userData.nombre,
      email: userData.email,
      rol: userData.rol,
      ...(userData.fechaRegistro && { fechaRegistro: userData.fechaRegistro }),
    };
    setUser(userToStore);
    setToken(userToken);
    localStorage.setItem("authToken", userToken);
    localStorage.setItem("authUser", JSON.stringify(userToStore));
  };
  
  const login = useCallback(async (email: string, password?: string, isAdminLogin: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      // Ahora llama a la Server Action importada
      const { user: userData, token: userToken } = await loginAction(email, password, isAdminLogin);
      handleAuthSuccess(userData, userToken);

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
       // Ahora llama a la Server Action importada
       const { user: userData, token: userToken } = await signupAction(name, email, password);
       handleAuthSuccess(userData, userToken);

    } catch(err: any) {
        setError(err.message);
        throw err;
    } finally {
        setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    router.push('/');
  }, [router]);

  const value = useMemo(() => ({
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout
  }), [user, token, loading, error, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
