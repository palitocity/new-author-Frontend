/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [Loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      return toast.error("Email and password are required");
    }

    try {
      setLoading(true);

      const endpoint = "/login";
      const payload = {
        email: formData.email,
        password: formData.password,
      };

      const res = await axios.post(endpoint, payload);

      toast.success(res.data.message || "Success");

      // Save token if returned
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-stone-800">Login</h2>
        <p className="text-center text-stone-500 mb-6">Welcome back</p>

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

        {/* Password */}
        <div className="mb-6">
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

        <button
          onClick={handleSubmit}
          className="w-full bg-amber-600 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition"
        >
          {Loading ? "Please wait...." : "Login"}
        </button>

        <p className="text-center text-sm text-stone-600 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-amber-600 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
