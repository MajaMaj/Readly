import type { Book, Review, Shelf } from "../types";

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
const BASE_URL = "http://localhost:8000/api/books";
const SHELVES_URL = "http://localhost:8000/api/shelves";

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
    description?: string;
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
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=best+books+2024&maxResults=5&orderBy=relevance&key=${API_KEY}`
    );
    const data = await res.json();
    return data.items ? data.items.map(mapBookData) : [];
  },

  getCategoryBooks: async (category: string): Promise<Book[]> => {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=subject:${category}&maxResults=8&orderBy=newest&key=${API_KEY}`
    );
    const data = await res.json();
    return data.items ? data.items.map(mapBookData) : [];
  },

  getBookDetails: async (id: string): Promise<Book> => {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`
    );
    const data = await res.json();
    const info = data.volumeInfo;

    return {
      id: data.id,
      title: info.title || "Unknown Title",
      author: info.authors ? info.authors[0] : "Unknown Author",
      image_url: info.imageLinks?.thumbnail?.replace("http:", "https:") || null,
      rating: info.averageRating || 4.5,
      description: info.description?.replace(/<[^>]*>/g, ""),
    };
  },

  getReviews: async (bookId: string): Promise<Review[]> => {
    const res = await fetch(`${BASE_URL}/${bookId}/reviews`);
    const data = await res.json();

    return data.map((item: any) => ({
      id: item.id.toString(),
      bookId: item.book_id,
      userId: item.user_id,
      username: item.username,
      rating: item.rating,
      content: item.content,
      createdAt: item.created_at,
    }));
  },

  addReview: async (bookId: string, review: any): Promise<Review> => {
    const res = await fetch(`${BASE_URL}/${bookId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: review.userId,
        username: review.username,
        rating: review.rating,
        content: review.content,
      }),
    });

    const item = await res.json();

    return {
      id: item.id.toString(),
      bookId: item.book_id,
      userId: item.user_id,
      username: item.username,
      rating: item.rating,
      content: item.content,
      createdAt: item.created_at,
    };
  },

  updateReview: async (reviewId: string, review: any): Promise<Review> => {
    const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review),
    });

    const item = await res.json();

    return {
      id: item.id.toString(),
      bookId: item.book_id,
      userId: item.user_id,
      username: item.username,
      rating: item.rating,
      content: item.content,
      createdAt: item.created_at,
    };
  },

  getShelves: async (userId: string): Promise<Shelf[]> => {
    const res = await fetch(`${SHELVES_URL}/${userId}`);
    return await res.json();
  },

  getShelf: async (shelfId: string): Promise<Shelf> => {
    const res = await fetch(`${SHELVES_URL}/single/${shelfId}`);
    return await res.json();
  },

  createShelf: async (name: string, userId: string): Promise<Shelf> => {
    const res = await fetch(SHELVES_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, user_id: userId }),
    });

    return await res.json();
  },

  addBookToShelf: async (shelfId: string, book: Book) => {
    await fetch(`${SHELVES_URL}/${shelfId}/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: book.title,
        author: book.author,
        image_url: book.image_url,
        google_books_id: book.id,
      }),
    });
  },

  removeBookFromShelf: async (shelfId: string, bookId: string) => {
    await fetch(
      `http://localhost:8000/api/shelves/${shelfId}/books/${bookId}`,
      {
        method: "DELETE",
      }
    );
  },
};
