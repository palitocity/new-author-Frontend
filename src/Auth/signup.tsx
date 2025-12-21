/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // 👈 added
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!formData.fullname || !formData.email || !formData.password) {
      return toast.error("All fields are required");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "https://sanfossa-backend.onrender.com/apiauth/register",
        {
          fullname: formData.fullname,
          email: formData.email,
          password: formData.password,
          role: formData.role, // 👈 sent to API
        }
      );

      toast.success(res.data.message || "Account created successfully");

      setFormData({
        fullname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });

      // Optional redirect
      // window.location.href = "/login";
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Signup failed";

      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-stone-800">
          Create Account
        </h2>
        <p className="text-center text-stone-500 mb-6">Join us today</p>

        {/* Full Name */}
        <div className="mb-4">
          <label className="text-sm text-stone-600">Full Name</label>
          <div className="relative">
            <User
              className="absolute left-3 top-3.5 text-stone-400"
              size={18}
            />
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="John Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm text-stone-600">Email</label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-3.5 text-stone-400"
              size={18}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Role */}
        <div className="mb-4">
          <label className="text-sm text-stone-600">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-lg bg-white focus:ring-2 focus:ring-amber-500 outline-none"
          >
            <option value="user">User</option>
          </select>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="text-sm text-stone-600">Password</label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-3.5 text-stone-400"
              size={18}
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-stone-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="text-sm text-stone-600">Confirm Password</label>
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-stone-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-amber-600 font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
