import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function LibraryEmptyState() {
  return (
    <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
      <div>
        <BookOpen className="mx-auto h-12 w-12 text-amber-700" />
        <h2 className="mt-4 text-xl font-bold text-stone-950">
          Your continuity shelf is waiting
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
          Purchased products, protected access, progress, Reflection Notes, and
          bookmarks will appear here.
        </p>
        <Link
          to="/dashboard/marketplace"
          className="mt-5 inline-flex rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white"
        >
          Browse Marketplace
        </Link>
      </div>
    </div>
  );
}
