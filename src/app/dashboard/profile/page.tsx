"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { User, BookOpen, Target, Sparkles, Key, Check, Camera } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile } = useApp();

  // Inputs
  const [name, setName] = useState(user?.displayName || "");
  const [education, setEducation] = useState(user?.education || "");
  const [goals, setGoals] = useState(user?.goals || "");
  const [avatarSeed, setAvatarSeed] = useState(user?.displayName || "Alex");
  const [saved, setSaved] = useState(false);

  // Password fields
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passSaved, setPassSaved] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;
    updateProfile(name, education, goals, avatarUrl);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass || !confirmPass) return;
    if (newPass !== confirmPass) {
      alert("Passwords do not match.");
      return;
    }
    
    // simulated update
    setPassSaved(true);
    setCurrentPass("");
    setNewPass("");
    setConfirmPass("");
    setTimeout(() => setPassSaved(false), 2000);
  };

  const currentAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Student Profile</h1>
          <p className="text-slate-400 text-xs mt-1">Manage display details, education tags, and account password constraints.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Left Side: Avatar display card */}
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="relative group">
              <img
                src={currentAvatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-indigo-500/20 bg-indigo-50/50 dark:bg-slate-950 p-1 object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-base">{user?.displayName}</h3>
              <p className="text-[10px] text-slate-400 font-semibold">{user?.email}</p>
              <p className="text-[10px] text-indigo-500 font-semibold mt-1">{user?.education}</p>
            </div>

            <div className="w-full pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="text-[9px] font-bold text-slate-400 uppercase block text-left">Avatar seed identifier</label>
              <input
                type="text"
                value={avatarSeed}
                onChange={(e) => setAvatarSeed(e.target.value)}
                placeholder="Type name to morph avatar"
                className="w-full px-2 py-1.5 rounded-lg text-[10px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center focus:outline-none"
              />
            </div>
          </div>

          {/* Right Side: Profile Details form & Password change */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Update Info Form */}
            <div className="glass-panel p-6 rounded-2xl space-y-5">
              <h3 className="font-bold text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Academic Credentials
              </h3>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Education */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" /> Education Level / Major
                    </label>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="e.g. B.Tech Computer Science"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                </div>

                {/* Goals */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> Learning Goals & Targets
                  </label>
                  <textarea
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="e.g. Master database schemas and pass semester exam with straight A's."
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    {saved ? <><Check className="w-4 h-4" /> Updated</> : "Save Profile Details"}
                  </button>
                </div>
              </form>
            </div>

            {/* Password Update Form */}
            <div className="glass-panel p-6 rounded-2xl space-y-5">
              <h3 className="font-bold text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-3">
                <Key className="w-4 h-4 text-violet-500" /> Account Security
              </h3>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-450 uppercase">Current Password</label>
                      <input
                        type="password"
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-450 uppercase">New Password</label>
                      <input
                        type="password"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-450 uppercase">Confirm Password</label>
                      <input
                        type="password"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none"
                        required
                      />
                    </div>

                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-205 dark:hover:bg-slate-750 rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    {passSaved ? <><Check className="w-4 h-4 text-emerald-500" /> Password Changed</> : "Update Password"}
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
