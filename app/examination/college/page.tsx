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
    <div className="min-h-screen pt-32 pb-12 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <button
            onClick={() => router.back()}
            className="mb-4 text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-white mb-3">College Level Examinations</h1>
          <p className="text-gray-400 text-lg">JEE & NEET Preparation</p>
        </motion.div>

        {/* Options Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
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
