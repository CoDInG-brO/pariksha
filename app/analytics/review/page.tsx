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
      <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-slate-600 dark:text-slate-300 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (!attemptId) {
    return (
      <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800"
          >
            <p className="text-2xl mb-2">📋</p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">No Test Selected</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              Please select a test attempt from the Analytics page to review your answers.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/student/analytics")}
              className="h-8 px-3 rounded-md bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium"
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
      <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800"
          >
            <p className="text-2xl mb-2">❌</p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">Test Not Found</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
              The test attempt you&apos;re looking for doesn&apos;t exist or has been deleted.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/student/analytics")}
              className="h-8 px-3 rounded-md bg-sky-500 hover:bg-sky-600 text-white text-xs font-medium"
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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
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
            className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 shadow-sm text-center"
          >
            <p className="text-6xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Questions Found</h3>
            <p className="text-slate-600 dark:text-slate-400">
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          {/* Question Navigator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-surface to-elevated rounded-lg p-3 border border-white/10 sticky top-32">
              <h3 className="text-xs font-bold text-white mb-2">Questions</h3>
              <div className="grid grid-cols-6 gap-0.5 max-h-80 overflow-y-auto">
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
                      className={`w-7 h-7 rounded text-xs font-bold border transition-all flex items-center justify-center ${bgColor} ${
                        currentQuestionIndex === idx ? "ring-2 ring-accent" : ""
                      }`}
                    >
                      {origIdx + 1}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-500/30 border border-emerald-400 dark:border-emerald-500"></div>
                  <span className="text-slate-600 dark:text-slate-400 text-xs">Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-red-100 dark:bg-red-500/30 border border-red-400 dark:border-red-500"></div>
                  <span className="text-slate-600 dark:text-slate-400 text-xs">Incorrect</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"></div>
                  <span className="text-slate-600 dark:text-slate-400 text-xs">Unanswered</span>
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
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              {/* Question Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    attempt.examType === "JEE" ? "bg-cyan-100 dark:bg-cyan-500/30 text-cyan-700 dark:text-cyan-300" : "bg-emerald-100 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                  }`}>
                    Q{originalIndex + 1}
                  </span>
                  {currentQuestion.section && (
                    <span className="text-slate-500 dark:text-slate-400 text-xs">{currentQuestion.section}</span>
                  )}
                  {currentQuestion.subject && (
                    <span className="text-slate-500 dark:text-slate-400 text-xs">{currentQuestion.subject}</span>
                  )}
                </div>
                <div className={`px-3 py-1 rounded text-xs font-bold ${
                  isCorrect 
                    ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                    : isUnanswered
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30"
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
                <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 leading-relaxed">
                  {currentQuestion.question}
                </h2>

                {/* Options */}
                <div className="space-y-2 mb-4">
                  {currentQuestion.options.map((option, index) => {
                    const isThisCorrect = index === currentQuestion.correctAnswer;
                    const isUserChoice = index === userAnswer;

                    let optionStyle = "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300";
                    
                    if (isThisCorrect) {
                      optionStyle = "bg-emerald-50 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-200";
                    } else if (isUserChoice && !isThisCorrect) {
                      optionStyle = "bg-red-50 dark:bg-red-500/20 border-red-400 dark:border-red-500 text-red-800 dark:text-red-200";
                    }

                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border transition-all text-sm ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              isThisCorrect
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : isUserChoice
                                ? "bg-red-500 border-red-500 text-white"
                                : "border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {isThisCorrect ? "✓" : isUserChoice ? "✗" : String.fromCharCode(65 + index)}
                          </div>
                          <span className="flex-1 text-sm">{option}</span>
                          {(isThisCorrect || (isUserChoice && isThisCorrect)) && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-xs flex-shrink-0">Correct</span>
                          )}
                          {isUserChoice && !isThisCorrect && (
                            <span className="text-red-600 dark:text-red-400 font-semibold text-xs flex-shrink-0">Your Answer</span>
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
                  className={`p-4 rounded-lg border ${
                    attempt.examType === "JEE"
                      ? "bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30"
                      : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">💡</span>
                    <h4 className={`font-bold text-sm ${
                      attempt.examType === "JEE" ? "text-cyan-700 dark:text-cyan-300" : "text-emerald-700 dark:text-emerald-300"
                    }`}>
                      Explanation
                    </h4>
                  </div>
                  <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{currentQuestion.explanation}</p>
                </motion.div>
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all"
                >
                  ← Prev
                </motion.button>

                <span className="text-slate-600 dark:text-slate-400 text-sm self-center">
                  {currentQuestionIndex + 1} / {filteredQuestions.length}
                </span>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setCurrentQuestionIndex(Math.min(filteredQuestions.length - 1, currentQuestionIndex + 1))
                  }
                  disabled={currentQuestionIndex === filteredQuestions.length - 1}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-700 dark:text-slate-300 text-sm font-semibold transition-all"
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
      className="max-w-6xl mx-auto px-4 mb-3"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/student/analytics")}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-all text-xs"
              aria-label="Back"
            >
              ←
            </motion.button>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Review</h1>
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
              attempt.examType === "JEE" ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300" : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
            }`}>
              {attempt.examType}
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            {formatTimestamp(attempt.timestamp)} • {formatTimeSpent(attempt.timeSpent)}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-center">
            <p className="text-base font-bold text-sky-600 dark:text-sky-400">{attempt.percentage}%</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Score</p>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
          <div className="text-center">
            <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{attempt.correct}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Correct</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-red-600 dark:text-red-400">{attempt.incorrect}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Wrong</p>
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-slate-600 dark:text-slate-400">{attempt.unanswered}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Skipped</p>
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
      className="max-w-6xl mx-auto mb-2"
    >
      <div className="flex flex-wrap gap-1.5">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => {
              setFilterType(filter.key);
              setCurrentQuestionIndex(0);
            }}
            className={`px-2 py-1 rounded font-semibold text-xs transition-all flex items-center gap-1 border ${
              filterType === filter.key
                ? filter.color === "accent"
                  ? "bg-sky-500 border-sky-500 text-white"
                  : filter.color === "green"
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : filter.color === "red"
                  ? "bg-red-500 border-red-500 text-white"
                  : "bg-slate-500 border-slate-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {filter.label}
            <span className={`px-1 py-0.5 rounded text-xs ${
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
      <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-slate-600 dark:text-slate-300 text-sm">Loading...</div>
        </div>
      </div>
    }>
      <ReviewContent />
    </Suspense>
  );
}
