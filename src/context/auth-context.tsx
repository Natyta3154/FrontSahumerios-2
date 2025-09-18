
"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

// =================================================================================
// CONTEXTO DE AUTENTICACIÓN (REFACTORIZADO PARA RENDIMIENTO)
//
// ¿QUÉ HA CAMBIADO?
// 1. YA NO CONTIENE LÓGICA DE LOGIN/SIGNUP: Esas acciones se manejan directamente
//    en sus respectivas páginas usando Server Actions.
// 2. SU ÚNICA RESPONSABILIDAD es leer el estado del usuario desde el localStorage y
//    proporcionar la función `logout`.
// 3. Es mucho más ligero y solo se usa para compartir el estado del usuario (User | null)
//    y la función de `logout` a los componentes cliente que lo necesiten (como el Header).
// =================================================================================

const API_BASE_URL = 'https://appsahumerio-600919214176.us-central1.run.app';

// --- Definición del Tipo de Contexto (Simplificado) ---
interface AuthContextType {
  user: User | null;          
  loading: boolean;           
  logout: () => void;         
}

// --- Creación del Contexto ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);


// --- Proveedor del Contexto (AuthProvider) ---
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // --- EFECTO INICIAL: Cargar sesión desde localStorage ---
  // Se ejecuta solo una vez al cargar la aplicación en el cliente.
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

  // --- FUNCIÓN DE LOGOUT ---
  // Llama al backend para que invalide la cookie de sesión y limpia el estado local.
  const logout = useCallback(async () => {
    try {
        await fetch(`${API_BASE_URL}/usuarios/logout`, {
            method: 'POST',
            // El navegador enviará la cookie automáticamente.
            credentials: 'include',
        });
    } catch (e) {
        console.error("Fallo al contactar el endpoint de logout:", e);
    } finally {
        setUser(null);
        localStorage.removeItem("authUser");
        // Refrescamos para que los componentes de servidor reconozcan el estado de logout.
        router.push('/');
        router.refresh(); 
    }
  }, [router]);

  // El valor del contexto es ahora más simple.
  const value = useMemo(() => ({
    user,
    loading,
    logout
  }), [user, loading, logout]);

  // Solo muestra los hijos cuando ha terminado de cargar el estado inicial.
  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

// --- Hook Personalizado `useAuth` ---
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
