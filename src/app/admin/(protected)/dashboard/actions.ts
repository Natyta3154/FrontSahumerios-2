'use server';

import { revalidatePath } from 'next/cache';
import type { User } from '@/lib/types';

const API_BASE_URL_GOOGLE = process.env.NEXT_PUBLIC_API_BASE_URL;

// ============================================================================
// UTILS: Manejo de cookies y headers para fetch
// ============================================================================
export async function fetchProtectedData() {
  const res = await fetch(`${API_BASE_URL_GOOGLE}/usuarios/perfil`, {
    method: "GET",
    credentials: "include", // 👈 importante
    cache: "no-cache",
  });

  if (!res.ok) {
    throw new Error("Error al traer datos protegidos");
  }

  return res.json();
}

// ============================================================================
// ACCIONES DE AUTENTICACIÓN
// ============================================================================
export async function loginAction(email: string, password?: string): Promise<{ user: User }> {
  const response = await fetch(`${API_BASE_URL_GOOGLE}/usuarios/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: password || '' }),
    cache: 'no-cache',
    credentials: 'include', // 👈 cookie HttpOnly viaja sola
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorJson = {};
    try {
      errorJson = JSON.parse(errorText);
    } catch {
      /* ignore */
    }
    throw new Error((errorJson as any).message || response.statusText || 'Error en login');
  }

  return response.json(); // backend ya setea cookie
}

export async function signupAction(name: string, email: string, password: string): Promise<{ user: User }> {
  const response = await fetch(`${API_BASE_URL_GOOGLE}/usuarios/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: name, email, password }),
    cache: 'no-cache',
    credentials: 'include', // 👈 cookie viaja sola
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorJson = {};
    try {
      errorJson = JSON.parse(errorText);
    } catch {
      /* ignore */
    }
    throw new Error((errorJson as any).message || response.statusText || 'Error en signup');
  }

  return response.json();
}

// ============================================================================
// PRODUCTOS
// ============================================================================
function buildProductPayload(formData: FormData) {
  const fragancias = ((formData.get('fragancias') as string) || '')
    .split(',')
    .map(f => f.trim())
    .filter(f => f);

  const atributos = ((formData.get('atributos') as string) || '')
    .split(',')
    .map(a => a.trim())
    .filter(a => a.includes(':'))
    .map(a => {
      const [nombre, ...valorParts] = a.split(':');
      return { nombre: nombre.trim(), valor: valorParts.join(':').trim() };
    });

  const getNumberOrNull = (field: string) => {
    const value = formData.get(field) as string;
    return value && !isNaN(Number(value)) ? Number(value) : null;
  };

  const getIntOrNull = (field: string) => {
    const value = formData.get(field) as string;
    return value && !isNaN(parseInt(value, 10)) ? parseInt(value, 10) : null;
  };

  const payload: any = {
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio: getNumberOrNull('precio'),
    stock: getIntOrNull('stock'),
    imagenurl: formData.get('imagenurl'),
    activo: formData.get('activo') === 'on',
    categoriaNombre: formData.get('categoriaNombre'),
    fragancias,
    atributos,
    totalIngresado: getIntOrNull('totalIngresado'),
    precioMayorista: getNumberOrNull('precioMayorista'),
    porcentajeDescuento: getNumberOrNull('porcentajeDescuento'),
    fechaInicioDescuento: formData.get('fechaInicioDescuento') || null,
    fechaFinDescuento: formData.get('fechaFinDescuento') || null,
  };

  Object.keys(payload).forEach(key => {
    if (payload[key] === null || payload[key] === undefined) delete payload[key];
  });

  return payload;
}

