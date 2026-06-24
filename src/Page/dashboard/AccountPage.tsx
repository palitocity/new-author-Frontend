import { useState } from "react";
import { Crown, ShieldCheck, Star, Calendar } from "lucide-react";

export default function AccountPage() {
  const [membership, setMembership] = useState({
    isMember: false,
    plan: "Steward Access",
    joinedAt: "15 Jul 2026",
    expiresAt: "15 Jul 2027",
  });

  const benefits = [
    "Exclusive member-only articles",
    "Protected Knowledge access",
    "Priority support",
    "Early access to new content",
    "Downloadable resources",
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Membership
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage your membership status and unlock exclusive resources.
        </p>
      </div>

      {/* Demo Toggle */}
      <div className="flex justify-end">
        <button
          onClick={() =>
            setMembership((prev) => ({
              ...prev,
              isMember: !prev.isMember,
            }))
          }
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium hover:bg-stone-100"
        >
          Toggle Member Status
        </button>
      </div>

      {/* Status + Membership Card */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Card */}
        <div className="rounded-3xl border border-stone-200 bg-white/5 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">
                Membership Status
              </p>

              <h2 className="mt-2 text-2xl text-gray-400 font-bold">
                {membership.isMember
                  ? "Active Member"
                  : "Registered User"}
              </h2>
            </div>

            <div
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                membership.isMember
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {membership.isMember ? "ACTIVE" : "FREE"}
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-stone-600">
            {membership.isMember
              ? "You currently have access to all member-only content, premium resources, and protected knowledge."
              : "Upgrade your account to unlock premium content, exclusive resources, and community benefits."}
          </p>

          {!membership.isMember && (
            <button className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800">
              Become a Member
            </button>
          )}
        </div>

        {/* Membership Card */}
        <div className="relative overflow-hidden rounded-3xl bg-black p-6 text-white shadow-sm">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <Crown size={18} />
              <span className="text-sm text-stone-300">
                Membership Card
              </span>
            </div>

            <h2 className="mt-6 text-3xl font-bold">
              {membership.plan}
            </h2>

            <p className="mt-1 text-stone-400">
              Protected Knowledge Membership
            </p>

            <div className="mt-10 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  Member Since
                </p>

                <p className="mt-1 font-medium">
                  {membership.joinedAt}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-stone-500">
                  Renewal
                </p>

                <p className="mt-1 font-medium">
                  {membership.expiresAt}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Star size={18} color="gold" />
          <h2 className="text-lg text-stone-700 font-bold">
            Membership Benefits
          </h2>
        </div>

        <div className="mt-6 grid gap-4 text-gray-600 md:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit}
              className="flex items-center gap-3 rounded-xl border border-stone-100 p-4"
            >
              <ShieldCheck
                size={18}
                className="text-green-600"
              />

              <span className="text-sm font-medium">
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Membership Details */}
      <div className="rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar size={18}  color="green"/>
          <h2 className="text-lg font-bold text-stone-700">
            Membership Information
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-sm text-stone-500">
              Membership Type
            </p>
            <p className="mt-1 font-semibold text-stone-500">
              {membership.plan}
            </p>
          </div>

          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-sm text-stone-500">
              Joined Date
            </p>
            <p className="mt-1 font-semibold text-stone-500">
              {membership.joinedAt}
            </p>
          </div>

          <div className="rounded-xl bg-stone-50 p-4">
            <p className="text-sm text-stone-500">
              Status
            </p>
            <p className="mt-1 font-semibold text-stone-500">
              {membership.isMember
                ? "Active Member"
                : "Regular User"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}