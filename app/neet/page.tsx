"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface NEETSubject {
  id: string;
  name: string;
  description: string;
  totalQuestions: number;
  totalMarks: number;
  icon: string;
  color: string;
  chapters: number;
  averageAccuracy: number;
}

export default function NEETDashboard() {
  const subjects: NEETSubject[] = [
    {
      id: "physics",
      name: "Physics",
      description: "Mechanics, Waves, Optics, Modern Physics, Thermodynamics",
      totalQuestions: 45,
      totalMarks: 180,
      chapters: 19,
      averageAccuracy: 68,
      icon: "⚛️",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "chemistry",
      name: "Chemistry",
      description: "Inorganic, Organic, Physical Chemistry",
      totalQuestions: 45,
      totalMarks: 180,
      chapters: 28,
      averageAccuracy: 75,
      icon: "🧪",
      color: "from-green-500 to-green-600"
    },
    {
      id: "biology",
      name: "Biology (Botany + Zoology)",
      description: "Cell Biology, Genetics, Human Physiology, Ecology, Plant Physiology",
      totalQuestions: 90,
      totalMarks: 360,
      chapters: 38,
      averageAccuracy: 82,
      icon: "🧬",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const performanceData = [
    { subject: "Physics", percentage: 68, status: "⚠️ Needs Improvement" },
    { subject: "Chemistry", percentage: 75, status: "✅ Good" },
    { subject: "Biology", percentage: 82, status: "💪 Excellent" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-6 mb-16"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl">🔬</span>
          <h1 className="text-4xl font-bold text-white">NEET Subject-wise Practice</h1>
        </div>
        <p className="text-gray-400 text-lg">Prepare for NEET with subject-specific questions and chapter-wise mastery tracking.</p>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface rounded-xl p-6 border">
            <p className="text-gray-400 text-sm">Total Questions</p>
            <p className="text-3xl font-bold text-white mt-2">180</p>
            <p className="text-xs text-gray-500 mt-2">MCQ format</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border">
            <p className="text-gray-400 text-sm">Total Marks</p>
            <p className="text-3xl font-bold text-white mt-2">720</p>
            <p className="text-xs text-gray-500 mt-2">+4, -1, 0 scoring</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border">
            <p className="text-gray-400 text-sm">Exam Duration</p>
            <p className="text-3xl font-bold text-white mt-2">180 Min</p>
            <p className="text-xs text-gray-500 mt-2">3 hours</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border">
            <p className="text-gray-400 text-sm">Total Chapters</p>
            <p className="text-3xl font-bold text-white mt-2">85</p>
            <p className="text-xs text-gray-500 mt-2">NCERT covered</p>
          </div>
        </div>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Your Performance</h2>
        <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10">
          <div className="space-y-4">
            {performanceData.map((item, index) => (
              <div key={index} className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <p className="text-white font-semibold">{item.subject}</p>
                    <span className="text-lg">{item.status}</span>
                  </div>
                  <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1.5, delay: 0.3 + index * 0.2 }}
                      className={`h-full rounded-full ${
                        item.subject === "Physics"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : item.subject === "Chemistry"
                          ? "bg-gradient-to-r from-green-500 to-green-600"
                          : "bg-gradient-to-r from-orange-500 to-orange-600"
                      }`}
                    />
                  </div>
                </div>
                <span className="text-2xl font-bold text-accent">{item.percentage}%</span>
              </div>
            ))}
          </div>

          {/* Important Note */}
          <div className="mt-8 p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <p className="text-orange-200 text-sm">
              <strong>📌 Focus on Biology:</strong> Biology (90 questions, 360 marks) is 50% of the exam. Strong performance here is crucial!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Subjects Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-8">Choose Subject to Practice</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={`/neet/${subject.id}`}>
                <div className={`bg-gradient-to-br ${subject.color} rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer h-full shadow-lg hover:shadow-2xl`}>
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-5xl">{subject.icon}</span>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
                      {subject.totalMarks} Marks
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{subject.name}</h3>
                  <p className="text-white/80 text-sm mb-6">{subject.description}</p>

                  <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
                    <div className="flex justify-between text-sm text-white/90">
                      <span>📝 Questions</span>
                      <span className="font-semibold">{subject.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white/90">
                      <span>📚 Chapters</span>
                      <span className="font-semibold">{subject.chapters}</span>
                    </div>
                    <div className="flex justify-between text-sm text-white/90">
                      <span>📊 Accuracy</span>
                      <span className="font-semibold">{subject.averageAccuracy}%</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 px-4 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold transition-all duration-200 backdrop-blur"
                  >
                    Practice Subject →
                  </motion.button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Full Mock Option */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <Link href="/neet/full-mock">
          <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl p-8 border-2 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">🎯 Full NEET Mock Test</h3>
                <p className="text-gray-300">Take all 3 subjects with flexible navigation. (180 minutes total)</p>
                <p className="text-sm text-purple-300 mt-3">Test your readiness with complete exam simulation including all NCERT topics</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl text-white font-bold transition-all duration-200 shadow-lg hover:shadow-purple-500/20"
              >
                Start Full Mock →
              </motion.button>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Chapter Mastery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Recommended Chapters to Focus On</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Mechanics (Physics)", level: "Medium", status: "🔴 Weak", progress: 45 },
            { name: "Organic Chemistry", level: "Hard", status: "🔴 Weak", progress: 52 },
            { name: "Photosynthesis (Biology)", level: "Easy", status: "🟢 Strong", progress: 88 }
          ].map((chapter, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-black/30 border border-white/10 rounded-xl p-6 hover:border-accent/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-bold text-white">{chapter.name}</h4>
                <span className="text-xl">{chapter.status}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Difficulty: {chapter.level}</p>
              <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${chapter.progress}%` }}
                  transition={{ duration: 1.2, delay: 0.3 + idx * 0.1 }}
                  className="h-full bg-gradient-to-r from-accent to-accent/60"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{chapter.progress}% mastered</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">💡 NEET Preparation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="text-white font-semibold">NCERT Focus</p>
                  <p className="text-gray-400 text-sm">90% of NEET questions come from NCERT. Master every concept thoroughly.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🧬</span>
                <div>
                  <p className="text-white font-semibold">Biology Priority</p>
                  <p className="text-gray-400 text-sm">50% of the exam is Biology. It's your scoring subject. Master it!</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-white font-semibold">Balanced Approach</p>
                  <p className="text-gray-400 text-sm">All three subjects equally important. Don't ignore Physics or Chemistry.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="text-white font-semibold">Time Management</p>
                  <p className="text-gray-400 text-sm">180 minutes for 180 questions. Pace yourself at 1 min per question average.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
