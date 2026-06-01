/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axiosconfiq";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Admin email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/admin/login", formData);
      const token = res.data?.data?.token || res.data?.token;
      const admin = res.data?.data?.admin || res.data?.data?.user || res.data?.admin;

      if (!token) {
        toast.error("Admin token was not returned by the server");
        return;
      }

      localStorage.setItem("adminToken", token);
      if (admin) localStorage.setItem("adminUser", JSON.stringify(admin));
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");

      toast.success(res.data?.message || "Admin login successful");
      navigate("/admin/main", { replace: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Admin login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-xl"
      >
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-500 hover:text-stone-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        <h1 className="text-2xl font-bold text-stone-950">Admin Login</h1>
        <p className="mt-1 text-sm text-stone-500">
          Sign in to manage stories, books, blogs, galleries, and orders.
        </p>

        <label className="mt-6 block text-sm font-semibold text-stone-700">
          Email
          <span className="relative mt-2 block">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-stone-300 py-3 pl-11 pr-3 outline-none focus:border-amber-600"
              placeholder="admin@example.com"
            />
          </span>
        </label>

        <label className="mt-4 block text-sm font-semibold text-stone-700">
          Password
          <span className="relative mt-2 block">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-md border border-stone-300 py-3 pl-11 pr-11 outline-none focus:border-amber-600"
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

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-stone-950 px-4 py-3 font-semibold text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login as Admin"}
        </button>

        <p className="mt-5 text-center text-sm text-stone-500">
          Reader account?{" "}
          <Link to="/login" className="font-semibold text-amber-700">
            User Login
          </Link>
        </p>
      </form>
    </main>
  );
}
