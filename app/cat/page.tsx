"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import ClockIcon from '@/components/icons/ClockIcon';
import QuestionIcon from '@/components/icons/QuestionIcon';


interface CATSection {
  id: string;
  name: string;
  description: string;
  topics: string[];
  timeLimit: number;
  totalQuestions: number;
  icon: string;
  color: string;
}

export default function CATDashboard() {
  const sections: CATSection[] = [
    {
      id: "quant",
      name: "Quantitative Aptitude",
      description: "Questions on mathematics, arithmetic, algebra, geometry",
      topics: ["Arithmetic", "Algebra", "Geometry"],
      timeLimit: 40,
      totalQuestions: 22,
      icon: "🔢",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "dilr",
      name: "Data Interpretation & Logical Reasoning",
      description: "Data analysis, graphs, logic puzzles, arrangements",
      topics: ["DI", "LR", "Data Sets"],
      timeLimit: 40,
      totalQuestions: 22,
      icon: "📊",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: "verbal",
      name: "Verbal Ability & Reading Comprehension",
      description: "Grammar, vocabulary, reading comprehension, sentence correction",
      topics: ["RC", "Grammar", "Vocab"],
      timeLimit: 40,
      totalQuestions: 22,
      icon: "📖",
      color: "from-orange-500 to-orange-600"
    }
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
          <span className="text-5xl">📊</span>
          <h1 className="text-4xl font-bold text-white">CAT Section-wise Tests</h1>
        </div>
        <p className="text-gray-400 text-lg">Choose a section to practice. Each section has 40 minutes time limit - just like the real exam.</p>
        
        <div className="mt-5 px-3 py-2.5 rounded-md bg-amber-500/10 border border-amber-500/20">
          <p className="text-amber-700 dark:text-amber-200 text-[12px] leading-relaxed">
            <strong>⚠️ Important:</strong> In actual CAT, you cannot switch sections once you start. Practice with the same mindset!
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface rounded-xl p-6 border">
            <p className="text-gray-400 text-sm">Total Duration</p>
            <p className="text-3xl font-bold text-white mt-2">120 Minutes</p>
            <p className="text-xs text-gray-500 mt-2">40 min × 3 sections</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border">
            <p className="text-gray-400 text-sm">Total Questions</p>
            <p className="text-3xl font-bold text-white mt-2">66 Questions</p>
            <p className="text-xs text-gray-500 mt-2">22 per section</p>
          </div>
          <div className="bg-surface rounded-xl p-6 border">
            <p className="text-gray-400 text-sm">Total Marks</p>
            <p className="text-3xl font-bold text-white mt-2">198 Marks</p>
            <p className="text-xs text-gray-500 mt-2">+3, -1, 0 scoring</p>
          </div>
        </div>
      </motion.div>

      {/* Sections Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-8">Available Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={`/cat/${section.id}`}>
                <div className={`relative rounded-2xl p-6 border bg-surface transition-all duration-300 cursor-pointer h-full`}> 
                  {/* top-left icon */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-black/10 border border-white/5">
                    <span className="text-lg">{section.icon}</span>
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">{section.name}</h3>
                    <span className="badge-pill text-sm">{index + 1}/3</span>
                  </div>

                  <p className="text-gray-300 text-sm mb-4">{section.description}</p>

                  <div className="flex gap-2 flex-wrap mb-4">
                    {section.topics.map(t => (
                      <span key={t} className="text-xs px-3 py-1 rounded-full bg-black/5 border border-white/5 text-gray-300">{t}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <ClockIcon className="w-4 h-4 text-gray-300" />
                        <span className="text-white/90">{section.timeLimit} min</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <QuestionIcon className="w-4 h-4 text-gray-300" />
                        <span className="text-white/90">{section.totalQuestions} Qs</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 btn-enterprise text-sm"
                    >
                      Start Section →
                    </motion.button>
                  </div>
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
        <Link href="/cat/full-mock">
          <div className="bg-surface rounded-2xl p-8 border transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">🎯 Full CAT Mock Test</h3>
                <p className="text-gray-300">Take all 3 sections back-to-back in one sitting. (120 minutes total)</p>
                <p className="text-sm text-green-300 mt-3">Includes real exam experience with section-wise locked navigation</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 btn-enterprise green"
              >
                Start Full Mock →
              </motion.button>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="max-w-7xl mx-auto px-6 mb-12"
      >
        <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6">💡 CAT Preparation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="text-white font-semibold">Time Management</p>
                  <p className="text-gray-400 text-sm">40 minutes per section is tight. Practice speed without sacrificing accuracy.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-white font-semibold">Strategic Approach</p>
                  <p className="text-gray-400 text-sm">Attempt easy questions first, skip tough ones, don't let time pressure affect decisions.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="text-white font-semibold">Negative Marking</p>
                  <p className="text-gray-400 text-sm">-1 for wrong answer. Better to skip than guess. Calculate risk vs. reward.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <p className="text-white font-semibold">No Going Back</p>
                  <p className="text-gray-400 text-sm">Once a section ends, you can't return. Treat each section independently and strategically.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
