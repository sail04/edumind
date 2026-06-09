"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatar: string;
  education: string;
  goals: string;
}

export interface StudyNote {
  id: string;
  name: string;
  subject: string;
  uploadDate: string;
  size: string;
  content: string;
  type: string;
}

export interface AISummary {
  id: string;
  noteId: string;
  title: string;
  length: string;
  content: string;
}

export interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface MCQSet {
  id: string;
  noteId: string;
  title: string;
  questions: MCQQuestion[];
}

export interface Flashcard {
  id: string;
  noteId: string;
  front: string;
  back: string;
  learned: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface StudyPlanner {
  examDate: string;
  subjects: string;
  hours: string;
  dailyPlan: string[];
  weeklySchedule: { day: string; tasks: string[] }[];
  revisionTasks: string[];
}

export interface QuizAttempt {
  id: string;
  title: string;
  date: string;
  score: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  percentage: number;
  performance: string;
}

interface AppContextType {
  user: UserProfile | null;
  theme: "light" | "dark";
  notes: StudyNote[];
  summaries: AISummary[];
  mcqSets: MCQSet[];
  flashcards: Flashcard[];
  planner: StudyPlanner | null;
  chatMessages: ChatMessage[];
  quizAttempts: QuizAttempt[];
  streak: number;
  studyHours: number;
  notifications: { id: string; text: string; time: string; read: boolean }[];
  
  toggleTheme: () => void;
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, education: string, goals: string, avatar: string) => void;
  
  addNote: (name: string, subject: string, size: string, content: string, type: string) => StudyNote;
  deleteNote: (id: string) => void;
  
  addSummary: (noteId: string, title: string, length: string, content: string) => void;
  deleteSummary: (id: string) => void;
  
  addMCQSet: (noteId: string, title: string, questions: MCQQuestion[]) => MCQSet;
  
  addFlashcard: (noteId: string, front: string, back: string) => void;
  toggleFlashcardLearned: (id: string) => void;
  deleteFlashcard: (id: string) => void;
  
  setPlannerData: (data: StudyPlanner) => void;
  
  sendChatMessage: (text: string) => Promise<void>;
  clearChat: () => void;
  
