import { useCallback, useEffect, useState } from "react";
import axios from "../config/axiosconfiq";
import type { Book } from "../types/book";

export type BookAccess = {
  canRead: boolean;
  isFree: boolean;
  owned: boolean;
  book: Book;
  streamToken?: string;
};

type AxiosLikeError = {
  response?: { data?: { message?: string; error?: string } };
};

/**
 * Asks the API whether the signed-in user may read a story (free, or in
 * their library) and, if so, returns a short-lived stream token.
 */
export function useBookAccess(bookId?: string) {
  const [access, setAccess] = useState<BookAccess | null>(null);
  const [loading, setLoading] = useState(Boolean(bookId));
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!bookId) return;

    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`/book/${bookId}/access`);
      setAccess(res.data.data);
    } catch (fetchError) {
      const response = (fetchError as AxiosLikeError).response;
      setError(
        response?.data?.message ||
          response?.data?.error ||
          "Unable to open this item.",
      );
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    load();
  }, [load]);

  return { access, loading, error, reload: load };
}
