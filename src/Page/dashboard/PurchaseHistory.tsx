import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { usePaymentHistoryQuery, type PaymentStatus } from "../../services/api";

const statuses: Array<"All" | PaymentStatus> = [
  "All",
  "Successful",
  "Pending",
  "Failed",
];

export default function PurchaseHistory() {
  const { data = [], isLoading } = usePaymentHistoryQuery();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | PaymentStatus>("All");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    return data.filter((payment) => {
      const matchesStatus = status === "All" || payment.status === status;
      const matchesQuery =
        `${payment.transactionReference} ${payment.itemPurchased}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [data, query, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

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
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-900"
              placeholder="Search payments"
            />
          </label>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "All" | PaymentStatus);
              setPage(1);
            }}
            className="rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm dark:border-stone-700 dark:bg-stone-900"
          >
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-100 text-xs uppercase tracking-widest text-stone-500 dark:bg-stone-950">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Item Purchased</th>
                <th className="px-4 py-3">Amount Paid</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
              {isLoading ? (
                <tr>
                  <td className="px-4 py-6 text-stone-500" colSpan={6}>
                    Loading purchase history...
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-4 py-4 font-mono text-xs">
                      {payment.transactionReference}
                    </td>
                    <td className="px-4 py-4 font-semibold">
                      {payment.itemPurchased}
                    </td>
                    <td className="px-4 py-4">
                      ₦{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">{payment.paymentMethod}</td>
                    <td className="px-4 py-4">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-bold dark:bg-stone-800">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-6 text-stone-500" colSpan={6}>
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
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={page === 1}
              className="rounded-md border border-stone-300 px-3 py-1.5 font-semibold disabled:opacity-40 dark:border-stone-700"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((value) => Math.min(pages, value + 1))}
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
