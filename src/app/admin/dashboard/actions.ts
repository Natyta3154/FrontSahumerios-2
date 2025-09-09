'use server';

import { revalidatePath } from 'next/cache';

// NOTA PARA EL DESARROLLADOR:
// Este archivo contiene "Server Actions" de Next.js.
// Estas funciones se ejecutan en el servidor y son el lugar ideal y seguro
// para realizar las llamadas a tu API de backend para crear, editar o eliminar datos.

// --- ACCIONES DE PRODUCTOS ---

// Conexión con el endpoint para AÑADIR un nuevo producto.
export async function addProduct(formData: FormData) {
  // Mapeo del FormData al JSON que espera el backend
  const newProduct = {
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio: Number(formData.get('precio')),
    stock: Number(formData.get('stock')),
    imagenurl: formData.get('imagenurl'),
    activo: true, // Asumimos que un nuevo producto siempre está activo
    categoriaNombre: formData.get('categoriaNombre'),
    fragancias: (formData.get('fragancias') as string || '').split(',').map(f => f.trim()).filter(f => f),
    atributos: [
      {
        nombre: "Brand",
        valor: formData.get('brand') || ""
      }
    ]
  };

  try {
    // Esta es la llamada 'fetch' al endpoint de tu API para agregar productos.
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
      throw new Error(`Error al añadir el producto: ${errorText}`);
    }

    console.log('Producto añadido con éxito.');
    // 'revalidatePath' le dice a Next.js que refresque los datos en estas páginas.
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

  const updatedProduct = {
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio: Number(formData.get('precio')),
    stock: Number(formData.get('stock')),
    imagenurl: formData.get('imagenurl'),
    activo: true, 
    categoriaNombre: formData.get('categoriaNombre'),
    fragancias: (formData.get('fragancias') as string || '').split(',').map(f => f.trim()).filter(f => f),
    atributos: [
       {
        nombre: "Brand",
        valor: formData.get('brand') || ""
      }
    ]
  };

   try {
    // Esta es la llamada 'fetch' al endpoint de tu API para editar productos.
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
      throw new Error(`Error al editar el producto: ${errorText}`);
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
    // Esta es la llamada 'fetch' al endpoint de tu API para eliminar productos.
    const response = await fetch(`https://apisahumerios.onrender.com/productos/eliminar/${productId}`, {
      method: 'DELETE',
      credentials: 'omit',
    });

     if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al eliminar el producto: ${errorText}`);
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