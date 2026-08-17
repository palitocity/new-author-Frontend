import type { LibraryProduct } from "../../types/libary";
import LibraryCard from "./LibraryCard";

export default function LibraryGrid({
  products,
  view,
}: {
  products: LibraryProduct[];
  view: "grid" | "list";
}) {
  return (
    <div
      className={
        view === "grid"
          ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          : "space-y-4"
      }
    >
      {products.map((product) => (
        <LibraryCard
          key={product.id}
          product={product}
          view={view}
        />
      ))}
    </div>
  );
}