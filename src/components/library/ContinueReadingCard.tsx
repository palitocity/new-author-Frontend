import { ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import type { ContinuityProduct } from "../../data/mockContinuity";

export default function ContinueReadingCard({
  product,
}: {
  product: ContinuityProduct;
}) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <img
          src={product.coverImage}
          alt={product.title}
          className="h-20 w-16 rounded-md object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-stone-950">{product.title}</p>
          <p className="mt-1 text-xs text-stone-500">
            Chapter {product.currentChapter} · {product.progress}% complete
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full rounded-full bg-amber-600" style={{ width: `${product.progress}%` }} />
          </div>
        </div>
      </div>
      <Link
        to={`/reader/${product.id}`}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-stone-950 px-3 py-2 text-sm font-semibold text-white"
      >
        <BookOpen className="h-4 w-4" />
        Continue Reading
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}
