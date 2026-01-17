
import React, { useEffect, useRef, useState } from "react";

type SubscribePayload = {
  firstName: string;
  lastName: string;
  email: string;
};

type SubscribeModalProps = {
  /** Controls whether the modal is visible */
  open: boolean;
  /** Called when the user closes the modal (X button, overlay click, or ESC) */
  onClose: () => void;
  /** Authorization key for header: `Authorization: key <authKey>` */
  authKey: string;
  /** Endpoint to submit subscriptions (default: `/subscribers/all`) */
  endpoint?: string;
  /** Optional callback when subscription succeeds */
  onSuccess?: (data: any) => void;
  /** Optional base URL (e.g., https://api.example.com). If not provided, uses relative path. */
  baseUrl?: string;
  /** Optional extra headers if your backend expects more (e.g., tenant-id) */
  extraHeaders?: Record<string, string>;
  /** Optional: Pre-fill email if already known */
  defaultEmail?: string;
};

const EMAIL_REGEX =
  // basic RFC5322-ish, practical client-side check
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  open,
  onClose,
  authKey,
  endpoint = "/subscribers/all",
  onSuccess,
  baseUrl,
  extraHeaders,
  defaultEmail = "",
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
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

  // Focus the first input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      // reset state when closing
      setForm({ firstName: "", lastName: "", email: defaultEmail });
      setErrors({});
      setServerError(null);
      setSuccessMsg(null);
      setSubmitting(false);
    }
  }, [open, defaultEmail]);

  // ESC key to close
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Simple client-side validation
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

    const ok = validate(payload);
    if (!ok) return;
const token = localStorage.getItem("token");

    setSubmitting(true);
    try {
      const url = `${endpoint}`;
      const res = await fetch(url, {
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

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscribe-title"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-2 text-gray-500 hover:bg-gray-100"
          aria-label="Close subscribe modal"
        >
          ✕
        </button>

        <h2 id="subscribe-title" className="mb-1 text-xl font-semibold text-gray-900">
          Subscribe to our updates
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Get the latest news and product updates straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              First name
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={form.firstName}
              onChange={handleChange("firstName")}
              className={`w-full rounded-lg border p-2 outline-none focus:ring-2 ${
                errors.firstName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
              }`}
              placeholder="Jane"
              autoComplete="given-name"
              disabled={submitting}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Last name
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={handleChange("lastName")}
              className={`w-full rounded-lg border p-2 outline-none focus:ring-2 ${
                errors.lastName ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
              }`}
              placeholder="Doe"
              autoComplete="family-name"
              disabled={submitting}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              className={`w-full rounded-lg border p-2 outline-none focus:ring-2 ${
                errors.email ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
              }`}
              placeholder="jane.doe@example.com"
              autoComplete="email"
              inputMode="email"
              disabled={submitting}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {serverError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
              {serverError}
            </div>
          )}

          {successMsg && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-2 text-sm text-green-700">
              {successMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Subscribing..." : "Subscribe"}
          </button>

          <p className="text-center text-xs text-gray-500">
            By subscribing, you agree to our terms and privacy policy.
          </p>
        </form>
      </div>
    </div>
  );
};
