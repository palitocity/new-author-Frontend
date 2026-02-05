/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, type JSX, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  Eye,
  Package,
  TrendingUp,
  DollarSign,
  X,
} from "lucide-react";
import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";

const shortOrderId = (id: string) => `#${id.slice(0, 5)}`;

const PAGE_SIZE = 5;

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get("/order/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setOrders(res.data.data);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, [token]);

  // ---- Filters ----
  const filteredOrders = orders.filter((order) => {
    const statusMatch =
      filterStatus === "all" ||
      order.status.toLowerCase() === filterStatus.toLowerCase();

    const searchMatch =
      order.userInfo?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());

    return statusMatch && searchMatch;
  });

  const orderTotal = (order: any) =>
    order.items.reduce(
      (sum: number, item: any) => sum + item.priceAtPurchase,
      0,
    );

  const totalRevenue = orders.reduce(
    (acc, order) => acc + orderTotal(order),
    0,
  );

  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, page]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatus]);

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Orders Management
        </h1>
        <p className="text-stone-600">Track and manage all customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Orders"
          value={orders.length}
          icon={<ShoppingBag className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title="Revenue"
          value={`₦${totalRevenue}`}
          icon={<DollarSign className="w-5 h-5 text-green-600" />}
        />
        <StatCard
          title="Pending Orders"
          value={orders.filter((o) => o.status === "Pending").length}
          icon={<Package className="w-5 h-5 text-orange-600" />}
        />
        <StatCard
          title="Avg Order Value"
          value={`₦${
            orders.length ? (totalRevenue / orders.length).toFixed(2) : 0
          }`}
          icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-stone-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-600 outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-600 outline-none"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Items",
                  "Total",
                  "Status",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left py-4 px-6 text-sm font-semibold text-stone-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center">
                    No orders found
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order._id} className="border-t hover:bg-stone-50">
                    <td className="px-6 py-4 font-semibold" title={order._id}>
                      {shortOrderId(order._id)}
                    </td>
                    <td className="px-6 py-4">{order.userInfo.name}</td>
                    <td className="px-6 py-4">{order.items.length}</td>
                    <td className="px-6 py-4 font-semibold">
                      ₦{orderTotal(order)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(order.orderedAt).toDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-amber-50 rounded-lg text-amber-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t flex justify-between items-center">
        <p className="text-sm text-stone-600">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded ${
                page === i + 1 ? "bg-amber-600 text-white" : "border"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-800"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Order {shortOrderId(selectedOrder._id)}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <Info label="Customer" value={selectedOrder.userInfo.name} />
              <Info label="Email" value={selectedOrder.userInfo.email} />
              <Info label="Phone" value={selectedOrder.userInfo.phone} />
              <Info label="Address" value={selectedOrder.userInfo.address} />
              <Info label="Status" value={selectedOrder.status} />
              <Info label="Payment" value={selectedOrder.paymentStatus} />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Items</h3>
              {selectedOrder.items.map((item: any) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm py-1"
                >
                  <span>{item.book.title}</span>
                  <div>
                    <p className=" font-bold">Price at Purchase</p>
                    <span>₦{item.priceAtPurchase}</span>
                  </div>

                  <div className=" flex justify-between text-sm py-1">
                    <p className=" font-bold">
                      Quantity:{" "}
                      <span className=" font-normal">{item.quantity}</span>{" "}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-semibold">
              <span>Total</span>
              <span>₦{orderTotal(selectedOrder)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

/* ---------------- Components ---------------- */

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: any;
  icon: JSX.Element;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <p className="text-stone-600 text-sm">{title}</p>
      {icon}
    </div>
    <p className="text-3xl font-bold text-stone-800">{value}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: any = {
    Completed: "bg-green-100 text-green-800",
    Shipped: "bg-blue-100 text-blue-800",
    Processing: "bg-amber-100 text-amber-800",
    Pending: "bg-orange-100 text-orange-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        map[status] || "bg-stone-100 text-stone-700"
      }`}
    >
      {status}
    </span>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-stone-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
