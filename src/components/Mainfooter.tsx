import { useState } from "react";

import logo from "../assets/sankofaseek.png";

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

// Enhanced Footer Component
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <footer className="bg-linear-to-br from-[#6B4321] via-[#7A4D2A] to-[#5A3719] text-white relative overflow-hidden">
      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative container mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="flex flex-col space-y-5">
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="SankofaSeek Logo"
                className="h-14 w-auto object-contain rounded-md shadow-md bg-white p-1"
              />

              <div>
                <h3 className="font-bold text-xl">SankofaSeek</h3>
                <p className="text-xs text-amber-200">Return & Retrieve</p>
              </div>
            </div>

            <p className="text-sm text-gray-200 leading-relaxed">
              Connecting you to stories of heritage, culture, and tradition —
              exploring the pulse of our ancestors through the wisdom of the
              past.
            </p>

            {/* Social Links */}
            <div className="flex space-x-3 pt-2">
              {[
                {
                  Icon: Instagram,
                  href: "https://www.instagram.com/sankofaseekarts?igsh=MXhpd284dXUydTBybg==",
                  label: "Instagram",
                },
                {
                  Icon: Facebook,
                  href: "https://www.facebook.com/share/14RnpXX4r1u/",
                  label: "Facebook",
                },
                {
                  Icon: Twitter,
                  href: "https://x.com/Sankofaseekart?t=JAj0W5pnj3FF3kVqV4WTuQ&s=09",
                  label: "Twitter / X",
                },
                {
                  Icon: Youtube,
                  href: "https://youtube.com/@sankofaseekarts?si=HWE9qgmfCbOsVEv6",
                  label: "YouTube",
                },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm 
                  flex items-center justify-center hover:bg-amber-500 hover:scale-110 
                  transition-all duration-300 group"
                >
                  <Icon className="w-5 h-5 text-white group-hover:text-black transition" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-lg mb-1 text-amber-200 flex items-center">
              <span className="w-1 h-6 bg-amber-500 mr-3 rounded-full"></span>
              Quick Links
            </h3>
            <nav className="flex flex-col space-y-3">
              {["Home", "About", "Blog", "Marketplace"].map((item) => (
                <a
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="text-gray-200 hover:text-amber-300 transition-all duration-200 hover:translate-x-1 inline-flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-amber-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-lg mb-1 text-amber-200 flex items-center">
              <span className="w-1 h-6 bg-amber-500 mr-3 rounded-full"></span>
              Resources
            </h3>
            <nav className="flex flex-col space-y-3">
              {[
                { name: "Contact Us", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "FAQ", href: "/faq" },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-200 hover:text-amber-300 transition-all duration-200 hover:translate-x-1 inline-flex items-center group"
                >
                  <span className="w-0 h-0.5 bg-amber-500 group-hover:w-4 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col space-y-4">
            <h3 className="font-bold text-lg mb-1 text-amber-200 flex items-center">
              <span className="w-1 h-6 bg-amber-500 mr-3 rounded-full"></span>
              Stay Connected
            </h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              Receive stories, insights, and cultural wisdom directly in your
              inbox.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col space-y-3"
            >
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-lg text-gray-800 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={subscribed}
                className="bg-amber-500 px-6 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {subscribed ? (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Subscribed!
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} SankofaSeek. All rights
              reserved. Crafted with heritage in mind.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <a href="/sitemap" className="hover:text-amber-300 transition">
                Sitemap
              </a>
              <a
                href="/accessibility"
                className="hover:text-amber-300 transition"
              >
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
