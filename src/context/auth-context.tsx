
"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define la estructura del objeto de usuario para que coincida con el backend
interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'user' | 'ADMIN' | string;
}

// Define el tipo para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (emailOrUser: string | User, password?: string, isAdminLogin?: boolean) => Promise<void>;
  logout: () => void;
}

// Crea el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define el proveedor del contexto de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Función para "iniciar sesión"
  const login = useCallback(async (emailOrUser: string | User, password?: string, isAdminLogin: boolean = false) => {
    // Si se pasa un objeto de usuario directamente (después del registro), se establece como usuario
    if (typeof emailOrUser !== 'string') {
        setUser(emailOrUser);
        return;
    }
      
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://apisahumerios.onrender.com/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify({ email: emailOrUser, password }),
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

    } catch (err: any) {
      setError(err.message);
      // Re-lanza el error para que el componente que llama pueda manejarlo
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para "cerrar sesión"
  const logout = useCallback(() => {
    setUser(null);
    router.push('/'); // Redirige al inicio después de cerrar sesión
  }, [router]);

  // Memoriza el valor del contexto para evitar re-renderizados innecesarios
  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout
  }), [user, loading, error, login, logout]);

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

