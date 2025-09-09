export type Product = {
  id: number; // Cambiado a number para coincidir con el backend
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenurl: string; // Corregido a 'imagenurl'
  activo: boolean;
  categoriaNombre: 'incense' | 'diffusers' | 'oils' | 'Aceite' | 'Sahumerios' | string; // Permitir más categorías
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

  // Mantener campos antiguos por compatibilidad temporal donde sea necesario o mapear
  // Esto es para que el resto de la aplicación no se rompa de inmediato.
  // Idealmente, se refactoriza todo para usar los nuevos nombres.
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'incense' | 'diffusers' | 'oils' | 'Aceite' | 'Sahumerios' | string;
  rating: number; // Simulado o mapeado si no viene del backend
  reviews: number; // Simulado o mapeado
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
