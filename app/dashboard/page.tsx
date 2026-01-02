"use client";
import { motion } from "framer-motion";
import { useState } from "react";

interface ExamHistory {
  id: number;
  name: string;
  score: number;
  date: string;
  attempts: number;
}

export default function Dashboard() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const stats = {
    lastScore: 72,
    totalExams: 8,
    averageScore: 68,
    strongArea: "Data Structures",
    weakArea: "Database Design",
    totalAttempts: 15,
    streak: 3
  };

  const recentExams: ExamHistory[] = [
    { id: 1, name: "Database Fundamentals", score: 72, date: "Today", attempts: 1 },
    { id: 2, name: "Web Development Basics", score: 85, date: "Yesterday", attempts: 2 },
    { id: 3, name: "Algorithm Analysis", score: 65, date: "2 days ago", attempts: 1 },
    { id: 4, name: "Data Structures", score: 90, date: "3 days ago", attempts: 1 }
  ];

  const topicPerformance = [
    { topic: "Data Structures", percentage: 90, color: "from-green-500 to-green-600" },
    { topic: "Algorithms", percentage: 75, color: "from-blue-500 to-blue-600" },
    { topic: "Web Development", percentage: 82, color: "from-purple-500 to-purple-600" },
    { topic: "Databases", percentage: 55, color: "from-orange-500 to-orange-600" },
    { topic: "System Design", percentage: 68, color: "from-pink-500 to-pink-600" }
  ];

  const suggestedTopics = [
    { name: "SQL Joins", difficulty: "Medium", estimatedTime: "30 min", priority: "High" },
    { name: "Database Indexing", difficulty: "Hard", estimatedTime: "45 min", priority: "High" },
    { name: "Normalization", difficulty: "Medium", estimatedTime: "25 min", priority: "Medium" }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Welcome Back!</h1>
        <p className="text-gray-400">Here's your exam performance overview</p>
      </motion.div>

      {/* Key Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {/* Last Score */}
        <motion.div variants={itemVariants} className="group">
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl p-6 border border-accent/30 hover:border-accent/60 transition-all duration-300 shadow-lg hover:shadow-accent/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm font-medium">Last Score</span>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-4xl font-bold text-accent mb-2">{stats.lastScore}%</p>
            <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.lastScore}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-accent to-accent/60"
              />
            </div>
          </div>
        </motion.div>

        {/* Total Exams */}
        <motion.div variants={itemVariants} className="group">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 shadow-lg hover:shadow-blue-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm font-medium">Total Exams</span>
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-4xl font-bold text-blue-400 mb-2">{stats.totalExams}</p>
            <p className="text-xs text-gray-500">{stats.totalAttempts} total attempts</p>
          </div>
        </motion.div>

        {/* Average Score */}
        <motion.div variants={itemVariants} className="group">
          <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl p-6 border border-green-500/30 hover:border-green-500/60 transition-all duration-300 shadow-lg hover:shadow-green-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm font-medium">Average Score</span>
              <span className="text-2xl">📈</span>
            </div>
            <p className="text-4xl font-bold text-green-400 mb-2">{stats.averageScore}%</p>
            <p className="text-xs text-green-400/60">Across all exams</p>
          </div>
        </motion.div>

        {/* Current Streak */}
        <motion.div variants={itemVariants} className="group">
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 rounded-2xl p-6 border border-orange-500/30 hover:border-orange-500/60 transition-all duration-300 shadow-lg hover:shadow-orange-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm font-medium">Current Streak</span>
              <span className="text-2xl">🔥</span>
            </div>
            <p className="text-4xl font-bold text-orange-400 mb-2">{stats.streak}</p>
            <p className="text-xs text-orange-400/60">Days active</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Topic Performance */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">Topic Performance</h2>
            <div className="space-y-5">
              {topicPerformance.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedTopic(item.topic)}
                  className={`cursor-pointer transition-all duration-300 p-4 rounded-lg ${
                    selectedTopic === item.topic ? "bg-white/10 border border-accent/50" : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-semibold">{item.topic}</p>
                    <span className={`text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1.2, delay: index * 0.1 }}
                      className={`h-full bg-gradient-to-r ${item.color}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Strong vs Weak Areas */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10 shadow-xl h-full">
            <h2 className="text-2xl font-bold text-white mb-6">Your Insights</h2>
            <div className="space-y-6">
              {/* Strong Area */}
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">💪</span>
                  <p className="text-gray-400 text-sm">Strong Area</p>
                </div>
                <p className="text-xl font-bold text-green-400">{stats.strongArea}</p>
              </div>

              {/* Weak Area */}
              <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚡</span>
                  <p className="text-gray-400 text-sm">Needs Work</p>
                </div>
                <p className="text-xl font-bold text-orange-400">{stats.weakArea}</p>
              </div>

              {/* Next Practice */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-accent/20"
              >
                Start Practice ✨
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Exams */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-12"
      >
        <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Exams</h2>
          <div className="space-y-3">
            {recentExams.map((exam, index) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5 transition-all duration-300 cursor-pointer"
              >
                <div className="flex-1">
                  <p className="text-white font-semibold">{exam.name}</p>
                  <p className="text-gray-400 text-sm">{exam.date} • {exam.attempts} attempt(s)</p>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${exam.score >= 80 ? "text-green-400" : exam.score >= 70 ? "text-yellow-400" : "text-red-400"}`}>
                    {exam.score}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Suggested Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Recommended Topics to Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestedTopics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-black/30 border border-white/10 rounded-xl p-6 hover:border-accent/50 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{topic.name}</h3>
                  {topic.priority === "High" && (
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
                      High Priority
                    </span>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-400">
                    <span className="text-gray-500">Difficulty:</span> {topic.difficulty}
                  </p>
                  <p className="text-sm text-gray-400">
                    <span className="text-gray-500">Time:</span> {topic.estimatedTime}
                  </p>
                </div>
                <button className="w-full py-2 px-3 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg font-medium transition-all duration-200">
                  Start Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
