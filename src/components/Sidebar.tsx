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
      name: "Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      path: "/admin/orders",
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
      name: "Settings",
      icon: <Settings className="w-5 h-5" />,
      path: "/admin/settings",
    },
    {
      name: "View Blogs",
      icon: <BookOpen className="w-5 h-5" />,
      path: "view-blogs",
    },
    {
      path: "view-stories",
      name: "View Stories",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router("/login");
  };

  return (
    <>
      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full bg-linear-to-b from-amber-900 to-orange-900 text-stone-50 shadow-lg
          transition-transform duration-300 z-50
          ${sidebarOpen ? "translate-x-0 w-64" : "translate-x-full w-64"}
          md:hidden`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-stone-200/20">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-stone-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-2">
          {menuItems.map((item, idx) => (
            <a
              key={idx}
              href={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-700 transition"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </a>
          ))}
        </nav>

        {/* Logout button */}
        <div className="px-4 py-4 border-t border-stone-200/20">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 text-sm font-medium text-stone-50 hover:text-orange-300 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-linear-to-b from-amber-900 to-orange-900 text-stone-50 h-full justify-between">
        <div>
          <nav className="flex-1 px-2 py-4 space-y-2">
            {menuItems.map((item, idx) => (
              <a
                key={idx}
                href={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Logout button */}
        <div className="px-4 py-4 border-t border-stone-200/20">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 text-sm font-medium text-stone-50 hover:text-orange-300 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-60">
          <div className="bg-stone-50 rounded-xl shadow-xl p-6 w-80 text-center">
            <h3 className="text-lg font-semibold text-stone-800 mb-3">
              Confirm Logout
            </h3>
            <p className="text-sm text-stone-600 mb-6">
              Are you sure you want to log out?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
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
