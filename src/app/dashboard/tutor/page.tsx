"use client";

import React, { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useApp, ChatMessage } from "@/context/AppContext";
import { 
  Send, 
  MessageSquare, 
  Trash2, 
  Bot, 
  User as UserIcon, 
  Sparkles,
  Paperclip,
  ArrowRight,
  RefreshCw,
  Plus
} from "lucide-react";

export default function TutorPage() {
  const { chatMessages, sendChatMessage, clearChat } = useApp();
  
  // States
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingId, setTypingId] = useState<string | null>(null);
  const [typedText, setTypedText] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested Prompts
  const suggestedPrompts = [
    "What is Machine Learning?",
    "Explain DBMS Normalization",
    "Create Notes on IoT",
    "Generate Questions From Chapter 3"
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, typedText]);

  // Handle Typewriter effect on new AI messages
  useEffect(() => {
    if (chatMessages.length > 0) {
      const lastMsg = chatMessages[chatMessages.length - 1];
      if (lastMsg.sender === "ai" && lastMsg.id !== typingId) {
        // Trigger typewriter effect
        setTypingId(lastMsg.id);
        setTypedText("");
        
        let i = 0;
        const speed = 10; // character print delay in ms
        const fullText = lastMsg.text;
        
        const interval = setInterval(() => {
          setTypedText((prev) => prev + fullText.charAt(i));
          i++;
          if (i >= fullText.length) {
            clearInterval(interval);
            setTypingId(null);
          }
        }, speed);

        return () => clearInterval(interval);
      }
    }
  }, [chatMessages, typingId]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setInputValue("");
    
    try {
      await sendChatMessage(text);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-10rem)] flex gap-6">
        
        {/* Left Side: Mock Chat History */}
        <div className="w-64 glass-panel rounded-2xl flex flex-col justify-between hidden md:flex overflow-hidden">
          <div className="p-4 border-b border-slate-200/40 dark:border-slate-800 flex justify-between items-center">
            <span className="font-bold text-xs">Chat History</span>
            <button
              onClick={clearChat}
              className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"
              title="Clear Conversations"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {chatMessages.length === 0 ? (
              <div className="text-center py-12 text-[10px] text-slate-400 italic">No chat logs yet.</div>
            ) : (
              <div className="p-2.5 rounded-lg bg-indigo-650/10 border border-indigo-500/10 text-xs font-semibold text-indigo-500 flex items-center gap-2 truncate">
                <MessageSquare className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                <span className="truncate">Active AI Tutor Session</span>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/40 dark:border-slate-800 text-[10px] text-slate-400 leading-normal text-center">
            Ask any academic question to receive instant feedback.
          </div>
        </div>

        {/* Right Side: Conversation Area */}
        <div className="flex-1 glass-panel rounded-2xl flex flex-col justify-between overflow-hidden relative border-r-2 border-r-indigo-500/10">
          
          {/* Conversational Screen */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {chatMessages.length === 0 ? (
              
              // Welcome Screen when Empty
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto py-12">
                <div className="w-14 h-14 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center animate-bounce">
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Meet Your EduMind AI Tutor</h2>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    I am powered by Gemini. Ask me to explain concepts, solve problems, summarize chapters, or create practice questionnaires.
                  </p>
                </div>

                {/* Suggested prompts Pills */}
                <div className="space-y-2 w-full pt-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested Starting Topics</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {suggestedPrompts.map((promptText, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(promptText)}
                        className="p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-left rounded-xl text-[11px] font-semibold hover:scale-[1.01] transition-all flex items-center justify-between group cursor-pointer"
                      >
                        <span className="truncate pr-2">{promptText}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              
              // Chats Message Render List
              <div className="space-y-6">
                {chatMessages.map((msg) => {
                  const isUser = msg.sender === "user";
                  const isTyping = msg.id === typingId;
                  const textToRender = isTyping ? typedText : msg.text;

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-4 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                    >
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 ${
                        isUser 
                          ? "bg-indigo-100 border-indigo-200 text-indigo-600 dark:bg-indigo-950 dark:border-indigo-855 dark:text-indigo-400" 
                          : "bg-purple-100 border-purple-200 text-purple-650 dark:bg-purple-950 dark:border-purple-855 dark:text-purple-400"
                      }`}>
                        {isUser ? <UserIcon className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5" />}
                      </div>

                      {/* Chat text box */}
                      <div className="space-y-1.5 min-w-0">
                        <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                          isUser
                            ? "bg-indigo-600 border-indigo-600 text-white rounded-tr-none shadow-sm"
                            : "bg-white dark:bg-slate-950 border-slate-200/50 dark:border-slate-850 rounded-tl-none text-slate-800 dark:text-slate-100 shadow-sm"
                        }`}>
                          
                          {/* Markdown parsing for bot responses */}
                          {!isUser ? (
                            <div className="prose prose-sm dark:prose-invert space-y-3 font-medium select-text">
                              {textToRender.split("\n").map((line, lidx) => {
                                if (line.startsWith("**") && line.endsWith("**")) {
                                  return <h4 key={lidx} className="font-bold text-sm text-indigo-500 pt-1">{line.replace(/\*\*/g, "")}</h4>;
                                }
                                if (line.startsWith("* ")) {
                                  return <li key={lidx} className="list-disc pl-4 mt-1">{line.replace("* ", "")}</li>;
                                }
                                return <p key={lidx}>{line}</p>;
                              })}
                              {isTyping && <span className="typing-cursor ml-0.5" />}
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap select-text">{msg.text}</p>
                          )}

                        </div>
                        <span className={`text-[9px] text-slate-400 block ${isUser ? "text-right" : "text-left"}`}>
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Typing Loading State Indicator */}
          {loading && !typingId && (
            <div className="px-6 py-2 flex items-center gap-2 text-[10px] text-slate-400 font-semibold italic">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" /> EduMind Tutor is formulating explanation...
            </div>
          )}

          {/* Prompt Entry Box */}
          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200/40 dark:border-slate-800 flex gap-3 items-center">
            <button className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask AI Tutor: 'Explain DBMS normalisation' or 'Create chapter notes'..."
                rows={1}
                className="w-full pl-4 pr-12 py-3 rounded-xl text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:outline-none resize-none scrollbar-none transition-all"
                disabled={loading}
              />
              <button
                onClick={() => handleSend(inputValue)}
                disabled={loading || !inputValue.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-650 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-40 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
