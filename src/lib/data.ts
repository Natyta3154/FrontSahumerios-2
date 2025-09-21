

// =================================================================================
// CAPA DE DATOS (DATA LAYER)
// Este archivo es el punto central para OBTENER datos de tu API.
//
// ¿QUÉ HACE?
// 1. Define funciones para hacer `fetch` a los endpoints de tu backend.
// 2. Contiene funciones "adaptadoras" (mappers) que transforman la respuesta
//    de tu API al formato/tipo que el frontend espera (ej: `Product`, `User`).
// 3. Centraliza las URLs de la API para que sean fáciles de modificar.
//
// NOTA: Este archivo se enfoca en peticiones GET (obtener datos).
// Para POST, PUT, DELETE, se usan Server Actions en `src/app/admin/(protected)/dashboard/actions.ts`.
// =================================================================================


import type { Product, BlogArticle, User, Order, Deal, ProductAttribute, Fragrance } from './types';
import { cookies } from 'next/headers';


const API_BASE_URL_GOOGLE = process.env.NEXT_PUBLIC_API_BASE_URL; // Cambia esto si tu API está en otra URL.


// --- ADAPTADORES DE API A TIPO DE FRONTEND ---
// Estas funciones son cruciales. Toman el objeto JSON que viene de tu API
// y lo convierten en el objeto `Product` que usa el frontend.
// Esto desacopla el frontend del backend; si el backend cambia un nombre de campo,
// solo necesitas actualizarlo aquí.
function mapApiToProduct(apiProduct: any): Product {
  // Determina si el producto está en oferta.
  const onSale = apiProduct.porcentajeDescuento && Number(apiProduct.porcentajeDescuento) > 0;
  
  const basePrice = Number(apiProduct.precio) || 0;
  const finalPrice = Number(apiProduct.precioFinal) || basePrice;
  
  // Mapea campo por campo.
  return {
    id: apiProduct.id,
    nombre: apiProduct.nombre,
    descripcion: apiProduct.descripcion,
    precio: basePrice,
    stock: Number(apiProduct.stock) || 0,
    activo: apiProduct.activo,
    categoriaNombre: apiProduct.categoriaNombre,
    fragancias: apiProduct.fragancias || [],
    porcentajeDescuento: apiProduct.porcentajeDescuento ? Number(apiProduct.porcentajeDescuento) : null,
    fechaInicioDescuento: apiProduct.fechaInicioDescuento,
    fechaFinDescuento: apiProduct.fechaFinDescuento,
    precioFinal: finalPrice,
    atributos: apiProduct.atributos || [],
    precioMayorista: apiProduct.precioMayorista ? Number(apiProduct.precioMayorista) : undefined,
    totalIngresado: apiProduct.totalIngresado ? Number(apiProduct.totalIngresado) : undefined,
    imagenurl: apiProduct.imagenurl,
    mensaje: apiProduct.mensaje,

    // Datos adicionales que el frontend usa para la visualización.
    // Se llenan con los datos de la API para mantener consistencia.
    name: apiProduct.nombre,
    description: apiProduct.descripcion,
    price: finalPrice, // El precio que se muestra al usuario es el final.
    image: apiProduct.imagenurl || `https://picsum.photos/600/600?random=${apiProduct.id}`, // Fallback a una imagen de placeholder.
    category: apiProduct.categoriaNombre,
    rating: 4.5, // Dato simulado, ya que no viene de la API.
    reviews: 10, // Dato simulado.
    aromas: apiProduct.fragancias || [],
    brand: apiProduct.atributos?.find((a: any) => a.nombre.toLowerCase() === 'marca')?.valor, // Extrae la marca de los atributos.
    onSale: onSale,
    originalPrice: onSale ? basePrice : undefined, // Si está en oferta, guarda el precio original para mostrarlo tachado.
  };
}

function mapApiToUser(apiUser: any): User {
    return {
        id: apiUser.id,
        nombre: apiUser.nombre,
        email: apiUser.email,
        rol: apiUser.rol,
        fechaRegistro: apiUser.fechaRegistro,
    }
}

function mapApiToOrder(apiOrder: any): Order {
    return {
        id: apiOrder.id,
        customerName: apiOrder.usuario.nombre, // Asume que la API anida el objeto de usuario.
        date: apiOrder.fecha,
        status: apiOrder.estado,
        total: Number(apiOrder.total) || 0,
        items: apiOrder.detalles?.map((d: any) => ({
            productId: d.producto.id,
            productName: d.producto.nombre,
            quantity: d.cantidad,
            price: Number(d.precio) || 0
        })) || []
    }
}

