'use server';

import { revalidatePath } from 'next/cache';

// NOTA PARA EL DESARROLLADOR:
// Este archivo contiene "Server Actions" de Next.js.
// Estas funciones se ejecutan en el servidor y están conectadas a tu API de backend.

// Añade un nuevo producto.
export async function addProduct(formData: FormData) {
  // Mapeo del FormData al JSON que espera el backend
  const newProduct = {
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio: Number(formData.get('precio')),
    stock: Number(formData.get('stock')),
    imagenUrl: formData.get('imagenUrl'),
    activo: true, // Asumimos que un nuevo producto siempre está activo
    categoriaNombre: formData.get('categoriaNombre'),
    // Las fragancias se envían como un string separado por comas, lo convertimos a array
    fragancias: (formData.get('fragancias') as string || '').split(',').map(f => f.trim()).filter(f => f),
    // Por ahora, los atributos se manejarán de forma simple o se omitirán si no están en el form
    atributos: [
      {
        nombre: "Brand",
        valor: formData.get('brand') || ""
      }
    ]
  };

  try {
    const response = await fetch('http://localhost:8080/productos/agregar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al añadir el producto: ${errorText}`);
    }

    console.log('Producto añadido con éxito.');
    revalidatePath('/admin/dashboard');
    revalidatePath('/products');

  } catch (error) {
    console.error('Error en addProduct:', error);
    return { error: (error as Error).message };
  }
}
  
// Edita un producto existente.
export async function editProduct(formData: FormData) {
  const productId = formData.get('id');
  if (!productId) {
    return { error: 'No se proporcionó ID de producto.' };
  }

  // Mapeo del FormData al JSON que espera el backend
  const updatedProduct = {
    nombre: formData.get('nombre'),
    descripcion: formData.get('descripcion'),
    precio: Number(formData.get('precio')),
    stock: Number(formData.get('stock')),
    imagenUrl: formData.get('imagenUrl'),
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
    const response = await fetch(`http://localhost:8080/productos/editar/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
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

// Elimina un producto.
export async function deleteProduct(productId: number) {
  if (!productId) {
    return { error: 'No se proporcionó ID de producto.' };
  }

  try {
    const response = await fetch(`http://localhost:8080/productos/eliminar/${productId}`, {
      method: 'DELETE',
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
