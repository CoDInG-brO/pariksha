"use client";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getTestAttemptById,
  formatTimestamp,
  formatTimeSpent,
  TestAttempt,
  SavedQuestion
} from "@/lib/testStorage";

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("id");

  const [attempt, setAttempt] = useState<TestAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [filterType, setFilterType] = useState<"all" | "correct" | "incorrect" | "unanswered">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (attemptId) {
      const loadedAttempt = getTestAttemptById(attemptId);
      setAttempt(loadedAttempt);
    }
    setLoading(false);
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-32 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!attemptId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-12 border border-white/10"
          >
            <p className="text-6xl mb-6">📋</p>
            <h1 className="text-3xl font-bold text-white mb-4">No Test Selected</h1>
            <p className="text-gray-400 mb-8">
              Please select a test attempt from the Analytics page to review your answers.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/analytics")}
              className="px-8 py-4 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 rounded-xl text-white font-bold text-lg"
            >
              Go to Analytics
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-12 border border-white/10"
          >
            <p className="text-6xl mb-6">❌</p>
            <h1 className="text-3xl font-bold text-white mb-4">Test Not Found</h1>
            <p className="text-gray-400 mb-8">
              The test attempt you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/analytics")}
              className="px-8 py-4 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 rounded-xl text-white font-bold text-lg"
            >
              Go to Analytics
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Filter questions based on user's selection
  const getFilteredQuestions = (): { question: SavedQuestion; originalIndex: number }[] => {
    return attempt.questions
      .map((q, idx) => ({ question: q, originalIndex: idx }))
      .filter(({ question, originalIndex }) => {
        const userAnswer = attempt.selectedAnswers[originalIndex];
        const isCorrect = userAnswer === question.correctAnswer;
        const isUnanswered = userAnswer === null;

        switch (filterType) {
          case "correct":
            return isCorrect;
          case "incorrect":
            return !isCorrect && !isUnanswered;
          case "unanswered":
            return isUnanswered;
          default:
            return true;
        }
      });
  };

  const filteredQuestions = getFilteredQuestions();
  const currentFilteredQuestion = filteredQuestions[currentQuestionIndex];

  if (filteredQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-32">
        <ReviewHeader attempt={attempt} router={router} />
        <div className="max-w-4xl mx-auto px-6">
          <FilterButtons 
            filterType={filterType} 
            setFilterType={setFilterType}
            attempt={attempt}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-12 border border-white/10 text-center"
          >
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-white mb-2">No Questions Found</h3>
            <p className="text-gray-400">
              No questions match the current filter. Try selecting a different filter.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = currentFilteredQuestion.question;
  const originalIndex = currentFilteredQuestion.originalIndex;
  const userAnswer = attempt.selectedAnswers[originalIndex];
  const isCorrect = userAnswer === currentQuestion.correctAnswer;
  const isUnanswered = userAnswer === null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-32 pb-20">
      <ReviewHeader attempt={attempt} router={router} />

      <div className="max-w-6xl mx-auto px-6">
        {/* Filter Buttons */}
        <FilterButtons 
          filterType={filterType} 
          setFilterType={setFilterType}
          attempt={attempt}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10 sticky top-32">
              <h3 className="text-lg font-bold text-white mb-4">Questions</h3>
              <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto">
                {filteredQuestions.map(({ question, originalIndex: origIdx }, idx) => {
                  const uAnswer = attempt.selectedAnswers[origIdx];
                  const isCor = uAnswer === question.correctAnswer;
                  const isUn = uAnswer === null;

                  let bgColor = "bg-white/10 hover:bg-white/20";
                  if (isCor) bgColor = "bg-green-500/30 border-green-500";
                  else if (isUn) bgColor = "bg-gray-500/30 border-gray-500";
                  else bgColor = "bg-red-500/30 border-red-500";

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-10 h-10 rounded-lg border transition-all flex items-center justify-center text-sm font-bold ${bgColor} ${
                        currentQuestionIndex === idx ? "ring-2 ring-accent" : ""
                      }`}
                    >
                      {origIdx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500"></div>
                  <span className="text-gray-400">Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500/30 border border-red-500"></div>
                  <span className="text-gray-400">Incorrect</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-500/30 border border-gray-500"></div>
                  <span className="text-gray-400">Unanswered</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Question Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    attempt.examType === "CAT" ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"
                  }`}>
                    Q{originalIndex + 1}
                  </span>
                  {currentQuestion.section && (
                    <span className="text-gray-400 text-sm">{currentQuestion.section}</span>
                  )}
                  {currentQuestion.subject && (
                    <span className="text-gray-400 text-sm">{currentQuestion.subject}</span>
                  )}
                </div>
                <div className={`px-4 py-2 rounded-lg text-sm font-bold ${
                  isCorrect 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : isUnanswered
                    ? "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}>
                  {isCorrect ? "✓ Correct" : isUnanswered ? "○ Skipped" : "✗ Incorrect"}
                </div>
              </div>

              {/* Question Text */}
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-bold text-white mb-6 leading-relaxed">
                  {currentQuestion.question}
                </h2>

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option, index) => {
                    const isThisCorrect = index === currentQuestion.correctAnswer;
                    const isUserChoice = index === userAnswer;

                    let optionStyle = "bg-white/5 border-white/20 text-gray-400";
                    
                    if (isThisCorrect) {
                      optionStyle = "bg-green-500/20 border-green-500 text-green-300";
                    } else if (isUserChoice && !isThisCorrect) {
                      optionStyle = "bg-red-500/20 border-red-500 text-red-300";
                    }

                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 transition-all ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                              isThisCorrect
                                ? "bg-green-500 border-green-500 text-white"
                                : isUserChoice
                                ? "bg-red-500 border-red-500 text-white"
                                : "border-gray-500 text-gray-500"
                            }`}
                          >
                            {isThisCorrect ? "✓" : isUserChoice ? "✗" : String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1">{option}</span>
                          {isThisCorrect && (
                            <span className="text-green-400 font-semibold text-sm">Correct Answer</span>
                          )}
                          {isUserChoice && !isThisCorrect && (
                            <span className="text-red-400 font-semibold text-sm">Your Answer</span>
                          )}
                          {isUserChoice && isThisCorrect && (
                            <span className="text-green-400 font-semibold text-sm">Your Answer ✓</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-xl border ${
                    attempt.examType === "CAT"
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-green-500/10 border-green-500/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">💡</span>
                    <h4 className={`font-bold ${
                      attempt.examType === "CAT" ? "text-blue-300" : "text-green-300"
                    }`}>
                      Explanation
                    </h4>
                  </div>
                  <p className="text-gray-200 leading-relaxed">{currentQuestion.explanation}</p>
                </motion.div>
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 mt-6 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all"
                >
                  ← Previous
                </motion.button>

                <span className="text-gray-400 self-center">
                  {currentQuestionIndex + 1} of {filteredQuestions.length}
                </span>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setCurrentQuestionIndex(Math.min(filteredQuestions.length - 1, currentQuestionIndex + 1))
                  }
                  disabled={currentQuestionIndex === filteredQuestions.length - 1}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all"
                >
                  Next →
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Header Component
function ReviewHeader({ attempt, router }: { attempt: TestAttempt; router: ReturnType<typeof useRouter> }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-6 mb-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/analytics")}
              className="text-gray-400 hover:text-white transition-all"
            >
              ← Back
            </motion.button>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              attempt.examType === "CAT" ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"
            }`}>
              {attempt.examType}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">Review Your Answers</h1>
          <p className="text-gray-400">
            {formatTimestamp(attempt.timestamp)} • {formatTimeSpent(attempt.timeSpent)}
          </p>
        </div>

        <div className="flex items-center gap-6 bg-gradient-to-r from-surface to-elevated p-4 rounded-xl border border-white/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{attempt.percentage}%</p>
            <p className="text-xs text-gray-400">Score</p>
          </div>
          <div className="w-px h-12 bg-white/10"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">{attempt.correct}</p>
            <p className="text-xs text-gray-400">Correct</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{attempt.incorrect}</p>
            <p className="text-xs text-gray-400">Wrong</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-400">{attempt.unanswered}</p>
            <p className="text-xs text-gray-400">Skipped</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Filter Buttons Component
function FilterButtons({ 
  filterType, 
  setFilterType, 
  attempt,
  setCurrentQuestionIndex
}: { 
  filterType: string; 
  setFilterType: (type: "all" | "correct" | "incorrect" | "unanswered") => void;
  attempt: TestAttempt;
  setCurrentQuestionIndex: (idx: number) => void;
}) {
  const filters = [
    { key: "all", label: "All Questions", count: attempt.totalQuestions, color: "accent" },
    { key: "correct", label: "Correct", count: attempt.correct, color: "green" },
    { key: "incorrect", label: "Incorrect", count: attempt.incorrect, color: "red" },
    { key: "unanswered", label: "Skipped", count: attempt.unanswered, color: "gray" },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto mb-6"
    >
      <div className="flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => {
              setFilterType(filter.key);
              setCurrentQuestionIndex(0);
            }}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
              filterType === filter.key
                ? filter.color === "accent"
                  ? "bg-accent text-white"
                  : filter.color === "green"
                  ? "bg-green-500 text-white"
                  : filter.color === "red"
                  ? "bg-red-500 text-white"
                  : "bg-gray-500 text-white"
                : "bg-white/10 text-gray-400 hover:bg-white/20"
            }`}
          >
            {filter.label}
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filterType === filter.key ? "bg-white/20" : "bg-white/10"
            }`}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// Main export with Suspense boundary
export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-32 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <ReviewContent />
    </Suspense>
  );
}