function mapApiToDeal(apiDeal: any): Deal {
    return {
        idOferta: apiDeal.idOferta,
        nombreProducto: apiDeal.nombreProducto,
        descripcion: apiDeal.descripcion,
        precio: apiDeal.precio,
        estado: apiDeal.estado,
        tipoDescuento: apiDeal.tipoDescuento,
        valorDescuento: apiDeal.valorDescuento,
        fechaInicio: apiDeal.fechaInicio,
        fechaFin: apiDeal.fechaFin,
        productoId: apiDeal.productoId,
    }
}


// --- CONEXIONES AL BACKEND (FUNCIONES FETCH) ---

/**
 * Obtiene la cookie de sesión del navegador y la prepara para ser reenviada
 * en una petición fetch desde el servidor a la API de backend.
 * @returns {HeadersInit} Objeto de cabeceras con la cookie incluida.
 */
async function getAuthHeaders(providedToken?: string | null) {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Si se provee un token explícitamente (desde un componente de cliente), úsalo.
    if (providedToken) {
        headers['Authorization'] = `Bearer ${providedToken}`;
        return headers;
    }
    
    // Si no, intenta obtener la cookie del lado del servidor.
    try {
        const cookieStore = await cookies();
        const tokenCookie = await cookieStore.get('token'); // Asume que la cookie se llama 'token'
        if (tokenCookie) {
            headers['Cookie'] = `token=${tokenCookie.value}`;
        }
    } catch (error) {
        // Esto fallará en el lado del cliente, es esperado.
        // No hacer nada, la petición irá sin la cabecera de cookie.
    }

    return headers;
}


// Función genérica para obtener datos.
async function fetchData<T>(endpoint: string, token: string | null, mapper: (item: any) => T): Promise<T[]> {
  try {
    const response = await fetch(`${API_BASE_URL_GOOGLE}${endpoint}`, {
      cache: 'no-cache', 
      headers: await getAuthHeaders(token),
    });

    if (!response.ok) {
       const errorText = await response.text();
       const errorJson = errorText ? JSON.parse(errorText) : {};
       const errorMessage = errorJson.message || response.statusText || `HTTP error! status: ${response.status}`;
      throw new Error(`Error al obtener datos de ${endpoint}: ${errorMessage}`);
    }
    const data = await response.json();
    
    // La API a veces devuelve un solo objeto en lugar de un array, así que lo manejamos.
    return Array.isArray(data) ? data.map(mapper) : [];
  } catch (error) {
    console.error(`No se pudieron obtener datos de ${endpoint}:`, error);
    return []; // Devuelve un array vacío en caso de error para evitar que la UI se rompa.
  }
}

