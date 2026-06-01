import { BookOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLibraryQuery, type ContentType } from "../../services/api";

type Filter = "All" | ContentType;
type Sort = "Recent" | "Oldest";

export default function MyLibrary() {
  const { data = [], isError, isLoading } = useLibraryQuery();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<Sort>("Recent");

  const items = useMemo(() => {
    return data
      .filter((item) => {
        const matchesFilter = filter === "All" || item.contentType === filter;
        const matchesQuery = `${item.title} ${item.author}`
          .toLowerCase()
          .includes(query.toLowerCase());
        return matchesFilter && matchesQuery;
      })
      .sort((a, b) => {
        const first = new Date(a.purchaseDate).getTime();
        const second = new Date(b.purchaseDate).getTime();
        return sort === "Recent" ? second - first : first - second;
      });
  }, [data, filter, query, sort]);

  if (isLoading) {
    return <p className="text-sm text-stone-500">Loading your library...</p>;
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">My Library</h1>
          <p className="mt-1 text-sm text-stone-500">
            Every purchased book and story you permanently own.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-900"
              placeholder="Search library"
            />
          </label>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as Filter)}
            className="rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm dark:border-stone-700 dark:bg-stone-900"
          >
            <option>All</option>
            <option>Book</option>
            <option>Story</option>
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm dark:border-stone-700 dark:bg-stone-900"
          >
            <option>Recent</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          Unable to load your library.
        </div>
      )}

      {!isError && items.length === 0 && (
        <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center dark:border-stone-700 dark:bg-stone-900">
          <div>
            <BookOpen className="mx-auto h-12 w-12 text-amber-700" />
            <h2 className="mt-4 text-xl font-bold">Your shelf is waiting</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-stone-500">
              Browse stories and books, complete a purchase, and your access
              will appear here automatically.
            </p>
            <Link
              to="/dashboard/marketplace"
              className="mt-5 inline-flex rounded-md bg-stone-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-stone-950"
            >
              Browse Stories
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="aspect-4/3 bg-stone-200 dark:bg-stone-800">
              {item.coverImage ? (
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center">
                  <BookOpen className="h-10 w-10 text-stone-400" />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">
                  {item.contentType}
                </span>
                <span className="text-xs text-stone-500">
                  {new Date(item.purchaseDate).toLocaleDateString()}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-bold">{item.title}</h2>
              <p className="mt-1 text-sm text-stone-500">by {item.author}</p>
              <Link
                to={`/library/${item.contentId}`}
                className="mt-4 inline-flex w-full justify-center rounded-md bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-800"
              >
                Continue Reading
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
