"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  calculateCATPercentile,
  calculateNEETPercentile,
  estimateCollegeCategory,
  estimateIIMCategory
} from "@/lib/percentileCalculator";

import CatIcon from '@/components/icons/CatIcon';
import NeetIcon from '@/components/icons/NeetIcon';
import ReviewIcon from '@/components/icons/ReviewIcon';
import TrashIcon from '@/components/icons/TrashIcon';
import {
  getTestAttempts,
  formatTimestamp,
  formatTimeSpent,
  deleteTestAttempt,
  TestAttempt
} from "@/lib/testStorage";

export default function Analytics() {
  const router = useRouter();
  const [examType, setExamType] = useState<"CAT" | "NEET">("CAT");
  const [score, setScore] = useState<number>(150);
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [showAttempts, setShowAttempts] = useState(true);

  // Load attempts from localStorage on mount
  useEffect(() => {
    setAttempts(getTestAttempts());
  }, []);

  const handleDeleteAttempt = (id: string) => {
    if (confirm("Are you sure you want to delete this attempt?")) {
      deleteTestAttempt(id);
      setAttempts(getTestAttempts());
    }
  };

  const CATResult = calculateCATPercentile(score);
  const NEETResult = calculateNEETPercentile(score * 4); // Convert CAT-like input to NEET
  const result = examType === "CAT" ? CATResult : NEETResult;

  const estimatedColleges =
    examType === "CAT"
      ? estimateIIMCategory(result.percentile)
      : estimateCollegeCategory(result.percentile);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Percentile & Performance Analytics</h1>
            <p className="text-gray-400">See how your performance compares against other candidates</p>
          </div>
        </div>
      </motion.div>

      {/* Past Attempts Section */}
      {attempts.length > 0 && (
      <div className="bg-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-7xl mx-auto px-6 mb-12"
        >
          <div className="bg-surface rounded-2xl p-8 border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                📋 Your Test Attempts
                <span className="text-sm font-normal text-gray-400 bg-black/10 px-3 py-1 rounded-full">
                  {attempts.length} {attempts.length === 1 ? "attempt" : "attempts"}
                </span>
              </h2>
              <button
                onClick={() => setShowAttempts(!showAttempts)}
                className="text-accent hover:text-accent/80 text-sm font-semibold"
              >
                {showAttempts ? "Hide" : "Show"}
              </button>
            </div>

            {showAttempts && (
              <div className="space-y-4">
                {attempts.map((attempt, idx) => (
                  <motion.div
                    key={attempt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`bg-surface rounded-xl p-5 border ${
                      attempt.examType === "CAT"
                        ? "border-blue-500/20 hover:border-blue-500/40"
                        : "border-green-500/20 hover:border-green-500/40"
                    } transition-all`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                          attempt.examType === "CAT"
                            ? "bg-blue-500/10"
                            : "bg-green-500/10"
                        }`}>
                          {attempt.examType === "CAT" ? <CatIcon className="w-6 h-6 text-blue-400" /> : <NeetIcon className="w-6 h-6 text-green-400" />}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {attempt.examType} Full Mock Test
                          </h3>
                          <p className="text-sm text-gray-400">
                            {formatTimestamp(attempt.timestamp)} • {formatTimeSpent(attempt.timeSpent)}
                          </p>
                        </div>
                      </div>

                      {/* Middle: Stats */}
                      <div className="flex items-center gap-6 text-center">
                        <div>
                          <p className="text-2xl font-bold text-accent">{attempt.percentage}%</p>
                          <p className="text-xs text-gray-400">Score</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-400">{attempt.correct}</p>
                          <p className="text-xs text-gray-400">Correct</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-400">{attempt.incorrect}</p>
                          <p className="text-xs text-gray-400">Wrong</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-400">{attempt.unanswered}</p>
                          <p className="text-xs text-gray-400">Skipped</p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push(`/analytics/review?id=${attempt.id}`)}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${attempt.examType === "CAT" ? 'btn-enterprise' : 'btn-enterprise green'}`}
                        >
                          <ReviewIcon className="w-4 h-4 mr-2" /> Review
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteAttempt(attempt.id)}
                          className="px-3 py-2 rounded-lg btn-ghost text-red-400 border-red-500/20 hover:bg-red-500/10 transition-all text-sm"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      )}

      {/* No Attempts Message */}
      {attempts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-7xl mx-auto px-6 mb-12"
        >
          <div className="bg-surface rounded-2xl p-8 border text-center">
            <p className="text-6xl mb-4">📝</p>
            <h3 className="text-xl font-bold text-white mb-2">No Test Attempts Yet</h3>
            <p className="text-gray-400 mb-6">Take a full mock test to see your results here</p>
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/cat/full-mock")}
                className="px-6 py-3 btn-enterprise"
              >
                📊 Take CAT Mock
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/neet/full-mock")}
                className="px-6 py-3 btn-enterprise green"
              >
                🔬 Take NEET Mock
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}


      {/* Exam Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-7xl mx-auto px-6 mb-8"
      >
        <div className="flex gap-4">
          {(["CAT", "NEET"] as const).map(type => (
            <button
              key={type}
              onClick={() => setExamType(type)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                examType === type
                  ? (type === "CAT" ? 'btn-enterprise' : 'btn-enterprise green')
                  : "bg-surface text-gray-400 hover:text-white"
              }`}
            >
              {type === "CAT" ? "📊 CAT" : "🔬 NEET"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Score Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <div className="bg-surface rounded-2xl p-8 border">
          <h2 className="text-2xl font-bold text-white mb-6">Enter Your Score</h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 font-semibold block mb-2">
                Your Score: <span className="text-accent text-2xl">{score}</span>
                {examType === "CAT" ? <span className="text-gray-500 text-lg">/198</span> : <span className="text-gray-500 text-lg">/720</span>}
              </label>
              <input
                type="range"
                min={0}
                max={examType === "CAT" ? 198 : 720}
                value={score}
                onChange={e => setScore(Number(e.target.value))}
                className="w-full h-2 bg-black/20 rounded-lg appearance-none cursor-pointer accent-accent"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Percentile Card */}
          <motion.div
            whileHover={{ y: -8 }}
            className={`bg-surface rounded-2xl p-8 border ${examType === 'CAT' ? 'border-blue-500/20' : 'border-green-500/20'} shadow-sm`}
          >
            <p className="text-gray-400 text-sm mb-2">Your Percentile</p>
            <motion.p
              key={result.percentile}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`text-6xl font-bold mb-2 ${examType === 'CAT' ? 'text-blue-400' : 'text-green-400'}`}
            >
              {result.percentile.toFixed(1)}
            </motion.p>
            <p className="text-gray-300 text-sm">
              Better than {(100 - result.percentile).toFixed(1)}% of candidates
            </p>
          </motion.div>

          {/* Score Card */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-surface rounded-2xl p-8 border border-accent/30 shadow-sm"
          >
            <p className="text-gray-400 text-sm mb-2">Your Score</p>
            <motion.p
              key={result.score}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-6xl font-bold text-accent mb-2"
            >
              {result.score}
            </motion.p>
            <p className="text-gray-300 text-sm">
              {result.percentage}% score achieved
            </p>
          </motion.div>

          {/* Rank Card */}
          <motion.div
            whileHover={{ y: -8 }}
            className="bg-surface rounded-2xl p-8 border border-purple-300/10 shadow-sm"
          >
            <p className="text-gray-400 text-sm mb-2">Estimated Rank</p>
            <motion.p
              key={result.rank}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-6xl font-bold text-purple-300 mb-2"
            >
              #{result.rank.toLocaleString("en-US")}
            </motion.p>
            <p className="text-gray-300 text-sm">
              Out of {result.totalCandidates.toLocaleString("en-US")} candidates
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Interpretation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <div className="bg-surface rounded-2xl p-8 border shadow-sm">
          <h3 className="text-2xl font-bold text-white mb-4">📊 Your Performance Analysis</h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-200 leading-relaxed"
          >
            {result.interpretation}
          </motion.p>
        </div>
      </motion.div>

      {/* College Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-6">
            {examType === "CAT" ? "🎓 IIM Categories You Can Target" : "🏥 College Categories You Can Target"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estimatedColleges.map((college, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="bg-surface rounded-lg p-4 border border-accent/20 hover:shadow-sm transition-all"
              >
                <p className="text-accent font-semibold">{college}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Performance Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <div className="bg-surface rounded-2xl p-8 border shadow-sm">
          <h3 className="text-2xl font-bold text-white mb-6">📈 Score Distribution</h3>
          <div className="space-y-4">
            {[
              { label: "Excellent (90%+)", value: 1, color: "from-green-500 to-green-600" },
              { label: "Very Good (75-89%)", value: 4, color: "from-blue-500 to-blue-600" },
              { label: "Good (60-74%)", value: 15, color: "from-yellow-500 to-yellow-600" },
              { label: "Average (50-59%)", value: 25, color: "from-orange-500 to-orange-600" },
              { label: "Below Average (<50%)", value: 55, color: "from-red-500 to-red-600" }
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">{item.label}</span>
                  <span className="text-gray-400">{item.value}%</span>
                </div>
                <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1.5, delay: 0.7 + idx * 0.1 }}
                    className={`h-full bg-gradient-to-r ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4">💡 Next Steps</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span>✓</span>
                <span className="text-gray-300">Identify and focus on weak areas</span>
              </li>
              <li className="flex gap-3">
                <span>✓</span>
                <span className="text-gray-300">Take more mock tests regularly</span>
              </li>
              <li className="flex gap-3">
                <span>✓</span>
                <span className="text-gray-300">Review your mistakes thoroughly</span>
              </li>
              <li className="flex gap-3">
                <span>✓</span>
                <span className="text-gray-300">Practice time management strategies</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4">🎯 Study Focus Areas</h3>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span>📌</span>
                <span className="text-gray-300">
                  {examType === "CAT"
                    ? "Focus on Verbal Ability section for better percentile"
                    : "Strengthen Biology - it's 50% of the exam"}
                </span>
              </li>
              <li className="flex gap-3">
                <span>📌</span>
                <span className="text-gray-300">
                  {examType === "CAT"
                    ? "Improve accuracy in Data Interpretation questions"
                    : "Improve Physics numericals - they're scoring"}
                </span>
              </li>
              <li className="flex gap-3">
                <span>📌</span>
                <span className="text-gray-300">
                  {examType === "CAT"
                    ? "Practice negative marking strategies"
                    : "Practice Chemistry conceptual questions"}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
