"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import JeeIcon from '@/components/icons/JeeIcon';
import NeetIcon from '@/components/icons/NeetIcon';

export default function PracticeMock() {
  const router = useRouter();

  const exams = [
    {
      id: "jee",
      name: "JEE",
      description: "Joint Entrance Examination for Engineering",
      icon: JeeIcon,
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-300/20",
      hoverBorder: "hover:border-orange-500/50"
    },
    {
      id: "neet",
      name: "NEET",
      description: "National Eligibility cum Entrance Test for Medical",
      icon: NeetIcon,
      color: "from-green-500 to-teal-500",
      borderColor: "border-green-300/20",
      hoverBorder: "hover:border-green-500/50"
    }
  ];

  return (
    <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              aria-label="Back"
            >
              ←
            </button>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Practice Mock</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Select your entrance exam</p>
        </motion.div>

        {/* Exam Selection Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl"
        >
          {exams.map((exam) => {
            const IconComponent = exam.icon;
            return (
              <motion.button
                key={exam.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/${exam.id}`)}
                className={`group p-8 rounded-2xl border ${exam.borderColor} ${exam.hoverBorder} bg-surface hover:bg-surface/80 transition-all duration-300 flex flex-col items-center text-center`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${exam.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{exam.name}</h3>
                <p className="text-gray-400 text-sm">{exam.description}</p>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