// Obtiene la lista pública de productos.
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL_GOOGLE}/productos/listado`, { 
      cache: 'no-cache',
      headers: await getAuthHeaders(), // Usa las cabeceras con la cookie si está disponible
    });
    
    if (!response.ok) {
      throw new Error(`Error al obtener los productos: ${response.statusText}`);
    }

    const apiProducts = await response.json();
    const mappedProducts = Array.isArray(apiProducts) ? apiProducts.map(mapApiToProduct) : [];
    
    return mappedProducts;

  } catch (error) {
    console.error("No se pudieron obtener los productos:", error);
    return [];
  }
}

// Obtiene un solo producto por su ID.
export async function getProductById(id: string | number): Promise<Product | undefined> {
   try {
    const response = await fetch(`${API_BASE_URL_GOOGLE}/productos/${id}`, { 
      cache: 'no-cache',
       headers: await getAuthHeaders(), // Usa las cabeceras con la cookie si está disponible
    });

    if (!response.ok) {
      if (response.status === 404) return undefined; // Si no lo encuentra, devuelve undefined.
      throw new Error(`Error al obtener el producto: ${response.statusText}`);
    }

    const apiProduct = await response.json();
    return mapApiToProduct(apiProduct);

  } catch (error) {
    console.error(`No se pudo obtener el producto con id ${id}:`, error);
    return undefined;
  }
}


// Obtiene los productos que están actualmente en oferta.
export async function getProductsOnDeal(): Promise<Product[]> {
  const deals = await getDeals(null); // Obtiene todas las ofertas.
  const activeDeals = deals.filter(deal => deal.estado); // Filtra solo las activas.
  
  // Para cada oferta activa, busca los detalles completos del producto.
  const productsOnDeal = await Promise.all(
    activeDeals.map(async (deal) => {
      const product = await getProductById(deal.productoId);
      return product;
    })
  );
  // Filtra cualquier resultado `undefined` (si un producto de una oferta no se encontrara).
  return productsOnDeal.filter((p): p is Product => p !== undefined);
}

// --- Funciones para el Panel de Administración (requieren token/cookie) ---
export const getUsers = (token: string | null) => fetchData('/usuarios', token, mapApiToUser);
export const getOrders = (token: string | null) => fetchData('/pedidos', token, mapApiToOrder);
export const getDeals = (token: string | null): Promise<Deal[]> => fetchData('/api/ofertas/listar', token, mapApiToDeal);
export const getAttributes = (token?: string | null): Promise<ProductAttribute[]> =>
  fetchData('/atributos/listado', token ?? null, item => item as ProductAttribute);
export const getFragrances = (token: string | null): Promise<Fragrance[]> => fetchData('/fragancias', token, item => item as Fragrance);


// --- DATOS DE MUESTRA (MOCK DATA) ---
// Estos son los datos para el blog. Como no hay una API para el blog,
// se usan estos datos estáticos.
export const blogArticles: BlogArticle[] = [
  {
    slug: 'beginners-guide-to-aromatherapy',
    title: 'A Beginner\'s Guide to Aromatherapy',
    summary: 'Discover the basics of aromatherapy, from what it is to how you can incorporate it into your daily life for enhanced well-being.',
    author: 'Jane Doe',
    date: 'October 26, 2023',
    image: 'https://picsum.photos/800/600?random=10',
    content: '<p>Aromatherapy is a holistic healing treatment that uses natural plant extracts to promote health and well-being. Sometimes called essential oil therapy, aromatherapy uses aromatic essential oils medicinally to improve the health of the body, mind, and spirit. It enhances both physical and emotional health.</p><p>Aromatherapy is thought of as both an art and a science. Recently, aromatherapy has gained more recognition in the fields of science and medicine.</p><h3>How does aromatherapy work?</h3><p>Researchers believe that inhaling essential oil molecules, or absorbing essential oils through the skin, transmits messages to the limbic system — a brain region responsible for controlling emotions and influencing the nervous system. These messages can affect biological factors such as heart rate, stress levels, blood pressure, breathing, and immune function.</p>'
  },
  {
    slug: 'top-5-essential-oils-for-relaxation',
    title: 'Top 5 Essential Oils for Relaxation',
    summary: 'Unwind and de-stress with our top five essential oils known for their calming and soothing properties. Find your perfect scent for peace.',
    author: 'John Smith',
    date: 'November 5, 2023',
    image: 'https://picsum.photos/800/600?random=11',
    content: '<p>In our fast-paced world, finding moments of calm is essential. Essential oils can be a powerful tool for relaxation. Here are our top 5 picks:</p><ol><li><strong>Lavender:</strong> The king of relaxation, lavender is renowned for its ability to calm the nervous system and promote sleep.</li><li><strong>Chamomile:</strong> With its gentle, soothing aroma, chamomile is perfect for easing anxiety and creating a peaceful environment.</li><li><strong>Bergamot:</strong> This citrus oil has an uplifting yet calming effect, helping to reduce stress and improve mood.</li><li><strong>Ylang Ylang:</strong> A sweet, floral scent that can help alleviate stress and promote a sense of well-being.</li><li><strong>Frankincense:</strong> An earthy, grounding oil that is excellent for meditation and quieting a busy mind.</li></ol>'
  },
  {
    slug: 'creating-a-mindful-space-with-incense',
    title: 'Creating a Mindful Space with Incense',
    summary: 'Learn how the ancient practice of burning incense can help you create a mindful, meditative space in your own home.',
    author: 'Emily White',
    date: 'November 15, 2023',
    image: 'https://picsum.photos/800/600?random=12',
    content: '<p>The ritual of burning incense has been used for centuries across various cultures to sanctify spaces and elevate consciousness. The simple act of lighting an incense stick and watching the smoke curl can be a powerful anchor for mindfulness.</p><h3>Choosing Your Scent</h3><p>Different scents evoke different moods. For a calming space, try Sandalwood or Lavender. For an energizing and cleansing atmosphere, Palo Santo or Sage are excellent choices. Experiment to find what resonates with you.</p><h3>The Ritual</h3><p>Find a quiet corner in your home. Place your incense in a proper holder. As you light it, set an intention for your practice, whether it\'s for meditation, creative work, or simply to unwind. Allow the aroma to fill your space and your senses, bringing you into the present moment.</p>'
  },
];

    