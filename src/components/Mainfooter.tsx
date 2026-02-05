/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import logo from "../assets/sankofaseek.png";

import { Instagram, Twitter, Youtube, X } from "lucide-react";
import axios from "../config/axiosconfiq";

// Enhanced Footer Component
export default function Footer() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenModal = () => {
    setShowModal(true);
    setError("");
    setFormData({ name: "", email: "" });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setFormData({ name: "", email: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.name) return;

    try {
      setLoading(true);

      await axios.post("/subscribers/subscribe", {
        name: formData.name,
        email: formData.email,
      });

      setSubscribed(true);
      setFormData({ name: "", email: "" });

      setTimeout(() => {
        setSubscribed(false);
        handleCloseModal();
      }, 2000);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Subscription failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                    href: "https://www.instagram.com/sankofaseekhub?igsh=MXhpd284dXUydTBybg==",
                    label: "Instagram",
                  },
                  {
                    Icon: Twitter,
                    href: "https://x.com/SankofaseekHub",
                    label: "Twitter / X",
                  },
                  {
                    Icon: Youtube,
                    href: "https://www.youtube.com/@sankofaseekartHub",
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
              <button
                onClick={handleOpenModal}
                className="bg-amber-500 px-6 py-3 rounded-lg font-semibold 
                hover:bg-amber-600 transition-all duration-300 
                hover:shadow-lg hover:scale-105 active:scale-95 
                flex items-center justify-center text-white"
              >
                Subscribe Now
              </button>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-white/10 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-300 text-sm text-center md:text-left">
                &copy; {new Date().getFullYear()} SankofaSeek. All rights
                reserved. Crafted with heritage in mind.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Subscription Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-linear-to-br from-[#6B4321] via-[#7A4D2A] to-[#5A3719] text-white px-6 py-5 relative">
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              </div>

              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">
                    Join Our Community
                  </h2>
                  <p className="text-amber-200 text-sm">
                    Stay connected with cultural wisdom
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {subscribed ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
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
                  </div>
                  <h3 className="text-2xl font-bold text-stone-800 mb-2">
                    Successfully Subscribed!
                  </h3>
                  <p className="text-stone-600">
                    Check your inbox for confirmation.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-5">
                  {/* Name Input */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-stone-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-stone-200 text-stone-800 
                      focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent 
                      transition-all placeholder:text-stone-400"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-stone-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-4 py-3 rounded-lg border-2 border-stone-200 text-stone-800 
                      focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent 
                      transition-all placeholder:text-stone-400"
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <svg
                        className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Privacy Notice */}
                  <p className="text-xs text-stone-500 leading-relaxed">
                    By subscribing, you agree to receive occasional emails from
                    SankofaSeek. You can unsubscribe at any time. We respect
                    your privacy.
                  </p>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-amber-500 to-amber-600 text-white px-6 py-3.5 rounded-lg font-semibold 
                    hover:from-amber-600 hover:to-amber-700 transition-all duration-300 
                    hover:shadow-lg hover:scale-[1.02] active:scale-95 
                    disabled:opacity-50 disabled:cursor-not-allowed 
                    flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Subscribe Now
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
