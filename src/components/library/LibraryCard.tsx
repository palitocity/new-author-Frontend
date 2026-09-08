import {
  BookOpen,
  Download,
  FileText,
  NotebookPen,
  PackageOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { LibraryProduct } from "../../types/libary";
import ProgressRing from "./ProgressRing";

export default function LibraryCard({
  product,
  view = "grid",
}: {
  product: LibraryProduct;
  view?: "grid" | "list";
}) {
  const list = view === "list";

  const progress = product.progressPercentage ?? product.progress ?? 0;

  const lastOpened = product.lastReadAt
    ? new Date(product.lastReadAt).toLocaleDateString()
    : "Not opened yet";

  return (
    <article
      className={`overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm ${
        list ? "grid gap-0 md:grid-cols-[180px_1fr]" : ""
      }`}
    >
      {/* COVER */}
      <div
        className={`${
          list ? "h-full min-h-48" : "aspect-4/3"
        } bg-stone-200`}
      >
        {product.coverImage ? (
          <img
            src={product.coverImage}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-48 items-center justify-center">
            <BookOpen className="h-10 w-10 text-stone-400" />
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4">
        {/* PRODUCT TYPE */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-700">
            {product.productType}
          </span>

          <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
            Purchased
          </span>
        </div>

        {/* TITLE + PROGRESS */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-lg font-bold text-stone-950">
              {product.title}
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              by {product.author}
            </p>

            {product.subtitle && (
              <p className="mt-1 line-clamp-2 text-xs text-stone-400">
                {product.subtitle}
              </p>
            )}
          </div>

          <ProgressRing value={progress} />
        </div>

        {/* PURCHASE / READING INFO */}
        <div className="mt-4 grid gap-2 text-xs text-stone-500 sm:grid-cols-2">
          <span>
            Purchased{" "}
            {new Date(product.purchaseDate).toLocaleDateString()}
          </span>

          <span>Last opened {lastOpened}</span>
        </div>

        {/* READING PROGRESS */}
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-stone-600">
            <span>Reading progress</span>
            <span>{progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-stone-100">
            <div
              className="h-full rounded-full bg-amber-600 transition-all"
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
              }}
            />
          </div>

          <p className="mt-1 text-xs text-stone-400">
            Page {product.currentPage} of {product.totalPages}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Link
  to={`/reader/${product.id}`}
  state={{ product }}
  className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-700 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-800"
>
  <BookOpen className="h-4 w-4" />
  Continue Reading
</Link>

          <Link
            to={`/library/${product.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-50"
          >
            <PackageOpen className="h-4 w-4" />
            Resources
          </Link>

          <Link
            to={`/dashboard/reflection-notes?product=${product.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-50"
          >
            <NotebookPen className="h-4 w-4" />
            Reflection Notes
          </Link>

          <a
            href={product.pdfFile}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-800 ${
              !product.pdfFile
                ? "pointer-events-none opacity-45"
                : "hover:bg-stone-50"
            }`}
          >
            {product.pdfFile ? (
              <Download className="h-4 w-4" />
            ) : (
              <FileText className="h-4 w-4" />
            )}

            {product.pdfFile ? "Open PDF" : "PDF Unavailable"}
          </a>
        </div>
      </div>
    </article>
  );
}