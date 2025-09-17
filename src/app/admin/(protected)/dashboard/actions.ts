
'use server';

// =================================================================================
// SERVER ACTIONS
// Este archivo contiene funciones que se ejecutan exclusivamente en el servidor.
// MODIFICADO PARA AUTENTICACIÓN BASADA EN COOKIES:
// Las funciones ya no reciben el token como parámetro.
// En su lugar, usan la función `getAuthHeaders` para leer la cookie de la
// petición entrante y reenviarla a la API del backend.
// =================================================================================


import { revalidatePath } from 'next/cache';
import type { User } from '@/lib/types';
import { cookies } from 'next/headers';

// --- ACCIONES DE AUTENTICACIÓN ---

// CONEXIÓN CON EL BACKEND: Inicia sesión de usuario.
// El backend establece la cookie, el frontend solo recibe los datos del usuario.
export async function loginAction(email: string, password?: string): Promise<{user: User}> {
    try {
        const response = await fetch('https://apisahumerios.onrender.com/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: password || '' }),
            cache: 'no-cache',
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.mensaje || 'Error de autenticación.');
        }

        // La respuesta del backend debe incluir una cabecera `Set-Cookie`.
        // El navegador almacenará esta cookie automáticamente.
        return { user: data.usuario };

    } catch (err: any) {
        throw new Error(err.message);
    }
}

// CONEXIÓN CON EL BACKEND: Registra un nuevo usuario.
export async function signupAction(name: string, email: string, password: string): Promise<{user: User}> {
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
                rol: 'USER',
            }),
            cache: 'no-cache',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensaje || 'Ocurrió un error al registrarse.');
        }
        
        // La respuesta también debería establecer la cookie de sesión.
        return { user: data.usuario };

    } catch(err: any) {
        throw new Error(err.message);
    }
}


// --- LÓGICA DE MANEJO DE COOKIES PARA SERVER ACTIONS ---

/**
 * Obtiene la cookie de sesión del navegador y la prepara para ser reenviada
 * en una petición fetch desde el servidor a la API de backend.
 * @returns {HeadersInit} Objeto de cabeceras con la cookie incluida.
 */
function getAuthHeaders() {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get('token'); // Asume que la cookie se llama 'token'
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (tokenCookie) {
        // Formato correcto para reenviar una cookie en una petición fetch.
        headers['Cookie'] = `token=${tokenCookie.value}`;
    }
    return headers;
}


// --- ACCIONES DE PRODUCTOS ---
// Helper para construir el payload del producto. No cambia.
function buildProductPayload(formData: FormData) {
  const fraganciasString = formData.get('fragancias') as string || '';
  const fragancias = fraganciasString ? fraganciasString.split(',').map(f => f.trim()).filter(f => f) : [];
  const atributosString = formData.get('atributos') as string || '';
  const atributos = atributosString
    .split(',')
    .map(a => a.trim())
    .filter(a => a.includes(':'))
    .map(a => {
      const [nombre, ...valorParts] = a.split(':');
      return { nombre: nombre.trim(), valor: valorParts.join(':').trim() };
    });

  const getNumberOrNull = (field: string) => {
    const value = formData.get(field) as string;
    return (value && !isNaN(Number(value))) ? Number(value) : null;
  };
  const getIntOrNull = (field: string) => {
      const value = formData.get(field) as string;
      return (value && !isNaN(parseInt(value, 10))) ? parseInt(value, 10) : null;
  };
  const getStringOrNull = (field: string) => {
    const value = formData.get(field) as string;
    return value || null;
  };
  
  const payload: any = {
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio: getNumberOrNull('precio'),
    stock: getIntOrNull('stock'),
    imagenurl: formData.get('imagenurl'),
    activo: formData.get('activo') === 'on',
    categoriaNombre: formData.get('categoriaNombre'),
    fragancias: fragancias,
    atributos: atributos,
    totalIngresado: getIntOrNull('totalIngresado'),
    precioMayorista: getNumberOrNull('precioMayorista'),
    porcentajeDescuento: getNumberOrNull('porcentajeDescuento'),
    fechaInicioDescuento: getStringOrNull('fechaInicioDescuento') || null,
    fechaFinDescuento: getStringOrNull('fechaFinDescuento') || null,
  };
  
   Object.keys(payload).forEach(key => {
    if (payload[key] === null || payload[key] === undefined) {
      delete payload[key];
    }
  });
  
  return payload;
}

// CONEXIÓN CON EL BACKEND: Añade un nuevo producto.
// Utiliza `getAuthHeaders` para enviar la cookie de autenticación.
export async function addProduct(formData: FormData) {
  const newProduct = buildProductPayload(formData);
  
  try {
    const response = await fetch('https://apisahumerios.onrender.com/productos/agregar', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newProduct),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/products');
    return { success: true };

  } catch (error) {
    return { error: (error as Error).message };
  }
}

