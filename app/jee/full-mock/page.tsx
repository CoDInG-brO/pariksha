"use client";
import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { saveTestAttempt } from "@/lib/testStorage";
import WebcamPreview from "@/components/WebcamPreview";
import AlertDialog from "@/components/AlertDialog";
import { jeeQuestionBank } from "@/lib/jeeQuestionBank";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  section: string;
}

interface SectionData {
  id: string;
  name: string;
  icon: string;
  color: string;
  questions: Question[];
}

function JEEFullMockContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mockType, setMockType] = useState<"full" | "half">("full");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(180 * 60); // 180 minutes total
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [testStarted, setTestStarted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [showBackAlert, setShowBackAlert] = useState(false);
  const startTimeRef = useRef<number>(0);

  // Initialize mock type from query parameters
  useEffect(() => {
    const mockTypeParam = searchParams.get("mockType");
    if (mockTypeParam === "half") {
      setMockType("half");
      setTimeRemaining(90 * 60); // 90 minutes for half mock
    } else {
      setMockType("full");
      setTimeRemaining(180 * 60); // 180 minutes for full mock
    }
  }, [searchParams]);

  // Prevent back button, refresh and keyboard shortcuts during exam
  useEffect(() => {
    if (!testStarted || testSubmitted) {
      return;
    }

    window.history.pushState(null, "", window.location.href);
    
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setShowBackAlert(true);
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "You have an exam in progress";
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F5 refresh
      if (e.key === "F5") {
        e.preventDefault();
      }
      // Prevent Ctrl+R (Windows/Linux)
      if ((e.ctrlKey || e.metaKey) && e.key === "r") {
        e.preventDefault();
      }
      // Prevent Ctrl+W (close tab) on Windows/Linux
      if (e.ctrlKey && e.key === "w") {
        e.preventDefault();
      }
      // Prevent Cmd+W (close tab) on Mac
      if (e.metaKey && e.key === "w") {
        e.preventDefault();
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [testStarted, testSubmitted]);

  const { physicsQuestions, chemistryQuestions, mathematicsQuestions, allQuestions } = useMemo(() => {
    const physicsQs = jeeQuestionBank.filter((question) => question.section === "physics");
    const chemistryQs = jeeQuestionBank.filter((question) => question.section === "chemistry");
    const mathematicsQs = jeeQuestionBank.filter((question) => question.section === "mathematics");

    // For half mock, use 50% of questions from each section
    const actualPhysicsQuestions = mockType === "half" ? physicsQs.slice(0, Math.ceil(physicsQs.length / 2)) : physicsQs;
    const actualChemistryQuestions = mockType === "half" ? chemistryQs.slice(0, Math.ceil(chemistryQs.length / 2)) : chemistryQs;
    const actualMathematicsQuestions = mockType === "half" ? mathematicsQs.slice(0, Math.ceil(mathematicsQs.length / 2)) : mathematicsQs;

    return {
      physicsQuestions: actualPhysicsQuestions,
      chemistryQuestions: actualChemistryQuestions,
      mathematicsQuestions: actualMathematicsQuestions,
      allQuestions: [
        ...actualPhysicsQuestions,
        ...actualChemistryQuestions,
        ...actualMathematicsQuestions,
      ]
    };
  }, [mockType]);

  const sectionsData: Record<string, SectionData> = {
    physics: {
      id: "physics",
      name: "Physics",
      icon: "🔭",
      color: "from-cyan-500 to-blue-600",
      questions: physicsQuestions
    },
    chemistry: {
      id: "chemistry",
      name: "Chemistry",
      icon: "⚗️",
      color: "from-amber-500 to-orange-600",
      questions: chemistryQuestions
    },
    mathematics: {
      id: "mathematics",
      name: "Mathematics",
      icon: "📐",
      color: "from-purple-500 to-indigo-600",
      questions: mathematicsQuestions
    }
  };

  const [currentSection, setCurrentSection] = useState(0);
  const sections = Object.values(sectionsData);
  const currentSectionData = sections[currentSection];
  const currentSectionQuestions = currentSectionData.questions;
  const questionIndexInSection = currentQuestionIndex - sections.slice(0, currentSection).reduce((acc, s) => acc + s.questions.length, 0);

  // Initialize answers
  useEffect(() => {
    if (selectedAnswers.length === 0) {
      setSelectedAnswers(new Array(allQuestions.length).fill(null));
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!testStarted || testSubmitted) return;

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
  }, [testStarted, testSubmitted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerClick = (optionIndex: number) => {
    if (testSubmitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      const newSection = sections.findIndex((s) => {
        const start = sections.slice(0, sections.indexOf(s)).reduce((acc, section) => acc + section.questions.length, 0);
        return currentQuestionIndex + 1 < start + s.questions.length;
      });
      setCurrentSection(newSection);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newSection = sections.findIndex((s) => {
        const start = sections.slice(0, sections.indexOf(s)).reduce((acc, section) => acc + section.questions.length, 0);
        return currentQuestionIndex - 1 < start + s.questions.length;
      });
      setCurrentSection(newSection);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const [savedAttemptId, setSavedAttemptId] = useState<string | null>(null);

  const handleSubmitTest = () => {
    const timeSpent = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 180 * 60 - timeRemaining;
    const score = calculateScore();
    
    // Save to localStorage
    const savedAttempt = saveTestAttempt({
      examType: "JEE",
      timeSpent,
      totalQuestions: allQuestions.length,
      correct: score.correct,
      incorrect: score.incorrect,
      unanswered: score.unanswered,
      rawScore: score.rawScore,
      maxScore: allQuestions.length * 4,
      percentage: score.percentage,
      estimatedPercentile: score.estimated_percentile,
      questions: allQuestions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        section: q.section,
      })),
      selectedAnswers: [...selectedAnswers],
    });
    
    setSavedAttemptId(savedAttempt.id);
    setTestSubmitted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    selectedAnswers.forEach((answer, index) => {
      if (answer === null) {
        unanswered++;
      } else if (answer === allQuestions[index].correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const maxScore = allQuestions.length * 4;
    const rawScore = correct * 4 - incorrect;
    return {
      correct,
      incorrect,
      unanswered,
      rawScore,
      percentage: ((rawScore / maxScore) * 100).toFixed(1),
      estimated_percentile: Math.max(0, Math.min(100, Math.round(40 + (rawScore / maxScore) * 60)))
    };
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-3 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="text-2xl mb-3">🚀</div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              JEE {mockType === "half" ? "Half" : "Full"} Mock Test
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs mb-4">
              {mockType === "half" 
                ? "Half 90-minute PCM simulation (50% questions) with +4 / -1 scoring." 
                : "Full 180-minute PCM simulation with +4 / -1 scoring."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <div className="bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 rounded-lg p-3">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] mb-0.5">Section 1</p>
                <p className="text-sm font-bold text-cyan-600 dark:text-cyan-300">Physics</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">
                  {mockType === "half" ? "10 questions | 30 min" : "20 questions | 60 min"}
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-3">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] mb-0.5">Section 2</p>
                <p className="text-sm font-bold text-amber-600 dark:text-amber-300">Chemistry</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">
                  {mockType === "half" ? "10 questions | 30 min" : "20 questions | 60 min"}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 rounded-lg p-3">
                <p className="text-slate-500 dark:text-slate-400 text-[10px] mb-0.5">Section 3</p>
                <p className="text-sm font-bold text-purple-600 dark:text-purple-300">Mathematics</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">
                  {mockType === "half" ? "10 questions | 30 min" : "20 questions | 60 min"}
                </p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg text-left">
              <p className="text-amber-800 dark:text-amber-200 font-semibold mb-1 text-xs">⚠️ Exam Protocol</p>
              <ul className="text-amber-700 dark:text-amber-300 text-[10px] space-y-0.5 list-disc pl-4">
                <li>Advancing to the next subject permanently locks the previous section.</li>
                <li>Budget 55 minutes per subject and keep a buffer for numerical answers.</li>
                <li>Pause and alert the invigilator before refreshing or leaving the window.</li>
              </ul>
            </div>

            {/* Camera Monitoring Toggle */}
            <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-slate-900 dark:text-white font-semibold flex items-center gap-2 text-xs">
                    <span>📷</span> Camera Monitoring
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] mt-0.5">
                    Display your webcam feed during the exam
                  </p>
                </div>
                <button
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    cameraEnabled ? "bg-cyan-500" : "bg-slate-300 dark:bg-slate-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-sm ${
                      cameraEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/student/dashboard")}
                className="px-3 py-1.5 text-xs bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold rounded-lg transition-all shadow-sm"
              >
                Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  // Decrement mock credit
                  const STORAGE_KEY = "mock_credits_v1";
                  const saved = localStorage.getItem(STORAGE_KEY);
                  if (saved) {
                    try {
                      const credits = JSON.parse(saved);
                      const type = mockType === "half" ? "half" : "full";
                      if (credits.JEE && credits.JEE[type] > 0) {
                        credits.JEE[type] = Math.max(0, credits.JEE[type] - 1);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(credits));
                      }
                    } catch (e) {
                      console.error("Error updating credits:", e);
                    }
                  }
                  startTimeRef.current = Date.now();
                  setTestStarted(true);
                }}
                className="px-4 py-1.5 text-xs bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all shadow-sm"
              >
                Start {mockType === "half" ? "Half" : "Full"} Mock →
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = allQuestions[currentQuestionIndex];
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
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => router.push("/student/dashboard")}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors text-lg"
                aria-label="Back"
              >
                ←
              </button>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Full Mock Completed</h2>
              <span className="text-2xl">{parseFloat(score.percentage) >= 70 ? "🎉" : "📊"}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">JEE Simulation Results</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl p-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Correct</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{score.correct}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl p-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Incorrect</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{score.incorrect}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Skipped</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{score.unanswered}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 rounded-xl p-4">
                <p className="text-slate-600 dark:text-slate-400 text-sm">Raw Score</p>
                <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">{score.rawScore}</p>
              </motion.div>
            </div>

            <div className="mb-6 p-5 bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-500/10 dark:to-purple-500/10 rounded-xl border border-cyan-200 dark:border-cyan-500/30">
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Score Percentage</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{score.percentage}%</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-2">
                Estimated Percentile: <span className="text-lg font-bold text-cyan-600 dark:text-cyan-300">{score.estimated_percentile}%ile</span>
              </p>
            </div>

            <div className="flex gap-4 justify-start">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/student/dashboard")}
                className="px-5 py-2.5 text-sm bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-white font-semibold rounded-lg transition-all shadow-sm"
              >
                Dashboard
              </motion.button>
              {savedAttemptId && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/analytics/review?id=${savedAttemptId}`)}
                  className="px-5 py-2.5 text-sm bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-lg text-white font-semibold transition-all shadow-sm"
                >
                  📝 Review Answers →
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
      <div className={`bg-gradient-to-r from-cyan-500 to-purple-600 fixed top-0 left-0 right-0 z-50 border-b border-white/10`}>
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-semibold text-white">JEE Full Mock Test</h1>
            <p className="text-xs text-white/80">
              {currentSectionData.name} • Question {questionIndexInSection + 1}/{currentSectionQuestions.length}
            </p>
          </div>

          <div className={`text-2xl font-bold font-mono px-4 py-2 rounded-lg ${
            timeRemaining <= 300 ? "bg-red-500/20 border border-red-500 text-red-100" : "bg-white/10 border border-white/20 text-white"
          }`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      <div className="pt-20 pb-4">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
              {/* Section Indicator */}
              <div className="mb-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    currentSection === 0 ? "bg-cyan-100 dark:bg-cyan-500/30 text-cyan-700 dark:text-cyan-200" : currentSection === 1 ? "bg-amber-100 dark:bg-amber-500/30 text-amber-700 dark:text-amber-200" : "bg-purple-100 dark:bg-purple-500/30 text-purple-700 dark:text-purple-200"
                  }`}>
                    {currentSectionData.name}
                  </span>
                </p>
              </div>

              {/* Question */}
              <div className="mb-3">
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Question {questionIndexInSection + 1} of {currentSectionQuestions.length}</p>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">{currentQuestion.question}</h2>
              </div>

              {/* Options */}
              <div className="space-y-1.5 mb-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === index;

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ x: 2 }}
                      onClick={() => handleAnswerClick(index)}
                      disabled={testSubmitted}
                      className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? "bg-sky-50 dark:bg-sky-500/20 border-sky-400 dark:border-sky-500 text-sky-800 dark:text-sky-200"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          isSelected
                            ? "bg-sky-500 border-sky-500 text-white"
                            : "border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400"
                        }`}>
                          {isSelected ? "✓" : String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-xs">{option}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {/* Mark for Review Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const newMarked = new Set(markedForReview);
                    if (newMarked.has(currentQuestionIndex)) {
                      newMarked.delete(currentQuestionIndex);
                    } else {
                      newMarked.add(currentQuestionIndex);
                    }
                    setMarkedForReview(newMarked);
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-sm ${
                    markedForReview.has(currentQuestionIndex)
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {markedForReview.has(currentQuestionIndex) ? '★ Marked' : '☆ Mark for Review'}
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
                  disabled={currentQuestionIndex === allQuestions.length - 1}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-slate-700 dark:text-slate-300 text-xs font-medium transition-all"
                >
                  Next →
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitTest}
                  className="ml-auto py-1.5 px-5 text-xs bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-all shadow-sm"
                >
                  Submit & Save
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Progress Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              {/* Question Grid by Section */}
              {sections.map((section, idx) => {
                const sectionStart = sections.slice(0, idx).reduce((acc, s) => acc + s.questions.length, 0);
                const isCurrentSection = idx === currentSection;

                return (
                  <div key={idx} className={`${isCurrentSection ? "" : "opacity-60"}`}>
                    <div className="flex items-center gap-1 mb-2">
                      <span className={`text-xs font-semibold ${
                        idx === 0 ? "text-cyan-600 dark:text-cyan-300" : idx === 1 ? "text-amber-600 dark:text-amber-300" : "text-purple-600 dark:text-purple-300"
                      }`}>
                        {section.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {section.questions.map((_, qIdx) => {
                        const globalIdx = sectionStart + qIdx;
                        const isCurrent = currentQuestionIndex === globalIdx;
                        const isAnswered = selectedAnswers[globalIdx] !== null;
                        const isMarked = markedForReview.has(globalIdx);

                        return (
                          <motion.button
                            key={qIdx}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCurrentQuestionIndex(globalIdx);
                              setCurrentSection(idx);
                            }}
                            className={`w-7 h-7 rounded-md inline-flex items-center justify-center text-xs font-bold transition-all border ${
                              isCurrent
                                ? "bg-sky-500 border-sky-500 text-white"
                                : isAnswered
                                ? "bg-emerald-100 dark:bg-emerald-500/30 border-emerald-400 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300"
                                : isMarked
                                ? "bg-amber-100 dark:bg-amber-500/30 border-amber-400 dark:border-amber-500 text-amber-700 dark:text-amber-300"
                                : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}>
                            {qIdx + 1}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Overall Stats */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-slate-900 dark:text-white font-bold mb-3 text-sm">Progress</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-3 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Answered</p>
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{selectedAnswers.filter((a) => a !== null).length}/{allQuestions.length}</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-500/10 rounded-lg p-3 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">For Review</p>
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{markedForReview.size}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Webcam Preview - shows during exam if enabled */}
      <WebcamPreview isActive={cameraEnabled && testStarted && !testSubmitted} />

      {/* Back Button Alert Dialog */}
      <AlertDialog
        isOpen={showBackAlert}
        onClose={() => setShowBackAlert(false)}
        title="⚠️ Cannot Go Back"
        message="You cannot go back during the exam. Please complete the exam and click the Submit button."
      />
    </div>
  );
}

export default function JEEFullMock() {
  return (
    <Suspense fallback={
      <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
        </div>
      </div>
    }>
      <JEEFullMockContent />
    </Suspense>
  );
}
