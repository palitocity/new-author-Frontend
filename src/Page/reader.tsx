import { lazy, Suspense, useCallback, useEffect, useRef } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Lock } from "lucide-react";
import type { LibraryProduct } from "../types/libary";
import { useBookAccess } from "../hooks/useBookAccess";
import {
  useLibraryQuery,
  useSaveReadingProgressMutation,
} from "../services/api";
import { getMediaKinds } from "../utils/media";

const MediaExperience = lazy(
  () => import("../components/media/MediaExperience"),
);

const PROGRESS_SAVE_DELAY_MS = 1500;

const FullScreenMessage = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen flex-col items-center justify-center gap-3 px-4 text-center text-stone-600">
    {children}
  </div>
);

const Spinner = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
  </div>
);

export default function Reader() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateProduct = (location.state as { product?: LibraryProduct } | null)
    ?.product;

  const { access, loading, error, reload } = useBookAccess(id);
  const { data: libraryData, isLoading: libraryLoading } = useLibraryQuery();
  const [saveReadingProgress] = useSaveReadingProgressMutation();

  const libraryEntry = libraryData?.data?.books?.find(
    (entry) => String(entry.bookId) === id,
  );
  const initialPage =
    libraryEntry?.currentPage || stateProduct?.currentPage || 1;

  // Save progress after the reader settles on a page, not on every flip.
  const saveTimer = useRef<number | undefined>(undefined);
  const canSaveProgress = Boolean(access?.owned);

  const handlePageChange = useCallback(
    (page: number, totalPages: number) => {
      if (!id || !canSaveProgress) return;

      window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        saveReadingProgress({ bookId: id, currentPage: page, totalPages })
          .unwrap()
          .catch(() => undefined);
      }, PROGRESS_SAVE_DELAY_MS);
    },
    [id, canSaveProgress, saveReadingProgress],
  );

  useEffect(() => () => window.clearTimeout(saveTimer.current), []);

  if (loading || libraryLoading) return <Spinner />;

  if (error || !access) {
    return (
      <FullScreenMessage>
        <p>{error || "Book not found."}</p>
        <Link to="/dashboard/library" className="text-amber-700 underline">
          Back to Library
        </Link>
      </FullScreenMessage>
    );
  }

  const book = access.book;

  if (!access.canRead || !access.streamToken) {
    return (
      <FullScreenMessage>
        <Lock className="h-8 w-8 text-amber-700" />
        <p>This item is part of the paid collection. Purchase it to read.</p>
        <Link to={`/order/${id}`} className="text-amber-700 underline">
          Purchase
        </Link>
      </FullScreenMessage>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <div className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
        <Link
          to="/dashboard/library"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-stone-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="min-w-0 text-center">
          <p className="truncate text-sm font-bold text-stone-950">
            {book.title}
          </p>
          {book.author && (
            <p className="text-xs text-stone-500">by {book.author}</p>
          )}
        </div>

        <div className="w-16" />
      </div>

      <div className="flex-1 p-2 md:p-4">
        <Suspense fallback={<Spinner />}>
          <MediaExperience
            bookId={book._id}
            streamToken={access.streamToken}
            media={getMediaKinds(book)}
            title={book.title}
            author={book.author}
            narrator={book.narrator}
            coverImage={book.coverImage}
            initialPage={initialPage}
            onPageChange={handlePageChange}
            onRetry={reload}
            fullHeight
          />
        </Suspense>
      </div>
    </div>
  );
}
