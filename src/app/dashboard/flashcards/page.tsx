"use client";

import React, { useState, useEffect, Suspense } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp, Flashcard } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";
import { 
  Layers, 
  Plus, 
  Check, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Trash2,
  BookmarkCheck
} from "lucide-react";

function FlashcardsContent() {
  const { notes, flashcards, addFlashcard, toggleFlashcardLearned, deleteFlashcard } = useApp();
  const searchParams = useSearchParams();
  const noteIdParam = searchParams.get("noteId");

  // States
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Custom manual flashcard creator fields
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [showCreator, setShowCreator] = useState(false);

  // Sync selected note from URL query parameter
  useEffect(() => {
    if (noteIdParam) {
      setSelectedNoteId(noteIdParam);
    } else if (notes.length > 0) {
      setSelectedNoteId(notes[0].id);
    }
  }, [noteIdParam, notes]);

  // Reset indices on note swap
  useEffect(() => {
    setActiveIdx(0);
    setIsFlipped(false);
  }, [selectedNoteId]);

  const selectedNote = notes.find(n => n.id === selectedNoteId);

  // Filter flashcards matching selected note
  const activeCards = flashcards.filter(c => c.noteId === selectedNoteId);

  const handleNext = () => {
    if (activeIdx < activeCards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setActiveIdx(activeIdx + 1);
      }, 150);
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setActiveIdx(activeIdx - 1);
      }, 150);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront || !newBack || !selectedNoteId) return;
    
    addFlashcard(selectedNoteId, newFront, newBack);
    setNewFront("");
    setNewBack("");
    setShowCreator(false);
    
    // Jump to the newly created card
    setTimeout(() => {
      setActiveIdx(activeCards.length); // length index points to the new append
    }, 100);
  };

  const currentCard = activeCards[activeIdx];
  const totalCards = activeCards.length;

  const learnedCount = activeCards.filter(c => c.learned).length;
  const progressPercent = totalCards > 0 ? Math.round((learnedCount / totalCards) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Interactive Flashcards</h1>
          <p className="text-slate-400 text-xs mt-1">Master active recall and spaced repetition concepts.</p>
        </div>
        <button
          onClick={() => setShowCreator(!showCreator)}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-500/10 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Create Custom Card
        </button>
      </div>

      {/* Main Flashcard View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Note selection & Stats */}
        <div className="space-y-6 col-span-1">
          <div className="glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Deck Configurator
            </h3>
            
            {/* Note Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Select Deck</label>
              {notes.length === 0 ? (
                <div className="text-xs text-red-400 italic">No notes uploaded.</div>
              ) : (
                <select
                  value={selectedNoteId}
                  onChange={(e) => setSelectedNoteId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  {notes.map(n => (
                    <option key={n.id} value={n.id}>{n.name} ({n.subject})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Deck statistics */}
            {totalCards > 0 && (
              <div className="space-y-4 border-t border-slate-200/40 dark:border-slate-800 pt-4 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <span>Learned Cards</span>
                  <span className="text-emerald-500">{learnedCount} / {totalCards}</span>
                </div>
                
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                    <span>Mastery Progress</span>
                    <span>{progressPercent}% Complete</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Create custom flashcard form */}
          {showCreator && (
            <div className="glass-panel p-6 rounded-2xl space-y-4 animate-in slide-in-from-top-3 duration-200">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" /> New Flashcard
              </h3>
              <form onSubmit={handleCreateCard} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Question (Front)</label>
                  <textarea
                    placeholder="e.g. What is DBMS 1NF?"
                    value={newFront}
                    onChange={(e) => setNewFront(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Answer (Back)</label>
                  <textarea
                    placeholder="e.g. First Normal Form requires all fields to be atomic..."
                    value={newBack}
                    onChange={(e) => setNewBack(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-indigo-650 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold"
                  >
                    Add Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreator(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-850 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Side: 3D Flipping Deck */}
        <div className="lg:col-span-2 space-y-6">
          {totalCards === 0 ? (
            <div className="text-center py-20 border border-dashed border-slate-200/50 dark:border-slate-800/50 rounded-2xl bg-white/30 dark:bg-slate-900/10">
              <Layers className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-semibold">No flashcards generated.</p>
              <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto leading-normal">
                Upload notes and click generated flashcard options to construct a spacing deck automatically, or write one manually using the form.
              </p>
            </div>
          ) : (
            <div className="space-y-6 flex flex-col items-center">
              
              {/* Perspective 3D Card Holder */}
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full h-80 perspective-1000 cursor-pointer group"
              >
                <div 
                  className={`w-full h-full duration-500 transform-style-3d relative transition-transform ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                >
                  
                  {/* CARD FRONT CONTAINER */}
                  <div className="absolute inset-0 backface-hidden glass-panel rounded-2xl p-8 flex flex-col justify-between border-2 border-indigo-500/20 shadow-lg select-none">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                      <span>Question (Front)</span>
                      <span>Card {activeIdx + 1} of {totalCards}</span>
                    </div>
                    
                    <div className="text-center font-bold text-base text-slate-800 dark:text-slate-100 leading-relaxed px-4">
                      {currentCard.front}
                    </div>

                    <div className="flex justify-center items-center gap-1.5 text-[10px] font-bold text-indigo-500">
                      <RotateCw className="w-3.5 h-3.5 animate-spin-slow" /> Click to Flip Card
                    </div>
                  </div>

                  {/* CARD BACK CONTAINER */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel rounded-2xl p-8 flex flex-col justify-between border-2 border-emerald-500/25 shadow-lg select-none">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
                      <span>Answer (Back)</span>
                      <span>Card {activeIdx + 1} of {totalCards}</span>
                    </div>

                    <div className="text-center text-xs leading-relaxed text-slate-700 dark:text-slate-350 px-4 max-h-[160px] overflow-y-auto">
                      {currentCard.back}
                    </div>

                    <div className="flex justify-between items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFlashcard(currentCard.id);
                          if (activeIdx > 0) setActiveIdx(activeIdx - 1);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Delete Card"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFlashcardLearned(currentCard.id);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                          currentCard.learned
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 dark:text-slate-300"
                        }`}
                      >
                        {currentCard.learned ? <><Check className="w-3.5 h-3.5" /> Learned</> : <><BookmarkCheck className="w-3.5 h-3.5" /> Mark Learned</>}
                      </button>
                    </div>

                  </div>

                </div>
              </div>

              {/* Navigation Arrows Row */}
              <div className="flex gap-4 items-center">
                <button
                  onClick={handlePrev}
                  disabled={activeIdx === 0}
                  className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:scale-105 active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-semibold text-slate-400">
                  {activeIdx + 1} / {totalCards}
                </span>
                <button
                  onClick={handleNext}
                  disabled={activeIdx === totalCards - 1}
                  className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:scale-105 active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    }>
      <FlashcardsContent />
    </Suspense>
  );
}
