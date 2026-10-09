import type { Book, MediaKind } from "../types/book";

export type { MediaKind };

export const API_BASE_URL = (
  import.meta.env.VITE_DEVE_URL || "https://api.sankofaseek.com/api"
).replace(/\/$/, "");

const MEDIA_KINDS: MediaKind[] = ["pdf", "audio", "video"];

/**
 * Which kinds of media a story has. The API only reports availability;
 * the files themselves are streamed through /book/:id/stream/:kind and are
 * never exposed as downloadable links.
 */
export const getMediaKinds = (
  book: Pick<Book, "media" | "hasPdf" | "hasAudio" | "hasVideo"> | null | undefined,
): MediaKind[] => {
  if (!book) return [];

  if (Array.isArray(book.media)) {
    return MEDIA_KINDS.filter((kind) => book.media?.includes(kind));
  }

  return MEDIA_KINDS.filter(
    (kind) =>
      (kind === "pdf" && book.hasPdf) ||
      (kind === "audio" && book.hasAudio) ||
      (kind === "video" && book.hasVideo),
  );
};

export const buildStreamUrl = (bookId: string, kind: MediaKind, token?: string) =>
  `${API_BASE_URL}/book/${encodeURIComponent(bookId)}/stream/${kind}${
    token ? `?token=${encodeURIComponent(token)}` : ""
  }`;

export const formatPrice = (price = 0) =>
  `NGN ${price.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
