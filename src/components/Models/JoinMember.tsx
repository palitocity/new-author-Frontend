/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  CreditCard,
  Lock,
  CheckCircle2,
  Crown,
} from "lucide-react";

type MembershipPlan =
  | "Steward Access"
  | "Guardian Access"
  | "Patron Access";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  plan: MembershipPlan;
  cardNumber: string;
  expiry: string;
  cvv: string;
}

const PLANS: {
  label: MembershipPlan;
  price: string;
  desc: string;
}[] = [
  {
    label: "Steward Access",
    price: "₦5,000/yr",
    desc: "Basic member benefits",
  },
  {
    label: "Guardian Access",
    price: "₦12,000/yr",
    desc: "Priority support + downloads",
  },
  {
    label: "Patron Access",
    price: "₦25,000/yr",
    desc: "All benefits + early access",
  },
];

export default function MembershipModal({ open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (membershipData: any) => void; }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
 

  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    plan: "Steward Access",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // -----------------------------
  // Helpers
  // -----------------------------

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);

    if (digits.length >= 3) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }

    return digits;
  };

  // -----------------------------
  // Validation
  // -----------------------------

  const validateStep1 = () => {
    const validationErrors: Partial<FormData> = {};

    if (!form.fullName.trim()) {
      validationErrors.fullName = "Full name is required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      validationErrors.email = "Enter a valid email";
    }

    if (!/^\+?[0-9]{10,14}$/.test(form.phone)) {
      validationErrors.phone = "Enter a valid phone number";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  const validateStep2 = () => {
    const validationErrors: Partial<FormData> = {};

    if (
      !form.cardNumber ||
      form.cardNumber.replace(/\s/g, "").length < 16
    ) {
      validationErrors.cardNumber =
        "Enter a valid 16-digit card number";
    }

    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      validationErrors.expiry = "Enter expiry as MM/YY";
    }

    if (!/^\d{3,4}$/.test(form.cvv)) {
      validationErrors.cvv = "Enter a valid CVV";
    }

    setErrors(validationErrors);

    return Object.keys(validationErrors).length === 0;
  };

  // -----------------------------
  // Navigation
  // -----------------------------

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      return;
    }

    if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const closeModal = () => {
    onClose();
    setStep(1);
    setErrors({});
  };

const handleSubmit = () => {
  onSuccess({
    isMember: true,
    plan: form.plan,
    joinedAt: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    expiresAt: new Date(
      Date.now() + 365 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  });

  onClose();
};

return(
 <>
      {open && (
        
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-lg max-h-[90vh] rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-black px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Crown size={18} className="text-amber-400" />
                <span className="font-bold text-lg">Become a Member</span>
              </div>
              <button onClick={closeModal} className="text-stone-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center px-6 pt-5 gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step > s
                        ? "bg-green-500 text-white"
                        : step === s
                        ? "bg-black text-white"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    {step > s ? <CheckCircle2 size={14} /> : s}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${step === s ? "text-stone-800" : "text-stone-400"}`}>
                    {s === 1 ? "Your Info" : s === 2 ? "Payment" : "Confirm"}
                  </span>
                  {s < 3 && <div className={`flex-1 h-px ${step > s ? "bg-green-400" : "bg-stone-200"}`} />}
                </div>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
              {/* ── STEP 1: Personal Info ── */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-stone-500 mb-2">Fill in your details to get started.</p>

                  {/* Full Name */}
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">Full Name</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        value={form.fullName}
                        onChange={(e) => update("fullName", e.target.value)}
                        placeholder="John Doe"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                          errors.fullName ? "border-red-400 bg-red-50" : "border-stone-200 focus:border-black"
                        }`}
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">Email Address</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="john@example.com"
                        type="email"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                          errors.email ? "border-red-400 bg-red-50" : "border-stone-200 focus:border-black"
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">Phone Number</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+2348012345678"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                          errors.phone ? "border-red-400 bg-red-50" : "border-stone-200 focus:border-black"
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Plan */}
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-2 block">Choose a Plan</label>
                    <div className="space-y-2">
                      {PLANS.map((p) => (
                        <label
                          key={p.label}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                            form.plan === p.label
                              ? "border-black bg-stone-50"
                              : "border-stone-200 hover:border-stone-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="plan"
                              value={p.label}
                              checked={form.plan === p.label}
                              onChange={() => update("plan", p.label)}
                              className="accent-black"
                            />
                            <div>
                              <p className="text-sm font-semibold text-stone-800">{p.label}</p>
                              <p className="text-xs text-stone-400">{p.desc}</p>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-amber-600">{p.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Payment ── */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-stone-500 mb-2">Enter your payment details securely.</p>

                  {/* Card Number */}
                  <div>
                    <label className="text-xs font-semibold text-stone-600 mb-1 block">Card Number</label>
                    <div className="relative">
                      <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        value={form.cardNumber}
                        onChange={(e) => update("cardNumber", formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition tracking-widest ${
                          errors.cardNumber ? "border-red-400 bg-red-50" : "border-stone-200 focus:border-black"
                        }`}
                      />
                    </div>
                    {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-stone-600 mb-1 block">Expiry</label>
                      <input
                        value={form.expiry}
                        onChange={(e) => update("expiry", formatExpiry(e.target.value))}
                        placeholder="MM/YY"
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                          errors.expiry ? "border-red-400 bg-red-50" : "border-stone-200 focus:border-black"
                        }`}
                      />
                      {errors.expiry && <p className="text-xs text-red-500 mt-1">{errors.expiry}</p>}
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-600 mb-1 block">CVV</label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          value={form.cvv}
                          onChange={(e) => update("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="123"
                          type="password"
                          className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition ${
                            errors.cvv ? "border-red-400 bg-red-50" : "border-stone-200 focus:border-black"
                          }`}
                        />
                      </div>
                      {errors.cvv && <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  <p className="flex items-center gap-1.5 text-xs text-stone-400 mt-2">
                    <Lock size={11} /> Your payment information is encrypted and secure.
                  </p>
                </div>
              )}

              {/* ── STEP 3: Confirm ── */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-stone-500 mb-2">Review your details before confirming.</p>

                  <div className="rounded-2xl border border-stone-100 bg-stone-50 divide-y divide-stone-100 overflow-hidden">
                    {[
                      { label: "Full Name", value: form.fullName },
                      { label: "Email", value: form.email },
                      { label: "Phone", value: form.phone },
                      { label: "Plan", value: form.plan },
                      { label: "Card", value: `•••• •••• •••• ${form.cardNumber.replace(/\s/g, "").slice(-4)}` },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between px-4 py-3">
                        <span className="text-xs text-stone-400 font-medium">{label}</span>
                        <span className="text-sm font-semibold text-stone-700">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-700">Amount Due</span>
                    <span className="text-base font-bold text-amber-700">
                      {PLANS.find((p) => p.label === form.plan)?.price}
                    </span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-100">
                {step > 1 ? (
                  <button
                    onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                    className="text-sm text-stone-500 hover:text-stone-800 transition font-medium"
                  >
                    ← Back
                  </button>
                ) : (
                  <span />
                )}

                {step < 3 ? (
                  <button
                    onClick={handleNext}
                    className="rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 transition"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="rounded-xl bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <CheckCircle2 size={15} /> Confirm & Join
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
     
      
      )}
   </>
    )
  }
