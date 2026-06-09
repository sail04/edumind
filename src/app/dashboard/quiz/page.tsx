"use client";

import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp, MCQQuestion } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { 
  Timer, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Award,
  RefreshCw,
  Eye,
  Check,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function QuizPage() {
  const { saveQuizAttempt } = useApp();
  const router = useRouter();

  // Active quiz states loaded from local storage
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Timer states
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Results review detailed accordion state
  const [expandedExplanation, setExpandedExplanation] = useState<Record<number, boolean>>({});

  // Load questions on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTitle = localStorage.getItem("active_quiz_title");
      const storedQuestions = localStorage.getItem("active_quiz_questions");
      
      if (storedTitle && storedQuestions) {
        setQuizTitle(storedTitle);
        setQuestions(JSON.parse(storedQuestions));
      } else {
        // Redirect to MCQs list if no active questions
        router.push("/dashboard/mcqs");
      }
    }
  }, [router]);

  // Start timer
  useEffect(() => {
    if (questions.length > 0 && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [questions, submitted]);

  if (questions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-450">Preparing exam simulation...</p>
        </div>
      </div>
    );
  }

  const activeQuestion = questions[activeIdx];
  const totalQuestions = questions.length;
  const isLastQuestion = activeIdx === totalQuestions - 1;

  const handleSelectOption = (letter: string) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [activeIdx]: letter
    });
  };

  const handleNext = () => {
    if (activeIdx < totalQuestions - 1) {
      setActiveIdx(activeIdx + 1);
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    }
  };

  const handleSubmit = () => {
    if (submitted) return;
    
    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current);

    // Compute results
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    
    let performance = "Needs Study";
    if (percentage >= 90) performance = "Outstanding Knowledge!";
    else if (percentage >= 80) performance = "Excellent understanding.";
    else if (percentage >= 70) performance = "Good performance, slight revision needed.";
    else if (percentage >= 50) performance = "Passed, but review materials.";

    // Save to global logs context
    saveQuizAttempt({
      title: quizTitle,
      score: correctCount,
      totalQuestions,
      timeSpent,
      percentage,
      performance
    });

    setSubmitted(true);

    // Blast premium confetti if passed with high marks
    if (percentage >= 80) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${minutes}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const toggleExplanation = (idx: number) => {
    setExpandedExplanation({
      ...expandedExplanation,
      [idx]: !expandedExplanation[idx]
    });
  };

  // 1. RESULT CARD SCREEN
  if (submitted) {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-8">
          
          {/* Result Score Board */}
          <div className="glass-panel p-8 rounded-2xl text-center space-y-6 relative overflow-hidden border-l-4 border-l-emerald-500">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full flex items-center justify-center">
              <Award className="w-10 h-10 text-emerald-500 animate-pulse" />
            </div>
            
            <h1 className="text-2xl font-extrabold tracking-tight">Practice Complete!</h1>
            
            <div className="inline-flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-indigo-500/25 bg-indigo-500/5 mt-4">
              <span className="text-3xl font-extrabold text-indigo-500">{percentage}%</span>
              <span className="text-[10px] text-slate-400 mt-1 font-semibold">Score: {correctCount}/{totalQuestions}</span>
            </div>

            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                {percentage >= 80 ? "Outstanding Knowledge!" : "Good Try, Review Explanations"}
              </h3>
              <p className="text-[11px] text-slate-400 leading-normal">
                Time Focused: {formatTime(timeSpent)} | Streak Incremented. Complete reviews help build strong memory recall.
              </p>
            </div>

            <div className="flex gap-4 items-center justify-center pt-2">
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setSubmitted(false);
                  setTimeSpent(0);
                  setActiveIdx(0);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 active:scale-[0.98] shadow-md transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Restart Quiz
              </button>
              <button
                onClick={() => router.push("/dashboard/mcqs")}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-xl text-xs font-semibold flex items-center gap-1.5 active:scale-[0.98] border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Quizzes
              </button>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold tracking-tight">Review Explanations</h2>
            
            <div className="space-y-3">
              {questions.map((q, idx) => {
                const userAns = selectedAnswers[idx];
                const isCorrect = userAns === q.correctAnswer;
                const isExpanded = !!expandedExplanation[idx];

                return (
                  <div 
                    key={idx} 
                    className="glass-panel p-5 rounded-2xl border-l-4 transition-all duration-300 space-y-4"
                    style={{ borderLeftColor: isCorrect ? "#10B981" : "#EF4444" }}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isCorrect ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                        }`}>
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                        <h4 className="font-semibold text-xs leading-relaxed text-slate-800 dark:text-slate-100 mt-2">
                          {q.question}
                        </h4>
                      </div>
                      
                      <button
                        onClick={() => toggleExplanation(idx)}
                        className="p-1 text-slate-400 hover:text-slate-650 dark:hover:text-slate-100"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Options status layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const letters = ["A", "B", "C", "D"];
                        const optLetter = letters[optIdx];
                        
                        let borderStyle = "border-slate-250 dark:border-slate-800";
                        let bgStyle = "bg-slate-50/50 dark:bg-slate-950/20";
                        let textStyle = "text-slate-700 dark:text-slate-300";

                        if (optLetter === q.correctAnswer) {
                          borderStyle = "border-emerald-500/40";
                          bgStyle = "bg-emerald-500/10";
                          textStyle = "text-emerald-700 dark:text-emerald-400 font-bold";
                        } else if (optLetter === userAns) {
                          borderStyle = "border-red-500/40";
                          bgStyle = "bg-red-500/10";
                          textStyle = "text-red-700 dark:text-red-400 font-bold";
                        }

                        return (
                          <div key={optIdx} className={`p-2 rounded-lg border flex gap-2 ${bgStyle} ${borderStyle} ${textStyle}`}>
                            <span>{optLetter}.</span>
                            <span>{opt}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation toggle box */}
                    {isExpanded && q.explanation && (
                      <div className="p-3 bg-indigo-50/20 dark:bg-indigo-950/15 border border-indigo-500/10 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 leading-normal animate-in slide-in-from-top-2 duration-150">
                        <span className="font-bold text-indigo-500 dark:text-indigo-400">Recall Explanation:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </DashboardLayout>
    );
  }

  // 2. ACTIVE TEST TAKING SCREEN
  const progressPercent = Math.round(((activeIdx + 1) / totalQuestions) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header Information: Timer & Counter */}
        <div className="flex justify-between items-center bg-white/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <p className="truncate max-w-[200px]" title={quizTitle}>{quizTitle}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Question {activeIdx + 1} of {totalQuestions}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-lg">
            <Timer className="w-4 h-4" />
            <span>{formatTime(timeSpent)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Panel */}
        <div className="glass-panel p-6 rounded-2xl space-y-6 min-h-[300px] flex flex-col justify-between">
          
          <div className="space-y-4">
            <h2 className="text-base font-bold leading-relaxed">
              {activeQuestion.question}
            </h2>

            {/* Options List */}
            <div className="space-y-2.5">
              {activeQuestion.options.map((opt, optIdx) => {
                const letters = ["A", "B", "C", "D"];
                const letter = letters[optIdx];
                const isSelected = selectedAnswers[activeIdx] === letter;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(letter)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs flex gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm"
                        : "bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/60"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                      isSelected
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}>
                      {letter}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer controls: Back/Next/Submit */}
          <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-850/80">
            <button
              onClick={handlePrev}
              disabled={activeIdx === 0}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-xl text-xs font-semibold flex items-center gap-1 hover:scale-102 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>
            
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-500/10 hover:scale-102 active:scale-95 transition-all cursor-pointer"
              >
                Submit Quiz <Check className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 hover:scale-102 active:scale-95 transition-all cursor-pointer"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
