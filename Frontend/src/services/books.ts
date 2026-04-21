import type { Book } from "../types";

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

interface GoogleBooksItem {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    imageLinks?: {
      extraLarge?: string;
      large?: string;
      medium?: string;
      small?: string;
      thumbnail?: string;
    };
    averageRating?: number;
  };
}

const mapBookData = (item: GoogleBooksItem): Book => {
  const info = item.volumeInfo;

  let coverUrl =
    info.imageLinks?.extraLarge ||
    info.imageLinks?.large ||
    info.imageLinks?.medium ||
    info.imageLinks?.small ||
    info.imageLinks?.thumbnail ||
    "";

  if (coverUrl) {
    coverUrl = coverUrl.replace("http:", "https:").replace("&edge=curl", "");

    if (coverUrl.includes("zoom=1")) {
      coverUrl = coverUrl.replace("zoom=1", "zoom=3");
    }
  }

  return {
    id: item.id,
    title: info.title || "Unknown Title",
    author: info.authors ? info.authors[0] : "Unknown Author",
    image_url: coverUrl || "",
    rating: info.averageRating || 4.5,
  };
};

export const bookService = {
  getTrendingBooks: async (): Promise<Book[]> => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=best+books+2024&maxResults=5&orderBy=relevance&key=${API_KEY}`
      );

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();

      return data.items ? data.items.map(mapBookData) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getCategoryBooks: async (category: string): Promise<Book[]> => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=8&orderBy=newest&key=${API_KEY}`
      );

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();

      return data.items ? data.items.map(mapBookData) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};
