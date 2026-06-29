import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/sankofaseek.png";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { logout } from "../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const menuItems = [
  { label: "Blog", to: "/blog" },
  { label: "Academy", to: "https://academy.sankofaseek.com", external: true },
  { label: "Gallery Alter", to: "/gallery" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();



  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    setOpen(false);
    toast.success("Logged out");
    navigate("/");
  };

  const navClass = scrolled
    ? "bg-white text-stone-950 shadow-sm"
    : "bg-stone-950 text-white shadow-sm";

  const renderMenuLink = (item: (typeof menuItems)[number]) => {
    if (item.external) {
      return (
        <a
          href={item.to}
          className="hover:text-accent transition"
          target="_blank"
          rel="noreferrer"
        >
          {item.label}
        </a>
      );
    }

    return (
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          isActive ? "border-b-2 border-accent" : "hover:text-accent transition"
        }
      >
        {item.label}
      </NavLink>
    );
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${navClass}`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center font-heading font-bold">
          <img
            src={logo}
            alt="Sankofa Seek Logo"
            className="mr-3 h-10 w-auto object-contain"
          />
        </Link>

        <ul className="hidden items-center space-x-6 font-body md:flex">
          {menuItems.map((item) => (
            <li key={item.label}>{renderMenuLink(item)}</li>
          ))}
        </ul>

    <div className="hidden items-center gap-3 md:flex">
  

  {token ? (
    <>
      <Link
        to="/dashboard"
        className="rounded-md border border-current px-3 py-2 text-sm font-semibold"
      >
        Dashboard
      </Link>

      <div className="relative">
        <button
          type="button"
          onClick={() => setProfileOpen((value) => !value)}
          className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-black/5"
        >
          <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-amber-100 text-sm font-bold text-amber-900">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.firstName} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              `${user?.firstName?.[0] || "U"}${
                user?.lastName?.[0] || ""
              }`
            )}
          </span>

          <ChevronDown className="h-4 w-4" />
        </button>

        {profileOpen && (
          <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-stone-200 bg-white text-stone-900 shadow-xl">
            <Link
              to="/dashboard/profile"
              onClick={() => setProfileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-semibold hover:bg-stone-100"
            >
              <UserRound className="h-4 w-4" />
              Profile Settings
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  ) : (
    <>
      <Link
        to="/login"
        className="rounded-md border border-current px-3 py-2 text-sm font-semibold"
      >
        Login
      </Link>

      <Link
        to="/signup"
        className="rounded-md bg-amber-700 px-3 py-2 text-sm font-semibold text-white"
      >
        Sign Up
      </Link>
    </>
  )}
</div>


         

        <button
          className="text-3xl md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle menu"
        >
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      <div
        className={`overflow-hidden bg-white text-black shadow-md transition-all duration-300 md:hidden ${
          open ? "max-h-[520px] py-4" : "max-h-0 py-0"
        }`}
      >
        
        <ul className="flex flex-col space-y-4 px-6">
          {menuItems.map((item) => (
            <li key={item.label} onClick={() => setOpen(false)}>
              {renderMenuLink(item)}
            </li>
          ))}
          {token ? (
            <>
              <li>
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="font-semibold">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" onClick={() => setOpen(false)}>
                  Sign Up
                </Link>
              </li>
            </>
          )}


        </ul>
      </div>
    </nav>
  );
}
