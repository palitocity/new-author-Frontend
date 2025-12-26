import { useState } from "react";
import {
  Mail,
  Send,
  Users as UsersIcon,
  TrendingUp,
  FileText,
  Calendar,
  Eye,
} from "lucide-react";

const Newsletter = () => {
  const [newsletterData, setNewsletterData] = useState({
    subject: "",
    previewText: "",
    content: "",
  });

  console.log(newsletterData, setNewsletterData);

  const campaigns = [
    {
      id: 1,
      name: "African History Week",
      sent: "Dec 15, 2025",
      recipients: 12456,
      opened: "42.3%",
      clicked: "18.7%",
    },
    {
      id: 2,
      name: "New Stories Alert",
      sent: "Dec 10, 2025",
      recipients: 12440,
      opened: "38.5%",
      clicked: "15.2%",
    },
    {
      id: 3,
      name: "Monthly Newsletter",
      sent: "Dec 1, 2025",
      recipients: 12401,
      opened: "45.1%",
      clicked: "21.3%",
    },
  ];

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
          <p className="text-3xl font-bold text-stone-800">12,456</p>
          <p className="text-sm text-green-600 mt-1">+234 this month</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Open Rate</p>
            <Eye className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">42.3%</p>
          <p className="text-sm text-green-600 mt-1">+3.2% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Click Rate</p>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">18.7%</p>
          <p className="text-sm text-green-600 mt-1">+1.8% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-stone-600 text-sm">Campaigns Sent</p>
            <Mail className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-stone-800">24</p>
          <p className="text-sm text-stone-500 mt-1">This year</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Newsletter */}
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
                  placeholder="Enter email subject..."
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Preview Text
                </label>
                <input
                  type="text"
                  placeholder="This appears below the subject in inboxes..."
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">
                  Email Content *
                </label>
                <textarea
                  rows={12}
                  placeholder="Write your newsletter content here..."
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 border-2 border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition font-medium">
                  Save Draft
                </button>
                <button className="flex-1 px-6 py-3 border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition font-medium">
                  Preview
                </button>
                <button className="flex-1 px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-medium flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-linear-to-br from-amber-600 to-orange-600 rounded-xl p-6 shadow-sm text-white">
            <h3 className="text-lg font-bold mb-4">Quick Send</h3>
            <p className="text-amber-100 text-sm mb-4">
              Send to all subscribers
            </p>
            <button className="w-full bg-white text-orange-600 py-2 rounded-lg font-medium hover:bg-stone-50 transition">
              Send to 12,456 subscribers
            </button>
          </div>

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

      {/* Previous Campaigns */}
      <div className="mt-6 bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-stone-200">
          <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Previous Campaigns
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Campaign Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Sent Date
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Recipients
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Opened
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-stone-700">
                  Clicked
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr
                  key={campaign.id}
                  className="border-t border-stone-100 hover:bg-stone-50 transition"
                >
                  <td className="py-4 px-6 font-semibold text-stone-800">
                    {campaign.name}
                  </td>
                  <td className="py-4 px-6 text-stone-600">{campaign.sent}</td>
                  <td className="py-4 px-6 text-stone-700">
                    {campaign.recipients.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-green-600 font-semibold">
                    {campaign.opened}
                  </td>
                  <td className="py-4 px-6 text-amber-600 font-semibold">
                    {campaign.clicked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
