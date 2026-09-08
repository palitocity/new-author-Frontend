import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../services/api";
import Turnstile from "../components/Turnstile";
import { forgotPasswordSchema, type ForgotPasswordForm } from "./validation";

export default function ForgotPassword() {
  const [turnstileToken, setTurnstileToken] = useState("");
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordForm) => {
    if (!turnstileToken) {
      toast.error("Please complete the verification challenge.");
      return;
    }

    try {
      const response = await forgotPassword({ ...values, turnstileToken }).unwrap();
      toast.success(response.message || "Reset link sent to your email");
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Unable to send reset link.";
      toast.error(message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 dark:bg-stone-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900"
      >
        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 dark:text-stone-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Login
        </Link>
        <h1 className="text-2xl font-bold text-stone-950 dark:text-white">
          Forgot Password
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          We will email a secure reset link if the account exists.
        </p>

        <label className="mt-6 block text-sm font-semibold text-stone-700 dark:text-stone-200">
          Email
          <span className="relative mt-2 block">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
            <input
              type="email"
              {...register("email")}
              className="w-full rounded-md border border-stone-300 py-3 pl-11 pr-3 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950 dark:text-white"
              placeholder="you@example.com"
            />
          </span>
          {errors.email && (
            <span className="mt-1 block text-sm text-red-600">
              {errors.email.message}
            </span>
          )}
        </label>

        <Turnstile
          className="mt-4"
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
        />

        <button
          type="submit"
          disabled={isLoading || !turnstileToken}
          className="mt-6 w-full rounded-md bg-amber-700 px-4 py-3 font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </main>
  );
}
