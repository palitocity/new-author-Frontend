import { Link, NavLink } from "react-router-dom";
import logo from "../assets/sankofaseek.png";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white text-black shadow-md"
          : "bg-primary text-accent shadow-md"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center text-2xl font-heading font-bold tracking-wide"
        >
          <img
            src={logo}
            alt="Sankofa Seek Logo"
            className="h-10 w-auto object-contain mr-3"
          />
        </Link>

        <ul className="flex space-x-6 font-body">
          {["Home", "About", "Blog", "Marketplace"].map((item) => (
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
      </div>
    </nav>
  );
}
