/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Download,
  Eye,
  Package,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/order/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setOrders(res.data.data);
        } else {
          toast.error(res.data.error || "Failed to fetch orders");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [token]);

  // Filter & search logic
  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      filterStatus === "all" ||
      order.status.toLowerCase() === filterStatus.toLowerCase();
    const searchMatch =
      order.userInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Orders Management
        </h1>
        <p className="text-stone-600">Track and manage all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Total Orders</p>
            <ShoppingBag className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">{orders.length}</p>
          <p className="text-sm text-green-600 mt-1">
            {/* You can calculate change dynamically */}
            +12% from last month
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Revenue</p>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">
            $
            {orders.reduce(
              (acc, order) =>
                acc +
                order.items.reduce(
                  (sum: number, item: any) =>
                    sum + item.quantity * item.priceAtPurchase,
                  0,
                ),
              0,
            )}
          </p>
          <p className="text-sm text-green-600 mt-1">+15% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Pending Orders</p>
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            {orders.filter((o) => o.status === "Pending").length}
          </p>
          <p className="text-sm text-stone-500 mt-1">Needs attention</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Avg Order Value</p>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">
            $
            {orders.length
              ? (
                  orders.reduce(
                    (acc, order) =>
                      acc +
                      order.items.reduce(
                        (sum: number, item: any) =>
                          sum + item.quantity * item.priceAtPurchase,
                        0,
                      ),
                    0,
                  ) / orders.length
                ).toFixed(2)
              : 0}
          </p>
          <p className="text-sm text-green-600 mt-1">+8% from last month</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-stone-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button className="px-4 py-2 border-2 border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Orders
          </button>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Order ID
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Customer
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Items
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Total
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-stone-500">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-stone-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <tr
                    key={idx}
                    className="border-t border-stone-100 hover:bg-stone-50 transition"
                  >
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      {order._id}
                    </td>
                    <td className="py-4 px-6 text-stone-700">
                      {order.userInfo?.name}
                    </td>
                    <td className="py-4 px-6 text-stone-600">
                      {order.items.length}
                    </td>
                    <td className="py-4 px-6 font-semibold text-stone-800">
                      $
                      {order.items.reduce(
                        (sum: number, item: any) =>
                          sum + item.quantity * item.priceAtPurchase,
                        0,
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "Processing"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-stone-600 text-sm">
                      {new Date(order.orderedAt).toDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-2 hover:bg-amber-50 rounded-lg transition text-amber-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-stone-200 flex items-center justify-between">
          <p className="text-sm text-stone-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border-2 border-stone-200 rounded-lg hover:bg-stone-50 transition">
              Previous
            </button>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 border-2 border-stone-200 rounded-lg hover:bg-stone-50 transition">
              2
            </button>
            <button className="px-4 py-2 border-2 border-stone-200 rounded-lg hover:bg-stone-50 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
