import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../services/api";
import Turnstile from "../components/Turnstile";
import { signupSchema, type SignupForm } from "./validation";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [registerUser, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (formValues: SignupForm) => {
    if (!turnstileToken) {
      toast.error("Please complete the verification challenge.");
      return;
    }

    const values = {
      email: formValues.email,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      password: formValues.password,
      turnstileToken,
    };

    try {
      const response = await registerUser(values).unwrap();
      toast.success(response.message || "Account created successfully");
navigate("/verify-email", { state: { email: formValues.email } });
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Signup failed. This email may already be registered.";
      toast.error(message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10 dark:bg-stone-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl rounded-lg border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900"
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </button>

        <h1 className="text-2xl font-bold text-stone-950 dark:text-white">
          Sign Up
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Create your reader account and keep every purchase in one place.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200">
            First Name
            <span className="relative mt-2 block">
              <User className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
              <input
                {...register("firstName")}
                className="w-full rounded-md border border-stone-300 py-3 pl-11 pr-3 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950 dark:text-white"
                placeholder="John"
              />
            </span>
            {errors.firstName && (
              <span className="mt-1 block text-sm text-red-600">
                {errors.firstName.message}
              </span>
            )}
          </label>

          <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200">
            Last Name
            <span className="relative mt-2 block">
              <User className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
              <input
                {...register("lastName")}
                className="w-full rounded-md border border-stone-300 py-3 pl-11 pr-3 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950 dark:text-white"
                placeholder="Doe"
              />
            </span>
            {errors.lastName && (
              <span className="mt-1 block text-sm text-red-600">
                {errors.lastName.message}
              </span>
            )}
          </label>
        </div>

        <label className="mt-4 block text-sm font-semibold text-stone-700 dark:text-stone-200">
          Email
          <span className="relative mt-2 block">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
            <input
              type="email"
              autoComplete="email"
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

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200">
            Password
            <span className="relative mt-2 block">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("password")}
                className="w-full rounded-md border border-stone-300 py-3 pl-11 pr-11 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950 dark:text-white"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-3 text-stone-400"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </span>
            {errors.password && (
              <span className="mt-1 block text-sm text-red-600">
                {errors.password.message}
              </span>
            )}
          </label>

          <label className="block text-sm font-semibold text-stone-700 dark:text-stone-200">
            Confirm Password
            <span className="relative mt-2 block">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="w-full rounded-md border border-stone-300 py-3 pl-11 pr-3 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950 dark:text-white"
                placeholder="Confirm"
              />
            </span>
            {errors.confirmPassword && (
              <span className="mt-1 block text-sm text-red-600">
                {errors.confirmPassword.message}
              </span>
            )}
          </label>
        </div>

        <Turnstile
          className="mt-4"
          onVerify={setTurnstileToken}
          onExpire={() => setTurnstileToken("")}
        />

        <button
          type="submit"
          disabled={isLoading || !turnstileToken}
          className="mt-6 w-full rounded-md bg-amber-700 px-4 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </button>

        <p className="mt-5 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link className="font-semibold text-amber-700" to="/login">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
