
'use server';

// =================================================================================
// SERVER ACTIONS
// Este archivo contiene funciones que se ejecutan exclusivamente en el servidor.
//
// ¿QUÉ HACE?
// 1. Proporciona una forma segura de interactuar con el backend para realizar
//    operaciones de escritura (POST, PUT, DELETE).
// 2. Se encarga de la lógica de autenticación y modificación de datos.
// 3. Usa `revalidatePath` para indicarle a Next.js que debe refrescar los datos
//    de ciertas páginas después de una modificación, manteniendo la UI actualizada.
// =================================================================================

import { revalidatePath } from 'next/cache';
import type { User } from '@/lib/types';

// --- ACCIONES DE AUTENTICACIÓN ---

// CONEXIÓN CON EL BACKEND: Inicia sesión de usuario.
// Se ha simplificado para no requerir el parámetro `isAdminLogin`.
export async function loginAction(email: string, password?: string): Promise<{user: User, token: string}> {
    try {
        const response = await fetch('https://apisahumerios.onrender.com/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Se asegura de enviar siempre una contraseña, aunque sea vacía.
            body: JSON.stringify({ email: email, password: password || '' }),
            cache: 'no-cache', // No cachear la respuesta de login.
        });
        
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || data.mensaje || 'Error de autenticación.');
        }

        // La verificación de si es admin se hará en el frontend,
        // mostrando el enlace al panel solo si el rol es 'ADMIN'.
        
        return { user: data.usuario, token: data.token };

    } catch (err: any) {
        // Relanza el error para que el `auth-context` lo pueda capturar.
        throw new Error(err.message);
    }
}

// CONEXIÓN CON EL BACKEND: Registra un nuevo usuario.
export async function signupAction(name: string, email: string, password: string): Promise<{user: User, token: string}> {
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
                rol: 'USER', // Los usuarios siempre se registran con rol 'USER'.
            }),
            cache: 'no-cache',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensaje || 'Ocurrió un error al registrarse.');
        }
        
        return { user: data.usuario, token: data.token };

    } catch(err: any) {
        throw new Error(err.message);
    }
}


// --- ACCIONES DE PRODUCTOS ---

// Función de ayuda para construir el objeto (payload) del producto
// con la estructura EXACTA que espera la API del backend.
function buildProductPayload(formData: FormData) {
  
  // Convierte strings separados por comas en arrays.
  const fraganciasString = formData.get('fragancias') as string || '';
  const fragancias = fraganciasString ? fraganciasString.split(',').map(f => f.trim()).filter(f => f) : [];

  // Convierte el string de atributos en un array de objetos {nombre, valor}.
  const atributosString = formData.get('atributos') as string || '';
  const atributos = atributosString
    .split(',')
    .map(a => a.trim())
    .filter(a => a.includes(':'))
    .map(a => {
      const [nombre, ...valorParts] = a.split(':');
      return { nombre: nombre.trim(), valor: valorParts.join(':').trim() };
    });

  // Funciones helper para asegurar que los tipos de datos son correctos.
  const getNumberOrNull = (field: string) => {
    const value = formData.get(field) as string;
    if (value === null || value.trim() === '' || isNaN(Number(value))) {
        return null;
    }
    return Number(value);
  };

  const getIntOrNull = (field: string) => {
    const value = formData.get(field) as string;
    if (value === null || value.trim() === '' || isNaN(Number(value))) {
        return null;
    }
    return parseInt(value, 10);
  };
  
  const getStringOrNull = (field: string) => {
    const value = formData.get(field) as string;
    return value || null;
  };
  
  // Construcción del payload final.
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
  
   // Elimina cualquier campo que sea nulo o indefinido para no enviarlo al backend.
   Object.keys(payload).forEach(key => {
    if (payload[key] === null || payload[key] === undefined) {
      delete payload[key];
    }
  });
  
  return payload;
}


// CONEXIÓN CON EL BACKEND: Añade un nuevo producto.
export async function addProduct(formData: FormData, token: string | null) {
  const newProduct = buildProductPayload(formData);
  
  try {
    const response = await fetch('https://apisahumerios.onrender.com/productos/agregar', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Requiere token de admin.
      },
      body: JSON.stringify(newProduct),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    // INVALIDACIÓN DE CACHÉ: Le dice a Next.js que la data de estas páginas cambió
    // y que debe volver a obtenerla en la próxima visita.
    revalidatePath('/admin/dashboard');
    revalidatePath('/products');
    return { success: true };

  } catch (error) {
    return { error: (error as Error).message };
  }
}

