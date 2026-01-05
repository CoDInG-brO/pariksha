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
  const [catAttempts, setCatAttempts] = useState<TestAttempt[]>([]);
  const [neetAttempts, setNeetAttempts] = useState<TestAttempt[]>([]);
  const [practiceProgress, setPracticeProgress] = useState<PracticeProgress | null>(null);

  useEffect(() => {
    const allAttempts = getTestAttempts();
    setAttempts(allAttempts);
    setCatAttempts(getAttemptsByExamType("CAT"));
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

  const catStats = calculateStats(catAttempts);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Track your CAT & NEET preparation progress</p>
        </motion.div>

        {/* Exam Performance Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
        >
          {/* CAT Performance Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-2xl p-6 border border-blue-500/20 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">CAT Performance</h2>
                    <p className="text-gray-400 text-sm">Common Admission Test</p>
                  </div>
                </div>
                {catStats && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-semibold">
                    {catStats.totalAttempts} Attempt{catStats.totalAttempts > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {catStats ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Best Score</p>
                      <p className="text-3xl font-bold text-blue-400">{catStats.bestScore}%</p>
                      <p className="text-blue-300/60 text-xs">{catStats.bestPercentile}%ile</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Latest Score</p>
                      <p className="text-3xl font-bold text-white">{catStats.latestScore}%</p>
                      <p className="text-gray-400 text-xs">{catStats.latestPercentile}%ile</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Average</p>
                      <p className="text-2xl font-bold text-gray-300">{catStats.avgPercentage}%</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Accuracy</p>
                      <p className="text-2xl font-bold text-green-400">
                        {((catStats.totalCorrect / catStats.totalQuestions) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/cat/full-mock")}
                      className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white text-sm font-medium transition-all"
                    >
                      Take New Test
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/analytics/review?id=${catAttempts[0]?.id}`)}
                      className="px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-300 text-sm font-medium transition-all"
                    >
                      Review Last
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No CAT tests attempted yet</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/cat/full-mock")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white font-semibold transition-all"
                  >
                    Take Your First CAT Mock →
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>

          {/* NEET Performance Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl p-6 border border-green-500/20 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔬</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">NEET Performance</h2>
                    <p className="text-gray-400 text-sm">National Eligibility cum Entrance Test</p>
                  </div>
                </div>
                {neetStats && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">
                    {neetStats.totalAttempts} Attempt{neetStats.totalAttempts > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {neetStats ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Best Score</p>
                      <p className="text-3xl font-bold text-green-400">{neetStats.bestScore}%</p>
                      <p className="text-green-300/60 text-xs">{neetStats.bestPercentile}%ile</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Latest Score</p>
                      <p className="text-3xl font-bold text-white">{neetStats.latestScore}%</p>
                      <p className="text-gray-400 text-xs">{neetStats.latestPercentile}%ile</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Average</p>
                      <p className="text-2xl font-bold text-gray-300">{neetStats.avgPercentage}%</p>
                    </div>
                    <div className="bg-black/20 rounded-xl p-4">
                      <p className="text-gray-400 text-xs mb-1">Accuracy</p>
                      <p className="text-2xl font-bold text-green-400">
                        {((neetStats.totalCorrect / neetStats.totalQuestions) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/neet/full-mock")}
                      className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white text-sm font-medium transition-all"
                    >
                      Take New Test
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/analytics/review?id=${neetAttempts[0]?.id}`)}
                      className="px-4 py-2.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-300 text-sm font-medium transition-all"
                    >
                      Review Last
                    </motion.button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No NEET tests attempted yet</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/neet/full-mock")}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white font-semibold transition-all"
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
        >
          {/* Practice Mode Card */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl p-6 border border-purple-500/20 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✏️</span>
                <div>
                  <h2 className="text-xl font-bold text-white">Practice Mode</h2>
                  <p className="text-gray-400 text-sm">
                    {practiceProgress && practiceProgress.answeredQuestions.length > 0 && practiceProgress.answeredQuestions.length < practiceProgress.totalQuestions
                      ? `${practiceProgress.examType} Session`
                      : "CAT & NEET Questions"}
                  </p>
                </div>
              </div>
              {practiceProgress && practiceProgress.answeredQuestions.length > 0 && practiceProgress.answeredQuestions.length < practiceProgress.totalQuestions && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold">
                  In Progress
                </span>
              )}
            </div>

            {practiceProgress && practiceProgress.answeredQuestions.length > 0 && practiceProgress.answeredQuestions.length < practiceProgress.totalQuestions ? (
              <>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-black/20 rounded-xl p-3 text-center">
                    <p className="text-gray-400 text-xs mb-1">Answered</p>
                    <p className="text-xl font-bold text-purple-400">
                      {practiceProgress.answeredQuestions.length}/{practiceProgress.totalQuestions}
                    </p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 text-center">
                    <p className="text-gray-400 text-xs mb-1">Correct</p>
                    <p className="text-xl font-bold text-green-400">{practiceProgress.correctAnswers}</p>
                  </div>
                  <div className="bg-black/20 rounded-xl p-3 text-center">
                    <p className="text-gray-400 text-xs mb-1">Remaining</p>
                    <p className="text-xl font-bold text-gray-300">
                      {practiceProgress.totalQuestions - practiceProgress.answeredQuestions.length}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Progress</span>
                    <span>{Math.round((practiceProgress.answeredQuestions.length / practiceProgress.totalQuestions) * 100)}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(practiceProgress.answeredQuestions.length / practiceProgress.totalQuestions) * 100}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/practice")}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl text-white text-sm font-medium transition-all"
                >
                  Continue Practice →
                </motion.button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-gray-400 text-center mb-4">Practice with random CAT & NEET questions</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/practice")}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl text-white text-sm font-medium transition-all"
                >
                  Start Practice →
                </motion.button>
              </div>
            )}
          </div>

          {/* Recent Tests Card */}
          <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10 h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recent Tests</h2>
              {attempts.length > 0 && (
                <button
                  onClick={() => router.push("/analytics")}
                  className="text-accent hover:text-accent/80 text-sm font-semibold transition-all"
                >
                  View All →
                </button>
              )}
            </div>
            
            {attempts.length > 0 ? (
              <div className="space-y-3">
                {attempts.slice(0, 4).map((attempt, index) => (
                  <motion.div
                    key={attempt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                    onClick={() => router.push(`/analytics/review?id=${attempt.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xl ${attempt.examType === "CAT" ? "text-blue-400" : "text-green-400"}`}>
                        {attempt.examType === "CAT" ? "📊" : "🔬"}
                      </span>
                      <div>
                        <p className="text-white font-semibold text-sm">{attempt.examType} Mock</p>
                        <p className="text-gray-400 text-xs">
                          {formatTimestamp(attempt.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        parseFloat(attempt.percentage) >= 70 ? "text-green-400" : 
                        parseFloat(attempt.percentage) >= 50 ? "text-yellow-400" : "text-red-400"
                      }`}>
                        {attempt.percentage}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <p className="text-gray-400 text-center mb-4">No tests attempted yet</p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/cat/full-mock")}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 text-sm font-semibold transition-all"
                  >
                    📊 CAT Mock
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/neet/full-mock")}
                    className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 text-sm font-semibold transition-all"
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
            className="text-center py-16"
          >
            <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-12 border border-white/10 max-w-2xl mx-auto">
              <span className="text-6xl mb-6 block">🎯</span>
              <h2 className="text-2xl font-bold text-white mb-4">Start Your Preparation Journey!</h2>
              <p className="text-gray-400 mb-8">
                Take your first mock test to see your performance analytics here.
                Track your progress, identify weak areas, and ace your exams!
              </p>
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/cat/full-mock")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white font-semibold transition-all"
                >
                  📊 Start CAT Mock
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/neet/full-mock")}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white font-semibold transition-all"
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
