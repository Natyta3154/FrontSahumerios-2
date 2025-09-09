
"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

// Define el tipo para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password?: string, isAdminLogin?: boolean) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Crea el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define el proveedor del contexto de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Inicia en true para comprobar el estado inicial
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
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("authToken", userToken);
    localStorage.setItem("authUser", JSON.stringify(userData));
  };
  
  const login = useCallback(async (email: string, password?: string, isAdminLogin: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://apisahumerios.onrender.com/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.mensaje || 'Error de autenticación.');
      }

      if (isAdminLogin && data.usuario.rol !== 'ADMIN') {
        throw new Error('Acceso denegado. Se requiere rol de administrador.');
      }
      
      handleAuthSuccess(data.usuario, data.token);

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
       const response = await fetch('https://apisahumerios.onrender.com/usuarios/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: name,
          email: email,
          password: password,
          rol: 'user', 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Ocurrió un error al registrarse.');
      }

      handleAuthSuccess(data.usuario, data.token);

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
