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
      id: "botany",
      name: "Botany",
      description: "Plant Physiology, Morphology, Cell Biology, Ecology",
      totalQuestions: 45,
      totalMarks: 180,
      chapters: 19,
      averageAccuracy: 82,
      icon: "🌿",
      color: "from-emerald-500 to-teal-600"
    },
    {
      id: "zoology",
      name: "Zoology",
      description: "Human Physiology, Genetics, Animal Kingdom, Evolution",
      totalQuestions: 45,
      totalMarks: 180,
      chapters: 19,
      averageAccuracy: 80,
      icon: "🦴",
      color: "from-amber-500 to-orange-600"
    }
  ];

  const performanceData = [
    { subject: "Physics", percentage: 68, status: "⚠️ Needs Improvement" },
    { subject: "Chemistry", percentage: 75, status: "✅ Good" },
    { subject: "Botany", percentage: 82, status: "💪 Excellent" },
    { subject: "Zoology", percentage: 80, status: "✅ Good" }
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
    <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-2xl shadow-sm">
            🔬
          </div>
          <h1 className="text-xl font-bold text-slate-900">NEET Subject-wise Tests</h1>
        </div>
        <p className="text-slate-600 text-sm mb-4">Choose a subject to practice. Each subject has dedicated questions - just like the real exam.</p>
        
        <div className="px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-amber-900 text-xs leading-snug font-medium">
            <strong>⚠️ Important:</strong> Biology (90 questions, 360 marks) is 50% of the exam. Master this to excel!
          </p>
        </div>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Questions</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">180</p>
            <p className="text-[10px] text-slate-600 mt-1 font-medium">MCQ format</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Marks</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">720</p>
            <p className="text-[10px] text-slate-600 mt-1 font-medium">+4, -1, 0 scoring</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Exam Duration</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">180 Min</p>
            <p className="text-[10px] text-slate-600 mt-1 font-medium">3 hours</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Chapters</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">85</p>
            <p className="text-[10px] text-slate-600 mt-1 font-medium">NCERT covered</p>
          </div>
        </div>
      </motion.div>

      {/* Subjects Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto mb-8"
      >
        <h2 className="text-lg font-bold text-slate-900 mb-5">Choose Subject to Practice</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={`/neet/${subject.id}`}>
                <div className={`relative rounded-2xl p-6 border border-slate-200/50 bg-white transition-all duration-300 cursor-pointer h-full hover:shadow-lg shadow-sm`}>
                  {/* subtle top stripe to indicate subject accent */}
                  <div className={`absolute top-0 left-6 right-6 h-1.5 rounded-b-md ${subject.color}`} />

                  {/* top-left icon */}
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-base bg-gradient-to-br from-green-50 to-green-100 shadow-sm mb-3">
                    {subject.icon}
                  </div>

                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base font-bold text-slate-900 leading-tight">{subject.name}</h3>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-[11px] font-bold uppercase tracking-wider">{subject.totalMarks} Marks</span>
                  </div>

                  <p className="text-slate-600 text-xs mb-4 leading-snug">{subject.description}</p>

                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-900">📝 {subject.totalQuestions} Qs</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-slate-900">📚 {subject.chapters} Ch</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-5 py-2 text-xs bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer border-0"
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
        transition={{ duration: 0.5, delay: 0.7 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-lg font-bold text-slate-900 mb-5">💡 NEET Preparation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">📚</span>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">NCERT Focus</p>
                  <p className="text-slate-600 text-xs mt-0.5 leading-snug">90% of NEET questions come from NCERT. Master every concept thoroughly.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">🧬</span>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">Biology Priority</p>
                  <p className="text-slate-600 text-xs mt-0.5 leading-snug">50% of the exam is Biology. It's your scoring subject. Master it!</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">📊</span>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">Balanced Approach</p>
                  <p className="text-slate-600 text-xs mt-0.5 leading-snug">All three subjects equally important. Don't ignore Physics or Chemistry.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl flex-shrink-0">⏰</span>
                <div>
                  <p className="text-slate-900 font-semibold text-sm">Time Management</p>
                  <p className="text-slate-600 text-xs mt-0.5 leading-snug">180 minutes for 180 questions. Pace yourself at 1 min per question average.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
