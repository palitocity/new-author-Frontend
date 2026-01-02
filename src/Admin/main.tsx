/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Users,
  ShoppingBag,
  FileText,
  Mail,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  BookOpen,
  BarChart3,
} from "lucide-react";
import axios from "../config/axiosconfiq";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("week");

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState<any>(null);

  const nav = useNavigate();

  const stats = dashboard
    ? [
        {
          title: "Total Users",
          value: dashboard.stats.users.value,
          change: dashboard.stats.users.change,
          trend: dashboard.stats.users.change.startsWith("+") ? "up" : "down",
          icon: <Users className="w-6 h-6" />,
          color: "amber",
        },
        {
          title: "Total Orders",
          value: dashboard.stats.orders.value,
          change: dashboard.stats.orders.change,
          trend: dashboard.stats.orders.change.startsWith("+") ? "up" : "down",
          icon: <ShoppingBag className="w-6 h-6" />,
          color: "orange",
        },
        {
          title: "Revenue",
          value: `₦${dashboard.stats.revenue.value.toLocaleString()}`,
          change: dashboard.stats.revenue.change,
          trend: dashboard.stats.revenue.change.startsWith("+") ? "up" : "down",
          icon: <DollarSign className="w-6 h-6" />,
          color: "amber",
        },
        {
          title: "Blog Views",
          value: dashboard.stats.blogViews.value,
          change: dashboard.stats.blogViews.change,
          trend: dashboard.stats.blogViews.change.startsWith("+")
            ? "up"
            : "down",
          icon: <Eye className="w-6 h-6" />,
          color: "orange",
        },
      ]
    : [];

  const recentOrders = dashboard?.recentOrders || [];

  const popularPosts = dashboard?.popularPosts || [];

  // Newsletter stats
  // const newsletterStats = dashboard?.newsletter;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
  };

  const token = localStorage.getItem("token");

  const getOverview = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboard(res.data.data);
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOverview();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-600">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Dashboard Overview
        </h1>
        <p className="text-stone-600">
          Welcome back! Here's what's happening with Sankofaseek today.
        </p>
      </div>

      {/* Time Range Filter */}
      <div className="mb-6 flex gap-2">
        {["today", "week", "month", "year"].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              timeRange === range
                ? "bg-linear-to-r from-amber-600 to-orange-600 text-white"
                : "bg-white text-stone-700 hover:bg-stone-100"
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-lg ${
                  stat.color === "amber" ? "bg-amber-100" : "bg-orange-100"
                }`}
              >
                <div
                  className={
                    stat.color === "amber"
                      ? "text-amber-600"
                      : "text-orange-600"
                  }
                >
                  {stat.icon}
                </div>
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <h3 className="text-stone-600 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-stone-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              Recent Orders
            </h2>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-2 text-sm font-semibold text-stone-700">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-stone-700">
                    Customer
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-stone-700">
                    Item
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-stone-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-semibold text-stone-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-stone-500">
                      No recent orders
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order: any, idx: number) => (
                    <tr key={idx} className="border-b border-stone-100">
                      <td className="py-3 px-2 font-medium">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 px-2">{order.customerName}</td>
                      <td className="py-3 px-2">
                        {order.items?.[0]?.name || "—"}
                      </td>
                      <td className="py-3 px-2 font-semibold">
                        ₦{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Newsletter Stats */}
        {/* <div className="bg-linear-to-br from-amber-600 to-orange-600 rounded-xl p-6 shadow-sm text-white">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-6 h-6" />
            <h2 className="text-lg font-bold">Newsletter</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-amber-100 text-sm mb-1">Total Subscribers</p>
              <p className="text-3xl font-bold">
                {newsletterStats?.subscribers ?? 0}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-amber-100 text-sm mb-1">Open Rate</p>
                <p className="text-xl font-bold">{newsletterStats.openRate}</p>
              </div>
              <div>
                <p className="text-amber-100 text-sm mb-1">Click Rate</p>
                <p className="text-xl font-bold">{newsletterStats.clickRate}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-white/20">
              <p className="text-amber-100 text-sm">
                Last sent: {newsletterStats.lastSent}
              </p>
            </div>
            <button className="w-full bg-white text-orange-600 py-2 rounded-lg font-medium hover:bg-stone-50 transition">
              Send Newsletter
            </button>
          </div>
        </div> */}
      </div>

      {/* Popular Blog Posts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Blog Posts */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              Popular Blog Posts
            </h2>
            <button
              onClick={() => nav("/admin/view-blogs")}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {popularPosts.length === 0 ? (
              <p className="text-sm text-stone-500">No blog data yet</p>
            ) : (
              popularPosts.map((post: any) => (
                <div
                  key={post._id}
                  className="flex items-start justify-between p-3 rounded-lg hover:bg-stone-50"
                >
                  <div>
                    <h3 className="text-sm font-semibold">{post.title}</h3>
                    <p className="text-xs text-stone-500">
                      Published{" "}
                      {new Date(post.publishDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-stone-600">
                    <Eye className="w-4 h-4" />
                    <span>{post.views || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => nav("/admin/blog")}
              className="p-4 border-2 border-stone-200 rounded-lg hover:border-amber-600 hover:bg-amber-50 transition group"
            >
              <FileText className="w-8 h-8 text-stone-600 group-hover:text-amber-600 mb-2" />
              <p className="text-sm font-medium text-stone-700 group-hover:text-amber-600">
                New Blog Post
              </p>
            </button>
            <button
              onClick={() => nav("/admin/newsletter")}
              className="p-4 border-2 border-stone-200 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition group"
            >
              <Mail className="w-8 h-8 text-stone-600 group-hover:text-orange-600 mb-2" />
              <p className="text-sm font-medium text-stone-700 group-hover:text-orange-600">
                Send Newsletter
              </p>
            </button>
            <button
              onClick={() => nav("/admin/users")}
              className="p-4 border-2 border-stone-200 rounded-lg hover:border-amber-600 hover:bg-amber-50 transition group"
            >
              <Users className="w-8 h-8 text-stone-600 group-hover:text-amber-600 mb-2" />
              <p className="text-sm font-medium text-stone-700 group-hover:text-amber-600">
                Manage Users
              </p>
            </button>
            <button
              onClick={() => nav("/admin/stories")}
              className="p-4 border-2 border-stone-200 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition group"
            >
              <BookOpen className="w-8 h-8 text-stone-600 group-hover:text-orange-600 mb-2" />
              <p className="text-sm font-medium text-stone-700 group-hover:text-orange-600">
                Add Stories
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
