"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { 
  Settings, 
  Bell, 
  Eye, 
  ShieldAlert, 
  Check, 
  RefreshCw,
  Moon,
  Sun
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { theme, toggleTheme, logout } = useApp();
  const router = useRouter();

  // Settings state controls
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [streakWarnings, setStreakWarnings] = useState(true);
  const [quizReminders, setQuizReminders] = useState(false);
  const [privacyMode, setPrivacyMode] = useState("Private");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to restore defaults? All uploaded notes and saved summaries will be wiped.")) {
      localStorage.clear();
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert("EduMind database reset successful.");
        window.location.reload();
      }, 500);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("CRITICAL WARNING: Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
      localStorage.clear();
      logout();
      router.push("/");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-3xl mx-auto">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Platform Settings</h1>
          <p className="text-slate-400 text-xs mt-1">Configure layout notifications, study privacy, and data purges.</p>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          
          {/* Section 1: Themes & Styling */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Settings className="w-4.5 h-4.5 text-indigo-500" /> Interface Customizer
            </h3>
            
            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold">Workspace Theme Mode</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Toggle light or dark styling elements globally</p>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl font-semibold flex items-center gap-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-900 active:scale-95"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="w-4 h-4 text-indigo-500" /> Switch to Dark
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4 text-amber-450" /> Switch to Light
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Notifications checkbox alerts */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Bell className="w-4.5 h-4.5 text-violet-500" /> Notifications Alerts
            </h3>

            <div className="space-y-3.5 text-xs">
              
              <label className="flex items-center justify-between cursor-pointer select-none">
                <div>
                  <p className="font-semibold">Weekly study progress summaries</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Receive performance metrics and analytics on Sunday evenings</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-350 dark:border-slate-700 text-indigo-650"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <div>
                  <p className="font-semibold">Daily streak loss alert warnings</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Warn when streak is about to reset (24 hour period limit)</p>
                </div>
                <input
                  type="checkbox"
                  checked={streakWarnings}
                  onChange={(e) => setStreakWarnings(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-350 dark:border-slate-700 text-indigo-650"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer select-none">
                <div>
                  <p className="font-semibold">Practice test quiz notifications</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Remind to study when mock tests or planners are pending</p>
                </div>
                <input
                  type="checkbox"
                  checked={quizReminders}
                  onChange={(e) => setQuizReminders(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-350 dark:border-slate-700 text-indigo-650"
                />
              </label>

            </div>
          </div>

          {/* Section 3: Privacy & Account visibility */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Eye className="w-4.5 h-4.5 text-cyan-500" /> Space Privacy
            </h3>

            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold">Profile Privacy Mode</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Control whether coaching tutors can review your notes and plans</p>
              </div>

              <select
                value={privacyMode}
                onChange={(e) => setPrivacyMode(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold focus:outline-none"
              >
                <option value="Private">Private Space</option>
                <option value="Public">Public Sharing</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              {saved ? <><Check className="w-4 h-4" /> Settings Saved</> : "Save Configurations"}
            </button>
          </div>

        </form>

        {/* Section 4: Critical Actions zone */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 border-l-4 border-l-red-500">
          <h3 className="font-bold text-sm text-red-500 flex items-center gap-2 border-b border-red-500/10 pb-3">
            <ShieldAlert className="w-4.5 h-4.5 text-red-500" /> Critical Operations Area
          </h3>

          <div className="space-y-4 text-xs">
            
            {/* Reset data */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-100 dark:border-slate-850/60 pb-3">
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-200">Clear Space Cache Database</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Resets study cards, chat files, and streak logs back to defaults</p>
              </div>
              <button
                type="button"
                onClick={handleResetData}
                disabled={loading}
                className="px-4 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 rounded-xl font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Clear Cache Database
              </button>
            </div>

            {/* Delete Account */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
              <div>
                <p className="font-semibold text-red-500">Permanently Delete Account</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Wipes user credentials and logged database assets from Vercel</p>
              </div>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="px-4 py-2.5 bg-red-500 hover:bg-red-650 text-white rounded-xl font-bold active:scale-95 transition-all cursor-pointer"
              >
                Delete Account
              </button>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
