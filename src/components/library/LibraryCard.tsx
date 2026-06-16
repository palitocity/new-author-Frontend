import {
  BookOpen,
  Download,
  FileText,
  NotebookPen,
  PackageOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { ContinuityProduct } from "../../data/mockContinuity";
import PermissionBanner from "../access/PermissionBanner";
import ProtectionBadge from "../access/ProtectionBadge";
import ProgressRing from "./ProgressRing";

export default function LibraryCard({
  product,
  view = "grid",
}: {
  product: ContinuityProduct;
  view?: "grid" | "list";
}) {
  const list = view === "list";

  return (
    <article
      className={`overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm ${list ? "grid gap-0 md:grid-cols-[180px_1fr]" : ""}`}
    >
      <div className={`${list ? "h-full min-h-48" : "aspect-4/3"} bg-stone-200`}>
        <img
          src={product.coverImage}
          alt={product.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <ProtectionBadge level={product.protectionLevel} />
          <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-700">
            {product.productType}
          </span>
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="line-clamp-2 text-lg font-bold text-stone-950">
              {product.title}
            </h2>
            <p className="mt-1 text-sm text-stone-500">by {product.author}</p>
          </div>
          <ProgressRing value={product.progress} />
        </div>
        <div className="mt-4 grid gap-2 text-xs text-stone-500 sm:grid-cols-2">
          <span>Purchased {new Date(product.purchaseDate).toLocaleDateString()}</span>
          <span>Last opened {product.lastOpened}</span>
        </div>
        <div className="mt-4">
          <PermissionBanner protectionLevel={product.protectionLevel} />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link
            to={`/reader/${product.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-700 px-3 py-2 text-sm font-semibold text-white"
          >
            <BookOpen className="h-4 w-4" />
            Continue Reading
          </Link>
          <Link
            to={`/library/${product.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-800"
          >
            <PackageOpen className="h-4 w-4" />
            Resources
          </Link>
          <Link
            to={`/dashboard/reflection-notes?product=${product.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-800"
          >
            <NotebookPen className="h-4 w-4" />
            Reflection Notes
          </Link>
          <button
            type="button"
            disabled={!product.downloadAllowed}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-800 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {product.downloadAllowed ? (
              <Download className="h-4 w-4" />
            ) : (
              <FileText className="h-4 w-4" />
            )}
            Download
          </button>
        </div>
      </div>
    </article>
  );
}
