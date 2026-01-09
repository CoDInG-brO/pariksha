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
  // Add per-section accent hex values so we can render subtle, consistent accents
  const sections: (CATSection & { accentFrom: string; accentTo: string; accentHex: string })[] = [
    {
      id: "quant",
      name: "Quantitative Aptitude",
      description: "Questions on mathematics, arithmetic, algebra, geometry",
      topics: ["Arithmetic", "Algebra", "Geometry"],
      timeLimit: 40,
      totalQuestions: 22,
      icon: "🔢",
      color: "from-blue-500 to-blue-600",
      accentFrom: "#3B82F6",
      accentTo: "#2563EB",
      accentHex: "#2563EB"
    },
    {
      id: "dilr",
      name: "Data Interpretation & Logical Reasoning",
      description: "Data analysis, graphs, logic puzzles, arrangements",
      topics: ["DI", "LR", "Data Sets"],
      timeLimit: 40,
      totalQuestions: 22,
      icon: "📊",
      color: "from-purple-500 to-purple-600",
      accentFrom: "#A855F7",
      accentTo: "#7C3AED",
      accentHex: "#7C3AED"
    },
    {
      id: "verbal",
      name: "Verbal Ability & Reading Comprehension",
      description: "Grammar, vocabulary, reading comprehension, sentence correction",
      topics: ["RC", "Grammar", "Vocab"],
      timeLimit: 40,
      totalQuestions: 22,
      icon: "📖",
      color: "from-orange-500 to-orange-600",
      accentFrom: "#FB923C",
      accentTo: "#F97316",
      accentHex: "#F97316"
    }
  ];

  // helper to derive rgba from a hex color
  function hexToRgba(hex: string, alpha: number) {
    const h = hex.replace('#','');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

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
    <div className="min-h-screen pt-25 pb-8 px-5">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-3xl shadow-sm">
            📊
          </div>
          <h1 className="text-3xl font-bold text-slate-900">CAT Section-wise Tests</h1>
        </div>
        <p className="text-slate-600 text-base mb-4">Choose a section to practice. Each section has 40 minutes time limit - just like the real exam.</p>
        
        <div className="px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-amber-900 text-sm leading-snug font-medium">
            <strong>⚠️ Important:</strong> In actual CAT, you cannot switch sections once you start. Practice with the same mindset!
          </p>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Duration</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">120 Minutes</p>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">40 min × 3 sections</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Questions</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">66 Questions</p>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">22 per section</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Marks</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">198 Marks</p>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">+3, -1, 0 scoring</p>
          </div>
        </div>
      </motion.div>

      {/* Sections Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto mb-8"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-5">Available Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={`/cat/${section.id}`}>
                <div className={`relative rounded-2xl p-6 border border-blue-200/50 bg-white transition-all duration-300 cursor-pointer h-full hover:shadow-lg shadow-sm`}>
                  {/* subtle top stripe to indicate section accent */}
                  <div style={{background: `linear-gradient(90deg, ${section.accentFrom}, ${section.accentTo})`}} className="absolute top-0 left-8 right-8 h-1.5 rounded-b-md" />

                  {/* top-left icon */}
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm mb-3">
                    {section.icon}
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{section.name}</h3>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-[11px] font-bold uppercase tracking-wider">{index + 1}/3</span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 leading-snug">{section.description}</p>

                  <div className="flex gap-2 flex-wrap mb-5">
                    {section.topics.map(t => (
                      <span key={t} className="text-xs px-3 py-1.5 rounded-lg font-semibold" style={{background: hexToRgba(section.accentFrom, 0.1), border: `1px solid ${hexToRgba(section.accentFrom, 0.2)}`, color: section.accentTo}}>{t}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <ClockIcon className="w-4 h-4 text-slate-600" />
                        <span className="font-semibold text-slate-900">{section.timeLimit} min</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <QuestionIcon className="w-4 h-4 text-slate-600" />
                        <span className="font-semibold text-slate-900">{section.totalQuestions} Qs</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-5 py-2 btn-gradient-blue text-sm"
                    >
                      Start →
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
        className="max-w-7xl mx-auto mb-8"
      >
        <Link href="/cat/full-mock">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 transition-all duration-300 cursor-pointer hover:shadow-lg shadow-sm">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">🎯 Full CAT Mock Test</h3>
                <p className="text-slate-600 text-sm">Take all 3 sections back-to-back in one sitting. (120 minutes total)</p>
                <p className="text-xs text-emerald-600 mt-3 font-semibold">✓ Real exam experience with section-wise locked navigation</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 btn-gradient-blue whitespace-nowrap text-sm"
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
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-2xl font-bold text-slate-900 mb-5">💡 CAT Preparation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">⏰</span>
                <div>
                  <p className="text-slate-900 font-semibold text-base">Time Management</p>
                  <p className="text-slate-600 text-sm mt-0.5 leading-snug">40 minutes per section is tight. Practice speed without sacrificing accuracy.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🎯</span>
                <div>
                  <p className="text-slate-900 font-semibold text-base">Strategic Approach</p>
                  <p className="text-slate-600 text-sm mt-0.5 leading-snug">Attempt easy questions first, skip tough ones, don't let time pressure affect decisions.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <p className="text-slate-900 font-semibold text-base">Negative Marking</p>
                  <p className="text-slate-600 text-sm mt-0.5 leading-snug">-1 for wrong answer. Better to skip than guess. Calculate risk vs. reward.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🔒</span>
                <div>
                  <p className="text-slate-900 font-semibold text-base">No Going Back</p>
                  <p className="text-slate-600 text-sm mt-0.5 leading-snug">Once a section ends, you can't return. Treat each section independently and strategically.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
