"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import ClockIcon from '@/components/icons/ClockIcon';
import QuestionIcon from '@/components/icons/QuestionIcon';
import { jeeQuestionBank, type JEESubject } from '@/lib/jeeQuestionBank';


export default function JEEDashboard() {
  // Per-subject metadata wired to the real question bank counts
  const subjectConfig: Record<JEESubject, {
    name: string;
    description: string;
    topics: string[];
    icon: string;
    color: string;
    accentFrom: string;
    accentTo: string;
    accentHex: string;
  }> = {
    physics: {
      name: "Physics",
      description: "Mechanics, electricity, magnetism and modern physics numericals",
      topics: ["Mechanics", "Electrostatics", "Modern"],
      icon: "🔭",
      color: "from-cyan-500 to-blue-500",
      accentFrom: "#06B6D4",
      accentTo: "#2563EB",
      accentHex: "#0EA5E9"
    },
    chemistry: {
      name: "Chemistry",
      description: "Balanced mix of Physical, Organic and Inorganic chemistry",
      topics: ["Physical", "Organic", "Inorganic"],
      icon: "⚗️",
      color: "from-amber-500 to-orange-500",
      accentFrom: "#F97316",
      accentTo: "#EA580C",
      accentHex: "#F97316"
    },
    mathematics: {
      name: "Mathematics",
      description: "Algebra, calculus and coordinate geometry intensive sets",
      topics: ["Algebra", "Calculus", "Coordinate"],
      icon: "📐",
      color: "from-purple-500 to-indigo-600",
      accentFrom: "#8B5CF6",
      accentTo: "#4C1D95",
      accentHex: "#7C3AED"
    },
    biology: {
      name: "Biology",
      description: "Cell biology, genetics and human physiology essentials",
      topics: ["Cell Biology", "Genetics", "Physiology"],
      icon: "🧬",
      color: "from-emerald-500 to-teal-600",
      accentFrom: "#10B981",
      accentTo: "#0F766E",
      accentHex: "#10B981"
    }
  };

  const baseCounts: Record<JEESubject, number> = {
    physics: 0,
    chemistry: 0,
    mathematics: 0,
    biology: 0
  };

  const questionCounts = jeeQuestionBank.reduce<Record<JEESubject, number>>((acc, question) => {
    acc[question.section] = (acc[question.section] || 0) + 1;
    return acc;
  }, baseCounts);

  const sections = (Object.keys(subjectConfig) as JEESubject[]).map((subject) => ({
    id: subject,
    timeLimit: 60,
    totalQuestions: questionCounts[subject],
    ...subjectConfig[subject]
  }));

  const totalQuestions = sections.reduce((sum, section) => sum + section.totalQuestions, 0);
  const totalDuration = sections.length * 60;
  const totalMarks = totalQuestions * 4;

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
    <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6 px-4">
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
          <h1 className="text-3xl font-bold text-slate-900">JEE Subject-wise Drills</h1>
        </div>
        <p className="text-slate-600 text-base mb-4">Choose a subject to practice. Each block mimics the JEE Main pattern with 60 minutes focus time.</p>
        
        <div className="px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-amber-900 text-sm leading-snug font-medium">
            <strong>⚠️ Important:</strong> JEE Main rewards accuracy. Stick to one subject at a time and avoid random switching.
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
            <p className="text-3xl font-bold text-slate-900 mt-2">{totalDuration} Minutes</p>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">60 min × {sections.length} subjects</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Questions</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{totalQuestions} Questions</p>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">Sourced from live PCM bank</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Marks</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{totalMarks} Marks</p>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">+4 correct, -1 incorrect</p>
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
              <Link href={`/jee/${section.id}`}>
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

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-2xl font-bold text-slate-900 mb-5">💡 JEE Preparation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">⏰</span>
                <div>
                  <p className="text-slate-900 font-semibold text-base">Time Management</p>
                  <p className="text-slate-600 text-sm mt-0.5 leading-snug">Split 180 minutes into 55-60 min blocks per subject and carry buffer for Section B numericals.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🎯</span>
                <div>
                  <p className="text-slate-900 font-semibold text-base">Strategic Approach</p>
                  <p className="text-slate-600 text-sm mt-0.5 leading-snug">Attempt all single-correct MCQs first, then move to numerical section for assured marks.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">📊</span>
                <div>
                  <p className="text-slate-900 font-semibold text-base">Negative Marking</p>
                  <p className="text-slate-600 text-sm mt-0.5 leading-snug">-1 hurts quickly. Fix threshold rules: skip if solving time crosses 2 minutes without progress.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl flex-shrink-0">🔒</span>
                <div>
                  <p className="text-slate-900 font-semibold text-base">Formula Discipline</p>
                  <p className="text-slate-600 text-sm mt-0.5 leading-snug">Keep condensed formula sheets for last-mile revision—especially for Electrostatics and Organic Chemistry.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
