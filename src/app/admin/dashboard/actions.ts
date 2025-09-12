
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
  
  // Elimina las claves con valores nulos para que no se envíen al backend
   Object.keys(payload).forEach(key => {
    if (payload[key] === null || payload[key] === undefined) {
      delete payload[key];
    }
  });
  
  return payload;
}

// --- ACCIONES DE PRODUCTOS ---

// Conexión con el endpoint para AÑADIR un nuevo producto.
// Ahora acepta el token para la autorización.
export async function addProduct(formData: FormData, token: string | null) {
  const newProduct = buildProductPayload(formData);
  
  console.log("Intentando añadir producto. Token:", token ? "Presente" : "Ausente");
  console.log("Payload enviado:", JSON.stringify(newProduct, null, 2));

  try {
    const response = await fetch('https://apisahumerios.onrender.com/productos/agregar', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(newProduct),
    });
    
    console.log("Respuesta de la API (Añadir):", {
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error("Error al añadir producto:", errorData);
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/products');
    return { success: true };

  } catch (error) {
    console.error("Error de red o de fetch (Añadir):", error);
    return { error: (error as Error).message };
  }
}
  
// Conexión con el endpoint para EDITAR un producto existente.
// Ahora acepta el token para la autorización.
export async function editProduct(formData: FormData, token: string | null) {
  const productId = formData.get('id');
  if (!productId) {
    return { error: 'No se proporcionó ID de producto.' };
  }

  const updatedProduct = buildProductPayload(formData);
  
  console.log(`Intentando editar producto ID: ${productId}. Token:`, token ? "Presente" : "Ausente");
  console.log("Payload enviado:", JSON.stringify(updatedProduct, null, 2));

   try {
    const response = await fetch(`https://apisahumerios.onrender.com/productos/editar/${productId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(updatedProduct),
    });
    
    console.log("Respuesta de la API (Editar):", {
      status: response.status,
      statusText: response.statusText,
    });


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error("Error al editar producto:", errorData);
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }

    revalidatePath('/admin/dashboard');
    revalidatePath(`/products/${productId}`);
    revalidatePath('/products');
    return { success: true };

  } catch (error) {
    console.error("Error de red o de fetch (Editar):", error);
    return { error: (error as Error).message };
  }
}

// Conexión con el endpoint para ELIMINAR un producto.
// Ahora acepta el token para la autorización.
export async function deleteProduct(productId: number, token: string | null) {
  if (!productId) {
    return { error: 'No se proporcionó ID de producto.' };
  }
  
  console.log(`Intentando eliminar producto ID: ${productId}. Token:`, token ? "Presente" : "Ausente");

  try {
    const response = await fetch(`https://apisahumerios.onrender.com/productos/eliminar/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log("Respuesta de la API (Eliminar):", {
      status: response.status,
      statusText: response.statusText,
    });

    if (!response.ok) {
       const errorData = await response.json().catch(() => ({ message: response.statusText }));
       console.error("Error al eliminar producto:", errorData);
      throw new Error(errorData.message || `Error del servidor: ${response.status}`);
    }
    
    revalidatePath('/admin/dashboard');
    revalidatePath('/products');
    return { success: true };

  } catch (error) {
    console.error("Error de red o de fetch (Eliminar):", error);
    return { error: (error as Error).message };
  }
}
