
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
  id: string;
  name: string;
  email: string;
  joinDate: string;
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
  status: 'Pending' | 'Shipped' | 'Delivered';
  total: number;
  items: OrderItem[];
};
