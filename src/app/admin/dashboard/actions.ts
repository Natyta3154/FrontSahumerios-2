
'use server';

import { revalidatePath } from 'next/cache';

// NOTA PARA EL DESARROLLADOR:
// Este archivo contiene "Server Actions" de Next.js.
// Estas funciones se ejecutan en el servidor y son el lugar ideal y seguro
// para realizar las llamadas a tu API de backend para crear, editar o eliminar datos.

// Helper para convertir FormData a un objeto JSON que la API espera.
function buildProductPayload(formData: FormData) {
  
  const fraganciasString = formData.get('fragancias') as string || '';
  const fragancias = fraganciasString.split(',').map(f => f.trim()).filter(f => f);

  const atributosString = formData.get('atributos') as string || '';
  const atributos = atributosString
    .split(',')
    .map(a => a.trim())
    .filter(a => a.includes(':'))
    .map(a => {
      const [nombre, valor] = a.split(/:(.*)/s); // Divide solo por el primer ':'
      return { nombre: nombre.trim(), valor: valor.trim() };
    });

  const payload: any = {
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio: Number(formData.get('precio')),
    stock: Number(formData.get('stock')),
    imagenurl: formData.get('imagenurl'),
    activo: formData.get('activo') === 'on', // El switch envía "on" o nada
    categoriaNombre: formData.get('categoriaNombre'),
    fragancias: fragancias,
    atributos: atributos,
    precioMayorista: Number(formData.get('precioMayorista')) || 0,
    porcentajeDescuento: Number(formData.get('porcentajeDescuento')) || null,
    fechaInicioDescuento: formData.get('fechaInicioDescuento') || null,
    fechaFinDescuento: formData.get('fechaFinDescuento') || null,
  };
  
  // Limpia valores nulos para fechas
  if (!payload.fechaInicioDescuento) delete payload.fechaInicioDescuento;
  if (!payload.fechaFinDescuento) delete payload.fechaFinDescuento;
  if (payload.porcentajeDescuento === null || payload.porcentajeDescuento === 0) delete payload.porcentajeDescuento;


  return payload;
}

// --- ACCIONES DE PRODUCTOS ---

// Conexión con el endpoint para AÑADIR un nuevo producto.
export async function addProduct(formData: FormData) {
  const newProduct = buildProductPayload(formData);

  try {
    const response = await fetch('https://apisahumerios.onrender.com/productos/agregar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Intenta parsear como JSON, si falla, usa el texto plano.
      try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || errorJson.error || `Error al añadir el producto: ${errorText}`);
      } catch (e) {
          throw new Error(`Error al añadir el producto: ${errorText}`);
      }
    }

    console.log('Producto añadido con éxito.');
    revalidatePath('/admin/dashboard');
    revalidatePath('/products');

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
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'omit',
      body: JSON.stringify(updatedProduct),
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || errorJson.error || `Error al editar el producto: ${errorText}`);
      } catch (e) {
          throw new Error(`Error al editar el producto: ${errorText}`);
      }
    }

    console.log('Producto editado con éxito.');
    revalidatePath('/admin/dashboard');
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');


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
      const errorText = await response.text();
      try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || errorJson.error || `Error al eliminar el producto: ${errorText}`);
      } catch (e) {
          throw new Error(`Error al eliminar el producto: ${errorText}`);
      }
    }
    
    console.log('Producto eliminado con éxito.');
    revalidatePath('/admin/dashboard');
    revalidatePath('/products');

  } catch (error) {
    console.error('Error en deleteProduct:', error);
    return { error: (error as Error).message };
  }
}

// --- ACCIONES DE USUARIOS Y PEDIDOS (POR IMPLEMENTAR) ---
// NOTA PARA EL DESARROLLADOR:
// Aquí deberías añadir las funciones para editar y eliminar usuarios y pedidos.
// Sigue el mismo patrón que las funciones de productos.

// export async function editUser(formData: FormData) { ... }
// export async function deleteUser(userId: string) { ... }
// export async function updateOrderStatus(orderId: string, status: string) { ... }
