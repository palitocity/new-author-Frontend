import { Grid2X2, ListFilter, Rows3 } from "lucide-react";
import type { ProductType } from "../../types/user";

export type LibrarySort = "Recent" | "Oldest" | "Progress";
export type LibraryView = "grid" | "list";
export type LibraryFilter = "All" | ProductType;

const filters: LibraryFilter[] = [
  "All",
  "Book",
  "Audio Learning",
  "Research Pack",
  "Workbook",
  "Learning Pathway",
];

export default function LibraryFilters({
  filter,
  setFilter,
  setSort,
  setView,
  sort,
  view,
}: {
  filter: LibraryFilter;
  setFilter: (filter: LibraryFilter) => void;
  sort: LibrarySort;
  setSort: (sort: LibrarySort) => void;
  view: LibraryView;
  setView: (view: LibraryView) => void;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <label className="relative">
        <ListFilter className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-stone-400" />
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as LibraryFilter)}
          className="w-full rounded-md border border-stone-300 bg-black py-2.5 pl-10 pr-8 text-sm"
        >
          {filters.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <select
        value={sort}
        onChange={(event) => setSort(event.target.value as LibrarySort)}
        className="rounded-md border border-stone-300 bg-black px-3 py-2.5 text-sm"
      >
        <option>Recent</option>
        <option>Oldest</option>
        <option>Progress</option>
      </select>

      <div className="flex rounded-md border border-stone-300 bg-black p-1">
        <button
          type="button"
          onClick={() => setView("grid")}
          className={`rounded px-3 py-2 ${view === "grid" ? "bg-stone-950 text-white" : "text-stone-600"}`}
          aria-label="Grid view"
        >
          <Grid2X2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setView("list")}
          className={`rounded px-3 py-2 ${view === "list" ? "bg-stone-950 text-white" : "text-stone-600"}`}
          aria-label="List view"
        >
          <Rows3 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
