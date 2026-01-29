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
    <div className="pt-2 pb-6 px-4">
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
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xl p-4 text-center w-full max-w-sm pointer-events-auto">
                <div className="w-12 h-12 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-emerald-600 dark:text-emerald-400 text-xl">✓</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Settings Saved!</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs mb-4">Your preferences have been updated successfully.</p>
                <button
                  onClick={handleToastClose}
                  className="w-full h-7 px-3 text-[10px] bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center shadow-sm hover:shadow-md cursor-pointer border-0"
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
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors text-lg"
            aria-label="Back"
          >
            ←
          </button>
          <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">⚙️ Settings</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-xs mb-3">Customize your experience</p>

        <div className="space-y-3">
          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              🔔 Notifications
            </h3>
            <div className="space-y-3">
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
            className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              🎨 Appearance
            </h3>
            <div className="space-y-3">
              {/* Theme Selector */}
              <div className="py-1">
                <p className="text-slate-900 dark:text-slate-100 font-medium mb-1 text-xs">Theme</p>
                <p className="text-slate-600 dark:text-slate-400 text-xs mb-3">Choose your preferred color scheme</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
                      mounted && resolvedTheme === "light"
                        ? "border-sky-500 bg-sky-500/10"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span className="text-2xl">☀️</span>
                    <span className="text-slate-900 dark:text-slate-100 font-medium text-xs">Light</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
                      mounted && resolvedTheme === "dark"
                        ? "border-sky-500 bg-sky-500/10"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span className="text-2xl">🌙</span>
                    <span className="text-slate-900 dark:text-slate-100 font-medium text-xs">Dark</span>
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
                      mounted && theme === "system"
                        ? "border-sky-500 bg-sky-500/10"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <span className="text-2xl">💻</span>
                    <span className="text-slate-900 dark:text-slate-100 font-medium text-xs">System</span>
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
            className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              📝 Test Preferences
            </h3>
            <div className="space-y-3">
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
            className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800"
          >
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              🌍 Language & Region
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5 text-xs">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-colors"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5 text-xs">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/40 transition-colors"
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
            className="flex justify-end gap-2"
          >
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold transition-all text-xs dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="py-2 px-4 text-xs bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer border-0"
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
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-slate-900 dark:text-slate-100 font-medium text-xs">{label}</p>
        <p className="text-slate-600 dark:text-slate-400 text-xs">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          checked ? "bg-sky-500" : "bg-slate-300 dark:bg-slate-700"
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
