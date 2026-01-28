"use client";
import { motion } from "framer-motion";
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
    
    // Get random quote and joke based on day
    const today = new Date().getDate();
    setDailyQuote(motivationalQuotes[today % motivationalQuotes.length]);
    setDailyJoke(jokes[today % jokes.length]);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const displayedAttempts = showAllExams ? attempts : attempts.slice(0, 3);

  return (
    <div className="min-h-screen pt-4 pb-8 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Top 3 Cards: Notifications, Feeds/News, Actionable Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          {/* Notifications Card */}
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <span className="text-blue-600 dark:text-blue-400">🔔</span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Notifications</h2>
              </div>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-2">
                    <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                      notification.isNew ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`} />
                    <p className="text-sm text-slate-600 dark:text-slate-400">{notification.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Feeds/News Card */}
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                  <span className="text-amber-600 dark:text-amber-400">📰</span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Feeds/News</h2>
              </div>
              <div className="space-y-3">
                {feedsNews.map((news) => (
                  <p key={news.id} className="text-sm text-slate-600 dark:text-slate-400 italic">
                    &ldquo;{news.text}&rdquo;
                  </p>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Actionable Items Card */}
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <span className="text-emerald-600 dark:text-emerald-400">✅</span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Actionable Items</h2>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Complete Mock Test 3</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/neet/full-mock")}
                    className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors"
                  >
                    Start
                  </motion.button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Review Physics Chapter 5</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/analytics")}
                    className="rounded-full bg-sky-500 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-600 transition-colors"
                  >
                    Review
                  </motion.button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Attempt Daily Puzzle</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full bg-purple-500 px-3 py-1 text-xs font-semibold text-white hover:bg-purple-600 transition-colors"
                  >
                    Play
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* My Recent Exams - Full Width Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  <span>📋</span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">My Recent Exams</h2>
              </div>
              {attempts.length > 3 && (
                <button
                  onClick={() => setShowAllExams(!showAllExams)}
                  className="text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 text-xs font-semibold transition-colors"
                >
                  {showAllExams ? "Show Less" : `More (${attempts.length - 3})`}
                </button>
              )}
            </div>

            {attempts.length > 0 ? (
              <div className={`space-y-3 ${showAllExams ? 'max-h-80 overflow-y-auto pr-2' : ''}`}>
                {displayedAttempts.map((attempt, index) => (
                  <motion.div
                    key={attempt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex items-center justify-between rounded-xl border p-4 transition-all hover:shadow-md ${
                      attempt.examType === "JEE"
                        ? "border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-900/10"
                        : "border-green-200 dark:border-green-800/50 bg-green-50/50 dark:bg-green-900/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${
                        attempt.examType === "JEE"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-green-100 dark:bg-green-900/30"
                      }`}>
                        {attempt.examType === "JEE" ? "🧮" : "🔬"}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          {attempt.examType} Mock Test {attempts.length - attempts.indexOf(attempt)}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Score: {attempt.correct}/{attempt.totalQuestions} | Date: {formatTimestamp(attempt.timestamp)}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/analytics/review?id=${attempt.id}`)}
                      className={`rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-colors ${
                        attempt.examType === "JEE"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      View Details
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">No exams attempted yet. Start your first mock test!</p>
                <div className="flex justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/jee/full-mock")}
                    className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-600 transition-colors"
                  >
                    🧮 Take JEE Mock
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/neet/full-mock")}
                    className="rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white hover:bg-green-600 transition-colors"
                  >
                    🔬 Take NEET Mock
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bottom 3 Cards: Motivational Quote, Joke, Challenges */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {/* Motivational Quote Card */}
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                  <span className="text-yellow-600 dark:text-yellow-400 text-lg">&ldquo;&rdquo;</span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Motivational Quote</h2>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                  &ldquo;{dailyQuote.quote}&rdquo;
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 text-right">
                  - {dailyQuote.author}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Joke of the Day Card */}
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 dark:bg-pink-900/30">
                  <span className="text-pink-600 dark:text-pink-400">😄</span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Joke</h2>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {dailyJoke}
              </p>
            </div>
          </motion.div>

          {/* Challenges Card */}
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <span className="text-orange-600 dark:text-orange-400">🧩</span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Challenges</h2>
              </div>
              <div className="space-y-2.5">
                {challenges.slice(0, 2).map((challenge) => (
                  <div key={challenge.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{challenge.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500">Difficulty: {challenge.difficulty}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white hover:bg-orange-600 transition-colors"
                    >
                      Play
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
