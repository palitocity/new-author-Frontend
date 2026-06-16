/* eslint-disable react-hooks/exhaustive-deps */
import { Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "../../config/axiosconfiq";

type Product = {
  _id: string;
  title: string;
};

type ReflectionNote = {
  _id: string;
  title: string;
  body: string;
  productId?: string | { title?: string };
};

export default function ReflectionNotesPage() {
  const [notes, setNotes] = useState<ReflectionNote[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [productId, setProductId] = useState("All");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch Notes
  // =========================
  const fetchNotes = async () => {
    try {
      const params: Record<string, string> = {};

      if (query) {
        params.search = query;
      }

      if (productId !== "All") {
        params.productId = productId;
      }

      const res = await axios.get("/reflection-notes/getNotes", {
        params,
      });

      setNotes(res.data.notes || []);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  // =========================
  // Fetch Products
  // =========================
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/continuity-products");

      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // =========================
  // Create Note
  // =========================
  const createNote = async () => {
    if (!draft.trim()) return;

    try {
      const selectedProduct =
        productId === "All" ? products[0]?._id : productId;

      if (!selectedProduct) {
        alert("Please select a product");
        return;
      }

      await axios.post("/reflection-notes/createNote", {
        productId: selectedProduct,
        title: "New Reflection Note",
        body: draft,
      });

      setDraft("");
      fetchNotes();
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  // =========================
  // Delete Note
  // =========================
  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`/reflection-notes/${id}`);

      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  // =========================
  // Update Note
  // =========================
  const updateNote = async (id: string, body: string) => {
    try {
      await axios.put(`/reflection-notes/${id}`, {
        body,
      });

      setNotes((prev) =>
        prev.map((note) =>
          note._id === id
            ? {
                ...note,
                body,
              }
            : note,
        ),
      );
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await Promise.all([fetchNotes(), fetchProducts()]);

      setLoading(false);
    };

    loadData();
  }, []);

  // =========================
  // Search / Filter
  // =========================
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchNotes();
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, productId]);

  // =========================
  // Loading State
  // =========================
  if (loading) {
    return <div className="flex justify-center py-10">Loading notes...</div>;
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Reflection Notes</h1>

        <p className="mt-1 text-sm text-stone-500">
          Create, edit, search, and organize reflections by knowledge
          collection.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Create Note */}
        <div className="rounded-lg border border-stone-200 bg-black p-5 shadow-sm">
          <h2 className="font-bold">New Reflection Note</h2>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={10}
            className="mt-4 w-full rounded-md border border-stone-300 p-3 text-sm leading-6 outline-none focus:border-amber-600"
            placeholder="Write a reflection connected to your reading..."
          />

          <button
            type="button"
            onClick={createNote}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Create Note
          </button>
        </div>

        {/* Notes */}
        <div>
          {/* Search & Filter */}
          <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_220px]">
            <label className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-md border border-stone-300 py-2.5 pl-10 pr-3 text-sm"
                placeholder="Search Reflection Notes"
              />
            </label>

            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="rounded-md border border-stone-300 px-3 py-2.5 text-sm"
            >
              <option value="All">All Products</option>

              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title}
                </option>
              ))}
            </select>
          </div>

          {/* Notes List */}
          <div className="space-y-3">
            {notes.length === 0 ? (
              <div className="rounded-lg border border-stone-200 bg-white p-6 text-center text-sm text-stone-500">
                No reflection notes found.
              </div>
            ) : (
              notes.map((note) => (
                <article
                  key={note._id}
                  className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold">{note.title}</h2>

                      <p className="mt-1 text-xs text-stone-500">
                        {typeof note.productId === "object"
                          ? note.productId.title || "Unknown Product"
                          : "Unknown Product"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteNote(note._id)}
                      className="rounded-md p-2 text-red-700 hover:bg-red-50"
                      aria-label="Delete note"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <textarea
                    defaultValue={note.body}
                    onBlur={(e) => updateNote(note._id, e.target.value)}
                    rows={4}
                    className="mt-4 w-full rounded-md border border-stone-200 p-3 text-sm leading-6"
                  />
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