// CONEXIÓN CON EL BACKEND: Edita un producto existente.
export async function editProduct(formData: FormData, token: string | null) {
  const productId = formData.get('id');
  if (!productId) {
    return { error: 'No se proporcionó ID de producto.' };
  }

  const updatedProduct = buildProductPayload(formData);
  
   try {
    const response = await fetch(`https://apisahumerios.onrender.com/productos/editar/${productId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(updatedProduct),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    // Invalida las páginas afectadas.
    revalidatePath('/admin/dashboard');
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');
    return { success: true };

  } catch (error) {
    return { error: (error as Error).message };
  }
}

// CONEXIÓN CON EL BACKEND: Elimina un producto.
export async function deleteProduct(productId: number, token: string | null) {
  if (!productId) {
    return { error: 'No se proporcionó ID de producto.' };
  }
  
  try {
    const response = await fetch(`https://apisahumerios.onrender.com/productos/eliminar/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
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
// Estas funciones reutilizan la lógica para diferentes entidades (usuarios, pedidos, etc.)

// Gestiona la creación y edición de una entidad.
async function manageEntity(
  entityName: string, // 'usuarios', 'pedidos', etc.
  formData: FormData,
  token: string | null,
  idField: string = 'id' // Campo que identifica a la entidad (ej: 'id', 'idOferta')
) {
  const entityId = formData.get(idField);
  const isEdit = !!entityId;
  // Construye la URL de la API dinámicamente.
  const endpoint = `https://apisahumerios.onrender.com/${entityName}${isEdit ? `/editar/${entityId}` : '/agregar'}`;
  const method = isEdit ? 'PUT' : 'POST';

  const payload: {[k: string]: any} = Object.fromEntries(formData.entries());
  
  if(isEdit) {
    delete payload[idField];
    // Caso especial: Si se está editando y la contraseña está vacía, no se envía
    // para evitar que el backend la cambie a una cadena vacía.
    if ('password' in payload && payload.password === '') {
        delete payload.password;
    }
  }


  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
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

// Gestiona la eliminación de una entidad.
async function deleteEntity(entityName: string, entityId: number | string, token: string | null) {
  if (!entityId) {
    return { error: 'No se proporcionó ID.' };
  }

  try {
    const response = await fetch(`https://apisahumerios.onrender.com/${entityName}/eliminar/${entityId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
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
// Estas funciones usan los helpers `manageEntity` y `deleteEntity`.

export async function saveUser(formData: FormData, token: string | null) {
    // Lógica especial para el campo de contraseña de usuario.
    if (formData.get('id') && formData.get('password') === '') {
        formData.delete('password');
    }
    return await manageEntity('usuarios', formData, token);
}
export async function deleteUser(id: number, token: string | null) {
  return await deleteEntity('usuarios', id, token);
}

export async function saveOrder(formData: FormData, token: string | null) {
  return await manageEntity('pedidos', formData, token);
}
export async function deleteOrder(id: string, token: string | null) {
  return await deleteEntity('pedidos', id, token);
}

// Lógica específica para guardar/editar ofertas.
export async function saveDeal(formData: FormData, token: string | null) {
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
    if (payload[key] === null) {
      delete payload[key];
    }
  });

  try {
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.message || `Error en ofertas: ${response.status}`);
      } catch (e) {
        throw new Error(errorText || `Error en ofertas: ${response.status}`);
      }
    }
    
    revalidatePath(`/admin/deals`);
    return { success: true };
  } catch (error) {
    return { error: (error as Error).message };
  }
}


export async function deleteDeal(id: number, token: string | null) {
    if (!id) {
        return { error: 'No se proporcionó ID de oferta.' };
    }
    try {
        const response = await fetch(`https://apisahumerios.onrender.com/api/ofertas/eliminar/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
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

export async function saveAttribute(formData: FormData, token: string | null) {
  return await manageEntity('atributos', formData, token);
}
export async function deleteAttribute(id: number, token: string | null) {
  return await deleteEntity('atributos', id, token);
}

export async function saveFragrance(formData: FormData, token: string | null) {
  return await manageEntity('fragancias', formData, token);
}
export async function deleteFragrance(id: number, token: string | null) {
  return await deleteEntity('fragancias', id, token);
}
