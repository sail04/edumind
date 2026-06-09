"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  HelpCircle,
  Layers,
  MessageSquareCode,
  Calendar,
  BarChart3,
  Target,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useApp();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Notes", path: "/dashboard/notes", icon: BookOpen },
    { name: "Summaries", path: "/dashboard/summaries", icon: FileText },
    { name: "MCQs", path: "/dashboard/mcqs", icon: HelpCircle },
    { name: "Flashcards", path: "/dashboard/flashcards", icon: Layers },
    { name: "AI Tutor", path: "/dashboard/tutor", icon: MessageSquareCode },
    { name: "Study Planner", path: "/dashboard/planner", icon: Calendar },
    { name: "Analytics", path: "/dashboard/analytics", icon: BarChart3 },
    { name: "Exam Prep", path: "/dashboard/examprep", icon: Target },
    { name: "Profile", path: "/dashboard/profile", icon: User },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 text-slate-800 dark:text-slate-100 transition-all duration-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200/50 dark:border-slate-800/50">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
              EduMind
            </span>
          )}
        </Link>
        
        {/* Toggle Collapse Button (Desktop Only) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                  : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-105 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500"}`} />
              
              {!collapsed && <span>{item.name}</span>}
              
              {/* Tooltip for collapsed sidebar */}
              {collapsed && (
                <div className="absolute left-14 scale-0 group-hover:scale-100 transition-all origin-left duration-200 z-50 bg-slate-900 text-white text-xs px-2 py-1.5 rounded shadow-lg pointer-events-none border border-slate-700 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout Footer */}
      <div className="p-3 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
        {!collapsed && user && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/30 dark:border-slate-700/20">
            <img
              src={user.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=avatar"}
              alt="Avatar"
              className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 dark:border-indigo-800"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate leading-tight">{user.displayName}</p>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all w-full group relative`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
          {!collapsed && <span>Logout</span>}
          
          {collapsed && (
            <div className="absolute left-14 scale-0 group-hover:scale-100 transition-all origin-left duration-200 z-50 bg-red-600 text-white text-xs px-2 py-1.5 rounded shadow-lg pointer-events-none whitespace-nowrap">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer Container */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 transform transition-transform duration-300 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop Sidebar Container */}
      <div
        className={`hidden md:block transition-all duration-300 h-screen sticky top-0 flex-shrink-0 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
