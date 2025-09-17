
"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { loginAction, signupAction } from "@/app/admin/(protected)/dashboard/actions";

// =================================================================================
// CONTEXTO DE AUTENTICACIÓN (AUTH CONTEXT)
// MODIFICADO PARA AUTENTICACIÓN BASADA EN COOKIES
//
// ¿QUÉ HACE?
// 1. Mantiene el estado del usuario (si está logueado o no).
// 2. Ya no gestiona el token JWT; asume que el backend lo gestiona vía cookies HttpOnly.
// 3. Proporciona funciones para `login`, `signup` y `logout`.
// 4. `login` y `signup` guardan los datos del usuario en localStorage para la UI, pero no el token.
// 5. `logout` llama a un endpoint del backend para invalidar la cookie de sesión.
// =================================================================================


// --- Definición del Tipo de Contexto ---
// Se elimina `token` de la interfaz.
interface AuthContextType {
  user: User | null;          
  loading: boolean;           
  error: string | null;       
  login: (email: string, password?: string) => Promise<void>; 
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;         
}

// --- Creación del Contexto ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);


// --- Proveedor del Contexto (AuthProvider) ---
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // El estado `token` se ha eliminado.
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // --- EFECTO INICIAL: Cargar sesión desde localStorage ---
  // Intenta recuperar solo los datos del usuario del localStorage.
  // La cookie de autenticación es manejada por el navegador.
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("authUser");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Fallo al leer datos de autenticación del localStorage", e);
      localStorage.removeItem("authUser");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Helper para manejar una autenticación exitosa ---
  // Se simplifica para no manejar el token.
  const handleAuthSuccess = (userData: User) => {
    const userToStore: User = {
      id: userData.id,
      nombre: userData.nombre,
      email: userData.email,
      rol: userData.rol,
      ...(userData.fechaRegistro && { fechaRegistro: userData.fechaRegistro }),
    };
    
    setUser(userToStore);
    // Solo guarda el objeto de usuario en localStorage.
    localStorage.setItem("authUser", JSON.stringify(userToStore));
  };
  
  // --- FUNCIÓN DE LOGIN ---
  const login = useCallback(async (email: string, password?: string) => {
    setLoading(true);
    setError(null);
    try {
      // La Server Action ahora solo devuelve el usuario, no el token.
      const { user: userData } = await loginAction(email, password);
      handleAuthSuccess(userData);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // --- FUNCIÓN DE SIGNUP ---
  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
       const { user: userData } = await signupAction(name, email, password);
       handleAuthSuccess(userData);
    } catch(err: any) {
        setError(err.message);
        throw err;
    } finally {
        setLoading(false);
    }
  }, []);

  // --- FUNCIÓN DE LOGOUT ---
  // Ahora llama al backend para que invalide la cookie.
  const logout = useCallback(async () => {
    try {
        // Llama a un endpoint de logout en tu backend.
        // Es importante que este endpoint elimine la cookie.
        await fetch('https://apisahumerios.onrender.com/usuarios/logout', {
            method: 'POST',
            // El navegador enviará la cookie automáticamente.
        });
    } catch (e) {
        console.error("Fallo al contactar el endpoint de logout:", e);
    } finally {
        // Limpia el estado del frontend y el localStorage sin importar si la llamada falló.
        setUser(null);
        localStorage.removeItem("authUser");
        router.push('/');
    }
  }, [router]);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    signup,
    logout
  }), [user, loading, error, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Hook Personalizado `useAuth` ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
