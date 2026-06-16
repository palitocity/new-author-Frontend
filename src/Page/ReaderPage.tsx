import { BookmarkPlus, NotebookPen } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import ProtectionBadge from "../components/access/ProtectionBadge";
import ReaderSidebar from "../components/reader/ReaderSidebar";
import ReaderToolbar from "../components/reader/ReaderToolbar";
import ReadingProgressBar from "../components/reader/ReadingProgressBar";
import { continuityProducts } from "../data/mockContinuity";
import { useReadingProgress } from "../hooks/useReadingProgress";

export default function ReaderPage() {
  const { productId } = useParams();
  const product = continuityProducts.find((item) => item.id === productId);
  const { progress, updateProgress } = useReadingProgress(productId);
  const [localChapter, setLocalChapter] = useState(progress?.currentChapter || 1);
  const [page, setPage] = useState(progress?.currentPage || 1);

  const percentage = progress?.percentage ?? product?.progress ?? 0;
  const chapterTitle = useMemo(
    () => product?.chapters[localChapter - 1] || "Reading",
    [localChapter, product?.chapters],
  );

  if (!product) {
    return <div className="p-10 text-center">Reader product not found.</div>;
  }

  const persist = (nextChapter = localChapter, nextPage = page) => {
    const nextPercentage = Math.min(100, Math.max(1, Math.round((nextPage / 180) * 100)));
    updateProgress(product.id, {
      currentChapter: nextChapter,
      currentPage: nextPage,
      percentage: nextPercentage,
    });
  };

  const setChapter = (chapter: number) => {
    setLocalChapter(chapter);
    persist(chapter, page);
  };

  const onPageChange = (delta: number) => {
    const nextPage = Math.max(1, page + delta);
    setPage(nextPage);
    persist(localChapter, nextPage);
  };

  return (
    <main className="min-h-screen bg-stone-100">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <Link to={`/library/${product.id}`} className="text-xs font-bold uppercase tracking-widest text-amber-700">
              My Continuity Library
            </Link>
            <h1 className="text-xl font-bold text-stone-950">{product.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ProtectionBadge level={product.protectionLevel} />
            <span className="text-sm text-stone-500">Last opened {progress?.lastOpened || product.lastOpened}</span>
          </div>
        </div>
        <div className="mx-auto mt-3 max-w-7xl">
          <ReadingProgressBar value={percentage} />
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <ReaderSidebar chapters={product.chapters} currentChapter={localChapter} setChapter={setChapter} />
        </div>
        <article className="min-h-[calc(100vh-96px)] bg-stone-50 px-4 py-8">
          <div className="mx-auto max-w-3xl rounded-lg border border-stone-200 bg-white p-6 shadow-sm md:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Chapter {localChapter}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-stone-950">{chapterTitle}</h2>
            <p className="mt-2 text-sm text-stone-500">Page {page} · {percentage}% complete</p>
            <div className="prose mt-8 max-w-none text-stone-700">
              <p>
                This mocked reader area represents the protected digital reading surface.
                Backend content can later replace this text while keeping the toolbar,
                chapter navigation, progress, bookmarks, and Reflection Notes intact.
              </p>
              <p>
                The current collection asks the reader to move slowly, hold context, and
                connect each chapter to preserved materials, personal reflection, and
                responsible access.
              </p>
              <p>
                Reading progress is persisted locally for now, so returning to the product
                keeps your last chapter, page, and percentage available.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => toast.success("Bookmark saved")}
                className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold"
              >
                <BookmarkPlus className="h-4 w-4" />
                Bookmark
              </button>
              <button
                type="button"
                onClick={() => toast.success("Reflection Note started")}
                className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold"
              >
                <NotebookPen className="h-4 w-4" />
                Add Reflection Note
              </button>
            </div>
          </div>
        </article>
      </div>

      <ReaderToolbar
        onAddBookmark={() => toast.success("Bookmark saved")}
        onAddNote={() => toast.success("Reflection Note started")}
        onPageChange={onPageChange}
      />
    </main>
  );
}
