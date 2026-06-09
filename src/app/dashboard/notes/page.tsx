"use client";

import React, { useState, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp, StudyNote } from "@/context/AppContext";
import { 
  Upload, 
  FileText, 
  Trash2, 
  Brain, 
  HelpCircle, 
  Layers, 
  Eye,
  Plus,
  X,
  FileCode,
  Calendar,
  Layers3
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotesPage() {
  const { notes, addNote, deleteNote } = useApp();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedNote, setSelectedNote] = useState<StudyNote | null>(null);
  
  // Custom new note form details
  const [customSubject, setCustomSubject] = useState("General");
  const [customFileName, setCustomFileName] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateUpload = (fileName: string) => {
    setUploading(true);
    setUploadProgress(10);
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Determine content type based on name
            let content = "General study note guidelines. Active recall is the most effective memory technique.";
            let subject = customSubject;
            
            const lowerName = fileName.toLowerCase();
            if (lowerName.includes("machine") || lowerName.includes("ml") || lowerName.includes("ai")) {
              subject = "Machine Learning";
              content = "Machine learning (ML) algorithm models. Linear regression fits y = mx + c. Supervised classifications map discrete class tags. K-Means forms centroids. Neural network backpropagation runs gradient descent optimizations.";
            } else if (lowerName.includes("dbms") || lowerName.includes("normal")) {
              subject = "DBMS";
              content = "Database Normalization rules. First normal form avoids multi-valued entries. Second normal form removes partial keys. Third normal form blocks transitive dependencies. BCNF guarantees determinants are candidate keys.";
            } else if (lowerName.includes("iot") || lowerName.includes("internet")) {
              subject = "IoT";
              content = "Internet of Things architectures. Perception layer triggers actuators and temperature sensors. Network layer transports data via LoRaWAN and MQTT protocols. Gateways connect nodes to remote clouds.";
            }

            const size = Math.round((Math.random() * 20 + 5) * 10) / 10 + " KB";
            const ext = fileName.split(".").pop() || "txt";

            addNote(fileName, subject, size, content, ext);
            
            setUploading(false);
            setUploadProgress(0);
            setCustomFileName("");
          }, 400);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      simulateUpload(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      simulateUpload(file.name);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customFileName) return;
    const nameWithExt = customFileName.includes(".") ? customFileName : `${customFileName}.txt`;
    simulateUpload(nameWithExt);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Study Notes</h1>
            <p className="text-slate-400 text-xs mt-1">Upload and coordinate your textbooks, PDFs, and notes files.</p>
          </div>
        </div>

        {/* Upload Zone & Manual Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Drag & Drop Area */}
          <div className="lg:col-span-2">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`h-48 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-6 ${
                dragActive
                  ? "border-indigo-500 bg-indigo-500/5"
                  : "border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/30 hover:border-indigo-500/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {uploading ? (
                <div className="w-full max-w-xs text-center space-y-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Uploading your file...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-150" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Drag & drop your files here, or <span className="text-indigo-500 hover:underline">browse</span></p>
                    <p className="text-[10px] text-slate-400 mt-1">Supports PDF, DOCX, and TXT (Max 10MB)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Manual Upload Config */}
          <div className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
            <h3 className="font-bold text-sm mb-4">Upload Meta-Settings</h3>
            <form onSubmit={handleManualAdd} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Subject Tag</label>
                <select 
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="DBMS">Database Systems (DBMS)</option>
                  <option value="IoT">Internet of Things (IoT)</option>
                  <option value="Physics">Physics</option>
                  <option value="General">General Study</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Custom File Name</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Chapter_3_Review"
                    value={customFileName}
                    onChange={(e) => setCustomFileName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                  <button 
                    type="submit" 
                    className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
            <div className="text-[10px] text-slate-400 leading-normal border-t border-slate-200/40 dark:border-slate-850 pt-3 mt-3">
              📝 Select a subject and type a name, then click the plus button to simulate text file extraction immediately.
            </div>
          </div>

        </div>

        {/* Notes Grid Cards list */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">Uploaded Material ({notes.length})</h2>
          
          {notes.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200/50 dark:border-slate-800/50 rounded-2xl">
              <p className="text-sm text-slate-400">No notes found. Upload a file above to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <div 
                  key={note.id} 
                  className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.02] hover:shadow-lg border-l-4 border-l-indigo-500 transition-all duration-300 relative group"
                >
                  <div>
                    {/* Header: Extension & delete button */}
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 uppercase">
                        {note.type}
                      </span>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Delete Note"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Note Title */}
                    <h3 className="font-bold text-sm mt-3 truncate" title={note.name}>
                      {note.name}
                    </h3>
                    
                    {/* Subject category */}
                    <p className="text-[10px] font-semibold text-indigo-500 mt-1">
                      {note.subject}
                    </p>

                    {/* Details row */}
                    <div className="flex gap-4 text-[10px] text-slate-400 mt-4 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {note.uploadDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers3 className="w-3.5 h-3.5" /> {note.size}
                      </span>
                    </div>
                  </div>

                  {/* Quick Shortcuts */}
                  <div className="border-t border-slate-100 dark:border-slate-850 mt-5 pt-4 grid grid-cols-4 gap-2">
                    <button
                      onClick={() => setSelectedNote(note)}
                      className="p-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-500 dark:text-slate-200 rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                      title="Read Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/summaries?noteId=${note.id}`)}
                      className="p-2 bg-indigo-500/10 hover:bg-indigo-500/15 text-indigo-500 rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                      title="Generate AI Summary"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/mcqs?noteId=${note.id}`)}
                      className="p-2 bg-cyan-500/10 hover:bg-cyan-500/15 text-cyan-500 rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                      title="Generate Practice Quizzes"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/flashcards?noteId=${note.id}`)}
                      className="p-2 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-500 rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                      title="Generate Flashcards"
                    >
                      <Layers className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Reader Modal */}
        {selectedNote && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base truncate max-w-md">{selectedNote.name}</h3>
                  <p className="text-[10px] text-indigo-500 font-semibold mt-0.5">{selectedNote.subject}</p>
                </div>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850/60 text-xs leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap select-all font-mono">
                  {selectedNote.content}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/55 flex justify-end gap-3">
                <button
                  onClick={() => {
                    const id = selectedNote.id;
                    setSelectedNote(null);
                    router.push(`/dashboard/summaries?noteId=${id}`);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" /> Generate Summary
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
