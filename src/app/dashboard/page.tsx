"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { 
  Flame, 
  Clock, 
  Award, 
  FileText, 
  HelpCircle, 
  Layers, 
  BookOpen, 
  MessageSquare, 
  Upload, 
  ArrowRight,
  Plus,
  Play
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export default function DashboardHome() {
  const { 
    user, 
    notes, 
    summaries, 
    mcqSets, 
    flashcards, 
    quizAttempts, 
    streak, 
    studyHours 
  } = useApp();

  const [showUploadModal, setShowUploadModal] = useState(false);

  // Quick metrics calculations
  const totalNotes = notes.length;
  const totalSummaries = summaries.length;
  const totalMCQs = mcqSets.reduce((acc, set) => acc + set.questions.length, 0);
  const totalFlashcards = flashcards.length;
  const totalQuizzes = quizAttempts.length;

  const averageScore = quizAttempts.length > 0 
    ? Math.round(quizAttempts.reduce((acc, att) => acc + att.percentage, 0) / quizAttempts.length)
    : 85; // fallback default premium preview score

  // Weekly study data for Recharts
  const weeklyData = [
    { day: "Mon", hours: 2.5, score: 80 },
    { day: "Tue", hours: 3.2, score: 85 },
    { day: "Wed", hours: 1.8, score: 75 },
    { day: "Thu", hours: 4.0, score: 90 },
    { day: "Fri", hours: 2.2, score: 92 },
    { day: "Sat", hours: 3.5, score: 88 },
    { day: "Sun", hours: 1.3, score: 95 }
  ];

  const quickActions = [
    { name: "Upload Notes", desc: "PDF, DOCX, TXT files", path: "/dashboard/notes", icon: Upload, color: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/15 border-indigo-500/20" },
    { name: "Generate Summary", desc: "Short, medium, detailed summaries", path: "/dashboard/summaries", icon: FileText, color: "bg-violet-500/10 text-violet-500 hover:bg-violet-500/15 border-violet-500/20" },
    { name: "Create Quiz", desc: "Generate custom multiple choice tests", path: "/dashboard/mcqs", icon: HelpCircle, color: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/15 border-cyan-500/20" },
    { name: "Open AI Tutor", desc: "Ask questions on DBMS or ML", path: "/dashboard/tutor", icon: MessageSquare, color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/15 border-purple-500/20" },
    { name: "Create Flashcards", desc: "Interactive active recall decks", path: "/dashboard/flashcards", icon: Layers, color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15 border-emerald-500/20" }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Hello, <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">{user?.displayName || "Student"}</span> 👋
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              Ready to learn smarter today? Here is a summary of your academic progress.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link 
              href="/dashboard/notes"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Upload New Notes
            </Link>
          </div>
        </div>

        {/* Dashboard Statistics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Study Streak */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 dark:bg-amber-500/10 rounded-bl-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-500 animate-bounce" />
            </div>
            <p className="text-xs font-semibold text-slate-400">Study Streak</p>
            <h3 className="text-2xl font-bold mt-2">{streak} Days</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Keep it up to build habits! 🔥</p>
          </div>

          {/* Card 2: Study Hours */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-bl-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-indigo-500" />
            </div>
            <p className="text-xs font-semibold text-slate-400">Study Hours</p>
            <h3 className="text-2xl font-bold mt-2">{studyHours} hrs</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Recorded focus sessions ⏱️</p>
          </div>

          {/* Card 3: Average Quiz Score */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-bl-full flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-xs font-semibold text-slate-400">Average Quiz Score</p>
            <h3 className="text-2xl font-bold mt-2">{averageScore}%</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Across all mock tests 🎯</p>
          </div>

          {/* Card 4: Study Assets Count */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 dark:bg-purple-500/10 rounded-bl-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-xs font-semibold text-slate-400">Total Study Assets</p>
            <h3 className="text-2xl font-bold mt-2">{totalNotes + totalSummaries + totalFlashcards}</h3>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Notes, cards, and summaries 📚</p>
          </div>

        </div>

        {/* Quick Actions Bar */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Link
                  key={i}
                  href={action.path}
                  className={`p-4 rounded-xl border flex flex-col items-center text-center group transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${action.color}`}
                >
                  <Icon className="w-6 h-6 mb-2.5 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-bold">{action.name}</span>
                  <span className="text-[9px] opacity-70 mt-1 leading-normal hidden sm:block">{action.desc}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Chart Visualizations & Recent Updates grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Study analytics chart (Recharts) */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm">Study Engagement</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Hours focused and average score percentage per day</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-semibold">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Hours Focused</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Quiz Scores</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(15, 23, 42, 0.9)", 
                      borderColor: "rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                      color: "#F8FAFC",
                      fontSize: "10px"
                    }} 
                  />
                  <Bar dataKey="hours" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="score" fill="#06B6D4" radius={[4, 4, 0, 0]} barSize={12} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Academic subject breakdowns & Recent attempts */}
          <div className="glass-panel p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="font-bold text-sm">Course Coverage</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Progress estimations based on notes & quizzes</p>
            </div>

            <div className="space-y-4">
              
              {/* Subject 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Machine Learning</span>
                  <span className="text-indigo-500">80%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: "80%" }} />
                </div>
              </div>

              {/* Subject 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Database Systems</span>
                  <span className="text-violet-500">65%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              {/* Subject 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span>Internet of Things (IoT)</span>
                  <span className="text-emerald-500">40%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" style={{ width: "40%" }} />
                </div>
              </div>

            </div>

            <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-5 space-y-3">
              <h4 className="font-bold text-xs">Recent Quizzes</h4>
              
              {quizAttempts.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No quizzes completed yet. Go to MCQs to start.</p>
              ) : (
                <div className="space-y-2">
                  {quizAttempts.slice(0, 2).map((attempt) => (
                    <div 
                      key={attempt.id} 
                      className="flex justify-between items-center p-2 rounded-lg bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/20 dark:border-slate-700/20 text-xs"
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="font-semibold truncate">{attempt.title}</p>
                        <span className="text-[10px] text-slate-400">{attempt.date}</span>
                      </div>
                      <span className={`font-bold ${attempt.percentage >= 80 ? "text-emerald-500" : "text-amber-500"}`}>
                        {attempt.score}/{attempt.totalQuestions}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
