import { Archive, LockKeyhole, Pencil, Plus, ShieldCheck, Trash2 } from "lucide-react";
import ProtectionBadge from "../components/access/ProtectionBadge";
import RoleBadge from "../components/access/RoleBadge";
import { adminRows, continuityProducts } from "../data/mockContinuity";

type AdminSection =
  | "products"
  | "users"
  | "purchases"
  | "subscriptions"
  | "access"
  | "content";

const titleMap: Record<AdminSection, string> = {
  products: "Products",
  users: "Users",
  purchases: "Purchases",
  subscriptions: "Subscriptions",
  access: "Assign Access",
  content: "Protected Content",
};

export default function ContinuityAdminPage({ section }: { section: AdminSection }) {
  return (
    <section>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Frontend Admin
          </p>
          <h1 className="mt-2 text-2xl font-bold text-stone-950">{titleMap[section]}</h1>
          <p className="mt-1 text-sm text-stone-500">
            Mock interface for product, access, subscription, and protected content operations.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-amber-700 px-4 py-2 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" />
          Create Product
        </button>
      </div>

      {section === "products" && (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-stone-100 text-xs uppercase tracking-widest text-stone-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Protection</th>
                <th className="px-4 py-3">Progress Avg</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {continuityProducts.map((product) => (
                <tr key={product.id} className="border-t border-stone-200">
                  <td className="px-4 py-3 font-semibold">{product.title}</td>
                  <td className="px-4 py-3">{product.productType}</td>
                  <td className="px-4 py-3"><ProtectionBadge level={product.protectionLevel} /></td>
                  <td className="px-4 py-3">{product.progress}%</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="rounded-md border border-stone-300 p-2" aria-label="Edit product"><Pencil className="h-4 w-4" /></button>
                      <button className="rounded-md border border-stone-300 p-2" aria-label="Set protection"><LockKeyhole className="h-4 w-4" /></button>
                      <button className="rounded-md border border-stone-300 p-2" aria-label="Archive product"><Archive className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section === "users" && (
        <AdminList rows={adminRows.users.map((user) => [user.name, user.email, <RoleBadge key={user.id} role={user.role} />, user.status])} />
      )}

      {section === "purchases" && (
        <AdminList rows={adminRows.purchases.map((purchase) => [purchase.product, purchase.buyer, purchase.status, purchase.amount])} />
      )}

      {section === "subscriptions" && (
        <AdminList rows={adminRows.subscriptions.map((subscription) => [subscription.user, subscription.plan, subscription.status, subscription.renews])} />
      )}

      {section === "access" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {adminRows.users.map((user) => (
            <div key={user.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-stone-500">{user.email}</p>
                </div>
                <RoleBadge role={user.role} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-md bg-stone-950 px-3 py-2 text-sm font-semibold text-white">Assign Access</button>
                <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">Revoke Access</button>
                <button className="rounded-md border border-stone-300 px-3 py-2 text-sm font-semibold">Steward Access</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === "content" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {continuityProducts.filter((product) => product.protectionLevel !== "Public").map((product) => (
            <div key={product.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{product.title}</p>
                  <p className="mt-1 text-sm text-stone-500">Set Protection Level and approval requirements.</p>
                </div>
                <ProtectionBadge level={product.protectionLevel} />
              </div>
              <div className="mt-4 flex gap-2">
                <button className="inline-flex items-center gap-2 rounded-md bg-amber-700 px-3 py-2 text-sm font-semibold text-white">
                  <ShieldCheck className="h-4 w-4" />
                  Review
                </button>
                <button className="inline-flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">
                  <Trash2 className="h-4 w-4" />
                  Archive
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AdminList({ rows }: { rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      {rows.map((row, index) => (
        <div key={index} className="grid gap-3 border-b border-stone-200 p-4 last:border-b-0 md:grid-cols-4">
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} className="text-sm font-medium text-stone-700">{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}
