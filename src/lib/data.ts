// =================================================================================
// DATA LAYER (SERVER-SIDE ONLY)
// Este archivo se encarga únicamente de obtener datos del backend.
// NO se debe importar en Client Components directamente si usa cookies().
// Para acciones POST/PUT/DELETE, usar Server Actions.
// =================================================================================

import type { Product, BlogArticle, User, Order, Deal, ProductAttribute, Fragrance } from './types';

const API_BASE_URL_GOOGLE = process.env.NEXT_PUBLIC_API_BASE_URL;

// ------------------
// ADAPTADORES
// ------------------

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
    rating: 4.5,
    reviews: 10,
    aromas: apiProduct.fragancias || [],
    brand: apiProduct.atributos?.find((a: any) => a.nombre.toLowerCase() === 'marca')?.valor,
    onSale,
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
  };
}

function mapApiToOrder(apiOrder: any): Order {
  return {
    id: apiOrder.id,
    customerName: apiOrder.usuario.nombre,
    date: apiOrder.fecha,
    status: apiOrder.estado,
    total: Number(apiOrder.total) || 0,
    items: apiOrder.detalles?.map((d: any) => ({
      productId: d.producto.id,
      productName: d.producto.nombre,
      quantity: d.cantidad,
      price: Number(d.precio) || 0,
    })) || [],
  };
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
  };
}

// ------------------
// FETCH GENÉRICO (SERVER ONLY)
// ------------------

async function fetchData<T>(endpoint: string, token?: string, mapper?: (item: any) => T): Promise<T[]> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE_URL_GOOGLE}${endpoint}`, { headers, cache: 'no-cache' });
    if (!res.ok) {
      const text = await res.text();
      const json = text ? JSON.parse(text) : {};
      throw new Error(json.message || res.statusText || `HTTP ${res.status}`);
    }
    const data = await res.json();
    return Array.isArray(data) ? (mapper ? data.map(mapper) : data) : [];
  } catch (error) {
    console.error(`Error fetch ${endpoint}:`, error);
    return [];
  }
}

// ------------------
// FUNCIONES PÚBLICAS (SERVER COMPONENTS)
// ------------------

export const getProducts = (token?: string) => fetchData('/productos/listado', token, mapApiToProduct);
export const getProductById = async (id: string | number, token?: string): Promise<Product | undefined> => {
  try {
    const res = await fetch(`${API_BASE_URL_GOOGLE}/productos/${id}`, { headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, cache: 'no-cache' });
    if (!res.ok) return undefined;
    const apiProduct = await res.json();
    return mapApiToProduct(apiProduct);
  } catch {
    return undefined;
  }
};
export const getUsers = (token?: string) => fetchData('/usuarios', token, mapApiToUser);
export const getOrders = (token?: string) => fetchData('/pedidos', token, mapApiToOrder);
export const getDeals = (token?: string) => fetchData('/api/ofertas/listar', token, mapApiToDeal);
export const getAttributes = (token?: string): Promise<ProductAttribute[]> =>
  fetchData('/atributos/listado', token , item => item as ProductAttribute);

export const getFragrances = (token?: string): Promise<Fragrance[]> =>
  fetchData('/fragancias', token , item => item as Fragrance);

export const getProductsOnDeal = async (token?: string): Promise<Product[]> => {
  const deals = await getDeals(token);
  const activeDeals = deals.filter(deal => deal.estado);
  const productsOnDeal = await Promise.all(
    activeDeals.map(async deal => await getProductById(deal.productoId, token))
  );
  return productsOnDeal.filter((p): p is Product => p !== undefined);
};

// ------------------
// MOCK DATA (blog)
// ------------------

export const blogArticles: BlogArticle[] = [
  {
    slug: 'beginners-guide-to-aromatherapy',
    title: 'A Beginner\'s Guide to Aromatherapy',
    summary: 'Discover the basics of aromatherapy...',
    author: 'Jane Doe',
    date: 'October 26, 2023',
    image: 'https://picsum.photos/800/600?random=10',
    content: '<p>Contenido de aromaterapia...</p>'
  },
  {
    slug: 'top-5-essential-oils-for-relaxation',
    title: 'Top 5 Essential Oils for Relaxation',
    summary: 'Unwind and de-stress...',
    author: 'John Smith',
    date: 'November 5, 2023',
    image: 'https://picsum.photos/800/600?random=11',
    content: '<p>Contenido de aceites esenciales...</p>'
  },
];
