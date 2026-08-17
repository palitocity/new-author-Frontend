/* eslint-disable react-hooks/exhaustive-deps */
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
import { useLibraryQuery } from "../../services/api";
import type { LibraryProduct } from "../../types/libary";

export default function MyLibrary() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LibraryFilter>("All");
  const [sort, setSort] = useState<LibrarySort>("Recent");
  const [view, setView] = useState<LibraryView>("grid");

  const {
    data: libraryData,
    isLoading,
    isError,
    error,
  } = useLibraryQuery();

  // Backend:
  // {
  //   success: true,
  //   count: 2,
  //   data: {
  //     userId: "...",
  //     books: [...]
  //   }
  // }
  const libraryBooks = libraryData?.data?.books ?? [];

  const products: LibraryProduct[] = useMemo(() => {
    return libraryBooks
      .map((item): LibraryProduct | null => {
        const book = item.bookSnapshot;

        if (!book) {
          return null;
        }

        return {
          id: item.bookId,
          title: book.title,
          subtitle: book.subtitle,
          author: book.author || "Unknown Author",
          coverImage: book.coverImage,

          productType: "Book",

          purchaseDate: item.purchasedAt,

          currentPage: item.currentPage ?? 0,
          totalPages: item.totalPages ?? 0,

          progress: item.progressPercentage ?? 0,
          progressPercentage: item.progressPercentage ?? 0,

          lastReadAt: item.lastReadAt ?? null,

          pdfFile: book.pdfFile,

          orderId: item.orderId,
          transactionId: item.transactionId,
          paymentReference: item.paymentReference,
        };
      })
      .filter(
        (product): product is LibraryProduct =>
          product !== null,
      )
      .filter((product) => {
        const searchText = [
          product.title,
          product.author,
          product.productType,
          product.subtitle ?? "",
        ]
          .join(" ")
          .toLowerCase();

        const matchesQuery = searchText.includes(
          query.toLowerCase(),
        );

        // Since the API currently returns books,
        // only apply the filter if it is "All" or "Book".
        const matchesFilter =
          filter === "All" || filter === "Book";

        return matchesQuery && matchesFilter;
      })
      .sort((a, b) => {
        if (sort === "Progress") {
          return b.progress - a.progress;
        }

        const first = new Date(
          a.purchaseDate,
        ).getTime();

        const second = new Date(
          b.purchaseDate,
        ).getTime();

        if (sort === "Recent") {
          return second - first;
        }

        return first - second;
      });
  }, [libraryBooks, query, filter, sort]);

  // API ERROR
  if (isError) {
    console.error("Library error:", error);

    return (
      <section>
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h2 className="text-lg font-bold text-red-800">
            Unable to load your library
          </h2>

          <p className="mt-2 text-sm text-red-700">
            Something went wrong while loading your purchased
            books. Please refresh the page and try again.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Purchased Products
          </p>

          <h1 className="mt-2 text-2xl font-bold text-stone-950 sm:text-3xl">
            My Continuity Library
          </h1>

          <p className="mt-1 text-sm text-stone-500">
            Your purchased books, reading progress, and resources.
          </p>
        </div>

        <div className="grid gap-3 xl:min-w-[680px] xl:grid-cols-[1fr_auto]">
          <LibrarySearch
            value={query}
            onChange={setQuery}
          />

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

      {/* CONTENT */}
      {isLoading ? (
        <LibrarySkeleton />
      ) : products.length === 0 ? (
        <LibraryEmptyState />
      ) : (
        <LibraryGrid
          products={products}
          view={view}
        />
      )}
    </section>
  );
}