"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getTestAttempts,
  getAttemptsByExamType,
  formatTimestamp,
  formatTimeSpent,
  TestAttempt,
  getPracticeProgress,
  PracticeProgress
} from "@/lib/testStorage";

export default function Dashboard() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [jeeAttempts, setJeeAttempts] = useState<TestAttempt[]>([]);
  const [neetAttempts, setNeetAttempts] = useState<TestAttempt[]>([]);
  const [practiceProgress, setPracticeProgress] = useState<PracticeProgress | null>(null);

  useEffect(() => {
    const allAttempts = getTestAttempts();
    setAttempts(allAttempts);
    setJeeAttempts(getAttemptsByExamType("JEE"));
    setNeetAttempts(getAttemptsByExamType("NEET"));
    setPracticeProgress(getPracticeProgress());
  }, []);

  // Calculate stats for each exam type
  const calculateStats = (attempts: TestAttempt[]) => {
    if (attempts.length === 0) return null;
    
    const totalAttempts = attempts.length;
    const avgPercentage = attempts.reduce((sum, a) => sum + parseFloat(a.percentage), 0) / totalAttempts;
    const bestAttempt = attempts.reduce((best, a) => 
      parseFloat(a.percentage) > parseFloat(best.percentage) ? a : best
    , attempts[0]);
    const latestAttempt = attempts[0]; // Already sorted by most recent
    
    return {
      totalAttempts,
      avgPercentage: avgPercentage.toFixed(1),
      bestScore: bestAttempt.percentage,
      bestPercentile: bestAttempt.estimatedPercentile,
      latestScore: latestAttempt.percentage,
      latestPercentile: latestAttempt.estimatedPercentile,
      totalCorrect: attempts.reduce((sum, a) => sum + a.correct, 0),
      totalQuestions: attempts.reduce((sum, a) => sum + a.totalQuestions, 0),
    };
  };

  const jeeStats = calculateStats(jeeAttempts);
  const neetStats = calculateStats(neetAttempts);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen pt-4 pb-8 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 flex items-start justify-between gap-4"
        >
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">Monitor your Progress</h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Track your preparation in real-time across JEE & NEET</p>
          </div>
          {attempts.length > 0 && (
            <div className="rounded-full bg-sky-100 dark:bg-sky-900/30 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-sky-700 dark:text-sky-300">
              {attempts.length} test{attempts.length > 1 ? 's' : ''}
            </div>
          )}
        </motion.div>

        {/* Exam Performance Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
        >
          {/* JEE Performance Card */}
          <motion.div variants={itemVariants}>
            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.08)] dark:shadow-none transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-base shadow-sm">
                    📊
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">JEE Performance</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-[0.65rem] uppercase tracking-[0.3em]">Joint Entrance Examination</p>
                  </div>
                </div>
                {jeeStats && (
                  <span className="rounded-full bg-sky-100 dark:bg-sky-900/30 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-sky-700 dark:text-sky-300">
                    {jeeStats.totalAttempts} attempt{jeeStats.totalAttempts > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {jeeStats ? (
                <>
                  <div className="grid grid-cols-2 gap-2.5 mb-5">
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3">
                      <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Best Score</p>
                      <p className="text-xl font-semibold text-sky-600 dark:text-sky-400 mb-0.5">{jeeStats.bestScore}%</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[0.65rem]">{jeeStats.bestPercentile}%ile</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3">
                      <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Latest Score</p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white mb-0.5">{jeeStats.latestScore}%</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[0.65rem]">{jeeStats.latestPercentile}%ile</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3">
                      <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Average</p>
                      <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{jeeStats.avgPercentage}%</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3">
                      <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Accuracy</p>
                      <p className="text-lg font-semibold text-sky-600 dark:text-sky-400">
                        {((jeeStats.totalCorrect / jeeStats.totalQuestions) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/jee/full-mock")}
                      className="rounded-full bg-[#0ea5e9] px-3.5 py-2 text-[0.65rem] font-semibold text-white shadow-sm transition-all hover:bg-sky-500"
                    >
                      Take New Test
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/analytics/review?id=${jeeAttempts[0]?.id}`)}
                      className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-[0.65rem] font-semibold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Review Last
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <p className="text-slate-500 dark:text-slate-400 mb-2 text-xs">No JEE tests attempted yet</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/jee/full-mock")}
                    className="rounded-full bg-[#0ea5e9] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-sky-500"
                  >
                    Take Your First JEE Mock →
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* NEET Performance Card */}
          <motion.div variants={itemVariants}>
            <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.08)] dark:shadow-none transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-base shadow-sm">
                    🔬
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">NEET Performance</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-[0.65rem] uppercase tracking-[0.3em]">National Eligibility cum Entrance Test</p>
                  </div>
                </div>
                {neetStats && (
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-emerald-700 dark:text-emerald-300">
                    {neetStats.totalAttempts} attempt{neetStats.totalAttempts > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {neetStats ? (
                <>
                  <div className="grid grid-cols-2 gap-2.5 mb-5">
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3">
                      <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Best Score</p>
                      <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mb-0.5">{neetStats.bestScore}%</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[0.65rem]">{neetStats.bestPercentile}%ile</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3">
                      <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Latest Score</p>
                      <p className="text-xl font-semibold text-slate-900 dark:text-white mb-0.5">{neetStats.latestScore}%</p>
                      <p className="text-slate-500 dark:text-slate-400 text-[0.65rem]">{neetStats.latestPercentile}%ile</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3">
                      <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Average</p>
                      <p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{neetStats.avgPercentage}%</p>
                    </div>
                    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3">
                      <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Accuracy</p>
                      <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                        {((neetStats.totalCorrect / neetStats.totalQuestions) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/neet/full-mock")}
                      className="rounded-full bg-[#10b981] px-3.5 py-2 text-[0.65rem] font-semibold text-white shadow-sm transition-all hover:bg-emerald-500"
                    >
                      Take New Test
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/analytics/review?id=${neetAttempts[0]?.id}`)}
                      className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-[0.65rem] font-semibold text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      Review Last
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <p className="text-slate-500 dark:text-slate-400 mb-2 text-xs">No NEET tests attempted yet</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/neet/full-mock")}
                      className="rounded-full bg-[#10b981] px-5 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-500"
                  >
                    Take Your First NEET Mock →
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Practice Mode & Recent Tests - 50/50 Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6"
        >
          {/* Practice Mode Card */}
          <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.08)] dark:shadow-none transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-base shadow-sm">
                  ✏️
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">Practice Mode</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                    {practiceProgress && practiceProgress.answeredQuestions.length > 0 && practiceProgress.answeredQuestions.length < practiceProgress.totalQuestions
                      ? `${practiceProgress.examType} Session`
                      : "JEE & NEET Questions"}
                  </p>
                </div>
              </div>
              {practiceProgress && practiceProgress.answeredQuestions.length > 0 && practiceProgress.answeredQuestions.length < practiceProgress.totalQuestions && (
                <span className="rounded-full bg-sky-100 dark:bg-sky-900/30 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-sky-700 dark:text-sky-300">
                  In Progress
                </span>
              )}
            </div>

            {practiceProgress && practiceProgress.answeredQuestions.length > 0 && practiceProgress.answeredQuestions.length < practiceProgress.totalQuestions ? (
              <>
                <div className="grid grid-cols-3 gap-2.5 mb-5">
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3 text-center">
                    <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Answered</p>
                    <p className="text-lg font-semibold text-sky-600 dark:text-sky-400 mb-0.5">
                      {practiceProgress.answeredQuestions.length}/{practiceProgress.totalQuestions}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3 text-center">
                    <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Correct</p>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">{practiceProgress.correctAnswers}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3 text-center">
                    <p className="mb-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Remaining</p>
                    <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                      {practiceProgress.totalQuestions - practiceProgress.answeredQuestions.length}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="mb-2 flex justify-between text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span>{Math.round((practiceProgress.answeredQuestions.length / practiceProgress.totalQuestions) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(practiceProgress.answeredQuestions.length / practiceProgress.totalQuestions) * 100}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/practice")}
                  className="w-auto rounded-full bg-[#0ea5e9] px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_32px_rgba(14,165,233,0.15)] transition-all hover:bg-sky-500"
                >
                  Continue Practice →
                </motion.button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-slate-500 dark:text-slate-400 text-center mb-3 text-xs">Practice with random JEE & NEET questions</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/practice")}
                  className="w-auto rounded-full bg-[#0ea5e9] px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_32px_rgba(14,165,233,0.15)] transition-all hover:bg-sky-500"
                >
                  Start Practice →
                </motion.button>
              </div>
            )}
          </div>

          {/* Recent Tests Card */}
          <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_25px_60px_rgba(15,23,42,0.08)] dark:shadow-none transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-base shadow-sm">
                  📋
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Tests</h2>
              </div>
              {attempts.length > 0 && (
                <button
                  onClick={() => router.push("/analytics")}
                  className="text-sky-600 hover:text-sky-700 text-[0.6rem] font-semibold uppercase tracking-[0.3em] transition-all"
                >
                  View All →
                </button>
              )}
            </div>
            
            {attempts.length > 0 ? (
              <div className="space-y-2">
                {attempts.slice(0, 4).map((attempt, index) => (
                  <motion.div
                    key={attempt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className={`flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 p-3 transition-all cursor-pointer hover:border-slate-200 ${
                      attempt.examType === "JEE" ? "" : ""
                    }`}
                    onClick={() => router.push(`/analytics/review?id=${attempt.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-base font-semibold ${attempt.examType === "JEE" ? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300" : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"}`}>
                        {attempt.examType === "JEE" ? "🧮" : "🔬"}
                      </span>
                      <div>
                        <p className="text-slate-900 dark:text-white font-semibold text-xs">{attempt.examType} Mock</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[0.65rem]">
                          {formatTimestamp(attempt.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-base font-semibold ${
                        parseFloat(attempt.percentage) >= 70 ? "text-green-600 dark:text-green-400" : 
                        parseFloat(attempt.percentage) >= 50 ? "text-orange-600 dark:text-orange-400" : "text-red-600 dark:text-red-400"
                      }`}>
                        {attempt.percentage}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-slate-500 dark:text-slate-400 text-center mb-4 text-xs">No tests attempted yet - start with a mock</p>
                <div className="flex gap-2.5 w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/jee/full-mock")}
                    className="flex-1 rounded-full bg-sky-600 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-[0_12px_32px_rgba(14,165,233,0.25)] transition-all hover:bg-sky-500"
                  >
                    🧮 JEE Mock
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/neet/full-mock")}
                    className="flex-1 rounded-full bg-emerald-600 px-3 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-[0_12px_32px_rgba(16,185,129,0.25)] transition-all hover:bg-emerald-500"
                  >
                    🔬 NEET Mock
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Empty State */}
        {attempts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center py-8"
          >
            <div className="mx-auto max-w-2xl rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)] dark:shadow-none transition-all">
              <span className="mb-3 block text-3xl">🎯</span>
              <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Start Your Preparation Journey!</h2>
              <p className="mb-4 text-xs text-slate-600 dark:text-slate-400">
                Take your first mock test to see your performance analytics here.
                Track your progress, identify weak areas, and ace your exams!
              </p>
              <div className="flex gap-2.5 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/jee/full-mock")}
                  className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_32px_rgba(14,165,233,0.25)] transition-all hover:bg-sky-500"
                >
                  🧮 Start JEE Mock
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/neet/full-mock")}
                  className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_32px_rgba(16,185,129,0.25)] transition-all hover:bg-emerald-500"
                >
                  🔬 Start NEET Mock
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