export async function addProduct(formData: FormData) {
  const payload = buildProductPayload(formData);
  const response = await fetch(`${API_BASE_URL_GOOGLE}/productos/agregar`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Error del servidor: ${response.status}`);
  }

  revalidatePath('/admin/dashboard');
  revalidatePath('/products');
  return { success: true };
}

export async function editProduct(formData: FormData) {
  const productId = formData.get('id');
  if (!productId) return { error: 'No se proporcionó ID de producto.' };

  const payload = buildProductPayload(formData);

  const response = await fetch(`${API_BASE_URL_GOOGLE}/productos/editar/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Error del servidor: ${response.status}`);
  }

  revalidatePath('/admin/dashboard');
  revalidatePath(`/products/${productId}`);
  revalidatePath('/products');
  return { success: true };
}

export async function deleteProduct(productId: number) {
  if (!productId) return { error: "No se proporcionó ID de producto." };

  const response = await fetch(`${API_BASE_URL_GOOGLE}/productos/eliminar/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Error del servidor: ${response.status}`);
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/products");

  return { success: true };
}

// ============================================================================
// ENTIDADES GENERALES
// ============================================================================
async function manageEntity(entityName: string, formData: FormData, idField: string = 'id') {
  const entityId = formData.get(idField);
  const isEdit = !!entityId;
  const endpoint = `${API_BASE_URL_GOOGLE}/${entityName}${isEdit ? `/editar/${entityId}` : '/agregar'}`;
  const method = isEdit ? 'PUT' : 'POST';

  const payload: { [k: string]: any } = Object.fromEntries(formData.entries());
  if (isEdit) {
    delete payload[idField];
    if ('password' in payload && payload.password === '') delete payload.password;
  }

  const response = await fetch(endpoint, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Error en ${entityName}: ${response.status}`);
  }

  revalidatePath(`/admin/${entityName}`);
  return { success: true };
}

async function deleteEntity(entityName: string, entityId: number | string) {
  if (!entityId) return { error: 'No se proporcionó ID.' };

  const response = await fetch(`${API_BASE_URL_GOOGLE}/${entityName}/eliminar/${entityId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Error al eliminar en ${entityName}: ${response.status}`);
  }

  revalidatePath(`/admin/${entityName}`);
  return { success: true };
}

// ============================================================================
// ENTIDADES ESPECÍFICAS
// ============================================================================
export async function saveUser(formData: FormData) { return manageEntity('usuarios', formData); }
export async function deleteUser(id: number) { return deleteEntity('usuarios', id); }

export async function saveOrder(formData: FormData) { return manageEntity('pedidos', formData); }
export async function deleteOrder(id: string) { return deleteEntity('pedidos', id); }

export async function saveAttribute(formData: FormData) { return manageEntity('atributos', formData); }
export async function deleteAttribute(id: number) { return deleteEntity('atributos', id); }

export async function saveFragrance(formData: FormData) { return manageEntity('fragancias', formData); }
export async function deleteFragrance(id: number) { return deleteEntity('fragancias', id); }

export async function saveDeal(formData: FormData) {
  const dealId = formData.get('idOferta');
  const isEdit = !!dealId;
  const endpoint = isEdit
    ? `${API_BASE_URL_GOOGLE}/api/ofertas/editar/${dealId}`
    : `${API_BASE_URL_GOOGLE}/api/ofertas/crearOferta`;
  const method = isEdit ? 'PUT' : 'POST';

  const getNumberOrNull = (field: string) => {
    const value = formData.get(field) as string;
    return value && !isNaN(Number(value)) ? Number(value) : null;
  };
  const getStringOrNull = (field: string) => (formData.get(field) as string) || null;

  const payload: any = {
    productoId: getNumberOrNull('producto_id'),
    valorDescuento: getNumberOrNull('valor_descuento'),
    tipoDescuento: getStringOrNull('tipo_descuento'),
    fechaInicio: getStringOrNull('fecha_inicio'),
    fechaFin: getStringOrNull('fecha_fin'),
    estado: formData.get('activo') === 'on',
  };

  if (isEdit) {
    payload.nombreProducto = getStringOrNull('nombreProducto');
    payload.descripcion = getStringOrNull('descripcion');
    payload.precio = getNumberOrNull('precio');
  }

  Object.keys(payload).forEach(k => { if (payload[k] === null) delete payload[k]; });

  const response = await fetch(endpoint, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData: any = {};
    try {
      errorData = JSON.parse(errorText);
    } catch { /* ignore */ }
    throw new Error(errorData.message || `Error en ofertas: ${response.status}`);
  }

  revalidatePath(`/admin/deals`);
  return { success: true };
}

export async function deleteDeal(id: number) {
  if (!id) return { error: 'No se proporcionó ID de oferta.' };

  const response = await fetch(`${API_BASE_URL_GOOGLE}/api/ofertas/eliminar/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `Error al eliminar la oferta: ${response.status}`);
  }

  revalidatePath(`/admin/deals`);
  return { success: true };
}
