import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  bookmarkItems as seedBookmarks,
  continuityProducts,
  type BookmarkItem,
} from "../../data/mockContinuity";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(seedBookmarks);
  const [label, setLabel] = useState("");

  const addBookmark = () => {
    if (!label.trim()) return;
    const product = continuityProducts[0];
    setBookmarks((current) => [
      {
        id: `bookmark-${Date.now()}`,
        productId: product.id,
        label,
        chapter: product.chapters[0],
        location: "Current reader location",
        createdAt: new Date().toISOString(),
      },
      ...current,
    ]);
    setLabel("");
  };

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Bookmarks</h1>
        <p className="mt-1 text-sm text-stone-500">
          Save, label, edit, and delete reading locations.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 rounded-lg border border-stone-200 bg-black p-4 shadow-sm sm:flex-row">
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          className="flex-1 rounded-md border border-stone-300 px-3 py-2.5 text-sm"
          placeholder="Bookmark label"
        />
        <button
          type="button"
          onClick={addBookmark}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Save Location
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {bookmarks.map((bookmark) => (
          <article
            key={bookmark.id}
            className="rounded-lg border border-stone-200 bg-black p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{bookmark.label}</p>
                <p className="mt-1 text-sm text-stone-500">
                  {
                    continuityProducts.find(
                      (product) => product.id === bookmark.productId,
                    )?.title
                  }
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="rounded-md p-2 text-stone-600 hover:bg-stone-100"
                  aria-label="Edit bookmark"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setBookmarks((current) =>
                      current.filter((item) => item.id !== bookmark.id),
                    )
                  }
                  className="rounded-md p-2 text-red-700 hover:bg-red-50"
                  aria-label="Delete bookmark"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-stone-500">Chapter</dt>
                <dd className="font-semibold">{bookmark.chapter}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Location</dt>
                <dd className="font-semibold">{bookmark.location}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Date Created</dt>
                <dd className="font-semibold">
                  {new Date(bookmark.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
