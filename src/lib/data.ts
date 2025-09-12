

// NOTA PARA EL DESARROLLADOR:
// Este archivo es el punto central para obtener datos desde tu API.
// Contiene funciones que hacen 'fetch' a los endpoints de tu backend.

import type { Product, BlogArticle, User, Order, Deal, ProductAttribute, Fragrance } from './types';

// --- ADAPTADORES DE API A TIPO DE FRONTEND ---

function mapApiToProduct(apiProduct: any): Product {
  const onSale = apiProduct.porcentajeDescuento && Number(apiProduct.porcentajeDescuento) > 0;
  
  const basePrice = Number(apiProduct.precio) || 0;
  const finalPrice = Number(apiProduct.precioFinal) || basePrice;
  
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
    name: apiProduct.nombre,
    description: apiProduct.descripcion,
    price: finalPrice,
    image: apiProduct.imagenurl || `https://picsum.photos/600/600?random=${apiProduct.id}`,
    category: apiProduct.categoriaNombre,
    rating: 4.5, // Simulado
    reviews: 10, // Simulado
    aromas: apiProduct.fragancias || [],
    brand: apiProduct.atributos?.find((a: any) => a.nombre.toLowerCase() === 'marca')?.valor,
    onSale: onSale,
    originalPrice: onSale ? basePrice : undefined,
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
        customerName: apiOrder.usuario.nombre, // Asumiendo que la API anida el usuario
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


// --- CONEXIONES AL BACKEND ---

async function fetchData<T>(endpoint: string, token: string | null, mapper: (item: any) => T): Promise<T[]> {
  try {
    const response = await fetch(`https://apisahumerios.onrender.com${endpoint}`, {
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener datos de ${endpoint}: ${response.statusText}`);
    }
    const data = await response.json();
    return Array.isArray(data) ? data.map(mapper) : [];
  } catch (error) {
    console.error(`No se pudieron obtener datos de ${endpoint}:`, error);
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('https://apisahumerios.onrender.com/productos/listado', { 
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
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

export async function getProductById(id: string): Promise<Product | undefined> {
   try {
    const response = await fetch(`https://apisahumerios.onrender.com/productos/${id}`, { 
      cache: 'no-cache',
       headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) return undefined; 
      throw new Error(`Error al obtener el producto: ${response.statusText}`);
    }

    const apiProduct = await response.json();
    return mapApiToProduct(apiProduct);

  } catch (error) {
    console.error(`No se pudo obtener el producto con id ${id}:`, error);
    return undefined;
  }
}

// --- Nuevas funciones para el panel de admin ---
export const getUsers = (token: string | null) => fetchData('/usuarios', token, mapApiToUser);
export const getOrders = (token: string | null) => fetchData('/pedidos', token, mapApiToOrder);

// Asumiendo que estos endpoints existen y devuelven un array de objetos.
// Los mappers son simples, se pueden ajustar si la API devuelve una estructura diferente.
export const getDeals = (token: string | null): Promise<Deal[]> => fetchData('/ofertas', token, item => item as Deal);
export const getAttributes = (token: string | null): Promise<ProductAttribute[]> => fetchData('/atributos', token, item => item as ProductAttribute);
export const getFragrances = (token: string | null): Promise<Fragrance[]> => fetchData('/fragancias', token, item => item as Fragrance);


// --- DATOS DE MUESTRA (MOCK DATA) ---
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
