

// NOTA PARA EL DESARROLLADOR:
// Este archivo es el punto central para obtener datos desde tu API.
// Contiene funciones que hacen 'fetch' a los endpoints de tu backend.
// Deberías añadir aquí nuevas funciones para obtener usuarios, pedidos, etc.

import type { Product, BlogArticle, User, Order } from './types';

// Función para mapear la respuesta de la API al tipo 'Product' que usa el frontend.
// Esto actúa como un "adaptador" entre el backend y el frontend.
function mapApiToProduct(apiProduct: any): Product {
  const onSale = apiProduct.porcentajeDescuento && apiProduct.porcentajeDescuento > 0;
  return {
    // Datos del backend
    id: apiProduct.id,
    nombre: apiProduct.nombre,
    descripcion: apiProduct.descripcion,
    precio: apiProduct.precio,
    stock: apiProduct.stock,
    imagenurl: apiProduct.imagenurl,
    activo: apiProduct.activo,
    categoriaNombre: apiProduct.categoriaNombre,
    mensaje: apiProduct.mensaje,
    fragancias: apiProduct.fragancias,
    porcentajeDescuento: apiProduct.porcentajeDescuento,
    fechaInicioDescuento: apiProduct.fechaInicioDescuento,
    fechaFinDescuento: apiProduct.fechaFinDescuento,
    precioFinal: apiProduct.precioFinal,
    atributos: apiProduct.atributos,
    precioMayorista: apiProduct.precioMayorista,
    totalIngresado: apiProduct.totalIngresado,

    // Datos mapeados para compatibilidad con el frontend
    name: apiProduct.nombre,
    description: apiProduct.descripcion,
    price: apiProduct.precioFinal, // El precio para el cliente es el precio final
    image: apiProduct.imagenurl,
    category: apiProduct.categoriaNombre,
    rating: 4.5, // Simulado, ya que no viene del backend
    reviews: 10, // Simulado
    aromas: apiProduct.fragancias,
    brand: apiProduct.atributos?.find((a: any) => a.nombre.toLowerCase() === 'brand')?.valor,
    onSale: onSale,
    originalPrice: onSale ? apiProduct.precio : undefined, // El precio original es el base solo si hay oferta
  };
}


// --- CONEXIÓN AL BACKEND PARA PRODUCTOS ---

// CONEXIÓN: Obtiene todos los productos desde tu API.
export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('https://apisahumerios.onrender.com/productos/listado', { cache: 'no-cache', credentials: 'omit' });
    
    if (!response.ok) {
      throw new Error(`Error al obtener los productos: ${response.statusText}`);
    }

    const apiProducts = await response.json();
    return apiProducts.map(mapApiToProduct);

  } catch (error) {
    console.error("No se pudieron obtener los productos:", error);
    // Devuelve un array vacío en caso de error para que la aplicación no se rompa.
    return [];
  }
}

// CONEXIÓN: Obtiene un producto específico por su ID desde tu API.
export async function getProductById(id: string): Promise<Product | undefined> {
   try {
    const response = await fetch(`https://apisahumerios.onrender.com/productos/${id}`, { cache: 'no-cache', credentials: 'omit' });

    if (!response.ok) {
      if (response.status === 404) {
        return undefined; 
      }
      throw new Error(`Error al obtener el producto: ${response.statusText}`);
    }

    const apiProduct = await response.json();
    return mapApiToProduct(apiProduct);

  } catch (error) {
    console.error(`No se pudo obtener el producto con id ${id}:`, error);
    return undefined;
  }
}


// --- DATOS DE MUESTRA (MOCK DATA) Y CONEXIONES POR HACER ---
// NOTA: Las siguientes secciones usan datos de muestra.
// Deberás reemplazarlos con llamadas a tu API, siguiendo el ejemplo de getProducts.

// CONEXIÓN (POR HACER): Crear una función `getUsers()` para obtener usuarios de tu API.
// export async function getUsers(): Promise<User[]> { ... }
export const users: User[] = [];

// CONEXIÓN (POR HACER): Crear una función `getOrders()` para obtener pedidos de tu API.
// export async function getOrders(): Promise<Order[]> { ... }
export const orders: Order[] = [
  {
    id: 'ord_1',
    customerName: 'Sarah L.',
    date: '2023-10-20',
    status: 'Delivered',
    total: 62.98,
    items: [
      { productId: '2', productName: 'Ceramic Ultrasonic Diffuser', quantity: 1, price: 49.99 },
      { productId: '1', productName: 'Sandalwood Incense Sticks', quantity: 1, price: 12.99 },
    ],
  },
  {
    id: 'ord_2',
    customerName: 'Michael B.',
    date: '2023-11-01',
    status: 'Shipped',
    total: 33.49,
    items: [
      { productId: '3', productName: 'Pure Lavender Essential Oil', quantity: 1, price: 18.50 },
      { productId: '9', productName: 'Peppermint Essential Oil', quantity: 1, price: 13.50 },
    ],
  },
   {
    id: 'ord_3',
    customerName: 'Jessica P.',
    date: '2023-11-05',
    status: 'Pending',
    total: 15.00,
    items: [
      { productId: '4', productName: 'Palo Santo Sticks', quantity: 1, price: 15.00 },
    ],
  },
];


// Los artículos del blog pueden seguir siendo datos de muestra por ahora.
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
