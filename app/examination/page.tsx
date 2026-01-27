"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Examination() {
  const router = useRouter();

  const levels = [
    {
      id: "school",
      name: "School Level",
      description: "10+2 Board examinations",
      icon: "🏫",
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-300/20",
      hoverBorder: "hover:border-blue-500/50"
    },
    {
      id: "college",
      name: "College Level",
      description: "JEE & NEET entrance exams",
      icon: "🎓",
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-300/20",
      hoverBorder: "hover:border-purple-500/50"
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
          <h1 className="text-4xl font-bold text-white mb-3">Examination</h1>
          <p className="text-gray-400 text-lg">Select your exam level to get started</p>
        </motion.div>

        {/* Level Selection Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto"
        >
          {levels.map((level) => (
            <motion.button
              key={level.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/examination/${level.id}`)}
              className={`group p-8 rounded-2xl border ${level.borderColor} ${level.hoverBorder} bg-surface hover:bg-surface/80 transition-all duration-300 flex flex-col items-center text-center`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {level.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{level.name}</h3>
              <p className="text-gray-400 text-sm">{level.description}</p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
