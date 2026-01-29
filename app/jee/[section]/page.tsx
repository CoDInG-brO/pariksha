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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="text-6xl mb-4">
              {score.rawScore >= score.maxScore * 0.7 ? "🎉" : "📊"}
            </div>

            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Test Completed!</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">{sectionData.name}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4"
              >
                <p className="text-slate-600 dark:text-slate-400 text-sm">Correct</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{score.correct}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4"
              >
                <p className="text-slate-600 dark:text-slate-400 text-sm">Incorrect</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{score.incorrect}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4"
              >
                <p className="text-slate-600 dark:text-slate-400 text-sm">Skipped</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{score.unanswered}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-xl p-4"
              >
                <p className="text-slate-600 dark:text-slate-400 text-sm">Raw Score</p>
                <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">{score.rawScore}</p>
              </motion.div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-500/10 dark:to-purple-500/10 rounded-xl border border-cyan-200 dark:border-cyan-500/30">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Score Percentage</p>
              <p className="text-5xl font-bold text-slate-900 dark:text-white">{score.percentage}%</p>
              <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">Out of {score.maxScore} marks</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-4">
                {parseFloat(score.percentage) >= 70
                  ? "🎯 Excellent performance! Keep practicing."
                  : parseFloat(score.percentage) >= 50
                  ? "👍 Good attempt! Focus on weak areas."
                  : "📚 Need more practice. Review concepts."}
              </p>
              <p className="text-cyan-600 dark:text-cyan-300 text-sm font-semibold mt-3">
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
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

      <div className="pt-24 pb-4">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              {/* Question */}
              <div className="mb-3">
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Question {currentQuestionIndex + 1}</p>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">{currentQuestion.question}</h2>
              </div>

              {/* Options */}
              <div className="space-y-1.5 mb-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === index;
                  const isCorrect = index === currentQuestion.correctAnswer;
                  const showCorrect = (showAnswer || testSubmitted) && isCorrect;
                  const showIncorrect = showAnswer && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ x: 2 }}
                      onClick={() => handleAnswerClick(index)}
                      disabled={testSubmitted}
                      className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                        showCorrect
                          ? "bg-emerald-50 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500 text-emerald-800 dark:text-emerald-200"
                          : showIncorrect
                          ? "bg-red-50 dark:bg-red-500/20 border-red-400 dark:border-red-500 text-red-800 dark:text-red-200"
                          : isSelected
                          ? "bg-sky-50 dark:bg-sky-500/20 border-sky-400 dark:border-sky-500 text-sky-800 dark:text-sky-200"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            showCorrect
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : showIncorrect
                              ? "bg-red-500 border-red-500 text-white"
                              : isSelected
                              ? "bg-sky-500 border-sky-500 text-white"
                              : "border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {isSelected ? "✓" : String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-xs">{option}</span>
                        {showCorrect && <span className="ml-auto text-xs">✓ Correct</span>}
                        {showIncorrect && <span className="ml-auto text-xs">✗ Incorrect</span>}
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
                  className="mb-3 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg"
                >
                  <p className="text-emerald-800 dark:text-emerald-300 text-xs">
                    <strong>Explanation:</strong> {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShowAnswer}
                  className={`px-3.5 py-1.5 text-[13.6px] font-medium rounded-md transition-all duration-200 inline-flex items-center justify-center gap-2 border-0 cursor-pointer ${
                    showAnswer
                      ? 'bg-gradient-to-br from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-sm hover:shadow-md hover:-translate-y-px'
                      : 'bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-sm hover:shadow-md hover:-translate-y-px'
                  }`}
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
              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium transition-all"
                >
                  ← Previous
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium transition-all"
                >
                  Next →
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitTest}
                  className="ml-auto px-5 py-1.5 text-xs bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all shadow-sm"
                >
                  Submit & Save
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-slate-900 dark:text-white font-bold mb-3 text-sm">Questions</h3>
              <div className="flex flex-wrap gap-1">
                {questions.map((_, index) => {
                  const answered = selectedAnswers[index] !== null;
                  const isCurrent = index === currentQuestionIndex;
                  const isMarked = markedForReview.has(index);

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJumpToQuestion(index)}
                      className={`w-7 h-7 rounded-md inline-flex items-center justify-center text-xs font-bold transition-all border ${
                        isCurrent
                          ? "bg-sky-500 border-sky-500 text-white"
                          : answered
                          ? "bg-emerald-100 dark:bg-emerald-500/30 border-emerald-400 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300"
                          : isMarked
                          ? "bg-amber-100 dark:bg-amber-500/30 border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300"
                          : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {index + 1}
                    </motion.button>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-3 text-center">
                  <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Answered</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedAnswers.filter((a) => a !== null).length}/{questions.length}
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-500/10 rounded-lg p-3 text-center">
                  <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Marked</p>
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{markedForReview.size}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
