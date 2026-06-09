"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ThemeToggle } from "./ThemeToggle";
import { Bell, Search, Menu, LogOut, User, Settings, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  setMobileOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setMobileOpen }) => {
  const { user, notifications, markNotificationsRead, logout } = useApp();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
      
      {/* Search Bar / Mobile Toggler */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 rounded-lg md:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notes, summaries, flashcards... (Ctrl+K)"
            className="w-full pl-9 pr-4 py-1.5 rounded-lg text-sm bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all"
            disabled
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center h-5 select-none pointer-events-none px-1.5 text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-700 rounded shadow-sm">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Notifications Icon & Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all relative"
            aria-label="View Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[9px] font-bold text-white bg-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      markNotificationsRead();
                      setShowNotifications(false);
                    }}
                    className="text-xs text-indigo-500 hover:text-indigo-600 font-medium flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 border-b border-slate-50 dark:border-slate-700/40 text-xs transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-750/30 ${
                        !notif.read ? "bg-indigo-50/20 dark:bg-indigo-950/10 font-medium" : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <p>{notif.text}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-normal">{notif.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center focus:outline-none"
            >
              <img
                src={user.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=avatar"}
                alt="Avatar"
                className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 dark:border-indigo-800 cursor-pointer object-cover"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 py-1.5 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-400 font-normal">Signed in as</p>
                  <p className="text-sm font-semibold truncate mt-0.5">{user.displayName}</p>
                </div>
                
                <Link
                  href="/dashboard/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <User className="w-4 h-4" /> Profile
                </Link>

                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  <Settings className="w-4 h-4" /> Settings
                </Link>

                <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
