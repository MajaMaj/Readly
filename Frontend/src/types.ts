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
  image_url: string;
  rating: number;
}

export interface Work {
  key: string;
  title: string;
  authors?: { name: string }[];
  cover_id?: number;
}
