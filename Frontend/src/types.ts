export interface RegisterData {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginData {
  identifier: string;
  password?: string;
}

export interface ApiError {
  detail: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  image_url: string | null;
  rating: number;
  description?: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  username: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface Work {
  key: string;
  title: string;
  authors?: { name: string }[];
  cover_id?: number;
}

export interface ShelfBook {
  id: string;
  book_id: string;
  title: string;
  author: string;
  image_url: string | null;
}

export interface Shelf {
  id: string;
  name: string;
  books: ShelfBook[];
}
