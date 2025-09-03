export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'incense' | 'diffusers' | 'oils';
  rating: number;
  reviews: number;
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
