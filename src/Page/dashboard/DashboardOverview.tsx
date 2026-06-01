import { BookOpen, Bookmark, CreditCard, Library } from "lucide-react";
import {
  useDashboardActivityQuery,
  useDashboardStatsQuery,
} from "../../services/api";

const money = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

export default function DashboardOverview() {
  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery();
  const { data: activity, isLoading: activityLoading } =
    useDashboardActivityQuery();

  const cards = [
    {
      label: "Total Books Purchased",
      value: stats?.totalBooksPurchased ?? 0,
      icon: Library,
    },
    {
      label: "Total Stories Purchased",
      value: stats?.totalStoriesPurchased ?? 0,
      icon: BookOpen,
    },
    {
      label: "Total Amount Spent",
      value: money.format(stats?.totalAmountSpent ?? 0),
      icon: CreditCard,
    },
    {
      label: "Saved Stories Count",
      value: stats?.savedStoriesCount ?? 0,
      icon: Bookmark,
    },
  ];

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-stone-500">
          Your reading, purchases, and saved stories at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-stone-500">{label}</p>
              <Icon className="h-5 w-5 text-amber-700" />
            </div>
            <p className="mt-4 text-2xl font-bold">
              {statsLoading ? "..." : value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        {[
          {
            title: "Recently Purchased Books",
            items: activity?.recentlyPurchasedBooks.map((item) => item.title),
          },
          {
            title: "Recently Read Stories",
            items: activity?.recentlyReadStories.map((item) => item.title),
          },
          {
            title: "Recent Payments",
            items: activity?.recentPayments.map(
              (item) => `${item.itemPurchased} - ${item.status}`,
            ),
          },
        ].map((group) => (
          <div
            key={group.title}
            className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900"
          >
            <h2 className="font-bold">{group.title}</h2>
            {activityLoading ? (
              <p className="mt-4 text-sm text-stone-500">Loading...</p>
            ) : group.items?.length ? (
              <ul className="mt-4 space-y-3">
                {group.items.slice(0, 5).map((item) => (
                  <li
                    key={item}
                    className="rounded-md bg-stone-50 px-3 py-2 text-sm font-medium dark:bg-stone-950"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-stone-500">No activity yet.</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
