/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { usePaymentHistoryQuery } from "../../services/api";

type StatusFilter = "All" | "Paid" | "Pending" | "Failed";
const statuses: StatusFilter[] = ["All", "Paid", "Pending", "Failed"];

export default function PurchaseHistory() {
  const { data, isLoading } = usePaymentHistoryQuery();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Fix: unwrap the nested data array
  const orders = (data as any)?.data ?? data ?? [];

  const filtered = useMemo(() => {
    return orders.filter((order: any) => {
      const matchesStatus = status === "All" || order.paymentStatus === status;

      // Search across book titles in the order's items
      const bookTitles = order.items
        .map((i: any) => i.book?.title ?? "")
        .join(" ");
      const matchesQuery = `${order.paymentReference ?? ""} ${bookTitles}`
        .toLowerCase()
        .includes(query.toLowerCase());

      return matchesStatus && matchesQuery;
    });
  }, [orders, query, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const statusColors: Record<string, string> = {
    Paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    Pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    Failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Purchase History</h1>
          <p className="mt-1 text-sm text-stone-500">
            A searchable record of every payment on your account.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-900"
              placeholder="Search by title or reference"
            />
          </label>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as StatusFilter);
              setPage(1);
            }}
            className="rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm dark:border-stone-700 dark:bg-stone-900"
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-100 text-xs uppercase tracking-widest text-stone-500 dark:bg-stone-950">
              <tr>
                <th className="px-4 py-3">Order Reference</th>
                <th className="px-4 py-3">Items Purchased</th>
                <th className="px-4 py-3">Amount Paid</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {isLoading ? (
                <tr>
                  <td className="px-4 py-6 text-stone-500" colSpan={5}>
                    Loading purchase history...
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((order: any) => {
                  const bookNames = order.items
                    .map((i: any) => i.book?.title ?? "Deleted item")
                    .join(", ");

                  return (
                    <tr key={order._id}>
                      <td className="px-4 py-4 font-mono text-xs text-stone-500">
                        {order.paymentReference ?? order._id}
                      </td>
                      <td className="px-4 py-4 font-semibold">{bookNames}</td>
                      <td className="px-4 py-4">₦{order.totalAmount}</td>
                      <td className="px-4 py-4">
                        {new Date(
                          order.paidAt ?? order.createdAt,
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-bold ${statusColors[order.paymentStatus] ?? "bg-stone-100 dark:bg-stone-800"}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="px-4 py-6 text-stone-500" colSpan={5}>
                    No payments match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-stone-200 px-4 py-3 text-sm dark:border-stone-800">
          <span className="text-stone-500">
            Page {page} of {pages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((v) => Math.max(1, v - 1))}
              disabled={page === 1}
              className="rounded-md border border-stone-300 px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-stone-700"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((v) => Math.min(pages, v + 1))}
              disabled={page === pages}
              className="rounded-md border border-stone-300 px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-stone-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
