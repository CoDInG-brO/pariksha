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
    <div className="min-h-screen pt-28 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-start justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Monitor your Progress</h1>
            <p className="text-slate-500 text-lg">Track your preparation in real-time across CAT & NEET</p>
          </div>
          {attempts.length > 0 && (
            <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
              {attempts.length} test{attempts.length > 1 ? 's' : ''}
            </div>
          )}
        </motion.div>

        {/* Exam Performance Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* CAT Performance Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-3xl p-8 border border-blue-200/50 h-full hover:shadow-lg transition-all duration-300 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl shadow-sm">
                    📊
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">CAT Performance</h2>
                    <p className="text-slate-500 text-sm">Common Admission Test</p>
                  </div>
                </div>
                {catStats && (
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {catStats.totalAttempts} attempt{catStats.totalAttempts > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {catStats ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl p-5 border border-blue-100/50 hover:border-blue-200 transition-all">
                      <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Best Score</p>
                      <p className="text-4xl font-bold text-blue-600 mb-1">{catStats.bestScore}%</p>
                      <p className="text-blue-600/70 text-xs font-medium">{catStats.bestPercentile}%ile</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl p-5 border border-blue-100/50 hover:border-blue-200 transition-all">
                      <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Latest Score</p>
                      <p className="text-4xl font-bold text-slate-900 mb-1">{catStats.latestScore}%</p>
                      <p className="text-slate-600 text-xs font-medium">{catStats.latestPercentile}%ile</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl p-5 border border-blue-100/50 hover:border-blue-200 transition-all">
                      <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Average</p>
                      <p className="text-3xl font-bold text-slate-800">{catStats.avgPercentage}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl p-5 border border-blue-100/50 hover:border-blue-200 transition-all">
                      <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Accuracy</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {((catStats.totalCorrect / catStats.totalQuestions) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/cat/full-mock")}
                      className="flex-1 btn-gradient-blue"
                    >
                      Take New Test
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/analytics/review?id=${catAttempts[0]?.id}`)}
                      className="px-6 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-700 text-sm font-bold transition-all"
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
            <div className="bg-white rounded-3xl p-8 border border-green-200/50 h-full hover:shadow-lg transition-all duration-300 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-2xl shadow-sm">
                    🔬
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">NEET Performance</h2>
                    <p className="text-slate-500 text-sm">National Eligibility cum Entrance Test</p>
                  </div>
                </div>
                {neetStats && (
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    {neetStats.totalAttempts} attempt{neetStats.totalAttempts > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {neetStats ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-green-50/50 rounded-2xl p-5 border border-green-100/50 hover:border-green-200 transition-all">
                      <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Best Score</p>
                      <p className="text-4xl font-bold text-green-600 mb-1">{neetStats.bestScore}%</p>
                      <p className="text-green-600/70 text-xs font-medium">{neetStats.bestPercentile}%ile</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-50/50 rounded-2xl p-5 border border-green-100/50 hover:border-green-200 transition-all">
                      <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Latest Score</p>
                      <p className="text-4xl font-bold text-slate-900 mb-1">{neetStats.latestScore}%</p>
                      <p className="text-slate-600 text-xs font-medium">{neetStats.latestPercentile}%ile</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-50/50 rounded-2xl p-5 border border-green-100/50 hover:border-green-200 transition-all">
                      <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Average</p>
                      <p className="text-3xl font-bold text-slate-800">{neetStats.avgPercentage}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-50/50 rounded-2xl p-5 border border-green-100/50 hover:border-green-200 transition-all">
                      <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Accuracy</p>
                      <p className="text-3xl font-bold text-green-600">
                        {((neetStats.totalCorrect / neetStats.totalQuestions) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push("/neet/full-mock")}
                      className="flex-1 btn-gradient-green"
                    >
                      Take New Test
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/analytics/review?id=${neetAttempts[0]?.id}`)}
                      className="px-6 py-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl text-green-700 text-sm font-bold transition-all"
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
                      className="btn-gradient-green"
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Practice Mode Card */}
          <div className="bg-white rounded-3xl p-8 border border-purple-200/50 hover:shadow-lg transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center text-2xl shadow-sm">
                  ✏️
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Practice Mode</h2>
                  <p className="text-slate-500 text-sm">
                    {practiceProgress && practiceProgress.answeredQuestions.length > 0 && practiceProgress.answeredQuestions.length < practiceProgress.totalQuestions
                      ? `${practiceProgress.examType} Session`
                      : "CAT & NEET Questions"}
                  </p>
                </div>
              </div>
              {practiceProgress && practiceProgress.answeredQuestions.length > 0 && practiceProgress.answeredQuestions.length < practiceProgress.totalQuestions && (
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  In Progress
                </span>
              )}
            </div>

            {practiceProgress && practiceProgress.answeredQuestions.length > 0 && practiceProgress.answeredQuestions.length < practiceProgress.totalQuestions ? (
              <>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-50/50 rounded-2xl p-5 border border-purple-100/50 hover:border-purple-200 transition-all text-center">
                    <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Answered</p>
                    <p className="text-4xl font-bold text-purple-600 mb-1">
                      {practiceProgress.answeredQuestions.length}/{practiceProgress.totalQuestions}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-50/50 rounded-2xl p-5 border border-green-100/50 hover:border-green-200 transition-all text-center">
                    <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Correct</p>
                    <p className="text-4xl font-bold text-green-600">{practiceProgress.correctAnswers}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-50/50 rounded-2xl p-5 border border-orange-100/50 hover:border-orange-200 transition-all text-center">
                    <p className="text-slate-500 text-xs font-bold mb-2 uppercase tracking-wider">Remaining</p>
                    <p className="text-4xl font-bold text-orange-600">
                      {practiceProgress.totalQuestions - practiceProgress.answeredQuestions.length}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-slate-600 mb-3 font-semibold">
                    <span className="uppercase tracking-wider">Progress</span>
                    <span>{Math.round((practiceProgress.answeredQuestions.length / practiceProgress.totalQuestions) * 100)}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(practiceProgress.answeredQuestions.length / practiceProgress.totalQuestions) * 100}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-700"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/practice")}
                  className="w-full btn-gradient-blue"
                >
                  Continue Practice →
                </motion.button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-slate-500 text-center mb-6">Practice with random CAT & NEET questions</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/practice")}
                  className="w-full btn-gradient-blue"
                >
                  Start Practice →
                </motion.button>
              </div>
            )}
          </div>

          {/* Recent Tests Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/50 hover:shadow-lg transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl shadow-sm">
                  📋
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Recent Tests</h2>
              </div>
              {attempts.length > 0 && (
                <button
                  onClick={() => router.push("/analytics")}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-bold uppercase tracking-wider transition-all"
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
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                      attempt.examType === "CAT" 
                        ? "bg-blue-50/50 border-blue-100/50 hover:border-blue-200 hover:bg-blue-50" 
                        : "bg-green-50/50 border-green-100/50 hover:border-green-200 hover:bg-green-50"
                    }`}
                    onClick={() => router.push(`/analytics/review?id=${attempt.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-2xl w-10 h-10 rounded-xl flex items-center justify-center font-bold ${attempt.examType === "CAT" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                        {attempt.examType === "CAT" ? "📊" : "🔬"}
                      </span>
                      <div>
                        <p className="text-slate-900 font-bold text-sm">{attempt.examType} Mock</p>
                        <p className="text-slate-500 text-xs font-medium">
                          {formatTimestamp(attempt.timestamp)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${
                        parseFloat(attempt.percentage) >= 70 ? "text-green-600" : 
                        parseFloat(attempt.percentage) >= 50 ? "text-orange-600" : "text-red-600"
                      }`}>
                        {attempt.percentage}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-slate-500 text-center mb-8 text-sm">No tests attempted yet - start with a mock</p>
                <div className="flex gap-3 w-full">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/cat/full-mock")}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border border-blue-200 rounded-xl text-blue-50 text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
                  >
                    📊 CAT Mock
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/neet/full-mock")}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 border border-green-200 rounded-xl text-green-50 text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
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
            <div className="bg-white rounded-3xl p-12 border border-slate-200/50 max-w-2xl mx-auto hover:shadow-lg transition-all shadow-sm">
              <span className="text-6xl mb-6 block">🎯</span>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Start Your Preparation Journey!</h2>
              <p className="text-slate-600 mb-8 text-lg">
                Take your first mock test to see your performance analytics here.
                Track your progress, identify weak areas, and ace your exams!
              </p>
              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/cat/full-mock")}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl text-white font-bold shadow-md hover:shadow-lg transition-all"
                >
                  📊 Start CAT Mock
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push("/neet/full-mock")}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl text-white font-bold shadow-md hover:shadow-lg transition-all"
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
