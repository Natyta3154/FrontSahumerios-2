
"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { loginAction, signupAction } from "@/app/admin/(protected)/dashboard/actions";

// =================================================================================
// CONTEXTO DE AUTENTICACIÓN (AUTH CONTEXT)
// Este archivo es el "cerebro" de la autenticación en todo el frontend.
//
// ¿QUÉ HACE?
// 1. Mantiene el estado del usuario (si está logueado o no).
// 2. Proporciona funciones para `login`, `signup` y `logout`.
// 3. Sincroniza el estado de autenticación con el `localStorage` del navegador
//    para que la sesión persista al recargar la página.
// 4. Protege el acceso a ciertas partes de la aplicación.
// =================================================================================


// --- Definición del Tipo de Contexto ---
// Define la "forma" de los datos y funciones que estarán disponibles
// para cualquier componente que use este contexto.
interface AuthContextType {
  user: User | null;          // Objeto del usuario si está logueado, sino null.
  token: string | null;       // Token JWT para autenticar las peticiones a la API.
  loading: boolean;           // Indica si hay una operación de autenticación en curso.
  error: string | null;       // Almacena mensajes de error si algo falla.
  login: (email: string, password?: string, isAdminLogin?: boolean) => Promise<void>; // Función para iniciar sesión.
  signup: (name: string, email: string, password: string) => Promise<void>; // Función para registrar un nuevo usuario.
  logout: () => void;         // Función para cerrar sesión.
}

// --- Creación del Contexto ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);


// --- Proveedor del Contexto (AuthProvider) ---
// Este componente envuelve a toda la aplicación (ver en `src/app/layout.tsx`).
// Es el encargado de gestionar el estado y proveerlo a todos sus hijos.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Empieza en `true` para verificar el localStorage.
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // --- EFECTO INICIAL: Cargar sesión desde localStorage ---
  // Se ejecuta una sola vez cuando la aplicación carga.
  // Intenta recuperar el token y los datos del usuario del localStorage
  // para mantener al usuario logueado si ya tenía una sesión activa.
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Fallo al leer datos de autenticación del localStorage", e);
      // Limpia el localStorage si los datos están corruptos.
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    } finally {
      // Termina la carga inicial, la app ya sabe si hay un usuario logueado o no.
      setLoading(false);
    }
  }, []);

  // --- Helper para manejar una autenticación exitosa ---
  // Centraliza la lógica que se ejecuta después de un login o signup correcto.
  const handleAuthSuccess = (userData: User, userToken: string) => {
    // Crea un objeto de usuario limpio para almacenar.
    const userToStore: User = {
      id: userData.id,
      nombre: userData.nombre,
      email: userData.email,
      rol: userData.rol,
      ...(userData.fechaRegistro && { fechaRegistro: userData.fechaRegistro }),
    };
    
    // Actualiza el estado de React.
    setUser(userToStore);
    setToken(userToken);
    
    // Guarda los datos en localStorage para persistir la sesión.
    localStorage.setItem("authToken", userToken);
    localStorage.setItem("authUser", JSON.stringify(userToStore));
  };
  
  // --- FUNCIÓN DE LOGIN ---
  // Llama a la Server Action `loginAction` para comunicarse con el backend.
  const login = useCallback(async (email: string, password?: string, isAdminLogin: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      // CONEXIÓN CON EL BACKEND: Llama a la Server Action.
      const { user: userData, token: userToken } = await loginAction(email, password, isAdminLogin);
      handleAuthSuccess(userData, userToken);
    } catch (err: any) {
      setError(err.message);
      throw err; // Lanza el error para que el componente que llamó (ej. LoginPage) pueda manejarlo.
    } finally {
      setLoading(false);
    }
  }, []);

  // --- FUNCIÓN DE SIGNUP ---
  // Llama a la Server Action `signupAction`.
  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
       // CONEXIÓN CON EL BACKEND: Llama a la Server Action.
       const { user: userData, token: userToken } = await signupAction(name, email, password);
       handleAuthSuccess(userData, userToken);
    } catch(err: any) {
        setError(err.message);
        throw err;
    } finally {
        setLoading(false);
    }
  }, []);

  // --- FUNCIÓN DE LOGOUT ---
  // Limpia el estado y el localStorage, y redirige al inicio.
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    router.push('/');
  }, [router]);

  // --- Memoización del Valor del Contexto ---
  // `useMemo` asegura que el objeto `value` no se recree en cada render,
  // optimizando el rendimiento de los componentes que consumen este contexto.
  const value = useMemo(() => ({
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout
  }), [user, token, loading, error, login, signup, logout]);

  // --- Renderizado del Proveedor ---
  // Pone el objeto `value` a disposición de todos los componentes hijos.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// --- Hook Personalizado `useAuth` ---
// Simplifica el uso del contexto. En lugar de importar `useContext` y `AuthContext`
// en cada componente, solo se importa y llama a `useAuth()`.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
