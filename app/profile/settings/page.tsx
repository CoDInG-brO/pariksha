"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { isSoundEnabled, setSoundEnabled } from "@/lib/sounds";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    testReminders: true,
    weeklyReport: true,
    soundEffects: false,
    autoSubmit: true,
    showTimer: true,
    language: "English",
    timezone: "Asia/Kolkata"
  });

  // Prevent hydration mismatch and load saved settings
  useEffect(() => {
    setMounted(true);
    // Load sound setting from localStorage
    setSettings(prev => ({
      ...prev,
      soundEffects: isSoundEnabled()
    }));
  }, []);

  // Update sound setting in localStorage when it changes
  const handleSoundEffectsChange = (enabled: boolean) => {
    setSettings(prev => ({ ...prev, soundEffects: enabled }));
    setSoundEnabled(enabled);
  };

  const handleSave = () => {
    setShowSuccessToast(true);
  };

  const handleToastClose = () => {
    setShowSuccessToast(false);
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-28 pb-12">
      {/* Success Dialog */}
      <AnimatePresence>
        {showSuccessToast && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleToastClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-elevated rounded-2xl border border-white/10 shadow-2xl p-6 text-center w-full max-w-sm pointer-events-auto">
                <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-400 text-2xl">✓</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Settings Saved!</h3>
                <p className="text-gray-400 text-sm mb-5">Your preferences have been updated successfully.</p>
                <button
                  onClick={handleToastClose}
                  className="w-full px-4 py-2.5 bg-accent hover:bg-accent/90 rounded-lg text-white text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
              {/* Theme Selector */}
              <div className="py-2">
                <p className="text-white font-medium mb-1">Theme</p>
                <p className="text-gray-400 text-sm mb-4">Choose your preferred color scheme</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      mounted && resolvedTheme === "light"
                        ? "border-accent bg-accent/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className="text-3xl">☀️</span>
                    <span className="text-white font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      mounted && resolvedTheme === "dark"
                        ? "border-accent bg-accent/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className="text-3xl">🌙</span>
                    <span className="text-white font-medium">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      mounted && theme === "system"
                        ? "border-accent bg-accent/10"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <span className="text-3xl">💻</span>
                    <span className="text-white font-medium">System</span>
                  </button>
                </div>
              </div>
              <ToggleSetting
                label="Sound Effects"
                description="Play sounds for correct/incorrect answers"
                checked={settings.soundEffects}
                onChange={handleSoundEffectsChange}
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
            className="flex justify-end gap-3"
          >
            <button
              onClick={() => router.back()}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-gradient-to-r from-accent to-blue-600 hover:from-accent/90 hover:to-blue-600/90 rounded-lg text-white text-sm font-medium transition-all"
            >
              Save Changes
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
    <div className="flex items-center justify-between py-1.5">
      <div>
        <p className="text-white font-medium text-sm">{label}</p>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
