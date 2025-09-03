export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'incense' | 'diffusers' | 'oils';
  rating: number;
  reviews: number;
  fragrance?: string;
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
