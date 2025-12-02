import { Link, NavLink } from "react-router-dom";
import logo from "../assets/sankofaseek.png";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = ["Home", "About", "Blog", "Marketplace"];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white text-black shadow-md"
          : "bg-primary text-accent shadow-md"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center font-heading font-bold">
          <img
            src={logo}
            alt="Sankofa Seek Logo"
            className="h-10 w-auto object-contain mr-3"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 font-body">
          {menuItems.map((item) => (
            <li key={item}>
              <NavLink
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-accent"
                    : "hover:text-accent transition"
                }
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button className="md:hidden text-3xl" onClick={() => setOpen(!open)}>
          {open ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white text-black shadow-md transition-all duration-300 overflow-hidden ${
          open ? "max-h-60 py-4" : "max-h-0 py-0"
        }`}
      >
        <ul className="flex flex-col space-y-4 px-6">
          {menuItems.map((item) => (
            <li key={item}>
              <NavLink
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold text-accent"
                    : "hover:text-accent transition"
                }
              >
                {item}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
