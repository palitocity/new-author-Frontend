import {
  // BookMarked,
  Store,
  Clock3,
  Home,
  Library,
  Lock,
  LogOut,
  Menu,
  NotebookPen,
  Settings,
  ShieldCheck,
  X,

  UserRoundCog,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logout } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

const navItems = [
  { label: "Dashboard Overview", to: "/dashboard", icon: Home },
  { label: "Marketplace", to: "/dashboard/marketplace", icon: Store },

  { label: "My Continuity Library", to: "/dashboard/library", icon: Library },
  {
    label: "Reflection Notes",
    to: "/dashboard/reflection-notes",
    icon: NotebookPen,
  },

  { label: "Purchase History", to: "/dashboard/purchases", icon: Clock3 },
  // { label: "Saved Stories", to: "/dashboard/saved", icon: BookMarked },
  { label: "Profile Settings", to: "/dashboard/profile", icon: Settings },
  { label: "Security", to: "/dashboard/security", icon: ShieldCheck },
  { label: "Be a Member", to: "/dashboard/account", icon: UserRoundCog },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/");
  };

  const sidebar = (
    <aside className="flex h-screen flex-col overflow-hidden border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
      <div className="flex items-center justify-between px-5 py-5 shrink-0">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
            Sankofa Seek
          </p>
          <p className="mt-1 text-lg font-bold text-stone-950 dark:text-white">
            Reader Dashboard
          </p>
        </div>
        <button
          className="lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close dashboard menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              end={to === "/dashboard"}
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-stone-950 text-white dark:bg-white dark:text-stone-950"
                    : "text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-900"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-stone-200 p-3 dark:border-stone-800">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-stone-100 text-stone-950 dark:bg-stone-950 dark:text-white">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        {sidebar}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-label="Close dashboard menu"
          />
          <div className="relative h-full w-72 max-w-[85vw]">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stone-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95 sm:px-6">
          <button
            className="rounded-md border border-stone-200 p-2 lg:hidden dark:border-stone-800"
            onClick={() => setOpen(true)}
            aria-label="Open dashboard menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-2 text-sm font-semibold text-emerald-700 sm:flex">
            <Lock className="h-4 w-4" />
            Premium access is saved permanently after purchase.
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold">
                {user?.firstName || "Reader"} {user?.lastName || ""}
              </p>
              <p className="text-xs text-stone-500">{user?.email}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-amber-100 text-sm font-bold text-amber-900">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} avatar`}
                  className="h-full w-full object-cover"
                />
              ) : (
                `${user?.firstName?.[0] || "R"}${user?.lastName?.[0] || ""}`
              )}
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
