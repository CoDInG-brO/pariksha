"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function PrepareOwn() {
  const router = useRouter();

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
          <h1 className="text-4xl font-bold text-white mb-3">Prepare My Own Question Paper</h1>
          <p className="text-gray-400 text-lg">Create custom question papers for your preparation</p>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <div className="rounded-2xl border border-purple-300/20 bg-surface hover:bg-surface/80 transition-all p-12 text-center">
            <div className="text-6xl mb-4">🛠️</div>
            <h3 className="text-2xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-gray-400 text-lg mb-6">
              This feature is currently under development. You will soon be able to create custom question papers by selecting topics, difficulty levels, and question types.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold transition-all"
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
