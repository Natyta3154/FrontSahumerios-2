

'use server';

import { revalidatePath } from 'next/cache';

// NOTA PARA EL DESARROLLADOR:
// Este archivo contiene "Server Actions" de Next.js.
// Este es el puente entre tu frontend y tu API para realizar cambios en la base de datos.

// Helper para construir el payload del producto con la estructura EXACTA que espera el backend.
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

// --- ACCIONES DE PRODUCTOS ---
export async function addProduct(formData: FormData, token: string | null) {
  const newProduct = buildProductPayload(formData);
  
  try {
    const response = await fetch('https://apisahumerios.onrender.com/productos/agregar', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
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

    revalidatePath('/admin/dashboard');
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');
    return { success: true };

  } catch (error) {
    return { error: (error as Error).message };
  }
}

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
async function manageEntity(
  entityName: string,
  formData: FormData,
  token: string | null,
  idField: string = 'id'
) {
  const entityId = formData.get(idField);
  const isEdit = !!entityId;
  const endpoint = `https://apisahumerios.onrender.com/${entityName}${isEdit ? `/editar/${entityId}` : '/agregar'}`;
  const method = isEdit ? 'PUT' : 'POST';

  const payload = Object.fromEntries(formData.entries());
  
  if(isEdit) {
    delete payload[idField];
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

export const saveUser = async (formData: FormData, token: string | null) => await manageEntity('usuarios', formData, token);
export const deleteUser = async (id: number, token: string | null) => await deleteEntity('usuarios', id, token);

export const saveOrder = async (formData: FormData, token: string | null) => await manageEntity('pedidos', formData, token);
export const deleteOrder = async (id: string, token: string | null) => await deleteEntity('pedidos', id, token);

export async function saveDeal(formData: FormData, token: string | null) {
  const dealId = formData.get('id');
  const isEdit = !!dealId;

  // Usa los endpoints específicos para ofertas que nos diste
  const endpoint = isEdit
    ? `https://apisahumerios.onrender.com/api/ofertas/editar/${dealId}`
    : `https://apisahumerios.onrender.com/api/ofertas/crearOferta`;
  
  const method = isEdit ? 'PUT' : 'POST';

  // El backend espera el ID de producto como `productoId`, no como un objeto anidado
  const payload = {
    productoId: Number(formData.get('productoId')),
    porcentajeDescuento: Number(formData.get('porcentajeDescuento')),
    fechaInicio: formData.get('fechaInicio'),
    fechaFin: formData.get('fechaFin'),
  };

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
      throw new Error(errorData.message || `Error en ofertas: ${response.status}`);
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

export const saveAttribute = async (formData: FormData, token: string | null) => await manageEntity('atributos', formData, token);
export const deleteAttribute = async (id: number, token: string | null) => await deleteEntity('atributos', id, token);

export const saveFragrance = async (formData: FormData, token: string | null) => await manageEntity('fragancias', formData, token);
export const deleteFragrance = async (id: number, token: string | null) => await deleteEntity('fragancias', id, token);

