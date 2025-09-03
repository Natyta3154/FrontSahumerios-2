
"use client";

// NOTA PARA EL DESARROLLADOR:
// Este archivo simula un contexto de autenticación.
// En una aplicación real, aquí es donde integrarías tu solución de autenticación
// preferida (como Firebase Auth, NextAuth.js, etc.).
//
// El estado `user` y las funciones `login`/`logout` deberían interactuar
// con tu backend para gestionar sesiones de usuario reales.

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

// Define la estructura del objeto de usuario para que coincida con el backend
interface User {
  id: number;
  nombre: string;
  email: string;
  rol: 'user' | 'admin' | string;
}

// Define el tipo para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Crea el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define el proveedor del contexto de autenticación
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Función para "iniciar sesión" (simulada)
  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  // Función para "cerrar sesión" (simulada)
  const logout = useCallback(() => {
    setUser(null);
    router.push('/'); // Redirige al inicio después de cerrar sesión
  }, [router]);

  // Memoriza el valor del contexto para evitar re-renderizados innecesarios
  const value = useMemo(() => ({
    user,
    login,
    logout
  }), [user, login, logout]);

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
