import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduMind - Learn Smarter with AI",
  description: "Upload notes, generate summaries, create quizzes, build flashcards, and learn smarter with EduMind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      style={{ colorScheme: "light dark" }}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
