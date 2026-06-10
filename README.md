# 🎓 EduMind - Learn Smarter with AI

EduMind is an AI-powered study companion designed to optimize academic progress. Upload lecture notes, generate structured summaries, create flashcards for active recall, generate custom practice quizzes, and discuss topics with an AI Tutor.

🔗 **Live Link**: https://edumind-eta.vercel.app

---

## ✨ Features
* **AI Tutor Chat**: Interactive tutor powered by Google Gemini to clarify formulas, normal forms, or ML concepts.
* **Structured Summaries**: Extract short, medium, or detailed takeaways from uploaded documents.
* **Interactive Flashcards**: Retain information using active recall decks.
* **Practice Quizzes**: Test knowledge with custom multiple-choice assessment sets.
* **Dynamic Study Planner**: Create customized schedules matching exam dates and targets.
* **Learning Analytics**: Track daily focus sessions, streaks, and progress.

---

## 🛠️ Tech Stack
* **Frontend**: Next.js 16 (App Router), TailwindCSS, Recharts, Framer Motion
* **Backend**: FastAPI (Python), SQLModel (SQLite / Postgres)
* **Auth**: Firebase Authentication (Google Sign-In)
* **AI Engine**: Google Gemini API

---

## 🚀 Setup & Local Execution

### 1. Environment Variables (`.env.local`)
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Run the Next.js Frontend
```bash
npm install
npm run dev
```

### 3. Run the FastAPI Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --port 8000
```

---

## ☁️ Deployment instructions (Vercel)

1. Connect this repository to your **Vercel** account.
2. In the Vercel Project settings, go to **Environment Variables** and add all variables from `.env.local`.
3. In **Authentication $\rightarrow$ Authorized domains** in the Firebase Console, add your Vercel deployment domain (e.g., `your-app.vercel.app`) so Google Sign-In is allowed to redirect back to your live site.

