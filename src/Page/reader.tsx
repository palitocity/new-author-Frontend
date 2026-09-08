/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { LibraryProduct } from "../types/libary";
import axios from "../config/axiosconfiq";

export default function Reader() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const stateProduct = (location.state as { product?: LibraryProduct } | null)?.product;

  const [product, setProduct] = useState<LibraryProduct | null>(stateProduct ?? null);
  const [loading, setLoading] = useState(!stateProduct);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  // If we already got the product via route state, no need to fetch.
  if (stateProduct) return;

  async function fetchProduct() {
    try {
      setLoading(true);
      const res = await axios.get(`/library/${id}`, {
        withCredentials: true,
      });
      const data = res.data;
      setProduct(data.product ?? data); // adjust to your API's response shape
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          (err instanceof Error ? err.message : "Something went wrong."),
      );
    } finally {
      setLoading(false);
    }
  }

  fetchProduct();
}, [id, stateProduct]);
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-amber-700" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 text-stone-600">
        <p>{error ?? "Book not found."}</p>
        <Link to="/dashboard/library" className="text-amber-700 underline">
          Back to Library
        </Link>
      </div>
    );
  }

  if (!product.pdfFile) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 text-stone-600">
        <p>No PDF is available for this book yet.</p>
        <Link to="/dashboard/library" className="text-amber-700 underline">
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3">
        <Link
          to="/dashboard/library"
          className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-stone-950"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="min-w-0 text-center">
          <p className="truncate text-sm font-bold text-stone-950">{product.title}</p>
          <p className="text-xs text-stone-500">by {product.author}</p>
        </div>

        <div className="w-16" /> {/* spacer to balance the back button */}
      </div>

      {/* PDF VIEWER */}
      <div className="flex-1 bg-stone-100">
        <iframe
          src={`${product.pdfFile}#page=${product.currentPage || 1}`}
          title={product.title}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}