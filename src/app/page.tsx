"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Upload, 
  Brain, 
  HelpCircle, 
  Layers, 
  Calendar, 
  BarChart3, 
  Target, 
  BookOpen, 
  ArrowRight, 
  Check, 
  Play, 
  Star, 
  ArrowUpRight 
} from "lucide-react";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    { icon: Brain, title: "AI Tutor", desc: "Interactive chatbot for learning complex ideas, explaining formulas, and real-time guidance.", color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    { icon: BookOpen, title: "Notes Management", desc: "Upload PDF, DOCX, or text documents to organize your entire academic semester in one hub.", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20" },
    { icon: FileTextIcon, title: "AI Summary Generator", desc: "Condense long textbooks into structured short, medium, or detailed study guides instantly.", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { icon: HelpCircle, title: "AI MCQ Generator", desc: "Generate custom multiple-choice tests from note uploads to test your knowledge.", color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20" },
    { icon: Layers, title: "Flashcard Generator", desc: "Create interactive 3D flipping card decks automatically to master active recall vocabulary.", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { icon: Calendar, title: "Smart Study Planner", desc: "Input subjects and exam dates to get structured daily study milestones and revision plans.", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    { icon: BarChart3, title: "Learning Analytics", desc: "Track visual progress, weekly study times, quiz percentage scores, and study streak heatmaps.", color: "text-rose-500 bg-rose-500/10 border-rose-500/20" },
    { icon: Target, title: "Exam Preparation", desc: "High-yield topics checklists, mock tests, and AI guidance customized to your curriculum.", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" }
  ];

  const steps = [
    { step: "01", name: "Upload Notes", desc: "Drag and drop your lecture notes, documents, or textbook PDFs." },
    { step: "02", name: "AI Processes", desc: "EduMind's AI models analyze the material and extract core patterns." },
    { step: "03", name: "Generate Materials", desc: "Produce summaries, customized practice questions, and flashcard decks." },
    { step: "04", name: "Score Higher", desc: "Practice active recall, track your analytics, and pass your exams with confidence." }
  ];

  const plans = [
    {
      name: "Free Plan",
      price: "$0",
      desc: "Perfect for secondary school students starting out.",
      features: ["3 notes uploads per month", "Standard AI Summaries", "10 generated MCQs per quiz", "5 active flashcard decks", "Standard AI Tutor chat", "Basic Analytics"],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro Plan",
      price: "$9",
      period: "/month",
      desc: "Best for college and engineering students wanting full power.",
      features: ["Unlimited notes uploads", "Short/Medium/Detailed summaries", "Up to 30 MCQs per quiz", "Unlimited flashcards", "Priority AI Tutor & response", "Advanced Planner & Calendar", "Full performance charts"],
      cta: "Get Pro Access",
      popular: true
    },
    {
      name: "Coaching Team",
      price: "$29",
      period: "/month",
      desc: "Ideal for professional tutors, schools, and coaching groups.",
      features: ["Includes all Pro features", "Multi-student dashboards", "Custom question bank exports", "Detailed progress report PDFs", "24/7 dedicated support team", "Collaborative shared libraries"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const faqs = [
    { q: "How does the AI process my lecture notes?", a: "Once you upload a PDF, DOCX, or text file, EduMind runs our natural language processing model (powered by Google Gemini) to break down headings, formulas, and terminology into clean structured summaries, practice questions, and flashcards." },
    { q: "Is there a limit on file size uploads?", a: "Yes, the Free Plan allows notes files up to 10 MB. Pro and Premium tiers support larger file uploads of up to 100 MB per document." },
    { q: "Can I use EduMind on my tablet or smartphone?", a: "Absolutely! EduMind is built as a fully responsive web application, optimized for seamless usage on desktop monitors, iPad tablets, and mobile screens alike." },
    { q: "Can I import files from Google Drive or Dropbox?", a: "Yes, you can directly upload any text-based documents downloaded from your cloud storage. We are also building direct Google Drive sync options." }
  ];

  return (
    <div className="min-h-screen mesh-bg dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background radial glowing blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">EduMind</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-500 dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-500 dark:hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-indigo-500 dark:hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-indigo-500 dark:hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium hover:text-indigo-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900">
              Sign In
            </Link>
            <Link href="/register" className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all">
              Start Learning Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Learning Platform
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
          Your AI-Powered Learning Companion
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-normal">
          Upload notes, generate summaries, create quizzes, build flashcards, and learn smarter with EduMind.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all">
            Start Learning Free <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold px-6 py-3.5 rounded-xl transition-all">
            <Play className="w-4 h-4 fill-current" /> Watch Demo
          </a>
        </div>

        {/* Dashboard Preview Visual */}
        <div className="mt-16 relative mx-auto max-w-5xl rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xl p-2 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-md glow-effect overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-11 bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <span className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <div className="text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-md border border-slate-200/50 dark:border-slate-800/50">
              edumind.ai/dashboard
            </div>
            <div className="w-14" />
          </div>

          <div className="pt-12 grid grid-cols-1 md:grid-cols-4 bg-slate-50 dark:bg-slate-950/40 min-h-[420px] text-left text-xs divide-y md:divide-y-0 md:divide-x divide-slate-200/40 dark:divide-slate-800/40">
            
            {/* Mock Sidebar */}
            <div className="p-4 space-y-3 col-span-1 hidden md:block">
              <div className="h-6 w-24 bg-indigo-500/10 rounded-md animate-pulse" />
              <div className="space-y-2 pt-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className={`h-6 rounded-md ${i === 0 ? "bg-indigo-600/10 border border-indigo-500/20" : "bg-slate-200/40 dark:bg-slate-800/40"}`} />
                ))}
              </div>
            </div>

            {/* Mock Workspace Content */}
            <div className="p-6 col-span-3 space-y-6">
              
              {/* Top Banner Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-800/60 rounded-xl">
                  <p className="text-[10px] text-slate-400">Study Streak</p>
                  <p className="text-lg font-bold text-indigo-500 mt-1">🔥 4 Days</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-800/60 rounded-xl">
                  <p className="text-[10px] text-slate-400">Study Hours</p>
                  <p className="text-lg font-bold text-violet-500 mt-1">⏱️ 18.5 hrs</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-800/60 rounded-xl">
                  <p className="text-[10px] text-slate-400">Quiz Success</p>
                  <p className="text-lg font-bold text-emerald-500 mt-1">🎯 92%</p>
                </div>
              </div>

              {/* Row 2: Chat & MCQ preview layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-800/60 rounded-xl space-y-3">
                  <p className="font-semibold text-slate-400">🤖 AI Tutor Chat</p>
                  <div className="p-2 bg-slate-50 dark:bg-slate-900/40 rounded border border-slate-200/30 dark:border-slate-700/30">
                    <p className="text-indigo-400">@Alex: What is DBMS 3NF?</p>
                  </div>
                  <div className="p-2 bg-indigo-50/20 dark:bg-indigo-950/20 rounded border border-indigo-500/10 text-slate-500 dark:text-slate-300">
                    <p>AI: 3NF requires no transitive dependency. E.g. non-key attributes must depend only on candidate keys...</p>
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-800/80 border border-slate-200/40 dark:border-slate-800/60 rounded-xl space-y-3">
                  <p className="font-semibold text-slate-400">📋 Study Scheduler</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-2 rounded">
                      <span>Machine Learning fundamentals</span>
                      <span className="text-[9px] font-semibold text-indigo-500 bg-indigo-500/10 px-1.5 py-0.5 rounded">9:00 AM</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/40 p-2 rounded">
                      <span>Answer practice MCQs database normal form</span>
                      <span className="text-[9px] font-semibold text-violet-500 bg-violet-500/10 px-1.5 py-0.5 rounded">2:30 PM</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-8 bg-slate-100/30 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-800/50 text-center">
        <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
          10,000+ Students Learning Smarter At Leading Educational Institutions
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Learn Smarter. Study Faster. Score Better.
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            EduMind combines powerful large language models with established cognitive science studying methods.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div 
                key={i} 
                className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-indigo-500/5 transition-all duration-300 group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${f.color} mb-4 group-hover:scale-110 transition-all`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              AI-Powered Flow In Four Steps
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              Go from cluttered textbooks to exam readiness in a matter of clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((s, i) => (
              <div key={i} className="relative flex flex-col">
                <div className="text-5xl font-extrabold text-indigo-500/10 dark:text-indigo-400/10 tracking-widest">{s.step}</div>
                <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mt-2 mb-1">{s.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Student Success Stories
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400">
            Hear from students who transformed their grades and reduced study stress.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl">
            <div className="flex gap-1 text-amber-400 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              "EduMind made engineering study stress-free. Generating practice MCQs from class note chapters saved me hours of mock test preparation!"
            </p>
            <div className="flex items-center gap-3">
              <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=student1" alt="" className="w-10 h-10 rounded-full bg-slate-100" />
              <div>
                <h4 className="font-bold text-sm">Sarah Jenkins</h4>
                <p className="text-xs text-slate-400">Mechanical Engineering Student</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl">
            <div className="flex gap-1 text-amber-400 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              "The AI Tutor feels like a personal instructor sitting right next to me. Whenever I get stuck on normalisation tables or algorithms, I get explanations instantly."
            </p>
            <div className="flex items-center gap-3">
              <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=student2" alt="" className="w-10 h-10 rounded-full bg-slate-100" />
              <div>
                <h4 className="font-bold text-sm">David Chen</h4>
                <p className="text-xs text-slate-400">Computer Science Student</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl">
            <div className="flex gap-1 text-amber-400 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              "Flipping flashcards with the interactive 3D selector built muscle memory for my biology terminology terms. Strongly recommend to any student!"
            </p>
            <div className="flex items-center gap-3">
              <img src="https://api.dicebear.com/7.x/adventurer/svg?seed=student3" alt="" className="w-10 h-10 rounded-full bg-slate-100" />
              <div>
                <h4 className="font-bold text-sm">Emily Rodriguez</h4>
                <p className="text-xs text-slate-400">Pre-Med Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-50/50 dark:bg-slate-900/20 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Flexible Plans for Every Student
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400">
              Upgrade as your academic curriculum workload expands. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {plans.map((p, i) => (
              <div 
                key={i} 
                className={`p-8 bg-white dark:bg-slate-900 border rounded-2xl flex flex-col justify-between transition-all duration-300 relative ${
                  p.popular 
                    ? "border-indigo-500 shadow-xl shadow-indigo-500/5 scale-105 z-10" 
                    : "border-slate-200/60 dark:border-slate-800/60"
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-widest shadow-md">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="font-bold text-xl mb-1">{p.name}</h3>
                  <p className="text-xs text-slate-400 mb-6">{p.desc}</p>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-extrabold tracking-tight">{p.price}</span>
                    {p.period && <span className="text-sm text-slate-400 font-medium ml-1">{p.period}</span>}
                  </div>
                  
                  <div className="h-px bg-slate-100 dark:bg-slate-800 mb-6" />

                  <ul className="space-y-3 text-xs mb-8">
                    {p.features.map((feat, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Check className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/register"
                  className={`w-full text-center py-3 rounded-xl font-semibold text-xs transition-all ${
                    p.popular
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                      : "bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-850 dark:text-slate-200 border border-slate-200/40 dark:border-slate-700/40"
                  }`}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
            Everything you need to know about the EduMind AI workspace.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div 
                key={i} 
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  className="w-full text-left px-6 py-4 font-semibold text-sm flex items-center justify-between focus:outline-none hover:bg-slate-50/50 dark:hover:bg-slate-850/30"
                >
                  <span>{faq.q}</span>
                  <span className={`text-indigo-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>▼</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800/30 animate-in slide-in-from-top-2 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-600 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>EduMind</span>
            </Link>
            <p className="max-w-sm text-slate-400 leading-relaxed">
              EduMind is an AI-powered academic learning dashboard designed to help high school, college, and university students study faster and perform better.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-4 text-xs">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white uppercase tracking-wider mb-4 text-xs">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/50 mt-8 pt-6 flex items-center justify-between text-slate-500">
          <span>&copy; 2026 EduMind AI Inc. All rights reserved.</span>
          <span className="flex items-center gap-1"><ArrowUpRight className="w-3.5 h-3.5" /> Built for Vercel Deployment</span>
        </div>
      </footer>
    </div>
  );
}

// Quick custom components to avoid missing imports
function FileTextIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}
