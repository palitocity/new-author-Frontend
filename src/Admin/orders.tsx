import { useState } from "react";
import {
  ShoppingBag,
  Search,
  Download,
  Eye,
  Package,
  TrendingUp,
  DollarSign,
} from "lucide-react";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const orders = [
    {
      id: "#ORD-1234",
      customer: "Kwame Nkrumah",
      items: 3,
      total: "$189.97",
      status: "Completed",
      date: "Dec 24, 2025",
    },
    {
      id: "#ORD-1235",
      customer: "Yaa Asantewaa",
      items: 1,
      total: "$129.99",
      status: "Processing",
      date: "Dec 25, 2025",
    },
    {
      id: "#ORD-1236",
      customer: "Nelson Mandela",
      items: 2,
      total: "$159.98",
      status: "Pending",
      date: "Dec 25, 2025",
    },
    {
      id: "#ORD-1237",
      customer: "Wangari Maathai",
      items: 4,
      total: "$279.96",
      status: "Completed",
      date: "Dec 26, 2025",
    },
    {
      id: "#ORD-1238",
      customer: "Thomas Sankara",
      items: 1,
      total: "$99.99",
      status: "Shipped",
      date: "Dec 26, 2025",
    },
  ];

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
          <p className="text-3xl font-bold text-stone-800">1,234</p>
          <p className="text-sm text-green-600 mt-1">+12% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Revenue</p>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">$45,678</p>
          <p className="text-sm text-green-600 mt-1">+15% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Pending Orders</p>
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">24</p>
          <p className="text-sm text-stone-500 mt-1">Needs attention</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Avg Order Value</p>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">$87.42</p>
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
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
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
              {orders.map((order, idx) => (
                <tr
                  key={idx}
                  className="border-t border-stone-100 hover:bg-stone-50 transition"
                >
                  <td className="py-4 px-6 font-semibold text-stone-800">
                    {order.id}
                  </td>
                  <td className="py-4 px-6 text-stone-700">{order.customer}</td>
                  <td className="py-4 px-6 text-stone-600">{order.items}</td>
                  <td className="py-4 px-6 font-semibold text-stone-800">
                    {order.total}
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
                    {order.date}
                  </td>
                  <td className="py-4 px-6">
                    <button className="p-2 hover:bg-amber-50 rounded-lg transition text-amber-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-stone-200 flex items-center justify-between">
          <p className="text-sm text-stone-600">
            Showing 1 to 5 of 1,234 orders
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
