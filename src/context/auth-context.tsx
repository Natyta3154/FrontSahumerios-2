
"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

// Define el tipo para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  token: string | null; // Añadimos el token al contexto
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
  const [token, setToken] = useState<string | null>(null); // Estado para el token
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Función para "iniciar sesión"
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

      // Si es un intento de login de admin, se verifica el rol
      if (isAdminLogin && data.usuario.rol !== 'ADMIN') {
        throw new Error('Acceso denegado. Se requiere rol de administrador.');
      }
      
      setUser(data.usuario as User);
      setToken(data.token); // Guardamos el token

    } catch (err: any) {
      setError(err.message);
      // Re-lanza el error para que el componente que llama pueda manejarlo
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
          rol: 'user', // Registrar siempre como usuario común
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || 'Ocurrió un error al registrarse.');
      }

      // Después de un registro exitoso, se "inicia sesión" automáticamente.
      setUser(data.usuario as User);
      setToken(data.token); // Guardamos el token también al registrarse

    } catch(err: any) {
        setError(err.message);
        throw err;
    } finally {
        setLoading(false);
    }

  }, []);


  // Función para "cerrar sesión"
  const logout = useCallback(() => {
    setUser(null);
    setToken(null); // Limpiamos el token al cerrar sesión
    router.push('/'); // Redirige al inicio después de cerrar sesión
  }, [router]);

  // Memoriza el valor del contexto para evitar re-renderizados innecesarios
  const value = useMemo(() => ({
    user,
    token, // Exponemos el token
    loading,
    error,
    login,
    signup,
    logout
  }), [user, token, loading, error, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
