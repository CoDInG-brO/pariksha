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
  const [showAnswer, setShowAnswer] = useState(false);
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
      setShowAnswer(false);
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
      setShowAnswer(false);
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
      <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-surface rounded-xl p-4 border border-white/10"
          >
            <div className="text-3xl mb-2">🚀</div>
            <h1 className="text-xl font-semibold text-white mb-1">
              JEE {mockType === "half" ? "Half" : "Full"} Mock Test
            </h1>
            <p className="text-gray-400 text-sm mb-4">
              {mockType === "half" 
                ? "Half 90-minute PCM simulation (50% questions) with +4 / -1 scoring." 
                : "Full 180-minute PCM simulation with +4 / -1 scoring."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Section 1</p>
                <p className="text-lg font-semibold text-cyan-300">Physics</p>
                <p className="text-xs text-gray-500 mt-1">
                  {mockType === "half" ? "10 questions | 30 min" : "20 questions | 60 min"}
                </p>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Section 2</p>
                <p className="text-lg font-semibold text-amber-300">Chemistry</p>
                <p className="text-xs text-gray-500 mt-1">
                  {mockType === "half" ? "10 questions | 30 min" : "20 questions | 60 min"}
                </p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-1">Section 3</p>
                <p className="text-lg font-semibold text-purple-300">Mathematics</p>
                <p className="text-xs text-gray-500 mt-1">
                  {mockType === "half" ? "10 questions | 30 min" : "20 questions | 60 min"}
                </p>
              </div>
            </div>

            <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-left">
              <p className="text-amber-900 text-base font-semibold mb-2">⚠️ Exam protocol</p>
              <ul className="text-amber-800 text-sm space-y-1 list-disc pl-5">
                <li>Advancing to the next subject permanently locks the previous section.</li>
                <li>Budget 55 minutes per subject and keep a buffer for numerical answers.</li>
                <li>Pause and alert the invigilator before refreshing or leaving the window.</li>
              </ul>
            </div>

            {/* Camera Monitoring Toggle */}
            <div className="mb-4 p-4 bg-surface rounded-lg border border-white/8">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-accent text-sm font-semibold flex items-center gap-2">
                    <span>📷</span> Camera Monitoring
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Display your webcam feed during the exam
                  </p>
                </div>
                <button
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    cameraEnabled ? "bg-accent" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      cameraEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/jee")}
                className="btn-gradient-gray"
              >
                Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  startTimeRef.current = Date.now();
                  setTestStarted(true);
                }}
                className="btn-gradient-blue ml-auto"
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
      <div className="bg-slate-100/60 dark:bg-slate-950 pt-4 pb-6 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-surface rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => router.push("/jee")}
                className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                aria-label="Back"
              >
                ←
              </button>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Full Mock Completed</h2>
              <span className="text-lg">{parseFloat(score.percentage) >= 70 ? "🎉" : "📊"}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">JEE Simulation Results</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Correct</p>
                <p className="text-3xl font-bold text-green-400">{score.correct}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Incorrect</p>
                <p className="text-3xl font-bold text-red-400">{score.incorrect}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Skipped</p>
                <p className="text-3xl font-bold text-yellow-400">{score.unanswered}</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Raw Score</p>
                <p className="text-3xl font-bold text-blue-400">{score.rawScore}</p>
              </motion.div>
            </div>

            <div className="mb-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
              <p className="text-slate-500 text-xs mb-1">Score Percentage</p>
              <p className="text-2xl font-semibold text-white">{score.percentage}%</p>
              <p className="text-slate-500 text-xs mt-2">
                Estimated Percentile: <span className="text-base font-semibold text-blue-300">{score.estimated_percentile}%ile</span>
              </p>
            </div>

            <div className="flex gap-3 justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/jee")}
                className="btn-gradient-gray-lg"
              >
                Dashboard
              </motion.button>
              {savedAttemptId && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/analytics/review?id=${savedAttemptId}`)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-md text-white text-sm font-semibold transition-all"
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
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      {/* Header */}
      <div className={`bg-gradient-to-r from-cyan-500 to-purple-600 fixed top-0 left-0 right-0 z-50 border-b border-white/10`}>
        <div className="max-w-7xl mx-auto px-6 py-0.5 flex items-center justify-between">
          <div>
            <h1 className="text-[11px] font-medium text-white">JEE Full Mock Test</h1>
            <p className="text-[10px] text-white/80">
              {currentSectionData.name} • Question {questionIndexInSection + 1}/{currentSectionQuestions.length}
            </p>
          </div>

          <div className={`text-[11px] font-medium font-mono px-1 py-0.5 rounded-md ${
            timeRemaining <= 300 ? "bg-red-500/20 border border-red-500 text-red-400" : "bg-white/10 border border-white/20 text-white"
          }`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      <div className="pt-6 pb-4">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-2 items-start">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-4 border border-white/10">
              {/* Section Indicator */}
              <div className="mb-1.5 pb-1 border-b border-white/10">
                <p className="text-[10px] text-gray-400">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    currentSection === 0 ? "bg-cyan-500/30 text-cyan-200" : currentSection === 1 ? "bg-amber-500/30 text-amber-200" : "bg-purple-500/30 text-purple-200"
                  }`}>
                    {currentSectionData.name}
                  </span>
                </p>
              </div>

              {/* Question */}
              <div className="mb-1.5">
                <p className="text-gray-400 text-[10px] mb-0.5">Question {questionIndexInSection + 1} of {currentSectionQuestions.length}</p>
                <h2 className="text-base font-semibold text-white leading-tight">{currentQuestion.question}</h2>
              </div>

              {/* Options */}
              <div className="space-y-0.5 mb-1.5">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === index;

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ x: 0.5 }}
                      onClick={() => handleAnswerClick(index)}
                      disabled={testSubmitted}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? "bg-blue-500/16 border-blue-500 text-blue-300"
                          : "bg-white/5 border-white/16 text-white hover:bg-white/6"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] font-semibold ${
                          isSelected
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-500"
                        }`}>
                          {isSelected ? "✓" : String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-sm">{option}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {/* Mark for Review Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const newMarked = new Set(markedForReview);
                    if (newMarked.has(currentQuestionIndex)) {
                      newMarked.delete(currentQuestionIndex);
                    } else {
                      newMarked.add(currentQuestionIndex);
                    }
                    setMarkedForReview(newMarked);
                  }}
                  className={markedForReview.has(currentQuestionIndex) ? "btn-gradient-orange" : "btn-gradient-yellow"}
                  style={{padding: '0.25rem 0.75rem', fontSize: '0.75rem'}}
                >
                  <span className="inline-flex items-center gap-1">
                    <span>{markedForReview.has(currentQuestionIndex) ? '★ Marked' : '☆ Mark'}</span>
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
                  disabled={currentQuestionIndex === allQuestions.length - 1}
                  className="px-2 py-0.5 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-white text-[11px] font-semibold transition-all"
                >
                  Next →
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitTest}
                  className="ml-auto btn-gradient-cyan-md"
                >
                  Submit
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Progress Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gradient-to-br from-surface to-elevated rounded-2xl p-2 border border-white/10 space-y-2">
              {/* Question Grid by Section */}
              {sections.map((section, idx) => {
                const sectionStart = sections.slice(0, idx).reduce((acc, s) => acc + s.questions.length, 0);
                const isCurrentSection = idx === currentSection;

                return (
                  <div key={idx} className={`${isCurrentSection ? "" : "opacity-60"}`}>
                    <div className="flex items-center gap-1 mb-2">
                      <span className={`text-[10px] font-semibold ${
                        idx === 0 ? "text-cyan-200" : idx === 1 ? "text-amber-200" : "text-purple-200"
                      }`}>
                        {section.name}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-0.5">
                      {section.questions.map((_, qIdx) => {
                        const globalIdx = sectionStart + qIdx;
                        const isCurrent = currentQuestionIndex === globalIdx;
                        const isAnswered = selectedAnswers[globalIdx] !== null;
                        const isMarked = markedForReview.has(globalIdx);

                        return (
                          <motion.button
                            key={qIdx}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCurrentQuestionIndex(globalIdx);
                              setCurrentSection(idx);
                              setShowAnswer(false);
                            }}
                            className={`w-5 h-5 rounded inline-flex items-center justify-center text-[9px] font-bold transition-all border ${
                              isCurrent
                                ? "bg-blue-500 border-blue-500 text-white"
                                : isAnswered
                                ? "bg-green-500/30 border-green-500 text-green-300"
                                : isMarked
                                ? "bg-yellow-500/30 border-yellow-500 text-yellow-300"
                                : "bg-white/5 border-white/20 text-gray-500 hover:bg-white/10"
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
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-white font-bold mb-4 text-xs">Overall Stats</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-gray-400 text-xs">Answered</p>
                    <p className="text-lg font-bold text-green-400">{selectedAnswers.filter((a) => a !== null).length}/{allQuestions.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Marked for Review</p>
                    <p className="text-lg font-bold text-yellow-400">{markedForReview.size}</p>
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
