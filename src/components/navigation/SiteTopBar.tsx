import { Home, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import logo from "../../assets/sankofaseek.png";
import { useAccountLinks } from "../../hooks/useAccountLinks";

const linkClass =
  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950";

/**
 * Slim header for pages outside the main site and dashboard layouts
 * (checkout, reader, access notices): logo home, plus account links.
 */
export default function SiteTopBar() {
  const { isUser, isAdmin } = useAccountLinks();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5">
        <Link to="/" aria-label="SankofaSeek home" className="shrink-0">
          <img src={logo} alt="SankofaSeek" className="h-9 w-auto object-contain" />
        </Link>

        <nav className="flex items-center gap-1" aria-label="Site">
          <Link to="/" className={linkClass}>
            <Home className="h-4 w-4" />
            Home
          </Link>
          {isUser && (
            <Link to="/dashboard" className={linkClass}>
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin/main" className={linkClass}>
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Admin Panel</span>
            </Link>
          )}
          {!isUser && !isAdmin && (
            <Link
              to="/login"
              className="ml-1 rounded-md bg-stone-950 px-3 py-2 text-sm font-semibold text-white hover:bg-stone-800"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

/** Layout route: slim top bar above a standalone page. */
export function SiteTopBarLayout() {
  return (
    <>
      <SiteTopBar />
      <Outlet />
    </>
  );
}