// CONEXIÓN CON EL BACKEND: Edita un producto existente.
export async function editProduct(formData: FormData) {
  const productId = formData.get('id');
  if (!productId) return { error: 'No se proporcionó ID de producto.' };

  const updatedProduct = buildProductPayload(formData);
  
   try {
    const response = await fetch(`https://apisahumerios.onrender.com/productos/editar/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedProduct),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    revalidatePath('/admin/dashboard');
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');
    return { success: true };

  } catch (error) {
    return { error: (error as Error).message };
  }
}

// CONEXIÓN CON EL BACKEND: Elimina un producto.
export async function deleteProduct(productId: number) {
  if (!productId) return { error: 'No se proporcionó ID de producto.' };
  
  try {
    const response = await fetch(`https://apisahumerios.onrender.com/productos/eliminar/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
       const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/products');
    return { success: true };

  } catch (error) {
    return { error: (error as Error).message };
  }
}

// --- ACCIONES GENÉRICAS ---

async function manageEntity(
  entityName: string, 
  formData: FormData,
  idField: string = 'id'
) {
  const entityId = formData.get(idField);
  const isEdit = !!entityId;
  const endpoint = `https://apisahumerios.onrender.com/${entityName}${isEdit ? `/editar/${entityId}` : '/agregar'}`;
  const method = isEdit ? 'PUT' : 'POST';

  const payload: {[k: string]: any} = Object.fromEntries(formData.entries());
  
  if(isEdit) {
    delete payload[idField];
    if ('password' in payload && payload.password === '') {
        delete payload.password;
    }
  }

  try {
    const response = await fetch(endpoint, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error en ${entityName}: ${response.status}`);
    }
    
    revalidatePath(`/admin/${entityName}`);
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

async function deleteEntity(entityName: string, entityId: number | string) {
  if (!entityId) return { error: 'No se proporcionó ID.' };

  try {
    const response = await fetch(`https://apisahumerios.onrender.com/${entityName}/eliminar/${entityId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error al eliminar en ${entityName}: ${response.status}`);
    }

    revalidatePath(`/admin/${entityName}`);
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

// --- ACCIONES PARA CADA ENTIDAD ---

export async function saveUser(formData: FormData) {
    if (formData.get('id') && formData.get('password') === '') {
        formData.delete('password');
    }
    return await manageEntity('usuarios', formData);
}
export async function deleteUser(id: number) {
  return await deleteEntity('usuarios', id);
}

export async function saveOrder(formData: FormData) {
  return await manageEntity('pedidos', formData);
}
export async function deleteOrder(id: string) {
  return await deleteEntity('pedidos', id);
}

export async function saveDeal(formData: FormData) {
  const dealId = formData.get('idOferta');
  const isEdit = !!dealId;

  const endpoint = isEdit
    ? `https://apisahumerios.onrender.com/api/ofertas/editar/${dealId}`
    : 'https://apisahumerios.onrender.com/api/ofertas/crearOferta';
  
  const method = isEdit ? 'PUT' : 'POST';

  const getNumberOrNull = (field: string) => {
    const value = formData.get(field) as string;
    return (value && !isNaN(Number(value))) ? Number(value) : null;
  };
  const getStringOrNull = (field: string) => {
    const value = formData.get(field) as string;
    return value || null;
  };

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

  Object.keys(payload).forEach(key => {
    if (payload[key] === null) delete payload[key];
  });

  try {
    const response = await fetch(endpoint, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorData = JSON.parse(errorText || '{}');
      throw new Error(errorData.message || `Error en ofertas: ${response.status}`);
    }
    
    revalidatePath(`/admin/deals`);
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function deleteDeal(id: number) {
    if (!id) return { error: 'No se proporcionó ID de oferta.' };
    try {
        const response = await fetch(`https://apisahumerios.onrender.com/api/ofertas/eliminar/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            throw new Error(errorData.message || `Error al eliminar la oferta: ${response.status}`);
        }
        revalidatePath(`/admin/deals`);
        return { success: true };
    } catch (error) {
        return { error: (error as Error).message };
    }
}

export async function saveAttribute(formData: FormData) {
  return await manageEntity('atributos', formData);
}
export async function deleteAttribute(id: number) {
  return await deleteEntity('atributos', id);
}

export async function saveFragrance(formData: FormData) {
  return await manageEntity('fragancias', formData);
}
export async function deleteFragrance(id: number) {
  return await deleteEntity('fragancias', id);
}

    

    