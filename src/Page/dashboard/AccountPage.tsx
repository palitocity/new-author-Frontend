import RoleBadge from "../../components/access/RoleBadge";
import { mockCurrentAccess } from "../../data/mockContinuity";

export default function AccountPage() {
  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Account</h1>
        <p className="mt-1 text-sm text-stone-500">
          Profile, security, subscription, payment history, and access
          permissions.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[
          ["Profile", "Reader name, email, avatar, and learning preferences."],
          [
            "Security",
            "Password, active sessions, and session-expired recovery.",
          ],
          [
            "Subscription",
            "Member status, renewal date, and Steward Access review.",
          ],
          ["Payment History", "Purchased products and downloadable receipts."],
          [
            "Access Permissions",
            "Protected Knowledge permissions and restrictions.",
          ],
        ].map(([title, text]) => (
          <div
            key={title}
            className="rounded-lg border border-stone-200 bg-black p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold">{title}</h2>
              {title === "Access Permissions" && (
                <RoleBadge role={mockCurrentAccess.role} />
              )}
            </div>
            <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
