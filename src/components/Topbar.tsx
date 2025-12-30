import React, { useState } from "react";
import logo from "../assets/sankofaseek.png";
import { ChevronDown, LogOut, Search, User } from "lucide-react";
import userprofilepic from "../assets/facesofken.jpg";
import { MdMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface Props {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

const Topbar: React.FC<Props> = ({ setSidebarOpen, sidebarOpen }) => {
  const [dropdown, setDropdown] = useState(false);
  const router = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router("/login");
  };

  return (
    <header className="w-full h-[12vh] flex items-center justify-between px-4 md:px-6 bg-linear-to-r from-amber-600 to-orange-800 shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="h-10 w-auto" />
        <h2 className="hidden md:block font-bold text-stone-50 text-lg">
          Sankofaseek Admin
        </h2>
      </div>

      {/* Search (Desktop) */}
      <div className="hidden md:flex items-center bg-stone-50/90 px-3 py-2 rounded-md w-[300px]">
        <Search className="text-stone-600 w-5 h-5 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none flex-1 text-sm text-stone-800 placeholder-stone-500"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdown(!dropdown)}
            className="flex items-center gap-2"
          >
            <img
              src={userprofilepic}
              alt="profile"
              className="w-9 h-9 rounded-full border-2 border-stone-50"
            />
            <ChevronDown className="text-stone-50" />
          </button>

          {dropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-stone-50 shadow-md rounded-md py-2 z-50">
              <button
                onClick={() => router("/admin/settings")}
                className="w-full text-left px-4 py-2 hover:bg-amber-100 text-sm flex items-center gap-2 text-stone-700"
              >
                <User className="w-4 h-4" /> Profile
              </button>

              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full text-left px-4 py-2 hover:bg-orange-600 hover:text-white text-sm flex items-center gap-2 text-stone-700"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Sidebar Toggle */}
        <button
          className="md:hidden p-2 bg-stone-50/90 rounded-md"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <MdMenu size={22} className="text-amber-900" />
        </button>
      </div>

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
    </header>
  );
};

export default Topbar;