  saveQuizAttempt: (attempt: Omit<QuizAttempt, "id" | "date">) => void;
  addStudyHours: (hours: number) => void;
  markNotificationsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_NOTES: StudyNote[] = [
  {
    id: "note-1",
    name: "Machine_Learning_Intro.txt",
    subject: "Machine Learning",
    uploadDate: "2026-06-05",
    size: "12 KB",
    content: "Machine learning (ML) is a field of study in artificial intelligence concerned with the development and study of statistical algorithms that can learn from data and generalize to unseen data. Supervised learning, unsupervised learning, and reinforcement learning are the three main paradigms.",
    type: "txt",
  },
  {
    id: "note-2",
    name: "DBMS_Normalization_Rules.docx",
    subject: "DBMS",
    uploadDate: "2026-06-08",
    size: "24 KB",
    content: "Database Normalization rules structure databases in relational formats. 1NF removes repeating groups and ensures atomic fields. 2NF removes partial dependency. 3NF removes transitive dependency where non-key fields must not depend on other non-key fields.",
    type: "docx",
  }
];

const DEFAULT_SUMMARIES: AISummary[] = [
  {
    id: "sum-1",
    noteId: "note-1",
    title: "Summary: Machine_Learning_Intro",
    length: "medium",
    content: "## Machine Learning Overview\n\n- **Definition**: Algorithms learning from historical training samples to construct prediction models.\n- **Three Pillars**:\n  1. *Supervised*: Using labeled datasets (regression/classification).\n  2. *Unsupervised*: Finding clusters and correlations (K-Means/PCA).\n  3. *Reinforcement*: Learning from environmental rewards.\n- **Generalization**: The target is to build models with balanced bias and variance to prevent overfitting on validation segments."
  }
];

const DEFAULT_MCQS: MCQSet[] = [
  {
    id: "mcq-1",
    noteId: "note-1",
    title: "MCQs: Machine_Learning_Intro",
    questions: [
      {
        question: "Which learning paradigm uses labeled data?",
        options: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Semi-unsupervised Learning"],
        correctAnswer: "A",
        explanation: "Supervised learning algorithms are trained using inputs associated with explicit ground truth labels."
      },
      {
        question: "What is overfitting?",
        options: ["When a model learns training data details too well, degrading validation performance", "When a model fails to learn the basic patterns of training data", "When a model is too small to build fit relationships", "None of the above"],
        correctAnswer: "A",
        explanation: "Overfitting happens when a model learns the noise and details in the training dataset to the point that it negatively impacts the performance of the model on new data."
      }
    ]
  }
];

const DEFAULT_FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    noteId: "note-1",
    front: "What is the difference between supervised and unsupervised learning?",
    back: "Supervised learning uses labeled training datasets (inputs with correct target output) to train models, while unsupervised learning works with unlabeled datasets to identify hidden structures and clustering patterns.",
    learned: false
  },
  {
    id: "fc-2",
    noteId: "note-2",
    front: "What is 3NF in DBMS normalization?",
    back: "Third Normal Form (3NF) requires a relation to be in 2NF, and no non-prime attribute should be transitively dependent on any candidate key (non-prime fields only depend on primary keys directly).",
    learned: true
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [summaries, setSummaries] = useState<AISummary[]>([]);
  const [mcqSets, setMcqSets] = useState<MCQSet[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [planner, setPlanner] = useState<StudyPlanner | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);
  const [streak, setStreak] = useState<number>(3);
  const [studyHours, setStudyHours] = useState<number>(14.5);
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string; read: boolean }[]>([]);

  // Sync state data from python FastAPI backend
  const fetchUserData = async (uid: string, currentUserProfile: UserProfile | null) => {
    try {
      // Auth sync with backend
      await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          email: currentUserProfile?.email || "student@edumind.ai",
          displayName: currentUserProfile?.displayName || "Alex Mercer",
          avatar: currentUserProfile?.avatar || ""
        })
      });

      // Get profile
      try {
        const res = await fetch(`/api/profile?uid=${uid}`);
        if (res.ok) {
          const dbUser = await res.json();
          const profile: UserProfile = {
            uid: dbUser.uid,
            email: dbUser.email,
            displayName: dbUser.display_name,
            avatar: dbUser.avatar,
            education: dbUser.education,
            goals: dbUser.goals
          };
          setUser(profile);
          syncState("user", profile);
        }
      } catch (e) {
        console.error("Error syncing profile with DB:", e);
      }

      // Get notes
      const notesRes = await fetch(`/api/notes?uid=${uid}`);
      if (notesRes.ok) {
        const dbNotes = await notesRes.json();
        const formattedNotes = dbNotes.map((n: any) => ({
          id: n.id,
          name: n.name,
          subject: n.subject,
          uploadDate: n.upload_date,
          size: n.size,
          content: n.content,
          type: n.type
        }));
        setNotes(formattedNotes);
        syncState("notes", formattedNotes);
      }

      // Get summaries
      const summariesRes = await fetch(`/api/summaries?uid=${uid}`);
      if (summariesRes.ok) {
        const dbSummaries = await summariesRes.json();
        const formattedSummaries = dbSummaries.map((s: any) => ({
          id: s.id,
          noteId: s.note_id,
          title: s.title,
          length: s.length,
          content: s.content
        }));
        setSummaries(formattedSummaries);
        syncState("summaries", formattedSummaries);
      }

      // Get MCQ sets
      const mcqsRes = await fetch(`/api/mcqs?uid=${uid}`);
      if (mcqsRes.ok) {
        const dbMcqs = await mcqsRes.json();
        const formattedMcqs = dbMcqs.map((set: any) => ({
          id: set.id,
          noteId: set.note_id,
          title: set.title,
          questions: JSON.parse(set.questions_json)
        }));
        setMcqSets(formattedMcqs);
        syncState("mcqSets", formattedMcqs);
      }

      // Get flashcards
      const fcRes = await fetch(`/api/flashcards?uid=${uid}`);
      if (fcRes.ok) {
        const dbFc = await fcRes.json();
        const formattedFc = dbFc.map((fc: any) => ({
          id: fc.id,
          noteId: fc.note_id,
          front: fc.front,
          back: fc.back,
          learned: fc.learned
        }));
        setFlashcards(formattedFc);
        syncState("flashcards", formattedFc);
      }

      // Get planner
      const plannerRes = await fetch(`/api/planner?uid=${uid}`);
      if (plannerRes.ok) {
        const dbPlanner = await plannerRes.json();
        if (dbPlanner) {
          const planData = JSON.parse(dbPlanner.plan_json);
          const formattedPlanner = {
            examDate: dbPlanner.exam_date,
            subjects: dbPlanner.subjects,
            hours: dbPlanner.hours,
            dailyPlan: planData.dailyPlan || [],
            weeklySchedule: planData.weeklySchedule || [],
            revisionTasks: planData.revisionTasks || []
          };
          setPlanner(formattedPlanner);
          syncState("planner", formattedPlanner);
        }
      }

      // Get quiz attempts
      const quizRes = await fetch(`/api/quizzes?uid=${uid}`);
      if (quizRes.ok) {
        const dbQuizzes = await quizRes.json();
        const formattedQuizzes = dbQuizzes.map((q: any) => ({
          id: q.id,
          title: q.title,
          date: q.date,
          score: q.score,
          totalQuestions: q.total_questions,
          timeSpent: q.time_spent,
          percentage: q.percentage,
          performance: q.performance
        }));
        setQuizAttempts(formattedQuizzes);
        syncState("quizAttempts", formattedQuizzes);
      }
    } catch (err) {
      console.warn("FastAPI backend offline, running in local storage fallback mode.", err);
    }
  };

  // Sync with FastAPI whenever user profile loaded
  useEffect(() => {
    if (user?.uid) {
      fetchUserData(user.uid, user);
    }
  }, [user?.uid]);

  // Firebase Auth sync observer
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          const profile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "Student",
            avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${firebaseUser.uid}`,
            education: "University Student",
            goals: "Learn with AI"
          };
          setUser(profile);
          syncState("user", profile);
        } else {
          // Only clear if the current session is NOT a mock/simulated user
          const storedUserStr = localStorage.getItem("user");
          let isMock = false;
          if (storedUserStr) {
            try {
              const u = JSON.parse(storedUserStr);
              if (u && (u.uid.startsWith("mock-") || u.uid.startsWith("user-"))) {
                isMock = true;
              }
            } catch (e) {}
          }

          if (!isMock) {
            setUser(null);
            if (typeof window !== "undefined") {
              localStorage.removeItem("user");
            }
          }
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Load from LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme") as "light" | "dark";
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.classList.toggle("dark", storedTheme === "dark");
      } else {
        document.documentElement.classList.add("dark");
      }

      // Stored user local cache sync
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        try {
          const storedUser = JSON.parse(storedUserStr);
          // Load stored user if not in Firebase mode or if it's a simulated mock user
          if (!isFirebaseConfigured || (storedUser && (storedUser.uid.startsWith("mock-") || storedUser.uid.startsWith("user-")))) {
            setUser(storedUser);
          }
        } catch (e) {
          console.error("Error loading user from localStorage:", e);
        }
      } else if (!isFirebaseConfigured) {
        // Log in a default student profile for instant visual dashboard preview
        const mockDefaultUser = {
          uid: "mock-student-123",
          email: "student@edumind.ai",
          displayName: "Alex Mercer",
          avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Alex",
          education: "Computer Science & Engineering",
          goals: "Pass finals, master AI algorithms, and secure an internship."
        };
        setUser(mockDefaultUser);
        localStorage.setItem("user", JSON.stringify(mockDefaultUser));
      }

      setNotes(JSON.parse(localStorage.getItem("notes") || JSON.stringify(DEFAULT_NOTES)));
      setSummaries(JSON.parse(localStorage.getItem("summaries") || JSON.stringify(DEFAULT_SUMMARIES)));
      setMcqSets(JSON.parse(localStorage.getItem("mcqSets") || JSON.stringify(DEFAULT_MCQS)));
      setFlashcards(JSON.parse(localStorage.getItem("flashcards") || JSON.stringify(DEFAULT_FLASHCARDS)));
      
      const storedPlanner = localStorage.getItem("planner");
      if (storedPlanner) {
        setPlanner(JSON.parse(storedPlanner));
      } else {
        setPlanner({
          examDate: "2026-06-25",
          subjects: "Machine Learning, DBMS, IoT",
          hours: "3",
          dailyPlan: [
            "Morning Focus session: 1.5 hours on Machine Learning fundamentals",
            "Afternoon Practice: 1 hour doing active recall with Flashcards",
            "Evening Recap: 30 minutes chat with AI Tutor on DBMS normal forms"
          ],
          weeklySchedule: [
            { day: "Monday", tasks: ["Review Machine Learning linear models", "Read DBMS Chapter 2"] },
            { day: "Tuesday", tasks: ["Answer 10 practice MCQs", "Formulate IoT networking cards"] },
            { day: "Wednesday", tasks: ["Attempt mock assessment test", "Double review logic gates"] }
          ],
          revisionTasks: [
            "Verify DBMS normalization normal form checklists",
            "Re-run all generated flashcards twice",
            "Complete 3 full-length quizzes"
          ]
        });
      }

      setChatMessages(JSON.parse(localStorage.getItem("chatMessages") || "[]"));
      setQuizAttempts(JSON.parse(localStorage.getItem("quizAttempts") || "[]"));
      setStreak(Number(localStorage.getItem("streak") || "4"));
      setStudyHours(Number(localStorage.getItem("studyHours") || "18.5"));
      setNotifications(JSON.parse(localStorage.getItem("notifications") || JSON.stringify([
        { id: "notif-1", text: "Welcome to EduMind! Start by uploading your study materials.", time: "1 hour ago", read: false },
        { id: "notif-2", text: "New: You completed your study planner schedule.", time: "Yesterday", read: true }
      ])));
    }
  }, []);

  // Helper to sync to local storage
  const syncState = (key: string, data: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    syncState("theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    if (isFirebaseConfigured && auth) {
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        return true;
      } catch (error) {
        console.warn("Firebase Auth email login failed, falling back to simulation:", error);
      }
    }
    // Simulated successful login
    const mockUser: UserProfile = {
      uid: "user-" + Math.random().toString(36).substr(2, 9),
      email: email,
      displayName: email.split("@")[0].toUpperCase(),
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
      education: "University Student",
      goals: "Improve CGPA & Learn with AI",
    };
    setUser(mockUser);
    syncState("user", mockUser);
    return true;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    if (isFirebaseConfigured && auth) {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        return true;
      } catch (error) {
        console.warn("Firebase Google Auth failed, falling back to simulation:", error);
      }
    }
    // Simulation fallback Google Login
    const email = "alex.mercer@gmail.com";
    const name = "Alex Mercer";
    const mockUser: UserProfile = {
      uid: "mock-google-" + Math.random().toString(36).substr(2, 9),
      email: email,
      displayName: name,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      education: "Computer Science & Engineering",
      goals: "Master AI models and database structures.",
    };
    setUser(mockUser);
    syncState("user", mockUser);
    return true;
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    if (isFirebaseConfigured && auth) {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, pass);
        if (credential.user) {
          await firebaseUpdateProfile(credential.user, { displayName: name });
        }
        return true;
      } catch (error) {
        console.warn("Firebase Auth registration failed, falling back to simulation:", error);
      }
    }
    const mockUser: UserProfile = {
      uid: "user-" + Math.random().toString(36).substr(2, 9),
      email: email,
      displayName: name,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${name}`,
      education: "University Student",
      goals: "Improve study performance",
    };
    setUser(mockUser);
    syncState("user", mockUser);
    return true;
  };

  const logout = () => {
    if (isFirebaseConfigured && auth) {
      signOut(auth);
    }
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };

  const updateProfile = async (name: string, education: string, goals: string, avatar: string) => {
    if (user) {
      const updated = { ...user, displayName: name, education, goals, avatar };
      setUser(updated);
      syncState("user", updated);
      try {
        await fetch(`/api/profile?uid=${user.uid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            displayName: name,
            education,
            goals,
            avatar
          })
        });
      } catch (err) {
        console.error("Failed to sync profile update with backend:", err);
      }
    }
  };

  const addNote = (name: string, subject: string, size: string, content: string, type: string): StudyNote => {
    const newNote: StudyNote = {
      id: "note-" + Math.random().toString(36).substr(2, 9),
      name,
      subject,
      uploadDate: new Date().toISOString().split("T")[0],
      size,
      content,
      type,
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    syncState("notes", updated);

    // Sync to backend DB
    fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newNote.id,
        uid: user?.uid || "mock-student-123",
        name: newNote.name,
        subject: newNote.subject,
        upload_date: newNote.uploadDate,
        size: newNote.size,
        content: newNote.content,
        type: newNote.type
      })
    }).catch(err => console.error("Failed to sync note with backend DB:", err));

    // Auto-add notification
    const newNotif = {
      id: "notif-" + Date.now(),
      text: `Uploaded "${name}" successfully. Summary is ready to generate!`,
      time: "Just now",
      read: false
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    syncState("notifications", updatedNotifs);

    return newNote;
  };

  const deleteNote = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    syncState("notes", updated);

    // Sync to backend DB
    fetch(`/api/notes/${id}`, { method: "DELETE" })
      .catch(err => console.error("Failed to sync note deletion with backend DB:", err));
  };

  const addSummary = (noteId: string, title: string, length: string, content: string) => {
    const newSummary: AISummary = {
      id: "sum-" + Math.random().toString(36).substr(2, 9),
      noteId,
      title,
      length,
      content,
    };
    const updated = [newSummary, ...summaries];
    setSummaries(updated);
    syncState("summaries", updated);

    // Sync to backend DB
    fetch("/api/summaries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newSummary.id,
        note_id: newSummary.noteId,
        title: newSummary.title,
        length: newSummary.length,
        content: newSummary.content
      })
    }).catch(err => console.error("Failed to sync summary with backend DB:", err));
  };

  const deleteSummary = (id: string) => {
    const updated = summaries.filter((s) => s.id !== id);
    setSummaries(updated);
    syncState("summaries", updated);

    // Sync to backend DB
    fetch(`/api/summaries/${id}`, { method: "DELETE" })
      .catch(err => console.error("Failed to sync summary deletion with backend DB:", err));
  };

  const addMCQSet = (noteId: string, title: string, questions: MCQQuestion[]): MCQSet => {
    const newSet: MCQSet = {
      id: "mcq-" + Math.random().toString(36).substr(2, 9),
      noteId,
      title,
      questions,
    };
    const updated = [newSet, ...mcqSets];
    setMcqSets(updated);
    syncState("mcqSets", updated);

    // Sync to backend DB
    fetch("/api/mcqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newSet.id,
        note_id: newSet.noteId,
        title: newSet.title,
        questions_json: JSON.stringify(newSet.questions)
      })
    }).catch(err => console.error("Failed to sync MCQSet with backend DB:", err));

    return newSet;
  };

  const addFlashcard = (noteId: string, front: string, back: string) => {
    const newCard: Flashcard = {
      id: "fc-" + Math.random().toString(36).substr(2, 9),
      noteId,
      front,
      back,
      learned: false,
    };
    const updated = [newCard, ...flashcards];
    setFlashcards(updated);
    syncState("flashcards", updated);

    // Sync to backend DB
    fetch("/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newCard.id,
        note_id: newCard.noteId,
        front: newCard.front,
        back: newCard.back,
        learned: newCard.learned
      })
    }).catch(err => console.error("Failed to sync flashcard with backend DB:", err));
  };

  const toggleFlashcardLearned = (id: string) => {
    const card = flashcards.find(c => c.id === id);
    const updated = flashcards.map((c) =>
      c.id === id ? { ...c, learned: !c.learned } : c
    );
    setFlashcards(updated);
    syncState("flashcards", updated);

    if (card) {
      // Sync to backend DB
      fetch(`/api/flashcards/${id}?learned=${!card.learned}`, { method: "PUT" })
        .catch(err => console.error("Failed to sync flashcard learned state with backend DB:", err));
    }
  };

  const deleteFlashcard = (id: string) => {
    const updated = flashcards.filter((c) => c.id !== id);
    setFlashcards(updated);
    syncState("flashcards", updated);

    // Sync to backend DB
    fetch(`/api/flashcards/${id}`, { method: "DELETE" })
      .catch(err => console.error("Failed to sync flashcard deletion with backend DB:", err));
  };

  const setPlannerData = (data: StudyPlanner) => {
    setPlanner(data);
    syncState("planner", data);

    // Sync to backend DB
    fetch("/api/planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: "plan-" + (user?.uid || "mock-student-123"),
        uid: user?.uid || "mock-student-123",
        exam_date: data.examDate,
        subjects: data.subjects,
        hours: data.hours,
        plan_json: JSON.stringify({
          dailyPlan: data.dailyPlan,
          weeklySchedule: data.weeklySchedule,
          revisionTasks: data.revisionTasks
        })
      })
    }).catch(err => console.error("Failed to sync planner data with backend DB:", err));
  };

  const sendChatMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: "msg-" + Date.now() + "-user",
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    const currentMsgs = [...chatMessages, userMsg];
    setChatMessages(currentMsgs);
    syncState("chatMessages", currentMsgs);

    // Call API handler
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "tutor",
          prompt: text,
          history: currentMsgs.slice(-8) // Send recent history for context
        })
      });
      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: "msg-" + Date.now() + "-ai",
        sender: "ai",
        text: data.result || "I had trouble generating an explanation. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      const nextMsgs = [...currentMsgs, aiMsg];
      setChatMessages(nextMsgs);
      syncState("chatMessages", nextMsgs);
    } catch (e) {
      console.error(e);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("chatMessages");
    }
  };

  const saveQuizAttempt = (attempt: Omit<QuizAttempt, "id" | "date">) => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: "quiz-att-" + Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString([], { month: "short", day: "numeric" }),
    };
    const updated = [newAttempt, ...quizAttempts];
    setQuizAttempts(updated);
    syncState("quizAttempts", updated);

    // Sync to backend DB
    fetch("/api/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: newAttempt.id,
        uid: user?.uid || "mock-student-123",
        title: newAttempt.title,
        date: newAttempt.date,
        score: newAttempt.score,
        total_questions: newAttempt.totalQuestions,
        time_spent: newAttempt.timeSpent,
        percentage: newAttempt.percentage,
        performance: newAttempt.performance
      })
    }).catch(err => console.error("Failed to sync quiz attempt with backend DB:", err));

    // Increment streak and stats
    const newStreak = streak + 1;
    setStreak(newStreak);
    syncState("streak", newStreak);

    // Auto add notifications
    const newNotif = {
      id: "notif-" + Date.now(),
      text: `You completed the "${attempt.title}" quiz with a score of ${attempt.score}/${attempt.totalQuestions} (${attempt.percentage}%)!`,
      time: "Just now",
      read: false
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    syncState("notifications", updatedNotifs);
  };

  const addStudyHours = (hours: number) => {
    const updated = Math.round((studyHours + hours) * 10) / 10;
    setStudyHours(updated);
    syncState("studyHours", updated);
  };

  const markNotificationsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    syncState("notifications", updated);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        theme,
        notes,
        summaries,
        mcqSets,
        flashcards,
        planner,
        chatMessages,
        quizAttempts,
        streak,
        studyHours,
        notifications,
        toggleTheme,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        addNote,
        deleteNote,
        addSummary,
        deleteSummary,
        addMCQSet,
        addFlashcard,
        toggleFlashcardLearned,
        deleteFlashcard,
        setPlannerData,
        sendChatMessage,
        clearChat,
        saveQuizAttempt,
        addStudyHours,
        markNotificationsRead
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
