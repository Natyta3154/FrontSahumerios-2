
'use server';

import { revalidatePath } from 'next/cache';

// NOTA PARA EL DESARROLLADOR:
// Este archivo contiene "Server Actions" de Next.js.
// Este es el puente entre tu frontend y tu API para realizar cambios en la base de datos.

// Helper para construir el payload del producto con la estructura EXACTA que espera el backend.
function buildProductPayload(formData: FormData) {
  
  // Procesa las fragancias: convierte un string "a, b, c" en un array ["a", "b", "c"]
  const fraganciasString = formData.get('fragancias') as string || '';
  const fragancias = fraganciasString ? fraganciasString.split(',').map(f => f.trim()).filter(f => f) : [];

  // Procesa los atributos: convierte un string "nombre:valor, nombre2:valor2" en un array de objetos
  const atributosString = formData.get('atributos') as string || '';
  const atributos = atributosString
    .split(',')
    .map(a => a.trim())
    .filter(a => a.includes(':'))
    .map(a => {
      const [nombre, ...valorParts] = a.split(':');
      return { nombre: nombre.trim(), valor: valorParts.join(':').trim() };
    });

  const payload: any = {
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio: Number(formData.get('precio')),
    stock: Number(formData.get('stock')),
    imagenurl: formData.get('imagenurl'),
    activo: formData.get('activo') === 'on', // Un switch de HTML envía "on" si está activo, o nada si no.
    categoriaNombre: formData.get('categoriaNombre'),
    fragancias: fragancias,
    atributos: atributos,
    precioMayorista: Number(formData.get('precioMayorista')) || null,
    porcentajeDescuento: Number(formData.get('porcentajeDescuento')) || null,
    fechaInicioDescuento: formData.get('fechaInicioDescuento') || null,
    fechaFinDescuento: formData.get('fechaFinDescuento') || null,
  };
  
  // Limpia valores nulos o vacíos para que no se envíen al backend si no son necesarios.
  if (!payload.precioMayorista) delete payload.precioMayorista;
  if (!payload.porcentajeDescuento) delete payload.porcentajeDescuento;
  if (!payload.fechaInicioDescuento) delete payload.fechaInicioDescuento;
  if (!payload.fechaFinDescuento) delete payload.fechaFinDescuento;

  return payload;
}

// --- ACCIONES DE PRODUCTOS ---

// Conexión con el endpoint para AÑADIR un nuevo producto.
export async function addProduct(formData: FormData) {
  const newProduct = buildProductPayload(formData);

  try {
    const response = await fetch('https://apisahumerios.onrender.com/productos/agregar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
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
    console.error('Error en addProduct:', error);
    return { error: (error as Error).message };
  }
}
  
// Conexión con el endpoint para EDITAR un producto existente.
export async function editProduct(formData: FormData) {
  const productId = formData.get('id');
  if (!productId) {
    return { error: 'No se proporcionó ID de producto.' };
  }

  const updatedProduct = buildProductPayload(formData);

   try {
    const response = await fetch(`https://apisahumerios.onrender.com/productos/editar/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
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
    console.error('Error en editProduct:', error);
    return { error: (error as Error).message };
  }
}

// Conexión con el endpoint para ELIMINAR un producto.
export async function deleteProduct(productId: number) {
  if (!productId) {
    return { error: 'No se proporcionó ID de producto.' };
  }

  try {
    const response = await fetch(`https://apisahumerios.onrender.com/productos/eliminar/${productId}`, {
      method: 'DELETE',
      credentials: 'omit',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/products');
    return { success: true };

  } catch (error) {
    console.error('Error en deleteProduct:', error);
    return { error: (error as Error).message };
  }
}
