"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp, StudyPlanner } from "@/context/AppContext";
import { 
  Calendar as CalendarIcon, 
  Sparkles, 
  Clock, 
  CheckSquare, 
  ListTodo, 
  Grid,
  RefreshCw,
  Plus,
  Bookmark,
  Check
} from "lucide-react";

export default function PlannerPage() {
  const { planner, setPlannerData } = useApp();

  // Inputs
  const [examDate, setExamDate] = useState(planner?.examDate || "2026-06-25");
  const [subjects, setSubjects] = useState(planner?.subjects || "Machine Learning, DBMS, IoT");
  const [hours, setHours] = useState(planner?.hours || "4");
  const [loading, setLoading] = useState(false);

  // Checked tasks local track for progress checking
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "planner",
          subjects,
          examDate,
          hours
        })
      });
      const data = await response.json();
      
      if (data.result) {
        setPlannerData({
          examDate,
          subjects,
          hours,
          dailyPlan: data.result.dailyPlan || [],
          weeklySchedule: data.result.weeklySchedule || [],
          revisionTasks: data.result.revisionTasks || []
        });
        setCheckedTasks({});
      }
    } catch (err) {
      console.error(err);
      alert("Error generating schedule. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (taskKey: string) => {
    setCheckedTasks({
      ...checkedTasks,
      [taskKey]: !checkedTasks[taskKey]
    });
  };

  // Compute completion percent
  const totalTasks = (planner?.revisionTasks?.length || 0) + (planner?.dailyPlan?.length || 0);
  const checkedCount = Object.values(checkedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((checkedCount / totalTasks) * 100) : 0;

  // Mock mini Calendar dates list
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Study Planner</h1>
          <p className="text-slate-400 text-xs mt-1">Design customized daily routines, calendar schedules, and revision trackers.</p>
        </div>

        {/* Configurations Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Plan Optimizer
            </h3>
            
            <form onSubmit={handleGeneratePlan} className="space-y-4">
              
              {/* Exam Date */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5" /> Target Exam Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Subjects */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Subjects to cover</label>
                <input
                  type="text"
                  placeholder="e.g. Machine Learning, DBMS, Networking"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {/* Study Hours */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Daily Hours Dedicated
                </label>
                <select
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {[2, 3, 4, 5, 6, 7, 8].map(h => (
                    <option key={h} value={h}>{h} Hours / Day</option>
                  ))}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-650 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Optimizing Planner...
                  </>
                ) : (
                  <>
                    Build Study Schedule <Check className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Right Planner Visual Output Sheets */}
          <div className="lg:col-span-2 space-y-6">
            
            {loading ? (
              <div className="glass-panel p-8 rounded-2xl min-h-[400px] flex flex-col items-center justify-center text-slate-450 gap-4">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold">Generating customized daily planner templates and calendar mappings...</p>
              </div>
            ) : planner ? (
              <div className="space-y-6">
                
                {/* Visual Progress Dashboard Bar */}
                {totalTasks > 0 && (
                  <div className="glass-panel p-4 rounded-xl flex items-center justify-between gap-4 border-l-4 border-l-indigo-500">
                    <div className="text-xs font-bold">
                      <p>Planner Tasks Completion</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{checkedCount} of {totalTasks} milestones met</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-extrabold text-indigo-500">{progressPercent}%</span>
                    </div>
                  </div>
                )}

                {/* Daily Routine checklist */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <ListTodo className="w-4.5 h-4.5 text-indigo-500" /> Daily Focus Routine
                  </h3>
                  <div className="space-y-2">
                    {planner.dailyPlan.map((item, idx) => {
                      const key = `daily-${idx}`;
                      const isChecked = !!checkedTasks[key];
                      return (
                        <div 
                          key={idx} 
                          onClick={() => toggleCheck(key)}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs select-none transition-all ${
                            isChecked 
                              ? "bg-indigo-500/5 border-indigo-500/20 text-slate-400 line-through" 
                              : "bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <span className={`w-4.5 h-4.5 rounded border flex items-center justify-center ${
                            isChecked ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-350 dark:border-slate-700"
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </span>
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Grid Calendar Layout */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Grid className="w-4.5 h-4.5 text-violet-500" /> Calendar Planner Map
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {/* Week headers */}
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(w => (
                      <span key={w} className="text-center font-bold text-[9px] text-slate-400 uppercase py-1">{w}</span>
                    ))}
                    
                    {/* Day cells */}
                    {daysInMonth.map((dayNum) => {
                      // Color code days close to exam date
                      const isExamDay = dayNum === 25;
                      const isMilestone = dayNum % 5 === 0;

                      let cellStyle = "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-850";
                      
                      if (isExamDay) {
                        cellStyle = "bg-red-500 text-white border-red-650 shadow-md font-bold shadow-red-500/20";
                      } else if (isMilestone) {
                        cellStyle = "bg-indigo-500/10 border-indigo-500/25 text-indigo-500 font-bold";
                      }

                      return (
                        <div 
                          key={dayNum} 
                          className={`h-10 rounded-lg flex flex-col justify-between p-1.5 transition-all hover:scale-105 select-none ${cellStyle}`}
                          title={isExamDay ? "Exam Date!" : isMilestone ? "Active Study Review Check" : ""}
                        >
                          <span className="text-[8px] font-bold">{dayNum}</span>
                          {isExamDay && <span className="text-[6px] uppercase font-extrabold text-center">EXAM</span>}
                          {isMilestone && !isExamDay && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 self-end" />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Revision Checklist cards */}
                <div className="glass-panel p-6 rounded-2xl space-y-4">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <CheckSquare className="w-4.5 h-4.5 text-emerald-500" /> High-Yield Revision Tasks
                  </h3>
                  <div className="space-y-2">
                    {planner.revisionTasks.map((item, idx) => {
                      const key = `rev-${idx}`;
                      const isChecked = !!checkedTasks[key];
                      return (
                        <div 
                          key={idx} 
                          onClick={() => toggleCheck(key)}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer text-xs select-none transition-all ${
                            isChecked 
                              ? "bg-indigo-500/5 border-indigo-500/20 text-slate-400 line-through" 
                              : "bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <span className={`w-4.5 h-4.5 rounded border flex items-center justify-center ${
                            isChecked ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-350 dark:border-slate-700"
                          }`}>
                            {isChecked && <Check className="w-3.5 h-3.5" />}
                          </span>
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ) : (
              <div className="glass-panel p-8 rounded-2xl min-h-[400px] flex flex-col items-center justify-center text-slate-400 text-center">
                <CalendarIcon className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-sm font-semibold">No active study plan found.</p>
                <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal">
                  Specify your target exam date, subjects, and study hour limits in the configurator to optimize an AI calendar routine.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
