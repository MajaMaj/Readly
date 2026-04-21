import type { Book, Work } from "../types";

export const bookService = {
  getDiscoverBooks: async (): Promise<Book[]> => {
    try {
      const response = await fetch(
        "https://openlibrary.org/subjects/fiction.json?limit=12"
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();

      return data.works.map((work: Work) => ({
        id: work.key,
        title: work.title,
        author: work.authors?.[0]?.name || "Unknown Author",
        image_url: work.cover_id
          ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
          : "https://via.placeholder.com/150x220?text=No+Cover",
        rating: 4.7,
      }));
    } catch (error) {
      console.error("OpenLibrary Error:", error);
      return [];
    }
  },
};
