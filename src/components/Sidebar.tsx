import React, { useState } from "react";
import {
  Users,
  Settings,
  LayoutDashboard,
  X,
  BookOpen,
  LogOut,
  Mail,
  ShoppingBag,
  FileText,
  ImageUp,
  List,
  PackageOpen,
  ShieldCheck,
  LockKeyhole,
  BadgeCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

const Sidebar: React.FC<Props> = ({ setSidebarOpen, sidebarOpen }) => {
  const router = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/admin/main",
    },
    {
      name: "Users",
      icon: <Users className="w-5 h-5" />,
      path: "/admin/users",
    },
    {
      name: "Products",
      icon: <PackageOpen className="w-5 h-5" />,
      path: "/admin/products",
    },
    {
      name: "Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      path: "/admin/orders",
    },
    {
      name: "Purchases",
      icon: <BadgeCheck className="w-5 h-5" />,
      path: "/admin/purchases",
    },
    {
      name: "Subscriptions",
      icon: <ShieldCheck className="w-5 h-5" />,
      path: "/admin/subscriptions",
    },
    {
      name: "Access",
      icon: <LockKeyhole className="w-5 h-5" />,
      path: "/admin/access",
    },
    {
      name: "Protected Content",
      icon: <ShieldCheck className="w-5 h-5" />,
      path: "/admin/content",
    },
    {
      name: "Watchlist",
      icon: <List className="w-5 h-5" />,
      path: "/admin/watchlist",
    },
    {
      name: "Blog",
      icon: <FileText className="w-5 h-5" />,
      path: "/admin/blog",
    },
    {
      name: "Newsletter",
      icon: <Mail className="w-5 h-5" />,
      path: "/admin/newsletter",
    },
    {
      name: "Stories",
      icon: <BookOpen className="w-5 h-5" />,
      path: "/admin/stories",
    },
    {
      name: "Media",
      icon: <ImageUp className="w-5 h-5" />,
      path: "/admin/media",
    },
    {
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/admin/settings",
    },
    {
      name: "View Blogs",
      icon: <BookOpen className="w-5 h-5" />,
      path: "/admin/view-blogs",
    },
    {
      name: "View Stories",
      icon: <FileText className="w-5 h-5" />,
      path: "/admin/view-stories",
    },
    {
      name: "Upload Gallery",
      icon: <ImageUp className="w-5 h-5" />,
      path: "/admin/upload",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router("/admin/login");
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 z-50 flex h-screen w-64 flex-col overflow-hidden bg-linear-to-b from-amber-900 to-orange-900 text-stone-50 shadow-lg transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="shrink-0 border-b border-stone-200/20 px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Admin Panel</h2>

            <button
              onClick={() => setSidebarOpen(false)}
              className="text-stone-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-2">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.path}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-orange-700"
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* Fixed Logout */}
        <div className="shrink-0 border-t border-stone-200/20 px-4 py-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 text-sm font-medium text-stone-50 transition hover:text-orange-300"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden h-screen w-64 flex-col overflow-hidden bg-linear-to-b from-amber-900 to-orange-900 text-stone-50 md:flex">
        {/* Optional Header */}
        <div className="shrink-0 border-b border-stone-200/20 px-4 py-4">
          <h2 className="font-semibold">Admin Panel</h2>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <div className="space-y-2">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.path}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-orange-700"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* Fixed Logout */}
        <div className="shrink-0 border-t border-stone-200/20 px-4 py-4">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 text-sm font-medium text-stone-50 transition hover:text-orange-300"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-80 rounded-xl bg-stone-50 p-6 text-center shadow-xl">
            <h3 className="mb-3 text-lg font-semibold text-stone-800">
              Confirm Logout
            </h3>

            <p className="mb-6 text-sm text-stone-600">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="rounded-lg bg-stone-200 px-4 py-2 text-stone-700 transition hover:bg-stone-300"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-orange-600 px-4 py-2 text-white transition hover:bg-orange-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
