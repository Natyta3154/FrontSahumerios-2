'use server';

import { revalidatePath } from 'next/cache';

// NOTA PARA EL DESARROLLADOR:
// Este archivo contiene "Server Actions" de Next.js.
// Estas funciones se ejecutan en el servidor y están conectadas a tu API de backend.

// Añade un nuevo producto.
export async function addProduct(formData: FormData) {
  const newProduct = {
    name: formData.get('name'),
    price: Number(formData.get('price')),
    category: formData.get('category'),
    brand: formData.get('brand'),
    fragrance: formData.get('fragrance'),
    image: formData.get('image'),
    description: formData.get('description'),
    // Agrega aquí cualquier otro campo que tu API espere.
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
    // Revalida la ruta para actualizar la lista de productos en la UI.
    revalidatePath('/admin/dashboard');
    revalidatePath('/products');

  } catch (error) {
    console.error('Error en addProduct:', error);
    // Opcional: podrías devolver un objeto de error para mostrarlo en el cliente.
    return { error: (error as Error).message };
  }
}
  
// Edita un producto existente.
export async function editProduct(formData: FormData) {
  const productId = formData.get('id');
  if (!productId) {
    return { error: 'No se proporcionó ID de producto.' };
  }

  const updatedProduct = {
    name: formData.get('name'),
    price: Number(formData.get('price')),
    category: formData.get('category'),
    brand: formData.get('brand'),
    fragrance: formData.get('fragrance'),
    image: formData.get('image'),
    description: formData.get('description'),
     // Agrega aquí cualquier otro campo que tu API espere.
  };

   try {
    const response = await fetch(`http://localhost:8080/productos/editar/${productId}`, {
      method: 'PUT', // O 'PATCH', dependiendo de tu API
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
    // Revalida la ruta para actualizar la lista de productos en la UI.
    revalidatePath('/admin/dashboard');
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');


  } catch (error) {
    console.error('Error en editProduct:', error);
    return { error: (error as Error).message };
  }
}

// Elimina un producto.
export async function deleteProduct(productId: string) {
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
    // Revalida la ruta para actualizar la lista de productos en la UI.
    revalidatePath('/admin/dashboard');
    revalidatePath('/products');

  } catch (error) {
    console.error('Error en deleteProduct:', error);
    return { error: (error as Error).message };
  }
}
