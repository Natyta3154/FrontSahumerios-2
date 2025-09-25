'use server';

//const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL_RENDER = process.env.NEXT_PUBLIC_API_BASE_URL_RENDER;

// Traer perfil de usuario protegido
export async function fetchPerfil() {
  const res = await fetch(`${API_BASE_URL_RENDER}/usuarios/perfil`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("No hay sesión activa");
  }

  const data = await res.json();
  return data.usuario;
}

// Logout seguro
export async function logoutUser() {
  await fetch(`${API_BASE_URL_RENDER}/usuarios/logout`, {
    method: "POST",
    credentials: "include",
  });
}

// CRUD productos, usuarios, ofertas, atributos, etc.
export async function fetchEntity(endpoint: string, method: string, payload?: any) {
  const res = await fetch(`${API_BASE_URL_RENDER}/${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: payload ? JSON.stringify(payload) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Error del servidor");
  }

  return res.json();
}
