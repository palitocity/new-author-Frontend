/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "../config/axiosconfiq";

type LibraryBook = {
  bookId?: string;
  orderId?: string;
  transactionId?: string;
  paymentReference?: string;
  purchasedAt?: string;
  bookSnapshot?: {
    bookId?: string;
    title?: string;
    subtitle?: string;
    summary?: string;
    content?: string;
    author?: string;
    category?: string;
    coverImage?: string;
    pdfFile?: string;
    price?: number;
    tags?: string[];
  };
  book?: {
    _id?: string;
    title?: string;
    author?: string;
    coverImage?: string;
    pdfFile?: string;
  };
};

const normalizeLibraryBooks = (payload: any): LibraryBook[] => {
  const data = payload?.data;

  if (Array.isArray(data?.books)) return data.books;

  if (Array.isArray(data)) {
    return data.flatMap((item: any) => {
      if (Array.isArray(item?.books)) return item.books;
      return [item];
    });
  }

  return [];
};

export default function Library() {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setError("");
        const res = await axios.get(`/library/${email}`);
        setBooks(normalizeLibraryBooks(res.data));
      } catch (err: any) {
        setError(err?.response?.data?.error || "Unable to load your library.");
      } finally {
        setLoading(false);
      }
    };

    if (email) {
      fetchLibrary();
    } else {
      setLoading(false);
      setError("No purchase email found on this device.");
    }
  }, [email]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 px-4 py-12">
        <p className="text-center text-stone-600">Loading library...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-950">My Library</h1>
          {email && <p className="mt-1 text-sm text-stone-500">{email}</p>}
        </div>

        {error && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
            {error}
          </div>
        )}

        {!error && books.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white p-6 text-stone-600">
            No purchased stories found yet.
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((item) => {
            const book = item.bookSnapshot || item.book || {};
            const id =
              item.bookId ||
              item.bookSnapshot?.bookId ||
              item.book?._id ||
              item.paymentReference;

            return (
              <div
                key={`${id}-${item.paymentReference || item.purchasedAt || ""}`}
                className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"
              >
                {book.coverImage && (
                  <img
                    src={book.coverImage}
                    alt={book.title || "Purchased story"}
                    className="h-56 w-full object-cover"
                  />
                )}

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-stone-950">
                    {book.title || "Untitled story"}
                  </h2>
                  {book.author && (
                    <p className="mt-1 text-sm text-stone-500">
                      by {book.author}
                    </p>
                  )}
                  {item.purchasedAt && (
                    <p className="mt-2 text-xs text-stone-400">
                      Purchased {new Date(item.purchasedAt).toLocaleDateString()}
                    </p>
                  )}

                  {book.pdfFile ? (
                    <a
                      href={book.pdfFile}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex w-full justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                    >
                      Read / Download
                    </a>
                  ) : (
                    <p className="mt-4 text-sm text-stone-500">
                      File unavailable. Please contact support.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
