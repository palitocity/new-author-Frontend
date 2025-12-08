import { useState } from "react";
import { Send, Mail, User, MessageSquare, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            Get in Touch
          </h1>
          <p className="text-stone-600 text-lg">
            We’d love to hear from you. Send us a message and we’ll respond as
            soon as possible.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-amber-100 border border-amber-300 rounded-3xl shadow-xl p-8 md:p-10">
          {submitted ? (
            <div className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-amber-800 mb-2">
                Message Sent!
              </h3>
              <p className="text-amber-700">
                Thank you for reaching out. We’ll get back to you soon.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-700 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-700 placeholder-stone-400 focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-700 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-700 placeholder-stone-400 focus:ring-2 focus:ring-amber-500 transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Your Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 text-amber-700 w-5 h-5" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-stone-300 rounded-xl text-stone-700 placeholder-stone-400 focus:ring-2 focus:ring-amber-500 transition resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full bg-amber-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-amber-700 transition shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </div>
          )}
        </div>

        {/* Extra Info */}
        <div className="text-center mt-6 text-stone-500 text-sm">
          We typically respond within 24 hours.
        </div>
      </div>
    </div>
  );
};

export default Contact;
