"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getTestAttempts,
  formatTimestamp,
  TestAttempt,
} from "@/lib/testStorage";

// Sample data - In production, these would come from an API
const notifications = [
  { id: 1, text: "New mock test available for JEE.", type: "info", isNew: true },
  { id: 2, text: "Your weekly performance report is ready.", type: "success", isNew: true },
  { id: 3, text: "New challenge: Daily Sudoku.", type: "challenge", isNew: false },
];

const feedsNews = [
  { id: 1, text: "Top strategies for NEET 2026 revealed!" },
  { id: 2, text: "JEE Main 2026 application dates extended." },
  { id: 3, text: "New study material for Chemistry available." },
];

const motivationalQuotes = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
];

const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "Why did the student eat his homework? Because the teacher told him it was a piece of cake!",
  "Why was the math book sad? Because it had too many problems.",
  "What do you call a bear with no teeth? A gummy bear!",
];

const challenges = [
  { id: 1, name: "Daily Sudoku", difficulty: "Medium", type: "puzzle" },
  { id: 2, name: "Weekly Puzzle", difficulty: "Hard", type: "puzzle" },
  { id: 3, name: "Math Brain Teaser", difficulty: "Easy", type: "brain-teaser" },
];

export default function Dashboard() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [showAllExams, setShowAllExams] = useState(false);
  const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0]);
  const [dailyJoke, setDailyJoke] = useState(jokes[0]);

  useEffect(() => {
    const allAttempts = getTestAttempts();
    setAttempts(allAttempts);
    
    const today = new Date().getDate();
    setDailyQuote(motivationalQuotes[today % motivationalQuotes.length]);
    setDailyJoke(jokes[today % jokes.length]);
  }, []);

  const displayedAttempts = showAllExams ? attempts : attempts.slice(0, 3);

  return (
    <div className="min-h-screen py-3 px-2">
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Top Row: Notifications, Feeds/News, Actionable Items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Notifications Card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200/80 dark:border-slate-800/80 p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-[15px]">🔔</span>
              <h2 className="text-[13px] font-medium text-slate-700 dark:text-slate-200">Notifications</h2>
            </div>
            <div className="space-y-1.5">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-1.5">
                  <div className={`mt-[5px] w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    notification.isNew ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`} />
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-[1.4]">{notification.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Feeds/News Card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200/80 dark:border-slate-800/80 p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-[15px]">📰</span>
              <h2 className="text-[13px] font-medium text-slate-700 dark:text-slate-200">Feeds/News</h2>
            </div>
            <div className="space-y-1.5">
              {feedsNews.map((news) => (
                <p key={news.id} className="text-[11px] text-slate-600 dark:text-slate-400 leading-[1.4] italic">
                  "{news.text}"
                </p>
              ))}
            </div>
          </div>

          {/* Actionable Items Card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200/80 dark:border-slate-800/80 p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-[15px]">✅</span>
              <h2 className="text-[13px] font-medium text-slate-700 dark:text-slate-200">Actionable Items</h2>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-600 dark:text-slate-400">Complete Mock Test 3</span>
                  <button
                    onClick={() => router.push("/student/neet/full-mock")}
                  className="h-[26px] px-2.5 text-[10px] font-medium text-white bg-emerald-500 hover:bg-emerald-600 rounded-md transition-colors"
                >
                  Start
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-600 dark:text-slate-400">Review Physics Chapter 5</span>
                  <button
                    onClick={() => router.push("/student/analytics")}
                  className="h-[26px] px-2.5 text-[10px] font-medium text-white bg-sky-500 hover:bg-sky-600 rounded-md transition-colors"
                >
                  Review
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-600 dark:text-slate-400">Attempt Daily Puzzle</span>
                <button className="h-[26px] px-2.5 text-[10px] font-medium text-white bg-violet-500 hover:bg-violet-600 rounded-md transition-colors">
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* My Recent Exams - Full Width */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200/80 dark:border-slate-800/80 p-3">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px]">📋</span>
              <h2 className="text-[13px] font-medium text-slate-700 dark:text-slate-200">My Recent Exams</h2>
            </div>
            {attempts.length > 3 && (
              <button
                onClick={() => setShowAllExams(!showAllExams)}
                className="text-[11px] font-medium text-sky-600 hover:text-sky-700 dark:text-sky-400 transition-colors"
              >
                {showAllExams ? "Show Less" : `More (${attempts.length - 3})`}
              </button>
            )}
          </div>

          {attempts.length > 0 ? (
            <div className={`space-y-1.5 ${showAllExams ? 'max-h-52 overflow-y-auto' : ''}`}>
              {displayedAttempts.map((attempt, index) => (
                <div
                  key={attempt.id}
                  className={`flex items-center justify-between rounded-md border px-2.5 py-2 ${
                    attempt.examType === "JEE"
                      ? "border-blue-200/80 dark:border-blue-800/40 bg-blue-50/60 dark:bg-blue-950/20"
                      : "border-green-200/80 dark:border-green-800/40 bg-green-50/60 dark:bg-green-950/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center text-sm ${
                      attempt.examType === "JEE"
                        ? "bg-blue-100 dark:bg-blue-900/40"
                        : "bg-green-100 dark:bg-green-900/40"
                    }`}>
                      {attempt.examType === "JEE" ? "🧮" : "🔬"}
                    </div>
                    <div>
                      <h3 className="text-[11px] font-medium text-slate-700 dark:text-slate-200">
                        {attempt.examType} Mock Test {attempts.length - index}
                      </h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        Score: {attempt.correct}/{attempt.totalQuestions} | {formatTimestamp(attempt.timestamp)}
                      </p>
                    </div>
                  </div>
                    <button
                      onClick={() => router.push(`/student/analytics/review?id=${attempt.id}`)}
                    className={`h-[26px] px-2.5 text-[10px] font-medium text-white rounded-md transition-colors ${
                      attempt.examType === "JEE"
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">No exams attempted yet. Start your first mock test!</p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => router.push("/student/jee/full-mock")}
                  className="h-[28px] px-3 text-[10px] font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
                >
                  🧮 Take JEE Mock
                </button>
                  <button
                    onClick={() => router.push("/student/neet/full-mock")}
                  className="h-[28px] px-3 text-[10px] font-medium text-white bg-green-500 hover:bg-green-600 rounded-md transition-colors"
                >
                  🔬 Take NEET Mock
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Row: Quote, Joke, Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Motivational Quote Card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200/80 dark:border-slate-800/80 p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-[15px]">💬</span>
              <h2 className="text-[13px] font-medium text-slate-700 dark:text-slate-200">Quote</h2>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 italic leading-[1.4] mb-1">
              "{dailyQuote.quote}"
            </p>
            <p className="text-[10px] text-slate-500 text-right">— {dailyQuote.author}</p>
          </div>

          {/* Joke Card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200/80 dark:border-slate-800/80 p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-[15px]">😄</span>
              <h2 className="text-[13px] font-medium text-slate-700 dark:text-slate-200">Joke</h2>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-[1.4]">{dailyJoke}</p>
          </div>

          {/* Challenges Card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg border border-slate-200/80 dark:border-slate-800/80 p-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-[15px]">🧩</span>
              <h2 className="text-[13px] font-medium text-slate-700 dark:text-slate-200">Challenges</h2>
            </div>
            <div className="space-y-1.5">
              {challenges.slice(0, 2).map((challenge) => (
                <div key={challenge.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{challenge.name}</p>
                    <p className="text-[10px] text-slate-500">{challenge.difficulty}</p>
                  </div>
                  <button className="h-[26px] px-2.5 text-[10px] font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors">
                    Play
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
