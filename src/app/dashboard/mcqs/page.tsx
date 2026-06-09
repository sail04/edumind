"use client";

import React, { useState, useEffect, Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp, MCQQuestion } from "@/context/AppContext";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Sparkles, 
  HelpCircle, 
  Play, 
  Download, 
  Save, 
  Check, 
  Plus, 
  Trash2,
  RefreshCw,
  ArrowRight
} from "lucide-react";

function MCQsContent() {
  const { notes, mcqSets, addMCQSet } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteIdParam = searchParams.get("noteId");

  // States
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [count, setCount] = useState<10 | 20 | 30>(10);
  const [loading, setLoading] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<MCQQuestion[]>([]);
  const [saved, setSaved] = useState(false);

  // Sync selected note from URL query parameter
  useEffect(() => {
    if (noteIdParam) {
      setSelectedNoteId(noteIdParam);
    } else if (notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    }
  }, [noteIdParam, notes]);

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  const handleGenerate = async () => {
    if (!selectedNote) return;
    setLoading(true);
    setActiveQuestions([]);
    setSaved(false);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mcq",
          content: selectedNote.content,
          count: count
        })
      });
      const data = await response.json();
      setActiveQuestions(data.result || []);
    } catch (e) {
      console.error(e);
      alert("Error generating MCQs. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (activeQuestions.length === 0 || !selectedNote) return;
    addMCQSet(selectedNote.id, `MCQs: ${selectedNote.name.replace(/\.[^/.]+$/, "")}`, activeQuestions);
    setSaved(true);
  };

  const handleStartQuiz = () => {
    if (activeQuestions.length === 0 || !selectedNote) return;
    
    // Store questions locally for the Quiz page to consume
    localStorage.setItem("active_quiz_title", `MCQs: ${selectedNote.name.replace(/\.[^/.]+$/, "")}`);
    localStorage.setItem("active_quiz_questions", JSON.stringify(activeQuestions));
    
    router.push("/dashboard/quiz");
  };

  const handleExportPDF = () => {
    window.print();
  };

  // Saved MCQ Sets for active note
  const savedSets = mcqSets.filter(s => s.noteId === selectedNoteId);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI MCQ Generator</h1>
        <p className="text-slate-400 text-xs mt-1">Generate multi-choice question assessments from notes to practice active recalling.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Form Control Panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> MCQ Config
            </h3>
            
            {/* Note Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Select Material</label>
              {notes.length === 0 ? (
                <div className="text-xs text-red-400 italic">No notes uploaded. Go to My Notes to add some.</div>
              ) : (
                <select
                  value={selectedNoteId}
                  onChange={(e) => {
                    setSelectedNoteId(e.target.value);
                    setActiveQuestions([]);
                    setSaved(false);
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {notes.map(n => (
                    <option key={n.id} value={n.id}>{n.name} ({n.subject})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Question Count Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Question count</label>
              <div className="grid grid-cols-3 gap-2">
                {([10, 20, 30] as const).map((qCount) => (
                  <button
                    key={qCount}
                    onClick={() => setCount(qCount)}
                    className={`py-2 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all border ${
                      count === qCount
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-250 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-855"
                    }`}
                  >
                    {qCount} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !selectedNote}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Questions...
                </>
              ) : (
                <>
                  Generate MCQs <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Saved MCQ Sets List */}
          {savedSets.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-violet-500" /> Saved Quizzes ({savedSets.length})
              </h3>
              <div className="space-y-2">
                {savedSets.map(s => (
                  <div 
                    key={s.id} 
                    className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/20 dark:border-slate-700/20 text-xs hover:bg-slate-100/30 dark:hover:bg-slate-850/30 transition-all"
                  >
                    <button
                      onClick={() => {
                        setActiveQuestions(s.questions);
                        setSaved(true);
                      }}
                      className="text-left font-medium truncate flex-1 pr-2 hover:text-indigo-500"
                    >
                      {s.title} ({s.questions.length} Qs)
                    </button>
                    <button
                      onClick={() => {
                        localStorage.setItem("active_quiz_title", s.title);
                        localStorage.setItem("active_quiz_questions", JSON.stringify(s.questions));
                        router.push("/dashboard/quiz");
                      }}
                      className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 rounded-lg hover:scale-105"
                      title="Start Quiz"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Output Questions Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl min-h-[400px] flex flex-col justify-between overflow-hidden">
            
            {/* Header / Actions */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/40 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question Sheet View
              </span>
              
              {activeQuestions.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleExportPDF}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-[10px] font-semibold"
                    title="Print / Export PDF"
                  >
                    <Download className="w-4 h-4" /> PDF
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-[10px] font-semibold disabled:text-emerald-500"
                    title="Save MCQ Set"
                  >
                    {saved ? <><Check className="w-4 h-4 text-emerald-500" /> Saved</> : <><Save className="w-4 h-4" /> Save</>}
                  </button>
                  <button
                    onClick={handleStartQuiz}
                    className="p-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 text-[10px] font-bold shadow-md shadow-indigo-500/10 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Start Quiz
                  </button>
                </div>
              )}
            </div>

            {/* Questions List Render */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {loading ? (
                <div className="space-y-6">
                  {/* loading skeleton */}
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-3 p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/10">
                      <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activeQuestions.length > 0 ? (
                <div className="space-y-6">
                  {activeQuestions.map((q, idx) => (
                    <div 
                      key={idx} 
                      className="p-5 border border-slate-200/50 dark:border-slate-800/60 rounded-xl bg-white dark:bg-slate-900/40 space-y-3"
                    >
                      <h4 className="font-bold text-sm leading-relaxed text-slate-800 dark:text-slate-100">
                        {q.question}
                      </h4>
                      
                      {/* Options A-D Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const letters = ["A", "B", "C", "D"];
                          const isCorrect = letters[optIdx] === q.correctAnswer;
                          return (
                            <div 
                              key={optIdx} 
                              className={`p-2.5 rounded-lg border text-xs flex gap-2 ${
                                isCorrect 
                                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-semibold"
                                  : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850"
                              }`}
                            >
                              <span className="font-bold">{letters[optIdx]}.</span>
                              <span>{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="p-3 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-500/10 rounded-lg text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                          <span className="font-bold text-indigo-500 dark:text-indigo-400">Explanation:</span> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-12">
                  <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3 animate-bounce" />
                  <p className="text-sm font-semibold">Generate Practice Questions</p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal">
                    Select a note and counts in the config panel, then compile a custom question bank sheet.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function MCQsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    }>
      <MCQsContent />
    </Suspense>
  );
}
