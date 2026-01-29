"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { jeeQuestionBank, type JEESubject, type JEEQuestion } from "@/lib/jeeQuestionBank";
import { saveTestAttempt } from "@/lib/testStorage";

const SUBJECT_SEQUENCE: readonly JEESubject[] = ["physics", "chemistry", "mathematics"] as const;

const sectionMeta: Record<JEESubject, { name: string; icon: string; color: string }> = {
  physics: {
    name: "Physics",
    icon: "🔭",
    color: "from-cyan-500 to-blue-600"
  },
  chemistry: {
    name: "Chemistry",
    icon: "⚗️",
    color: "from-amber-500 to-orange-600"
  },
  mathematics: {
    name: "Mathematics",
    icon: "📐",
    color: "from-purple-500 to-indigo-600"
  },
  biology: {
    name: "Biology",
    icon: "🧬",
    color: "from-emerald-500 to-teal-600"
  }
};

export default function JEESubjectTest() {
  const params = useParams();
  const router = useRouter();
  const sectionId = params.section as string;

  const normalizedSection: JEESubject = SUBJECT_SEQUENCE.includes(sectionId as JEESubject)
    ? (sectionId as JEESubject)
    : "physics";

  const questionsForSection = jeeQuestionBank.filter((question) => question.section === normalizedSection);
  const effectiveSection: JEESubject = questionsForSection.length > 0 ? normalizedSection : "physics";
  const sectionQuestions: JEEQuestion[] = questionsForSection.length > 0
    ? questionsForSection
    : jeeQuestionBank.filter((question) => question.section === "physics");

  const sectionData = {
    id: effectiveSection,
    ...sectionMeta[effectiveSection],
    questions: sectionQuestions
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(() => new Array(sectionData.questions.length).fill(null));
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes per subject
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set<number>());
  const [savedAttemptId, setSavedAttemptId] = useState<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const questions = sectionData.questions;

  // Reset whenever the learner switches sections or question count shifts
  useEffect(() => {
    setSelectedAnswers(new Array(questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setMarkedForReview(new Set<number>());
    setShowAnswer(false);
    setTestSubmitted(false);
    setTimeRemaining(60 * 60);
    setSavedAttemptId(null);
    startTimeRef.current = Date.now();
  }, [sectionData.id, questions.length]);

  // Timer countdown
  useEffect(() => {
    if (testSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          setTestSubmitted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testSubmitted, sectionData.id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerClick = (optionIndex: number) => {
    if (testSubmitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
    setShowAnswer(false);
  };

  const handleShowAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
    }
  };

  const handleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentQuestionIndex)) {
      newMarked.delete(currentQuestionIndex);
    } else {
      newMarked.add(currentQuestionIndex);
    }
    setMarkedForReview(newMarked);
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowAnswer(false);
  };

  const handleSubmitTest = () => {
    if (testSubmitted) return;

    const timeSpent = startTimeRef.current
      ? Math.max(0, Math.min(60 * 60, Math.floor((Date.now() - startTimeRef.current) / 1000)))
      : 60 * 60 - timeRemaining;

    const latestScore = calculateScore();

    const savedAttempt = saveTestAttempt({
      examType: "JEE",
      timeSpent,
      totalQuestions: questions.length,
      correct: latestScore.correct,
      incorrect: latestScore.incorrect,
      unanswered: latestScore.unanswered,
      rawScore: latestScore.rawScore,
      maxScore: latestScore.maxScore,
      percentage: latestScore.percentage,
      estimatedPercentile: latestScore.estimatedPercentile,
      questions: questions.map((question) => ({
        id: question.id,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        section: question.section
      })),
      selectedAnswers: [...selectedAnswers]
    });

    setSavedAttemptId(savedAttempt.id);
    setShowAnswer(false);
    setTestSubmitted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    selectedAnswers.forEach((answer, index) => {
      if (answer === null) {
        unanswered++;
      } else if (answer === questions[index]?.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const maxScore = Math.max(questions.length * 4, 1);
    const rawScore = correct * 4 - incorrect;
    const normalizedScore = Math.max(0, Math.min(1, rawScore / maxScore));
    const percentage = (normalizedScore * 100).toFixed(1);
    const estimatedPercentile = Math.max(0, Math.min(100, Math.round(45 + normalizedScore * 55)));

    return {
      correct,
      incorrect,
      unanswered,
      rawScore,
      percentage,
      maxScore,
      estimatedPercentile
    };
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-10 border border-white/10"
          >
            <p className="text-5xl mb-4">🛠️</p>
            <h2 className="text-2xl font-bold text-white mb-2">Question bank loading</h2>
            <p className="text-gray-400 text-sm mb-6">
              We&apos;re refreshing the {sectionData.name} deck. Please check back in a moment or pick another subject.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/student/jee")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white font-semibold"
            >
              Back to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const score = calculateScore();

  if (testSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-12 border border-white/10 text-center"
          >
            <div className="text-6xl mb-4">
              {score.rawScore >= score.maxScore * 0.7 ? "🎉" : "📊"}
            </div>

            <h2 className="text-4xl font-bold text-white mb-2">Test Completed!</h2>
            <p className="text-gray-400 text-lg mb-8">{sectionData.name}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Correct</p>
                <p className="text-3xl font-bold text-green-400">{score.correct}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Incorrect</p>
                <p className="text-3xl font-bold text-red-400">{score.incorrect}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Skipped</p>
                <p className="text-3xl font-bold text-yellow-400">{score.unanswered}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4"
              >
                <p className="text-gray-400 text-sm">Raw Score</p>
                <p className="text-3xl font-bold text-blue-400">{score.rawScore}</p>
              </motion.div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
              <p className="text-gray-400 text-sm mb-2">Score Percentage</p>
              <p className="text-5xl font-bold text-white">{score.percentage}%</p>
              <p className="text-gray-300 text-xs mt-1">Out of {score.maxScore} marks</p>
              <p className="text-gray-400 text-sm mt-4">
                {parseFloat(score.percentage) >= 70
                  ? "🎯 Excellent performance! Keep practicing."
                  : parseFloat(score.percentage) >= 50
                  ? "👍 Good attempt! Focus on weak areas."
                  : "📚 Need more practice. Review concepts."}
              </p>
              <p className="text-cyan-200 text-sm font-semibold mt-3">
                Estimated Percentile: {score.estimatedPercentile}%ile
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/student/jee")}
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-semibold transition-all"
              >
                Back to Dashboard →
              </motion.button>
              {savedAttemptId && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/analytics/review?id=${savedAttemptId}`)}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-lg text-white font-semibold transition-all"
                >
                  Review Saved Attempt →
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      {/* Header */}
      <div className={`bg-gradient-to-r ${sectionData.color} fixed top-0 left-0 right-0 z-50 border-b border-white/10`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{sectionData.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{sectionData.name}</h1>
              <p className="text-sm text-white/80">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          <div className={`text-4xl font-bold font-mono px-6 py-2 rounded-lg ${
            timeRemaining <= 300
              ? "bg-red-500/20 border border-red-500 text-red-400"
              : "bg-white/10 border border-white/20 text-white"
          }`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      <div className="pt-6 pb-4">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-2 items-start">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-4 border border-white/10"
            >
              {/* Question */}
              <div className="mb-1.5">
                <p className="text-gray-400 text-[10px] mb-0.5">Question {currentQuestionIndex + 1}</p>
                <h2 className="text-base font-semibold text-white leading-tight">{currentQuestion.question}</h2>
              </div>

              {/* Options */}
              <div className="space-y-0.5 mb-1.5">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showCorrect = (showAnswer || testSubmitted) && isCorrect;
                  const showIncorrect = showAnswer && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ x: 4 }}
                      onClick={() => handleAnswerClick(index)}
                      disabled={testSubmitted}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        showCorrect
                          ? "bg-green-500/20 border-green-500 text-green-300"
                          : showIncorrect
                          ? "bg-red-500/20 border-red-500 text-red-300"
                          : isSelected
                          ? "bg-blue-500/20 border-blue-500 text-blue-300"
                          : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                            showCorrect
                              ? "bg-green-500 border-green-500"
                              : showIncorrect
                              ? "bg-red-500 border-red-500"
                              : isSelected
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-500"
                          }`}
                        >
                          {isSelected ? "✓" : String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                        {showCorrect && <span className="ml-auto">✓ Correct</span>}
                        {showIncorrect && <span className="ml-auto">✗ Incorrect</span>}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                >
                  <p className="text-blue-200 text-sm">
                    <strong>Explanation:</strong> {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowAnswer}
                  className={`px-3.5 py-1.5 text-[13.6px] font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center gap-2 border-0 cursor-pointer ${
                    showAnswer
                      ? 'bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-sm hover:shadow-md hover:-translate-y-px'
                      : 'bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-sm hover:shadow-md hover:-translate-y-px'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {showAnswer ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.94 17.94L6.06 6.06" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.58 10.58A3 3 0 1113.42 13.42 3 3 0 0110.58 10.58z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2.9 12s3.6-6 9.1-6 9.1 6 9.1 6-3.6 6-9.1 6-9.1-6-9.1-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.9 12s3.6-6 9.1-6 9.1 6 9.1 6-3.6 6-9.1 6S2.9 12 2.9 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    <span>{showAnswer ? 'Hide Answer' : 'Show Answer'}</span>
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMarkForReview}
                  className={`px-3.5 py-1.5 text-[13.6px] font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center gap-2 border-0 cursor-pointer ${
                    markedForReview.has(currentQuestionIndex)
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-sm hover:shadow-md hover:-translate-y-px'
                      : 'bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-sm hover:shadow-md hover:-translate-y-px'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span>{markedForReview.has(currentQuestionIndex) ? '★ Marked ✓' : '☆ Mark for Review'}</span>
                  </span>
                </motion.button>
              </div>

              {/* Navigation */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-white text-[11px] font-semibold transition-all"
                >
                  ← Previous
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-white text-[11px] font-semibold transition-all"
                >
                  Next →
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitTest}
                  className="ml-auto px-4 py-1.5 text-xs bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer border-0"
                >
                  Submit & Save
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gradient-to-br from-surface to-elevated rounded-2xl p-2 border border-white/10 space-y-2">
              <h3 className="text-white font-bold mb-4 text-xs">Questions</h3>
              <div className="flex flex-wrap gap-0.5">
                {questions.map((_, index) => {
                  const answered = selectedAnswers[index] !== null;
                  const isCurrent = index === currentQuestionIndex;
                  const isMarked = markedForReview.has(index);

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJumpToQuestion(index)}
                      className={`w-5 h-5 rounded inline-flex items-center justify-center text-[9px] font-bold transition-all border ${
                        isCurrent
                          ? "bg-blue-500 border-blue-500 text-white"
                          : answered
                          ? "bg-green-500/30 border-green-500 text-green-300"
                          : isMarked
                          ? "bg-yellow-500/30 border-yellow-500 text-yellow-300"
                          : "bg-white/5 border-white/20 text-gray-500 hover:bg-white/10"
                      }`}
                    >
                      {index + 1}
                    </motion.button>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
                <div>
                  <p className="text-gray-400 text-xs">Answered</p>
                  <p className="text-lg font-bold text-green-400">
                    {selectedAnswers.filter((a) => a !== null).length}/{questions.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Marked</p>
                  <p className="text-lg font-bold text-yellow-400">{markedForReview.size}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
