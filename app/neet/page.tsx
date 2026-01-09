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
    <div className="min-h-screen pt-20 pb-12 px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center text-4xl shadow-sm">
            🔬
          </div>
          <h1 className="text-5xl font-bold text-slate-900">NEET Subject-wise Tests</h1>
        </div>
        <p className="text-slate-600 text-lg mb-6">Choose a subject to practice. Each subject has dedicated questions - just like the real exam.</p>
        
        <div className="px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
          <p className="text-amber-900 text-sm leading-relaxed font-medium">
            <strong>⚠️ Important:</strong> Biology (90 questions, 360 marks) is 50% of the exam. Master this to excel!
          </p>
        </div>
      </motion.div>

      {/* Key Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Questions</p>
            <p className="text-4xl font-bold text-slate-900 mt-3">180</p>
            <p className="text-xs text-slate-600 mt-2 font-medium">MCQ format</p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Marks</p>
            <p className="text-4xl font-bold text-slate-900 mt-3">720</p>
            <p className="text-xs text-slate-600 mt-2 font-medium">+4, -1, 0 scoring</p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Exam Duration</p>
            <p className="text-4xl font-bold text-slate-900 mt-3">180 Min</p>
            <p className="text-xs text-slate-600 mt-2 font-medium">3 hours</p>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all">
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Total Chapters</p>
            <p className="text-4xl font-bold text-slate-900 mt-3">85</p>
            <p className="text-xs text-slate-600 mt-2 font-medium">NCERT covered</p>
          </div>
        </div>
      </motion.div>

      {/* Subjects Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto mb-12"
      >
        <h2 className="text-3xl font-bold text-slate-900 mb-8">Choose Subject to Practice</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={`/neet/${subject.id}`}>
                <div className={`relative rounded-3xl p-8 border border-slate-200/50 bg-white transition-all duration-300 cursor-pointer h-full hover:shadow-lg shadow-sm`}>
                  {/* subtle top stripe to indicate subject accent */}
                  <div className={`absolute top-0 left-8 right-8 h-1.5 rounded-b-md ${subject.color}`} />

                  {/* top-left icon */}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-gradient-to-br from-green-50 to-green-100 shadow-sm mb-4">
                    {subject.icon}
                  </div>

                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{subject.name}</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">{subject.totalMarks} Marks</span>
                  </div>

                  <p className="text-slate-600 text-sm mb-6">{subject.description}</p>

                  <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-slate-900">📝 {subject.totalQuestions} Qs</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-slate-900">📚 {subject.chapters} Ch</span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-2.5 btn-gradient-green"
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
        className="max-w-7xl mx-auto mb-12"
      >
        <Link href="/neet/full-mock">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/50 hover:shadow-lg transition-all shadow-sm cursor-pointer">
            <div className="flex items-center justify-between gap-8">
              <div>
                <h3 className="text-3xl font-bold text-slate-900 mb-2">🎯 Full NEET Mock Test</h3>
                <p className="text-slate-600 text-lg">Take all 3 subjects with flexible navigation. (180 minutes total)</p>
                <p className="text-sm text-emerald-600 mt-4 font-semibold">✓ Test your readiness with complete exam simulation including all NCERT topics</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 btn-gradient-green whitespace-nowrap"
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
        transition={{ duration: 0.5, delay: 0.7 }}
        className="max-w-7xl mx-auto mb-12"
      >
        <div className="bg-white rounded-3xl p-8 border border-slate-200/50 shadow-sm hover:shadow-lg transition-all">
          <h3 className="text-3xl font-bold text-slate-900 mb-8">💡 NEET Preparation Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-3xl flex-shrink-0">📚</span>
                <div>
                  <p className="text-slate-900 font-bold text-lg">NCERT Focus</p>
                  <p className="text-slate-600 text-sm mt-1">90% of NEET questions come from NCERT. Master every concept thoroughly.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl flex-shrink-0">🧬</span>
                <div>
                  <p className="text-slate-900 font-bold text-lg">Biology Priority</p>
                  <p className="text-slate-600 text-sm mt-1">50% of the exam is Biology. It's your scoring subject. Master it!</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="text-3xl flex-shrink-0">📊</span>
                <div>
                  <p className="text-slate-900 font-bold text-lg">Balanced Approach</p>
                  <p className="text-slate-600 text-sm mt-1">All three subjects equally important. Don't ignore Physics or Chemistry.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="text-3xl flex-shrink-0">⏰</span>
                <div>
                  <p className="text-slate-900 font-bold text-lg">Time Management</p>
                  <p className="text-slate-600 text-sm mt-1">180 minutes for 180 questions. Pace yourself at 1 min per question average.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
