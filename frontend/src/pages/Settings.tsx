import { useState } from "react";
import {
  User,
  Bell,
  Palette,
  Link2,
  Database,
  LogOut,
  Upload,
} from "lucide-react";

const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [retentionThreshold, setRetentionThreshold] = useState(70);
  const [decaySensitivity, setDecaySensitivity] = useState(50);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="opacity-60">Manage your account and preferences</p>
      </div>

      <div
        className="rounded-xl p-6 border"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6" style={{ color: "var(--primary)" }} />
          <h2 className="text-2xl font-bold">Profile</h2>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white relative group cursor-pointer"
            style={{ backgroundColor: "var(--primary)" }}
          >
            MC
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Upload className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Mrinali Charhate"
                className="w-full px-4 py-3 rounded-lg border outline-none"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--card-border)",
                  color: "var(--text)",
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                defaultValue="mrinali@gmail.com"
                className="w-full px-4 py-3 rounded-lg border outline-none"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--card-border)",
                  color: "var(--text)",
                }}
              />
            </div>
          </div>
        </div>

        <button
          className="px-6 py-2 rounded-lg font-medium transition-all hover:scale-105 text-white"
          style={{ backgroundColor: "var(--primary)" }}
        >
          Save Changes
        </button>
      </div>

      <div
        className="rounded-xl p-6 border"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6" style={{ color: "var(--primary)" }} />
          <h2 className="text-2xl font-bold">Notifications</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Reminders</p>
              <p className="text-sm opacity-60">
                Get notified about skills that need practice
              </p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`w-14 h-8 rounded-full transition-all ${
                emailNotifications ? "bg-[var(--primary)]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-all ${
                  emailNotifications ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Daily Streak Reminders</p>
              <p className="text-sm opacity-60">
                Get reminded to maintain your streak
              </p>
            </div>
            <button
              onClick={() => setDailyReminders(!dailyReminders)}
              className={`w-14 h-8 rounded-full transition-all ${
                dailyReminders ? "bg-[var(--primary)]" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-all ${
                  dailyReminders ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block font-medium mb-2">
              Alert when retention drops below:{" "}
              <span className="font-bold">{retentionThreshold}%</span>
            </label>
            <input
              type="range"
              min="30"
              max="90"
              value={retentionThreshold}
              onChange={(e) => setRetentionThreshold(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs opacity-60 mt-1">
              <span>30%</span>
              <span>60%</span>
              <span>90%</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-6 border"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6" style={{ color: "var(--primary)" }} />
          <h2 className="text-2xl font-bold">Preferences</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-2">
              Decay Sensitivity:{" "}
              <span className="font-bold">
                {decaySensitivity > 65
                  ? "Aggressive"
                  : decaySensitivity > 35
                    ? "Normal"
                    : "Relaxed"}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={decaySensitivity}
              onChange={(e) => setDecaySensitivity(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs opacity-60 mt-1">
              <span>Relaxed</span>
              <span>Normal</span>
              <span>Aggressive</span>
            </div>
            <p className="text-sm opacity-60 mt-2">
              Controls how quickly skills decay without practice
            </p>
          </div>

          <div>
            <label className="block font-medium mb-2">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                className="p-4 rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: "#f3f3fc",
                  borderColor: "var(--primary)",
                  color: "#0a071d",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Light</span>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: "#291d77" }}
                  />
                </div>
                <p className="text-xs opacity-60">Default light theme</p>
              </button>
              <button
                className="p-4 rounded-lg border-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: "#03030c",
                  borderColor: "var(--card-border)",
                  color: "#e5e2f8",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Dark</span>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: "#9488e2" }}
                  />
                </div>
                <p className="text-xs opacity-60">Easy on the eyes</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-6 border"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Link2 className="w-6 h-6" style={{ color: "var(--primary)" }} />
          <h2 className="text-2xl font-bold">Integrations</h2>
        </div>

        <div className="space-y-3">
          <div
            className="p-4 rounded-lg border flex items-center justify-between"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: "#24292e" }}
              >
                <svg viewBox="0 0 16 16" fill="white" className="w-6 h-6">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">GitHub</p>
                <p className="text-sm opacity-60">
                  Track skills from your repositories
                </p>
              </div>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: "var(--warning)" + "20",
                color: "var(--warning)",
              }}
            >
              Coming Soon
            </span>
          </div>

          <div
            className="p-4 rounded-lg border flex items-center justify-between"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ backgroundColor: "#0077b5" }}
              >
                <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">LinkedIn</p>
                <p className="text-sm opacity-60">
                  Sync skills with your profile
                </p>
              </div>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: "var(--warning)" + "20",
                color: "var(--warning)",
              }}
            >
              Coming Soon
            </span>
          </div>
        </div>
      </div>

      <div
        className="rounded-xl p-6 border"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-6 h-6" style={{ color: "var(--primary)" }} />
          <h2 className="text-2xl font-bold">Data Management</h2>
        </div>

        <div className="space-y-3">
          <button
            className="w-full p-4 rounded-lg border text-left transition-all hover:scale-102"
            style={{
              backgroundColor: "var(--background)",
              borderColor: "var(--card-border)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export All Data</p>
                <p className="text-sm opacity-60">Download your data as JSON</p>
              </div>
              <span>→</span>
            </div>
          </button>

          <button
            className="w-full p-4 rounded-lg border text-left transition-all hover:scale-102"
            style={{
              backgroundColor: "var(--danger)" + "10",
              borderColor: "var(--danger)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: "var(--danger)" }}>
                  Delete Account
                </p>
                <p className="text-sm opacity-60">
                  Permanently delete your account and all data
                </p>
              </div>
              <LogOut className="w-5 h-5" style={{ color: "var(--danger)" }} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
