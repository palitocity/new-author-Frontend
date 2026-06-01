import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setCredentials } from "../features/auth/authSlice";
import { useLoginMutation } from "../services/api";
import { useAppDispatch } from "../store/hooks";
import { loginSchema, type LoginForm } from "./validation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: string } | null)?.from || "/dashboard";

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      const response = await login(values).unwrap();
      dispatch(
        setCredentials({
          token: response.data.token,
          user: {
            id: response.data._id,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            role: response.data.role,
          },
        }),
      );
      toast.success(response.data.message || "Welcome back");
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ||
        "Login failed. Check your email and password.";
      toast.error(message);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10 dark:bg-stone-950">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900"
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
          Login
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Continue to your personal reading dashboard.
        </p>

        <label className="mt-6 block text-sm font-semibold text-stone-700 dark:text-stone-200">
          Email
          <span className="relative mt-2 block">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
            <input
              type="email"
              autoComplete="email"
              {...register("email")}
              className="w-full rounded-md border border-stone-300 bg-white py-3 pl-11 pr-3 text-stone-950 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950 dark:text-white"
              placeholder="you@example.com"
            />
          </span>
        </label>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}

        <label className="mt-4 block text-sm font-semibold text-stone-700 dark:text-stone-200">
          Password
          <span className="relative mt-2 block">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              {...register("password")}
              className="w-full rounded-md border border-stone-300 bg-white py-3 pl-11 pr-11 text-stone-950 outline-none focus:border-amber-600 dark:border-stone-700 dark:bg-stone-950 dark:text-white"
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
        </label>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}

        <div className="mt-4 flex items-center justify-between text-sm">
          <label className="inline-flex items-center gap-2 text-stone-500">
            <input type="checkbox" defaultChecked className="h-4 w-4" />
            Remember me
          </label>
          <Link className="font-semibold text-amber-700" to="/forgot-password">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-md bg-amber-700 px-4 py-3 font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Login"}
        </button>

        <p className="mt-5 text-center text-sm text-stone-500">
          New here?{" "}
          <Link className="font-semibold text-amber-700" to="/signup">
            Sign Up
          </Link>
        </p>
      </form>
    </main>
  );
}
