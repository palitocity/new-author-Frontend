
import React, { useEffect, useRef, useState } from "react";

type SubscribePayload = {
  firstName: string;
  lastName: string;
  email: string;
};

type SubscribeModalProps = {
  open: boolean;
  onClose: () => void;
  endpoint?: string;
  onSuccess?: (data: any) => void;
  extraHeaders?: Record<string, string>;
  defaultEmail?: string;
  /** Optional brand color (Tailwind color classes suffix), e.g. 'indigo', 'violet', 'emerald' */
  brandColor?: "indigo" | "violet" | "blue" | "emerald" | "rose" | "amber";
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  open,
  onClose,
  endpoint = "https://sanfossa-backend.onrender.com/api/subscribers/subscribe",
  onSuccess,
  extraHeaders,
  defaultEmail = "",
  brandColor = "indigo",
}) => {
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<SubscribePayload>({
    firstName: "",
    lastName: "",
    email: defaultEmail,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SubscribePayload, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Focus first input when opened, reset when closed
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 80);
    } else {
      setForm({ firstName: "", lastName: "", email: defaultEmail });
      setErrors({});
      setServerError(null);
      setSuccessMsg(null);
      setSubmitting(false);
    }
  }, [open, defaultEmail]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const validate = (payload: SubscribePayload) => {
    const newErrors: Partial<Record<keyof SubscribePayload, string>> = {};
    if (!payload.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!payload.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!payload.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(payload.email)) {
      newErrors.email = "Enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange =
    (field: keyof SubscribePayload) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMsg(null);

    const payload: SubscribePayload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
    };

    if (!validate(payload)) return;

    const token = localStorage.getItem("token");
    setSubmitting(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(extraHeaders ?? {}),
        },
        body: JSON.stringify(payload),
      });

      const isJson = res.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await res.json() : await res.text();

      if (!res.ok) {
        const message =
          (isJson && (data?.message || data?.error)) ||
          (typeof data === "string" ? data : "Subscription failed");
        throw new Error(message);
      }

      setSuccessMsg("You're subscribed! 🎉");
      onSuccess?.(data);
    } catch (err: any) {
      setServerError(err?.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  // Small helpers for dynamic brand color
  const brandBg = {
    indigo: "from-indigo-500/90 to-violet-500/90",
    violet: "from-violet-500/90 to-fuchsia-500/90",
    blue: "from-sky-500/90 to-blue-600/90",
    emerald: "from-emerald-500/90 to-teal-500/90",
    rose: "from-rose-500/90 to-pink-500/90",
    amber: "from-amber-500/90 to-orange-500/90",
  }[brandColor];

  const brandRing = {
    indigo: "focus:ring-indigo-200",
    violet: "focus:ring-violet-200",
    blue: "focus:ring-sky-200",
    emerald: "focus:ring-emerald-200",
    rose: "focus:ring-rose-200",
    amber: "focus:ring-amber-200",
  }[brandColor];

  const brandBtn = {
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    violet: "bg-violet-600 hover:bg-violet-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
    rose: "bg-rose-600 hover:bg-rose-700",
    amber: "bg-amber-600 hover:bg-amber-700",
  }[brandColor];

  const brandBadge = {
    indigo: "bg-indigo-600/20 text-indigo-100 ring-indigo-400/30",
    violet: "bg-violet-600/20 text-violet-100 ring-violet-400/30",
    blue: "bg-blue-600/20 text-blue-100 ring-blue-400/30",
    emerald: "bg-emerald-600/20 text-emerald-100 ring-emerald-400/30",
    rose: "bg-rose-600/20 text-rose-100 ring-rose-400/30",
    amber: "bg-amber-600/20 text-amber-100 ring-amber-400/30",
  }[brandColor];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscribe-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-8"
    >
      {/* Gradient Glass Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-white/70 shadow-2xl backdrop-blur-xl transition-all duration-200 dark:bg-neutral-900/70"
      >
        {/* Decorative header */}
        <div className={`relative h-32 w-full bg-gradient-to-tr ${brandBg}`}>
          {/* Abstract glow circles */}
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -right-10 -bottom-14 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

          {/* Badge */}
          <div className="absolute left-6 top-6 flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ${brandBadge} shadow-md`}
              aria-hidden="true"
            >
              {/* Envelope emoji as icon placeholder; replace with <svg> if you prefer */}
              <span className="text-2xl">✉️</span>
            </div>
            <div className="text-white">
              <h2 id="subscribe-title" className="text-lg font-semibold leading-tight">
                Subscribe to updates
              </h2>
              <p className="text-xs/5 opacity-90">
                Product news • Tips • Occasional offers
              </p>
            </div>
          </div>
        </div>

        {/* Form section */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          {/* Helper alert / success */}
          {(serverError || successMsg) && (
            <div
              className={`mb-4 rounded-xl border p-3 text-sm ${
                serverError
                  ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
              }`}
            >
              {serverError || successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* First name */}
            <div className="relative">
              <label
                htmlFor="first-name"
                className="pointer-events-none absolute left-11 top-1.5 z-10 select-none text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs dark:text-gray-400"
              >
                First name
              </label>
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg">👤</div>
              <input
                id="first-name"
                ref={firstInputRef}
                type="text"
                value={form.firstName}
                onChange={handleChange("firstName")}
                placeholder=" "
                autoComplete="given-name"
                disabled={submitting}
                className={`peer w-full rounded-2xl border bg-white/70 px-10 py-3 text-sm text-gray-900 outline-none transition-all placeholder-transparent focus:bg-white focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-100 ${errors.firstName ? "border-red-400 focus:ring-red-200" : `border-gray-200 ${brandRing}`}`}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.firstName}</p>
              )}
            </div>

            {/* Last name */}
            <div className="relative">
              <label
                htmlFor="last-name"
                className="pointer-events-none absolute left-11 top-1.5 z-10 select-none text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs dark:text-gray-400"
              >
                Last name
              </label>
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg">🧾</div>
              <input
                id="last-name"
                type="text"
                value={form.lastName}
                onChange={handleChange("lastName")}
                placeholder=" "
                autoComplete="family-name"
                disabled={submitting}
                className={`peer w-full rounded-2xl border bg-white/70 px-10 py-3 text-sm text-gray-900 outline-none transition-all placeholder-transparent focus:bg-white focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-100 ${errors.lastName ? "border-red-400 focus:ring-red-200" : `border-gray-200 ${brandRing}`}`}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="relative mt-4">
            <label
              htmlFor="email"
              className="pointer-events-none absolute left-11 top-1.5 z-10 select-none text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:top-1.5 peer-focus:text-xs dark:text-gray-400"
            >
              Email address
            </label>
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg">📧</div>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder=" "
              autoComplete="email"
              inputMode="email"
              disabled={submitting}
              className={`peer w-full rounded-2xl border bg-white/70 px-10 py-3 text-sm text-gray-900 outline-none transition-all placeholder-transparent focus:bg-white focus:ring-2 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-100 ${errors.email ? "border-red-400 focus:ring-red-200" : `border-gray-200 ${brandRing}`}`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Terms note */}
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            By subscribing, you agree to our{" "}
            <a href="#" className="underline underline-offset-2 hover:opacity-80">
              terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-2 hover:opacity-80">
              privacy policy
            </a>
            .
          </p>

          {/* CTA Row */}
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-200"
            >
              <span>Cancel</span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all ${brandBtn} disabled:cursor-not-allowed disabled:opacity-70`}
            >
              {submitting ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"
                    />
                  </svg>
                  Subscribing…
                </>
              ) : (
                <>
                  <span>Subscribe</span> <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Close button (top-right, floating) */}
        <button
          onClick={onClose}
          aria-label="Close subscribe modal"
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-gray-600 shadow-sm backdrop-blur hover:bg-white dark:bg-neutral-800/80 dark:text-neutral-300"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
``
