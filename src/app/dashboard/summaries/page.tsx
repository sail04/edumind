"use client";

import React, { useState, useEffect, Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp, AISummary } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Download, 
  Save, 
  Check, 
  ChevronRight, 
  BookOpen,
  ArrowRight,
  RefreshCw,
  Trash2
} from "lucide-react";

// Inner component to safely consume search parameters inside Suspense
function SummariesContent() {
  const { notes, summaries, addSummary, deleteSummary } = useApp();
  const searchParams = useSearchParams();
  const noteIdParam = searchParams.get("noteId");

  // States
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [length, setLength] = useState<"short" | "medium" | "detailed">("medium");
  const [loading, setLoading] = useState(false);
  const [activeSummaryText, setActiveSummaryText] = useState("");
  const [copied, setCopied] = useState(false);
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
    setActiveSummaryText("");
    setSaved(false);
    setCopied(false);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "summary",
          content: selectedNote.content,
          length: length
        })
      });
      const data = await response.json();
      setActiveSummaryText(data.result || "Could not generate summary.");
    } catch (e) {
      console.error(e);
      setActiveSummaryText("Error reaching Gemini model. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!activeSummaryText) return;
    navigator.clipboard.writeText(activeSummaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!activeSummaryText || !selectedNote) return;
    const blob = new Blob([activeSummaryText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedNote.name.replace(/\.[^/.]+$/, "")}_summary_${length}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (!activeSummaryText || !selectedNote) return;
    addSummary(selectedNote.id, `Summary: ${selectedNote.name.replace(/\.[^/.]+$/, "")}`, length, activeSummaryText);
    setSaved(true);
  };

  // Find saved summaries for active note
  const savedSummaries = summaries.filter(s => s.noteId === selectedNoteId);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Summary Generator</h1>
        <p className="text-slate-400 text-xs mt-1">Generate short, medium, or detailed study guides from your uploads.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Config Panel */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> Configurator
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
                    setActiveSummaryText("");
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

            {/* Length Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Summary Length</label>
              <div className="grid grid-cols-3 gap-2">
                {(["short", "medium", "detailed"] as const).map((len) => (
                  <button
                    key={len}
                    onClick={() => setLength(len)}
                    className={`py-2 rounded-xl text-[10px] font-semibold uppercase tracking-wider transition-all border ${
                      length === len
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-250 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850"
                    }`}
                  >
                    {len}
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
                  <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing...
                </>
              ) : (
                <>
                  Generate AI Summary <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Saved Summaries for Selected Note */}
          {savedSummaries.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-500" /> Saved Summaries ({savedSummaries.length})
              </h3>
              <div className="space-y-2">
                {savedSummaries.map(s => (
                  <div 
                    key={s.id} 
                    className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/20 dark:border-slate-700/20 text-xs hover:bg-slate-100/30 dark:hover:bg-slate-850/30 transition-all group"
                  >
                    <button
                      onClick={() => {
                        setActiveSummaryText(s.content);
                        setLength(s.length as any);
                        setSaved(true);
                      }}
                      className="text-left font-medium truncate flex-1 pr-2 hover:text-indigo-500"
                    >
                      {s.title} ({s.length})
                    </button>
                    <button
                      onClick={() => deleteSummary(s.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Output Reading Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl min-h-[400px] flex flex-col justify-between overflow-hidden">
            
            {/* Header / Actions */}
            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/40 dark:border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Reader View
              </span>
              
              {activeSummaryText && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 text-[10px]"
                    title="Copy to Clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Download Markdown"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:text-emerald-500"
                    title="Save Summary"
                  >
                    {saved ? <Check className="w-4 h-4 text-emerald-500" /> : <Save className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {/* Content reading container */}
            <div className="flex-1 p-8 overflow-y-auto">
              {loading ? (
                <div className="space-y-6">
                  {/* skeleton summary loader */}
                  <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  <div className="space-y-3 pt-4">
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                  </div>
                  <div className="space-y-3 pt-6 animate-pulse delay-100">
                    <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
                  </div>
                </div>
              ) : activeSummaryText ? (
                <div className="prose prose-sm dark:prose-invert max-w-none text-xs leading-relaxed space-y-6 select-text">
                  
                  {/* Procedural rendering of basic generated summary segments */}
                  {activeSummaryText.split("\n\n").map((para, i) => {
                    if (para.startsWith("## ")) {
                      return <h2 key={i} className="text-xl font-bold text-indigo-500 border-b border-slate-100 dark:border-slate-800 pb-2">{para.replace("## ", "")}</h2>;
                    }
                    if (para.startsWith("### ")) {
                      return <h3 key={i} className="text-base font-bold text-violet-500 pt-2">{para.replace("### ", "")}</h3>;
                    }
                    if (para.startsWith("#### ")) {
                      return <h4 key={i} className="text-sm font-bold text-fuchsia-500 pt-1">{para.replace("#### ", "")}</h4>;
                    }
                    if (para.startsWith("- ")) {
                      return (
                        <ul key={i} className="list-disc pl-5 space-y-2">
                          {para.split("\n").map((li, liI) => (
                            <li key={liI}>{li.replace("- ", "").replace(/\*\*(.*?)\*\*/g, "$1")}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={i} className="text-slate-650 dark:text-slate-350">{para}</p>;
                  })}

                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center py-12">
                  <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="text-sm font-semibold">Ready to Synthesize</p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-xs leading-normal">
                    Select a note and length in the configurator, then generate a detailed AI breakdown.
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

export default function SummariesPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    }>
      <SummariesContent />
    </Suspense>
  );
}
