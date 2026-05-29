/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import {
  AlertCircle,
  BookOpen,
  Headphones,
  Loader2,
  RefreshCw,
  Video,
} from "lucide-react";

import axios from "../config/axiosconfiq";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useMemo, useState } from "react";

const pdfWorkerUrl =
  "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

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
    audioFile?: string;
    videoFile?: string;
    price?: number;
    tags?: string[];
  };

  book?: {
    _id?: string;
    title?: string;
    author?: string;
    coverImage?: string;
    pdfFile?: string;
    audioFile?: string;
    videoFile?: string;
  };
};

type MediaAsset = {
  kind: "pdf" | "audio" | "video";
  url: string;
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

const getMediaAssets = (book: any): MediaAsset[] => {
  const assets: MediaAsset[] = [];

  if (book?.pdfFile) {
    assets.push({
      kind: "pdf",
      url: book.pdfFile,
    });
  }

  if (book?.audioFile) {
    assets.push({
      kind: "audio",
      url: book.audioFile,
    });
  }

  if (book?.videoFile) {
    assets.push({
      kind: "video",
      url: book.videoFile,
    });
  }

  return assets;
};

const mediaIcon = {
  pdf: BookOpen,
  audio: Headphones,
  video: Video,
};

const mediaLabel = {
  pdf: "Read",
  audio: "Listen",
  video: "Watch",
};

const ErrorState = ({ message }: { message: string }) => (
  <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-lg border border-red-200 bg-red-50 px-6 text-center text-red-800">
    <AlertCircle className="h-8 w-8" />

    <p className="max-w-md text-sm font-medium">{message}</p>
  </div>
);

const LoadingState = ({ label }: { label: string }) => (
  <div className="flex h-full min-h-72 items-center justify-center gap-3 bg-stone-100 text-stone-600">
    <Loader2 className="h-6 w-6 animate-spin" />

    <span className="text-sm font-semibold">{label}</span>
  </div>
);

const EmptyState = () => (
  <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-lg border border-stone-200 bg-white px-6 text-center text-stone-600">
    <BookOpen className="h-8 w-8 text-stone-400" />

    <p className="max-w-md text-sm font-medium">
      This item does not have any readable or playable media yet.
    </p>
  </div>
);

const PdfActionButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center justify-center gap-2 rounded-md bg-stone-800 px-3 py-2 text-xs font-semibold text-stone-100 transition hover:bg-stone-700"
  >
    {children}
  </button>
);

const PdfReader = ({ asset }: { asset: MediaAsset }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const [loadError, setLoadError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const retryReader = () => {
    setLoadError("");
    setRetryKey((c) => c + 1);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-stone-800 bg-stone-950 shadow-2xl">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-stone-800 p-3 text-white">
        <span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs text-amber-200">
          Reader mode
        </span>

        <PdfActionButton onClick={retryReader}>
          <RefreshCw className="h-4 w-4" />
          Retry
        </PdfActionButton>
      </div>

      {/* ERROR */}
      {loadError && (
        <div className="border-b border-stone-800 bg-stone-900 p-4">
          <ErrorState message={loadError} />
        </div>
      )}

      {/* PDF VIEWER */}
      <div className="h-[85vh] bg-stone-200">
        <Worker workerUrl={pdfWorkerUrl}>
          <Viewer
            key={`${asset.url}-${retryKey}`}
            fileUrl={asset.url}
            plugins={[defaultLayoutPluginInstance]}
            renderLoader={() => <LoadingState label="Loading PDF..." />}
            renderError={(error) => {
              return (
                <ErrorState
                  message={
                    error?.message || "Unable to load PDF. Please try again."
                  }
                />
              );
            }}
          />
        </Worker>
      </div>
    </div>
  );
};

const AudioPlayer = ({ asset, book }: { asset: MediaAsset; book: any }) => (
  <div className="grid gap-6 bg-stone-950 p-5 text-white md:grid-cols-[220px_1fr] md:p-8">
    <div className="aspect-square overflow-hidden rounded-lg bg-stone-800">
      {book.coverImage ? (
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <Headphones className="h-14 w-14 text-stone-500" />
        </div>
      )}
    </div>

    <div className="flex min-w-0 flex-col justify-center">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-300">
        Now playing
      </p>

      <h2 className="text-2xl font-bold md:text-4xl">{book.title}</h2>

      {book.author && (
        <p className="mt-2 text-sm text-stone-300">By {book.author}</p>
      )}

      <audio
        key={asset.url}
        controls
        preload="metadata"
        controlsList="nodownload"
        className="mt-8 w-full"
        src={asset.url}
      />
    </div>
  </div>
);

const VideoPlayer = ({ asset, book }: { asset: MediaAsset; book: any }) => (
  <div className="bg-black">
    <video
      key={asset.url}
      controls
      controlsList="nodownload"
      playsInline
      preload="metadata"
      poster={book.coverImage}
      className="aspect-video w-full bg-black object-contain"
      src={asset.url}
    />
  </div>
);

const MediaExperience = ({ book }: { book: any }) => {
  const assets = useMemo(() => getMediaAssets(book), [book]);

  const [activeAssetUrl, setActiveAssetUrl] = useState(assets[0]?.url || "");

  const activeAsset =
    assets.find((asset) => asset.url === activeAssetUrl) || assets[0];

  if (!activeAsset) return <EmptyState />;

  return (
    <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-xl">
      {/* MEDIA TABS */}
      {assets.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-b border-stone-200 bg-stone-100 p-2">
          {assets.map((asset) => {
            const Icon = mediaIcon[asset.kind];

            const active = asset.url === activeAsset.url;

            return (
              <button
                key={`${asset.kind}-${asset.url}`}
                type="button"
                onClick={() => setActiveAssetUrl(asset.url)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-stone-950 text-white"
                    : "bg-white text-stone-700 hover:bg-amber-50"
                }`}
              >
                <Icon className="h-4 w-4" />

                {mediaLabel[asset.kind]}
              </button>
            );
          })}
        </div>
      )}

      {/* PDF */}
      {activeAsset.kind === "pdf" && <PdfReader asset={activeAsset} />}

      {/* AUDIO */}
      {activeAsset.kind === "audio" && (
        <AudioPlayer asset={activeAsset} book={book} />
      )}

      {/* VIDEO */}
      {activeAsset.kind === "video" && (
        <VideoPlayer asset={activeAsset} book={book} />
      )}
    </section>
  );
};

export default function Library() {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedBook, setSelectedBook] = useState<any>(null);

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

  if (selectedBook) {
    return (
      <div className="min-h-screen bg-stone-950 p-4">
        <div className="mx-auto mb-4 flex max-w-7xl">
          <button
            onClick={() => setSelectedBook(null)}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-stone-950"
          >
            Back to library
          </button>
        </div>

        <div className="mx-auto max-w-7xl">
          <MediaExperience book={selectedBook} />
        </div>
      </div>
    );
  }

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
                      Purchased{" "}
                      {new Date(item.purchasedAt).toLocaleDateString()}
                    </p>
                  )}

                  <button
                    onClick={() => setSelectedBook(book)}
                    className="mt-4 inline-flex w-full justify-center rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
                  >
                    Read Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
