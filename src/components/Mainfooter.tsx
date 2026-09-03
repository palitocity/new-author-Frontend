import {
  Apple,
  Facebook,
  Instagram,
  Mail,
  Music,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../config/axiosconfiq";
import logo from "../assets/sankofaseek.png";

const socialLinks = [
  {
    Icon: Instagram,
    href: "https://www.instagram.com/sankofaseekhub?igsh=MXhpd284dXUydTBybg==",
    label: "Instagram",
  },
  {
    Icon: Apple,
    href: "https://music.apple.com/us/artist/sankofaseek/1891273794",
    label: "Apple Podcasts",
  },
  {
    Icon: Music,
    href: "https://open.spotify.com/artist/3scVWnR14UNTP8Z2dKpa8c?si=TND8NYpUTEuSht8TPXhDnw",
    label: "Spotify",
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
  {
    Icon: Facebook,
    href: "https://www.facebook.com/share/18BLhZmMtY/",
    label: "Facebook",
  },
];

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Gallery Alter", to: "/gallery" },
  { label: "Login", to: "/login" },
];

const resources = [
  { label: "Contact Us", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

export default function Footer() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setShowModal(false);
    setError("");
    setFormData({ name: "", email: "" });
  };
const handleSubscribe = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault();
  setError("");

  try {
    setLoading(true);

    const [firstName, ...lastNameParts] = formData.name.trim().split(" ");

    await axios.post("/subscribers/subscribe", {
      email: formData.email,
      firstName: firstName || "",
      lastName: lastNameParts.join(" ") || "",
    });

    setSubscribed(true);

    setFormData({
      name: "",
      email: "",
    });
  } catch (err: unknown) {
    const message =
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof err.response === "object" &&
      err.response !== null &&
      "data" in err.response &&
      typeof err.response.data === "object" &&
      err.response.data !== null &&
      "message" in err.response.data &&
      typeof err.response.data.message === "string"
        ? err.response.data.message
        : "Subscription failed. Please try again.";

    setError(message);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <footer className="border-t border-stone-800 bg-stone-950 px-6 py-12 text-stone-300">
        <div className="container mx-auto grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="SankofaSeek Logo"
                className="h-12 w-auto rounded-md bg-white object-contain p-1"
              />
              <div>
                <p className="text-lg font-bold text-white">SankofaSeek</p>
                <p className="text-sm text-amber-300">Return and retrieve.</p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-stone-300">
              Connecting you to stories of heritage, culture, and tradition,
              exploring the pulse of our ancestors through the wisdom of the
              past.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-stone-300 transition hover:border-amber-400 hover:text-amber-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-300">
              Quick Links
            </h3>
            <nav className="mt-5 grid gap-3 text-sm font-semibold">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="transition hover:text-amber-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-300">
              Resources
            </h3>
            <nav className="mt-5 grid gap-3 text-sm font-semibold">
              {resources.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="transition hover:text-amber-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-300">
              Stay Connected
            </h3>
            <p className="mt-5 text-sm leading-6 text-stone-300">
              Receive new stories, cultural reflections, and learning updates
              directly in your inbox.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubscribed(false);
                setShowModal(true);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-amber-400 px-5 py-3 text-sm font-bold text-stone-950 transition hover:bg-amber-300"
            >
              <Mail className="h-4 w-4" />
              Subscribe
            </button>
          </div>
        </div>

        <div className="container mx-auto mt-10 border-t border-white/10 pt-6">
          <p className="text-sm text-stone-400">
            &copy; {new Date().getFullYear()} SankofaSeek. All rights reserved.
          </p>
        </div>
      </footer>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-stone-950 px-6 py-5 text-white">
              <div>
                <h2 className="text-xl font-bold">Stay connected</h2>
                <p className="text-sm text-stone-300">
                  Join the SankofaSeek community.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close subscription form"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {subscribed ? (
                <div className="py-6 text-center">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <Mail className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-stone-950">
                    You are connected
                  </h3>
                  <p className="mt-2 text-sm text-stone-600">
                    Thanks for subscribing to SankofaSeek updates.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <label
                      htmlFor="subscriber-name"
                      className="text-sm font-semibold text-stone-700"
                    >
                      Full Name
                    </label>
                    <input
                      id="subscriber-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-md border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subscriber-email"
                      className="text-sm font-semibold text-stone-700"
                    >
                      Email Address
                    </label>
                    <input
                      id="subscriber-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-md border border-stone-300 px-4 py-3 text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                      placeholder="Enter your email"
                    />
                  </div>

                  {error && (
                    <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-amber-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Mail className="h-4 w-4" />
                    {loading ? "Subscribing..." : "Subscribe Now"}
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
