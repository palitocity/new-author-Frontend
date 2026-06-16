import {
  BookmarkPlus,
  BookOpen,
  Layers,
  NotebookPen,
  PackageOpen,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PermissionBanner from "../components/access/PermissionBanner";
import ProtectionBadge from "../components/access/ProtectionBadge";
import ProgressRing from "../components/library/ProgressRing";
import {
  bookmarkItems,
  continuityProducts,
  reflectionNotes,
} from "../data/mockContinuity";

const tabs = ["Overview", "Materials", "Notes", "Bookmarks", "Progress"] as const;

export default function ProductDetailsPage() {
  const { productId } = useParams();
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Overview");
  const product = continuityProducts.find((item) => item.id === productId);

  const productNotes = useMemo(
    () => reflectionNotes.filter((note) => note.productId === product?.id),
    [product?.id],
  );
  const productBookmarks = useMemo(
    () => bookmarkItems.filter((bookmark) => bookmark.productId === product?.id),
    [product?.id],
  );

  if (!product) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-100 px-4">
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link to="/dashboard/library" className="mt-4 inline-flex text-amber-700">
            Back to My Continuity Library
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
            <img src={product.coverImage} alt={product.title} className="h-96 w-full object-cover" />
          </div>
          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <ProtectionBadge level={product.protectionLevel} />
              <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs font-bold text-stone-700">
                {product.productType}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-stone-950 md:text-5xl">
              {product.title}
            </h1>
            <p className="mt-2 text-lg text-stone-600">{product.subtitle}</p>
            <p className="mt-5 max-w-4xl leading-8 text-stone-700">
              {product.description}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Access Level", product.accessLevel],
                ["Protection Level", product.protectionLevel],
                ["Reflection Notes", product.notesCount],
                ["Bookmarks", product.bookmarkCount],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border border-stone-200 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
                    {label}
                  </p>
                  <p className="mt-2 font-bold text-stone-950">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <PermissionBanner protectionLevel={product.protectionLevel} />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/reader/${product.id}`} className="inline-flex items-center gap-2 rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white">
                <BookOpen className="h-4 w-4" />
                Continue Reading
              </Link>
              <button className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800">
                <PackageOpen className="h-4 w-4" />
                Open Resources
              </button>
              <Link to={`/dashboard/reflection-notes?product=${product.id}`} className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800">
                <NotebookPen className="h-4 w-4" />
                View Reflection Notes
              </Link>
              <button className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-800">
                <BookmarkPlus className="h-4 w-4" />
                Add Bookmark
              </button>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
          <div className="flex gap-2 overflow-x-auto border-b border-stone-200 pb-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-md px-4 py-2 text-sm font-semibold ${
                  activeTab === tab ? "bg-stone-950 text-white" : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="p-2 pt-5">
            {activeTab === "Overview" && <p className="leading-7 text-stone-700">{product.description}</p>}
            {activeTab === "Materials" && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {product.resources.map((resource) => (
                  <div key={resource} className="rounded-lg border border-stone-200 p-4">
                    <Layers className="h-5 w-5 text-amber-700" />
                    <p className="mt-3 font-semibold">{resource}</p>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "Notes" && productNotes.map((note) => (
              <div key={note.id} className="mb-3 rounded-lg border border-stone-200 p-4">
                <p className="font-bold">{note.title}</p>
                <p className="mt-1 text-sm text-stone-600">{note.excerpt}</p>
              </div>
            ))}
            {activeTab === "Bookmarks" && productBookmarks.map((bookmark) => (
              <div key={bookmark.id} className="mb-3 rounded-lg border border-stone-200 p-4">
                <p className="font-bold">{bookmark.label}</p>
                <p className="mt-1 text-sm text-stone-600">{bookmark.chapter} · {bookmark.location}</p>
              </div>
            ))}
            {activeTab === "Progress" && (
              <div className="flex items-center gap-4">
                <ProgressRing value={product.progress} />
                <div>
                  <p className="font-bold">{product.progress}% complete</p>
                  <p className="text-sm text-stone-500">Last opened {product.lastOpened}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
