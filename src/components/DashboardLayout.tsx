"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Check Auth State on mount
  useEffect(() => {
    // Wait a brief tick to let AppContext restore localStorage
    const timeout = setTimeout(() => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        router.push("/login");
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [router]);

  if (!user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading student workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden mesh-bg text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Sidebar (Desktop Collapsible & Mobile Drawer) */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <Navbar setMobileOpen={setMobileSidebarOpen} />

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 focus:outline-none scroll-smooth">
          <div className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
