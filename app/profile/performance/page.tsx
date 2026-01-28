"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const performanceData = {
  overall: {
    testsCompleted: 24,
    avgScore: 78,
    totalQuestions: 1200,
    correctAnswers: 936,
    studyHours: 156,
    currentStreak: 12
  },
  jee: {
    testsCompleted: 14,
    avgScore: 82,
    sections: [
      { name: "Physics", score: 84, questions: 180, correct: 148 },
      { name: "Chemistry", score: 81, questions: 180, correct: 146 },
      { name: "Mathematics", score: 83, questions: 180, correct: 149 }
    ]
  },
  neet: {
    testsCompleted: 10,
    avgScore: 74,
    sections: [
      { name: "Physics", score: 72, questions: 150, correct: 108 },
      { name: "Chemistry", score: 76, questions: 150, correct: 114 },
      { name: "Biology", score: 74, questions: 300, correct: 222 }
    ]
  },
  recentTests: [
    { name: "JEE Full Mock 5", date: "Dec 28, 2025", score: 85, percentile: 94 },
    { name: "NEET Physics", date: "Dec 26, 2025", score: 78, percentile: 88 },
    { name: "JEE PCM Drill", date: "Dec 24, 2025", score: 82, percentile: 91 },
    { name: "NEET Full Mock 3", date: "Dec 22, 2025", score: 76, percentile: 85 },
    { name: "JEE Mathematics Sprint", date: "Dec 20, 2025", score: 88, percentile: 96 }
  ]
};

export default function PerformancePage() {
  const router = useRouter();

  return (
    <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto px-4"
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            aria-label="Back"
          >
            ←
          </button>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">📊 My Performance</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 mb-4">Track your progress and achievements</p>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4"
        >
          <StatCard icon="📝" label="Tests Completed" value={performanceData.overall.testsCompleted} />
          <StatCard icon="🎯" label="Avg Score" value={`${performanceData.overall.avgScore}%`} />
          <StatCard icon="❓" label="Questions Attempted" value={performanceData.overall.totalQuestions} />
          <StatCard icon="✅" label="Correct Answers" value={performanceData.overall.correctAnswers} />
          <StatCard icon="⏱️" label="Study Hours" value={performanceData.overall.studyHours} />
          <StatCard icon="🔥" label="Current Streak" value={`${performanceData.overall.currentStreak} days`} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* JEE Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                📐 JEE Performance
              </h3>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                {performanceData.jee.testsCompleted} tests
              </span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Average Score</span>
                <span className="text-cyan-300 font-bold">{performanceData.jee.avgScore}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full"
                  style={{ width: `${performanceData.jee.avgScore}%` }}
                />
              </div>
            </div>
            <div className="space-y-3">
              {performanceData.jee.sections.map((section, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{section.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${section.score}%` }}
                      />
                    </div>
                    <span className="text-cyan-300 text-sm font-medium w-10">{section.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* NEET Performance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🔬 NEET Performance
              </h3>
              <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                {performanceData.neet.testsCompleted} tests
              </span>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Average Score</span>
                <span className="text-green-300 font-bold">{performanceData.neet.avgScore}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                  style={{ width: `${performanceData.neet.avgScore}%` }}
                />
              </div>
            </div>
            <div className="space-y-3">
              {performanceData.neet.sections.map((section, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">{section.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-400 rounded-full"
                        style={{ width: `${section.score}%` }}
                      />
                    </div>
                    <span className="text-green-300 text-sm font-medium w-10">{section.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Tests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🕐 Recent Tests
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-gray-400 text-sm border-b border-white/10">
                  <th className="text-left py-3 px-2">Test Name</th>
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-center py-3 px-2">Score</th>
                  <th className="text-center py-3 px-2">Percentile</th>
                  <th className="text-right py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.recentTests.map((test, idx) => (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <span className="text-white font-medium">{test.name}</span>
                    </td>
                    <td className="py-3 px-2 text-gray-400">{test.date}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`font-bold ${test.score >= 80 ? "text-green-400" : test.score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                        {test.score}%
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="px-2 py-1 bg-accent/20 text-accent rounded-full text-sm">
                        {test.percentile}%ile
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button className="text-accent hover:text-accent/80 text-sm font-medium transition-colors">
                        Review →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: string; label: string; value: string | number }) {
  return (
    <div className="bg-gradient-to-br from-surface to-elevated rounded-xl p-4 border border-white/10 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-xl font-bold text-white mt-2">{value}</p>
      <p className="text-gray-400 text-xs mt-1">{label}</p>
    </div>
  );
}
