"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CollegeLevelExamination() {
  const router = useRouter();

  const options = [
    {
      id: "practice-mock",
      name: "Practice Mock",
      description: "Practice with topic-wise and full mock tests",
      icon: "✏️",
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-300/20",
      hoverBorder: "hover:border-blue-500/50",
      href: "/examination/practice-mock"
    },
    {
      id: "buy-mock",
      name: "Buy Mock Test",
      description: "Premium full and half mock tests",
      icon: "🛒",
      color: "from-amber-500 to-orange-500",
      borderColor: "border-amber-300/20",
      hoverBorder: "hover:border-amber-500/50",
      href: "/examination/buy-mock"
    },
    {
      id: "prepare-own",
      name: "Prepare My Own",
      description: "Create custom question papers",
      icon: "📝",
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-300/20",
      hoverBorder: "hover:border-purple-500/50",
      href: "/examination/prepare-own"
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
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">College Level Examinations</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">JEE & NEET Preparation</p>
        </motion.div>

        {/* Options Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl"
        >
          {options.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(option.href)}
              className={`group p-8 rounded-2xl border ${option.borderColor} ${option.hoverBorder} bg-surface hover:bg-surface/80 transition-all duration-300 flex flex-col items-center text-center`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${option.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {option.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{option.name}</h3>
              <p className="text-gray-400 text-sm">{option.description}</p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
