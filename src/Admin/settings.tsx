import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Mail as MailIcon,
  Shield,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    {
      id: "general",
      label: "General",
      icon: <SettingsIcon className="w-4 h-4" />,
    },
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
    },
    { id: "security", label: "Security", icon: <Lock className="w-4 h-4" /> },
    {
      id: "appearance",
      label: "Appearance",
      icon: <Palette className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Settings</h1>
        <p className="text-stone-600">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === tab.id
                    ? "bg-linear-to-r from-amber-600 to-orange-600 text-white"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-600" />
                  General Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Sankofaseek"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="Discover and explore African history through stories, articles, and educational content."
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Language
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition">
                      <option>English</option>
                      <option>French</option>
                      <option>Swahili</option>
                      <option>Arabic</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Timezone
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition">
                      <option>UTC +0:00 (GMT)</option>
                      <option>UTC +1:00 (WAT)</option>
                      <option>UTC +2:00 (CAT)</option>
                      <option>UTC +3:00 (EAT)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <MailIcon className="w-5 h-5 text-orange-600" />
                  Email Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@sankofaseek.com"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Support Email
                    </label>
                    <input
                      type="email"
                      defaultValue="support@sankofaseek.com"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-orange-600 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              <button className="px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-medium">
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-600" />
                Profile Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-24 h-24 bg-linear-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    A
                  </div>
                  <button className="px-4 py-2 border-2 border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition">
                    Change Photo
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Admin"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue="User"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@sankofaseek.com"
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition resize-none"
                  />
                </div>
                <button className="px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-medium">
                  Update Profile
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-600" />
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "New User Registrations",
                    desc: "Get notified when new users sign up",
                  },
                  {
                    label: "New Orders",
                    desc: "Receive alerts for new customer orders",
                  },
                  {
                    label: "Blog Comments",
                    desc: "Get notified of new comments on blog posts",
                  },
                  {
                    label: "Newsletter Campaigns",
                    desc: "Alerts for newsletter campaign results",
                  },
                  {
                    label: "System Updates",
                    desc: "Important system and security updates",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 border-2 border-stone-200 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-stone-800">
                        {item.label}
                      </p>
                      <p className="text-sm text-stone-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-600" />
                  Change Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:border-amber-600 focus:outline-none transition"
                    />
                  </div>
                  <button className="px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-medium">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-orange-600" />
                  Two-Factor Authentication
                </h2>
                <p className="text-stone-600 mb-4">
                  Add an extra layer of security to your account
                </p>
                <button className="px-6 py-3 border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition font-medium">
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-600" />
                Appearance Settings
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { name: "Light", active: true },
                      { name: "Dark", active: false },
                      { name: "Auto", active: false },
                    ].map((theme, idx) => (
                      <button
                        key={idx}
                        className={`p-4 border-2 rounded-lg transition ${
                          theme.active
                            ? "border-amber-600 bg-amber-50"
                            : "border-stone-200 hover:border-amber-600"
                        }`}
                      >
                        <p className="font-semibold text-stone-800">
                          {theme.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-3">
                    Primary Color
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {[
                      "#D97706",
                      "#EA580C",
                      "#DC2626",
                      "#059669",
                      "#0284C7",
                      "#7C3AED",
                    ].map((color, idx) => (
                      <button
                        key={idx}
                        className="w-12 h-12 rounded-lg border-2 border-stone-200 hover:scale-110 transition"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <button className="px-6 py-3 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:from-amber-700 hover:to-orange-700 transition font-medium">
                  Save Appearance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
