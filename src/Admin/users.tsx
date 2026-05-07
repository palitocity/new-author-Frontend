/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Edit, Search, Trash2, Mail, UserPlus, Download } from "lucide-react";
import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";

type User = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "User";
  status: "Active" | "Inactive";
  orders: number;
  joined: string;
};

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [users, setusers] = useState<User[]>([]);
  const [stats, setstats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newThisMonth: 0,
    admins: 0,
  });

  const token = localStorage.getItem("token");

  const getAllUsers = async () => {
    try {
      const res = await axios.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setusers(res.data.data);
      setstats(res.data.stats);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      await axios.delete(`/admin/users/${userToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("User deleted successfully");
      setUserToDelete(null);
      getAllUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  // const users = [
  //   {
  //     id: 1,
  //     name: "Kwame Mensah",
  //     email: "kwame@example.com",
  //     role: "Admin",
  //     status: "Active",
  //     joined: "Jan 15, 2025",
  //     orders: 12,
  //   },
  //   {
  //     id: 2,
  //     name: "Ama Kofi",
  //     email: "ama@example.com",
  //     role: "User",
  //     status: "Active",
  //     joined: "Feb 20, 2025",
  //     orders: 5,
  //   },
  //   {
  //     id: 3,
  //     name: "Kofi Annan",
  //     email: "kofi@example.com",
  //     role: "User",
  //     status: "Active",
  //     joined: "Mar 10, 2025",
  //     orders: 8,
  //   },
  //   {
  //     id: 4,
  //     name: "Yaa Asantewaa",
  //     email: "yaa@example.com",
  //     role: "Editor",
  //     status: "Active",
  //     joined: "Apr 5, 2025",
  //     orders: 3,
  //   },
  //   {
  //     id: 5,
  //     name: "Nkrumah Adu",
  //     email: "nkrumah@example.com",
  //     role: "User",
  //     status: "Inactive",
  //     joined: "May 12, 2025",
  //     orders: 0,
  //   },
  // ];

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Users Management
        </h1>
        <p className="text-stone-600">
          Manage all registered users and their permissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-stone-600 text-sm mb-1">Total Users</p>
          <p className="text-3xl font-bold text-stone-800">
            {stats.totalUsers}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-stone-600 text-sm mb-1">Active Users</p>
          <p className="text-3xl font-bold text-green-600">
            {stats.activeUsers}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-stone-600 text-sm mb-1">New This Month</p>
          <p className="text-3xl font-bold text-amber-600">
            {stats.newThisMonth}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-stone-600 text-sm mb-1">Admins</p>
          <p className="text-3xl font-bold text-orange-600">{stats.admins}</p>
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border-2 border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  User
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Orders
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Joined
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-stone-100 hover:bg-stone-50 transition"
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-stone-800">
                        {user.name}
                      </p>
                      <p className="text-sm text-stone-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === "Admin"
                          ? "bg-orange-100 text-orange-800"
                          : user.role === "Editor"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-stone-100 text-stone-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-stone-700">{user.orders}</td>
                  <td className="py-4 px-6 text-stone-600 text-sm">
                    {user.joined}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-amber-50 rounded-lg transition text-amber-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-orange-50 rounded-lg transition text-orange-600">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-stone-200 flex items-center justify-between">
          <p className="text-sm text-stone-600">
            Showing 1 to 5 of 2,847 users
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
              3
            </button>
            <button className="px-4 py-2 border-2 border-stone-200 rounded-lg hover:bg-stone-50 transition">
              Next
            </button>
          </div>
        </div>
      </div>
      {userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-stone-800 mb-2">
                Delete User?
              </h3>

              <p className="text-stone-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{userToDelete.name}</span>? This
                action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={deleting}
                className="flex-1 px-6 py-3 border-2 border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteUser}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
