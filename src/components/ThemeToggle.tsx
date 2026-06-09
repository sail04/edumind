"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 animate-pulse" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
      )}
    </button>
  );
};
