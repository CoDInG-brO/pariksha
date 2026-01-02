"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    testReminders: true,
    weeklyReport: true,
    darkMode: true,
    soundEffects: false,
    autoSubmit: true,
    showTimer: true,
    language: "English",
    timezone: "Asia/Kolkata"
  });

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-28 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-6"
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold text-white mb-2">⚙️ Settings</h1>
        <p className="text-gray-400 mb-8">Customize your experience</p>

        <div className="space-y-6">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🔔 Notifications
            </h3>
            <div className="space-y-4">
              <ToggleSetting
                label="Email Notifications"
                description="Receive updates and reminders via email"
                checked={settings.emailNotifications}
                onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
              />
              <ToggleSetting
                label="Push Notifications"
                description="Get instant notifications on your device"
                checked={settings.pushNotifications}
                onChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
              />
              <ToggleSetting
                label="Test Reminders"
                description="Remind me before scheduled tests"
                checked={settings.testReminders}
                onChange={(checked) => setSettings({ ...settings, testReminders: checked })}
              />
              <ToggleSetting
                label="Weekly Progress Report"
                description="Send me weekly performance summary"
                checked={settings.weeklyReport}
                onChange={(checked) => setSettings({ ...settings, weeklyReport: checked })}
              />
            </div>
          </motion.div>

          {/* Appearance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🎨 Appearance
            </h3>
            <div className="space-y-4">
              <ToggleSetting
                label="Dark Mode"
                description="Use dark theme for the application"
                checked={settings.darkMode}
                onChange={(checked) => setSettings({ ...settings, darkMode: checked })}
              />
              <ToggleSetting
                label="Sound Effects"
                description="Play sounds for correct/incorrect answers"
                checked={settings.soundEffects}
                onChange={(checked) => setSettings({ ...settings, soundEffects: checked })}
              />
            </div>
          </motion.div>

          {/* Test Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              📝 Test Preferences
            </h3>
            <div className="space-y-4">
              <ToggleSetting
                label="Auto Submit"
                description="Automatically submit test when time runs out"
                checked={settings.autoSubmit}
                onChange={(checked) => setSettings({ ...settings, autoSubmit: checked })}
              />
              <ToggleSetting
                label="Show Timer"
                description="Display countdown timer during tests"
                checked={settings.showTimer}
                onChange={(checked) => setSettings({ ...settings, showTimer: checked })}
              />
            </div>
          </motion.div>

          {/* Language & Region */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🌍 Language & Region
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 font-medium mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent transition-colors"
                >
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="Asia/Dubai">Dubai (GST)</option>
                  <option value="America/New_York">New York (EST)</option>
                  <option value="Europe/London">London (GMT)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4"
          >
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-accent to-blue-600 hover:from-accent/90 hover:to-blue-600/90 rounded-lg text-white font-semibold transition-all"
            >
              💾 Save Settings
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold transition-all"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-white font-medium">{label}</p>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
