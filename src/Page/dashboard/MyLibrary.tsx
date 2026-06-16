import { useMemo, useState } from "react";
import LibraryEmptyState from "../../components/library/LibraryEmptyState";
import LibraryFilters, {
  type LibraryFilter,
  type LibrarySort,
  type LibraryView,
} from "../../components/library/LibraryFilters";
import LibraryGrid from "../../components/library/LibraryGrid";
import LibrarySearch from "../../components/library/LibrarySearch";
import LibrarySkeleton from "../../components/library/LibrarySkeleton";
import { continuityProducts } from "../../data/mockContinuity";

export default function MyLibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LibraryFilter>("All");
  const [sort, setSort] = useState<LibrarySort>("Recent");
  const [view, setView] = useState<LibraryView>("grid");
  const [loading] = useState(false);

  const products = useMemo(() => {
    return continuityProducts
      .filter((product) => {
        const matchesQuery = `${product.title} ${product.author} ${product.productType}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesFilter = filter === "All" || product.productType === filter;
        return matchesQuery && matchesFilter;
      })
      .sort((a, b) => {
        if (sort === "Progress") return b.progress - a.progress;
        const first = new Date(a.purchaseDate).getTime();
        const second = new Date(b.purchaseDate).getTime();
        return sort === "Recent" ? second - first : first - second;
      });
  }, [filter, query, sort]);

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Purchased Products
          </p>
          <h1 className="mt-2 text-2xl font-bold text-stone-950 sm:text-3xl">
            My Continuity Library
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Books, audio learning, research packs, workbooks, pathways, progress,
            Reflection Notes, and resources.
          </p>
        </div>
        <div className="grid gap-3 xl:min-w-[680px] xl:grid-cols-[1fr_auto]">
          <LibrarySearch value={query} onChange={setQuery} />
          <LibraryFilters
            filter={filter}
            setFilter={setFilter}
            sort={sort}
            setSort={setSort}
            view={view}
            setView={setView}
          />
        </div>
      </div>

      {loading ? (
        <LibrarySkeleton />
      ) : products.length === 0 ? (
        <LibraryEmptyState />
      ) : (
        <LibraryGrid products={products} view={view} />
      )}
    </section>
  );
}
