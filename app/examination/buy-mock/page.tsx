"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import JeeIcon from '@/components/icons/JeeIcon';
import NeetIcon from '@/components/icons/NeetIcon';

export default function BuyMock() {
  const router = useRouter();
  const [selectedExam, setSelectedExam] = useState<"jee" | "neet" | null>(null);

  const exams = [
    {
      id: "jee",
      name: "JEE",
      description: "Joint Entrance Examination",
      icon: JeeIcon,
      color: "from-orange-500 to-red-500",
      borderColor: "border-orange-300/20",
      hoverBorder: "hover:border-orange-500/50"
    },
    {
      id: "neet",
      name: "NEET",
      description: "National Eligibility cum Entrance Test",
      icon: NeetIcon,
      color: "from-green-500 to-teal-500",
      borderColor: "border-green-300/20",
      hoverBorder: "hover:border-green-500/50"
    }
  ];

  const mockTypes = [
    {
      id: "full",
      name: "Full Mock",
      description: "Complete mock test with all questions",
      icon: "📚",
      color: "from-blue-500 to-cyan-500",
      borderColor: "border-blue-300/20",
      hoverBorder: "hover:border-blue-500/50",
      duration: "180 minutes",
      questionCount: "Full"
    },
    {
      id: "half",
      name: "Half Mock",
      description: "Half the questions in half the time",
      icon: "⏱️",
      color: "from-purple-500 to-pink-500",
      borderColor: "border-purple-300/20",
      hoverBorder: "hover:border-purple-500/50",
      duration: "90 minutes",
      questionCount: "50%"
    }
  ];

  const handleMockSelect = (mockType: "full" | "half") => {
    if (selectedExam) {
      // Pass mock type as query parameter
      router.push(`/${selectedExam}/full-mock?mockType=${mockType}`);
    }
  };

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
          <h1 className="text-4xl font-bold text-white mb-3">Buy Mock Test</h1>
          <p className="text-gray-400 text-lg">Select your exam and mock type</p>
        </motion.div>

        {/* Step 1: Exam Selection */}
        {!selectedExam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Step 1: Choose Exam</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {exams.map((exam) => {
                const IconComponent = exam.icon;
                return (
                  <motion.button
                    key={exam.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedExam(exam.id as "jee" | "neet")}
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
            </div>
          </motion.div>
        )}

        {/* Step 2: Mock Type Selection */}
        {selectedExam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Step 2: Choose Mock Type</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedExam(null)}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Change Exam
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {mockTypes.map((mockType) => (
                <motion.div
                  key={mockType.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-8 rounded-2xl border ${mockType.borderColor} ${mockType.hoverBorder} bg-surface hover:bg-surface/80 transition-all duration-300 flex flex-col items-center text-center`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mockType.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    {mockType.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{mockType.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{mockType.description}</p>
                  
                  <div className="space-y-2 mb-6 text-sm text-gray-300">
                    <p>⏱️ Duration: {mockType.duration}</p>
                    <p>📝 Questions: {mockType.questionCount}</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleMockSelect(mockType.id as "full" | "half")}
                    className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${mockType.color} text-white font-semibold transition-all`}
                  >
                    Start {mockType.name} →
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
