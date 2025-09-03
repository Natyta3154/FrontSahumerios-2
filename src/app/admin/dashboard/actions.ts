// NOTA PARA EL DESARROLLADOR:
// Este archivo contiene "Server Actions" de Next.js.
// Estas funciones se ejecutan en el servidor y son la forma ideal de manejar
// envíos de formularios y mutaciones de datos sin necesidad de crear endpoints de API explícitos.
//
// CUANDO CONECTES TU BACKEND:
// 1.  Aquí es donde implementarás la lógica para comunicarte con tu base de datos o API.
// 2.  Cada función (addProduct, editProduct, etc.) debe ser modificada para enviar
//     los datos del formulario (formData) a tu backend.
// 3.  Después de una operación exitosa (ej. producto añadido), deberías usar
//     `revalidatePath('/admin/dashboard')` de Next.js para refrescar los datos en la página
//     y mostrar los cambios inmediatamente.
'use server';

// Marcador de posición para agregar un producto.
// En una aplicación real, esta función interactuaría con una base de datos.
export async function addProduct(formData: FormData) {
  // Lógica para enviar los datos a tu backend.
  // Ejemplo:
  // const newProduct = {
  //   name: formData.get('name'),
  //   price: formData.get('price'),
  //   ...
  // };
  // await fetch('https://tu-api.com/products', { method: 'POST', body: JSON.stringify(newProduct) });

  console.log('Añadiendo producto...');
  console.log({
    name: formData.get('name'),
    price: formData.get('price'),
    category: formData.get('category'),
    fragrance: formData.get('fragrance'),
    brand: formData.get('brand'),
    image: formData.get('image'),
    description: formData.get('description'),
  });

  // Aquí deberías revalidar la ruta para actualizar la lista de productos en la UI.
  // Ejemplo: revalidatePath('/admin/dashboard');
}
  
// Marcador de posición para editar un producto.
// En una aplicación real, esta función interactuaría con una base de datos.
export async function editProduct(formData: FormData) {
  // Lógica para enviar los datos actualizados a tu backend.
  // Ejemplo:
  // const productId = formData.get('id');
  // const updatedProduct = {
  //   name: formData.get('name'),
  //   price: formData.get('price'),
  //   ...
  // };
  // await fetch(`https://tu-api.com/products/${productId}`, { method: 'PUT', body: JSON.stringify(updatedProduct) });

  console.log('Editando producto...');
  console.log({
    id: formData.get('id'),
    name: formData.get('name'),
    price: formData.get('price'),
    category: formData.get('category'),
    fragrance: formData.get('fragrance'),
    brand: formData.get('brand'),
    image: formData.get('image'),
    description: formData.get('description'),
  });

  // Aquí deberías revalidar la ruta para actualizar la lista de productos en la UI.
  // Ejemplo: revalidatePath('/admin/dashboard');
}

// Puedes añadir aquí más Server Actions para eliminar productos, editar usuarios, etc.
// export async function deleteProduct(productId: string) { ... }
// export async function editUser(formData: FormData) { ... }
