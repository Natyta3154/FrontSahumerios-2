

export type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenurl: string; 
  activo: boolean;
  categoriaNombre: 'incense' | 'diffusers' | 'oils' | 'Aceite' | 'Sahumerios' | string;
  mensaje?: string | null;
  fragancias?: string[];
  porcentajeDescuento?: number | null;
  fechaInicioDescuento?: string | null;
  fechaFinDescuento?: string | null;
  precioFinal: number;
  atributos?: {
    nombre: string;
    valor: string;
  }[];
  precioMayorista?: number;
  totalIngresado?: number;

  // Datos mapeados para compatibilidad con el frontend
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'incense' | 'diffusers' | 'oils' | 'Aceite' | 'Sahumerios' | string;
  rating: number; // Simulado
  reviews: number; // Simulado
  aromas?: string[];
  brand?: string;
  onSale?: boolean;
  originalPrice?: number;
};


export type BlogArticle = {
  slug: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  image: string;
  content: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type User = {
  id: number;
  nombre: string;
  email: string;
  rol: 'ADMIN' | 'USER';
  fechaRegistro: string;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customerName: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Procesando' | 'Enviado' | 'Entregado';
  total: number;
  items: OrderItem[];
};

export type Deal = {
    id: number;
    productoId: number;
    porcentajeDescuento: number;
    fechaInicio: string;
    fechaFin: string;
};

export type ProductAttribute = {
    id: number;
    nombre: string;
}

export type Fragrance = {
    id: number;
    nombre: string;
}
