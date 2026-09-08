
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../services/api";
import { resetPasswordSchema, type ResetPasswordForm } from "./validation";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (values: ResetPasswordForm) => {
    if (!token) {
      toast.error("Reset token is missing.");
      return;
    }

    try {
      const response = await resetPassword({
        token,
        password: values.password,
      }).unwrap();

      toast.success(response.message || "Password updated");
      navigate("/login");
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Reset token is invalid or expired.";

      toast.error(message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 dark:bg-stone-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900"
      >
        <h1 className="text-2xl font-bold text-stone-950 dark:text-white">
          Reset Password
        </h1>

        <p className="mt-1 text-sm text-stone-500">
          Choose a new password for your account.
        </p>

        {/* New Password */}
        <label className="mt-6 block text-sm font-semibold text-stone-700 dark:text-stone-200">
          New Password

          <span className="relative mt-2 block">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />

            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="w-full rounded-md border border-stone-300 py-3 pl-11 pr-11 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950 dark:text-white"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
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

        {/* Confirm Password */}
        <label className="mt-4 block text-sm font-semibold text-stone-700 dark:text-stone-200">
          Confirm Password

          <span className="relative mt-2 block">
            <input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className="w-full rounded-md border border-stone-300 py-3 pl-3 pr-11 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950 dark:text-white"
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((prev) => !prev)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </span>

          {errors.confirmPassword && (
            <span className="mt-1 block text-sm text-red-600">
              {errors.confirmPassword.message}
            </span>
          )}
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-md bg-amber-700 px-4 py-3 font-semibold text-white hover:bg-amber-800 disabled:opacity-60"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </main>
  );
}

