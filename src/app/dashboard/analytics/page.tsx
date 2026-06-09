"use client";

import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { 
  Flame, 
  Clock, 
  Award, 
  Layers, 
  TrendingUp, 
  Calendar,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar
} from "recharts";

export default function AnalyticsPage() {
  const { 
    notes, 
    summaries, 
    mcqSets, 
    flashcards, 
    quizAttempts, 
    streak, 
    studyHours 
  } = useApp();

  const totalAssets = notes.length + summaries.length + flashcards.length;

  // Pie chart asset allocation data
  const pieData = [
    { name: "My Notes", value: notes.length || 1, color: "#4F46E5" },
    { name: "Summaries", value: summaries.length || 1, color: "#7C3AED" },
    { name: "Flashcards", value: flashcards.length || 1, color: "#06B6D4" },
    { name: "Practice MCQs", value: mcqSets.length || 1, color: "#10B981" }
  ];

  // Weekly focus hour details
  const weeklyFocusData = [
    { name: "Mon", hours: 2.5 },
    { name: "Tue", hours: 3.2 },
    { name: "Wed", hours: 1.8 },
    { name: "Thu", hours: 4.0 },
    { name: "Fri", hours: 2.2 },
    { name: "Sat", hours: 3.5 },
    { name: "Sun", hours: 1.3 }
  ];

  // Dynamic Quiz score line chart (mapping actual user attempts, or default fallback)
  const quizScoresData = quizAttempts.length > 0 
    ? quizAttempts.map((att, idx) => ({ attempt: `Quiz #${idx+1}`, percentage: att.percentage }))
    : [
        { attempt: "Quiz #1", percentage: 70 },
        { attempt: "Quiz #2", percentage: 80 },
        { attempt: "Quiz #3", percentage: 90 },
        { attempt: "Quiz #4", percentage: 95 }
      ];

  // Grid list representing visual streak heatmaps
  const daysArray = Array.from({ length: 42 }, (_, i) => {
    const dayIndex = i - 4; // offset to fit month visually
    const isActive = dayIndex > 0 && dayIndex <= streak; // match streak
    const isPastActivity = dayIndex > 0 && (dayIndex % 3 === 0 || dayIndex % 7 === 0);
    return {
      day: dayIndex > 0 ? dayIndex : "",
      active: isActive || isPastActivity
    };
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Learning Analytics</h1>
          <p className="text-slate-400 text-xs mt-1">Review statistical study logs, focus hours, and exam scores.</p>
        </div>

        {/* Top KPIs Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-l-4 border-l-amber-500">
            <div>
              <p className="text-xs font-semibold text-slate-400">Streak Status</p>
              <h3 className="text-xl font-bold mt-1.5">{streak} Days</h3>
            </div>
            <span className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-5 h-5 animate-pulse" />
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-l-4 border-l-indigo-500">
            <div>
              <p className="text-xs font-semibold text-slate-400">Focus Hours</p>
              <h3 className="text-xl font-bold mt-1.5">{studyHours} hrs</h3>
            </div>
            <span className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-l-4 border-l-emerald-500">
            <div>
              <p className="text-xs font-semibold text-slate-400">Avg Score</p>
              <h3 className="text-xl font-bold mt-1.5">
                {quizAttempts.length > 0 
                  ? Math.round(quizAttempts.reduce((acc, att) => acc + att.percentage, 0) / quizAttempts.length)
                  : 85}%
              </h3>
            </div>
            <span className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </span>
          </div>

          <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border-l-4 border-l-purple-500">
            <div>
              <p className="text-xs font-semibold text-slate-400">Total Assets</p>
              <h3 className="text-xl font-bold mt-1.5">{totalAssets} items</h3>
            </div>
            <span className="w-9 h-9 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </span>
          </div>

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 1: Quiz Scores Area Trend */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-500" /> Quiz Grade Trend
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Success percentages across recent practice mock attempts</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={quizScoresData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="attempt" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(15, 23, 42, 0.9)", 
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#F8FAFC",
                      fontSize: "10px"
                    }} 
                  />
                  <Area type="monotone" dataKey="percentage" stroke="#4F46E5" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Asset Allocation Pie Chart */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-violet-500" /> Study Space Assets
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Distribution of notes, summaries, and cards</p>
            </div>
            
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-xs text-slate-400 font-medium">Assets</p>
                <p className="text-xl font-bold">{totalAssets}</p>
              </div>
            </div>

            {/* Labels and legends */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold pt-2 border-t border-slate-200/40 dark:border-slate-800">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Heatmap & Weekly study hours grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Chart 3: Weekly focus hours bar */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-500" /> Weekly Focus Sessions
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Study hours dedicated daily across current week</p>
            </div>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyFocusData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    contentStyle={{ 
                      backgroundColor: "rgba(15, 23, 42, 0.9)", 
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#F8FAFC",
                      fontSize: "10px"
                    }} 
                  />
                  <Bar dataKey="hours" fill="#10B981" radius={[4, 4, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Heatmap Grid */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-500" /> Study Heatmap
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Grid tracking daily focus activities across the last six weeks</p>
            </div>

            <div className="grid grid-cols-7 gap-1 max-w-md mx-auto pt-2">
              {/* Day initials */}
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <span key={i} className="text-center font-bold text-[8px] text-slate-450">{d}</span>
              ))}

              {/* Day blocks */}
              {daysArray.map((cell, idx) => {
                let cellColor = "bg-slate-100 dark:bg-slate-900/50 border border-slate-200/20 dark:border-slate-800/40";
                if (cell.day && cell.active) {
                  cellColor = "bg-indigo-500 dark:bg-indigo-600 border border-indigo-650 shadow-sm";
                }
                
                return (
                  <div 
                    key={idx}
                    className={`h-6 rounded flex items-center justify-center text-[7px] font-bold ${cellColor}`}
                    title={cell.day ? `Day ${cell.day}: Focused` : ""}
                  >
                    {cell.day}
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-between items-center text-[9px] text-slate-400 pt-2 font-medium">
              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-indigo-500" /> Active study logs</span>
              <div className="flex gap-2 items-center">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded bg-slate-150 dark:bg-slate-900" />
                <span className="w-2.5 h-2.5 rounded bg-indigo-500" />
                <span>More</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
