"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { 
  Target, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  CheckCircle,
  FileCheck,
  Play,
  Lightbulb,
  ArrowRight
} from "lucide-react";

export default function ExamPrepPage() {
  const router = useRouter();
  const { notes } = useApp();

  const [activeTab, setActiveTab] = useState<"syllabus" | "mocks" | "tips">("syllabus");

  // Important Topics checklists
  const coreTopics = [
    { title: "Supervised Learning Paradigms", desc: "Linear Regression, Logistic classification, SVM, Decision trees", subject: "Machine Learning", priority: "High" },
    { title: "Model Regularization rules", desc: "L1 (Lasso) vs L2 (Ridge) penalties, overfitting biases", subject: "Machine Learning", priority: "High" },
    { title: "Database Normal Forms (1NF to BCNF)", desc: "Functional partial dependencies, transitive anomalies, candidate keys", subject: "DBMS", priority: "High" },
    { title: "Transaction ACID Properties", desc: "Atomicity, Consistency, Isolation, Durability definitions", subject: "DBMS", priority: "Medium" },
    { title: "IoT Protocol Headers", desc: "MQTT publisher-subscriber topology, CoAP HTTP mappings", subject: "IoT", priority: "Medium" },
    { title: "Sensor Node Architectures", desc: "Power constraints, MCU layouts, wireless gateways", subject: "IoT", priority: "Low" }
  ];

  // Mock tests data
  const mockTests = [
    {
      title: "Machine Learning Mid-Term Mock",
      subject: "Machine Learning",
      questionsCount: 10,
      duration: "10 mins",
      difficulty: "Medium",
      questions: [
        {
          question: "Which regularizer drives weight parameters to exactly zero?",
          options: ["L1 Regularization (Lasso)", "L2 Regularization (Ridge)", "ElasticNet only", "Dropout regularizers"],
          correctAnswer: "A",
          explanation: "L1 uses the absolute value of weights, yielding corner solutions (zeros)."
        },
        {
          question: "What does the bias term in neural layers do?",
          options: ["Shifts the activation function left or right", "Controls the steepness of functions", "Normalizes the inputs to zero mean", "Eliminates all validation errors"],
          correctAnswer: "A",
          explanation: "Bias acts as an intercept, shifting the activation threshold without modifying weights."
        }
      ]
    },
    {
      title: "Database Normalization Drill",
      subject: "DBMS",
      questionsCount: 10,
      duration: "12 mins",
      difficulty: "Hard",
      questions: [
        {
          question: "If A -> B and B -> C, then A -> C is an example of what rule?",
          options: ["Transitive dependency", "Partial dependency", "Multivalued dependency", "Reflexive rule"],
          correctAnswer: "A",
          explanation: "When a non-key column determines another non-key column, it forms a transitive relationship."
        },
        {
          question: "BCNF is stronger than 3NF because BCNF requires what condition?",
          options: ["Every determinant must be a candidate key", "All fields must be alphanumeric", "No primary key can be composite", "No foreign keys are allowed"],
          correctAnswer: "A",
          explanation: "Boyce-Codd Normal Form eliminates all transitive anomalies by forcing every determinant attribute to be a candidate key."
        }
      ]
    }
  ];

  const handleLaunchMock = (mock: typeof mockTests[0]) => {
    // Save to active quiz store
    localStorage.setItem("active_quiz_title", mock.title);
    localStorage.setItem("active_quiz_questions", JSON.stringify(mock.questions));
    router.push("/dashboard/quiz");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Exam Preparation</h1>
          <p className="text-slate-400 text-xs mt-1">Review syllabus checklists, attempt full-scale mock tests, and get AI guidance.</p>
        </div>

        {/* Tab Buttons Row */}
        <div className="flex border-b border-slate-200/40 dark:border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab("syllabus")}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === "syllabus"
                ? "text-indigo-500 border-b-2 border-b-indigo-500"
                : "text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
            }`}
          >
            Syllabus Topics
          </button>
          <button
            onClick={() => setActiveTab("mocks")}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === "mocks"
                ? "text-indigo-500 border-b-2 border-b-indigo-500"
                : "text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
            }`}
          >
            Mock Assessments
          </button>
          <button
            onClick={() => setActiveTab("tips")}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === "tips"
                ? "text-indigo-500 border-b-2 border-b-indigo-500"
                : "text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
            }`}
          >
            AI Exam Guidance
          </button>
        </div>

        {/* Tab 1: Syllabus checklist */}
        {activeTab === "syllabus" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coreTopics.map((topic, i) => (
                <div 
                  key={i} 
                  className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.01] hover:shadow-md transition-all border-l-4 border-l-indigo-500/40"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase">
                      <span>{topic.subject}</span>
                      <span className={`px-2 py-0.5 rounded-full ${
                        topic.priority === "High" ? "bg-red-500/10 text-red-500" : "bg-yellow-500/10 text-yellow-500"
                      }`}>
                        {topic.priority} Priority
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mt-2">{topic.title}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{topic.desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850/60 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> High-yield target</span>
                    <button 
                      onClick={() => router.push(`/dashboard/tutor?q=Explain ${topic.title}`)}
                      className="text-indigo-500 hover:text-indigo-650 hover:underline flex items-center gap-0.5"
                    >
                      Ask AI Tutor <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Mock Mocks list */}
        {activeTab === "mocks" && (
          <div className="space-y-4 max-w-3xl mx-auto">
            {mockTests.map((mock, i) => (
              <div 
                key={i} 
                className="glass-panel p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-l-4 border-l-emerald-500 hover:scale-[1.01] transition-all"
              >
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-indigo-500 uppercase">{mock.subject}</span>
                  <h3 className="font-bold text-base text-slate-850 dark:text-slate-100 mt-1">{mock.title}</h3>
                  <div className="flex gap-4 text-[10px] text-slate-400 pt-2 font-medium">
                    <span>📋 {mock.questionsCount} Questions</span>
                    <span>⏱️ {mock.duration} Limit</span>
                    <span>🎯 Difficulty: {mock.difficulty}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleLaunchMock(mock)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/10 active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Launch Mock
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: AI guidance tips panel */}
        {activeTab === "tips" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="glass-panel p-6 rounded-2xl space-y-5 border-l-4 border-l-purple-500">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" /> AI Exam Strategy Guidance
              </h3>
              
              <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Focus on Active Recall over Highlight Reading</h4>
                    <p className="text-slate-450">
                      Rereading notes creates an illusion of competence. Use the MCQ Generator or Flashcard flipping tools to force cognitive retrieval. This builds stronger long-term neural memory pathways.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Study in Pomodoro Block Intervals</h4>
                    <p className="text-slate-450">
                      Maintain focus by breaking sessions down: 25 minutes of note summaries, followed by 5 minutes of rest. Log your weekly hours in the Analytics segment to audit study trends.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Decompose Normalization Tables</h4>
                    <p className="text-slate-450">
                      For DBMS database finals, remember: 1NF ensures atomicity, 2NF eliminates partial relations, and 3NF prevents transitivities. Test yourself with our DBMS mock exam questions above.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
