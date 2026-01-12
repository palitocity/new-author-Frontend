/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
  Mail,
  Send,
  Users as UsersIcon,
  TrendingUp,
  FileText,
  Calendar,
  Eye,
} from "lucide-react";
import axios from "../config/axiosconfiq";
import toast from "react-hot-toast";

interface SendResults {
  summary: {
    total: number;
    sent: number;
    failed: number;
    status: string;
  };
  results?: {
    email: string;
    success: boolean;
    error?: string;
  }[];
}

// Subscribers
interface Subscriber {
  _id: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  subscribedAt: string;
}

const Newsletter = () => {
  const token = localStorage.getItem("token");

  // Newsletter form
  const [newsletterData, setNewsletterData] = useState({
    subject: "",
    content: "",
  });

  // Sending state
  const [dryRun, setDryRun] = useState(true);
  const [sending, setSending] = useState(false);

  const [sendResults, setSendResults] = useState<SendResults | null>(null);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);

  // Fetch subscribers
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const res = await axios.get("/subscribers/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubscribers(res.data.data);
      } catch (err) {
        console.error("Failed to load subscribers", err);
      } finally {
        setLoadingSubscribers(false);
      }
    };
    fetchSubscribers();
  }, []);

  // Form handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewsletterData((prev) => ({ ...prev, [name]: value }));
  };

  const createNewsletter = async () => {
    try {
      const res = await axios.post(
        "/newsletter",
        { ...newsletterData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data._id;
    } catch (err) {
      console.error("Failed to create newsletter", err);
      toast.error("Failed to create newsletter");
    }
  };

  // Send newsletter API
  const sendNewsletter = async (newsletterId: string) => {
    try {
      setSending(true);
      const res = await axios.post(
        `/newsletter/${newsletterId}/send`,
        { dryRun, batchSize: 50, maxConcurrency: 5 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSendResults(res.data);

      toast.success(
        `Newsletter sent: ${res.data.summary.sent} / ${res.data.summary.total}`
      );

      // Clear newsletter form after sending
      setNewsletterData({ subject: "", content: "" });
    } catch (err) {
      console.error("Failed to send newsletter", err);
      toast.error("Failed to send newsletter");
    } finally {
      setSending(false);
    }
  };
  // Send button click
  const handleSendNow = async () => {
    const newsletterId = await createNewsletter();
    if (newsletterId) await sendNewsletter(newsletterId);

    if (scheduleEnabled) {
      await scheduleNewsletter(newsletterId);
    } else {
      await sendNewsletter(newsletterId);
    }
  };

  const scheduleNewsletter = async (newsletterId: string) => {
    try {
      await axios.post(
        `/newsletter/${newsletterId}/schedule`,
        { scheduledAt },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Newsletter scheduled successfully");
      setNewsletterData({ subject: "", content: "" });
      setScheduledAt("");
      setScheduleEnabled(false);
    } catch (err) {
      console.error("Failed to schedule", err);
      toast.error("Failed to schedule newsletter");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Newsletter Management
        </h1>
        <p className="text-stone-600">Create and manage email campaigns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Subscribers</p>
            <UsersIcon className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">
            {subscribers.length.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-1">+234 this month</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Open Rate</p>
            <Eye className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">42.3%</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Click Rate</p>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">18.7%</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Campaigns Sent</p>
            <Mail className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">24</p>
        </div>
      </div>

      {/* Newsletter Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              Create Newsletter
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Subject Line *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={newsletterData.subject}
                  onChange={handleChange}
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Email Content *
                </label>
                <textarea
                  name="content"
                  rows={12}
                  value={newsletterData.content}
                  onChange={handleChange}
                  placeholder="Write your newsletter content here..."
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition resize-none"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-2 text-stone-700">
                  <input
                    type="checkbox"
                    checked={scheduleEnabled}
                    onChange={() => setScheduleEnabled(!scheduleEnabled)}
                  />
                  Schedule for later
                </label>

                {scheduleEnabled && (
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-1">
                      Schedule Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full px-4 py-2 border-2 border-stone-200 rounded-lg focus:border-amber-600"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-stone-700">
                  <input
                    type="checkbox"
                    checked={dryRun}
                    onChange={() => setDryRun(!dryRun)}
                  />
                  Dry Run
                </label>

                <button
                  onClick={handleSendNow}
                  disabled={sending || (scheduleEnabled && !scheduledAt)}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sending
                    ? "Processing..."
                    : scheduleEnabled
                    ? "Schedule Newsletter"
                    : "Send Now"}
                </button>
              </div>

              {sendResults && (
                <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border border-stone-200">
                  <h4 className="font-bold text-stone-800 mb-2">
                    Send Summary
                  </h4>
                  <p>Total Recipients: {sendResults.summary.total}</p>
                  <p>Sent: {sendResults.summary.sent}</p>
                  <p>Failed: {sendResults.summary.failed}</p>
                  <p>Status: {sendResults.summary.status}</p>
                  {sendResults.results && sendResults.results.length > 0 && (
                    <details className="mt-2 text-sm text-stone-600">
                      <summary>View per-recipient results</summary>
                      <ul className="mt-1 max-h-40 overflow-y-auto">
                        {sendResults.results.map((r) => (
                          <li key={r.email}>
                            {r.email}: {r.success ? "✅" : `❌ ${r.error}`}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tips Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-stone-800 mb-4">Tips</h3>
            <ul className="space-y-3 text-sm text-stone-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Keep subject lines under 50 characters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Personalize content when possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Include a clear call-to-action</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span>Test before sending to all</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="mt-6 bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-stone-200">
          <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Subscribers List
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Verified</th>
                <th className="py-4 px-6 text-left">Subscribed At</th>
              </tr>
            </thead>
            <tbody>
              {loadingSubscribers ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-stone-500">
                    Loading subscribers...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-stone-500">
                    No subscribers found
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr
                    key={sub._id}
                    className="border-t border-stone-100 hover:bg-stone-50 transition"
                  >
                    <td className="py-4 px-6 font-medium text-stone-800">
                      {sub.email}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          sub.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {sub.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {sub.isVerified ? "✅ Verified" : "⏳ Pending"}
                    </td>
                    <td className="py-4 px-6 text-stone-600">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
