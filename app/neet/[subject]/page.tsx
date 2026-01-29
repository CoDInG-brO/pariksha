"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

interface SubjectConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalQuestions: number;
  totalMarks: number;
  questions: Question[];
}

export default function NEETSubjectTest() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subject as string;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [difficulty, setDifficulty] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Set<number>>(new Set());

  // Sample questions for each subject
  const subjectsData: Record<string, SubjectConfig> = {
    physics: {
      id: "physics",
      name: "Physics",
      icon: "⚛️",
      color: "from-blue-500 to-cyan-600",
      totalQuestions: 45,
      totalMarks: 180,
      questions: [
        {
          id: 1,
          question: "If a car accelerates from 0 to 100 m/s in 10 seconds, what is its acceleration?",
          options: ["5 m/s²", "10 m/s²", "15 m/s²", "20 m/s²"],
          correctAnswer: 1,
          explanation: "Using a = (v - u) / t = (100 - 0) / 10 = 10 m/s²",
          subject: "physics",
          difficulty: "Easy"
        },
        {
          id: 2,
          question: "A ball is thrown vertically upward with a velocity of 20 m/s. What is the maximum height reached? (g = 10 m/s²)",
          options: ["10 m", "20 m", "30 m", "40 m"],
          correctAnswer: 1,
          explanation: "Using v² = u² - 2gh, at max height v = 0. 0 = 400 - 2(10)h → h = 20 m",
          subject: "physics",
          difficulty: "Easy"
        },
        {
          id: 3,
          question: "Two masses m₁ = 2 kg and m₂ = 3 kg are connected by a string over a pulley. The acceleration of the system is (g = 10 m/s²)",
          options: ["1 m/s²", "2 m/s²", "3 m/s²", "4 m/s²"],
          correctAnswer: 1,
          explanation: "a = (m₂ - m₁)g / (m₁ + m₂) = (3 - 2) × 10 / 5 = 2 m/s²",
          subject: "physics",
          difficulty: "Medium"
        },
        {
          id: 4,
          question: "A resistor of 10 Ω is connected to a 100 V supply. The current flowing through it is",
          options: ["0.1 A", "1 A", "10 A", "100 A"],
          correctAnswer: 2,
          explanation: "Using Ohm's law: I = V/R = 100/10 = 10 A",
          subject: "physics",
          difficulty: "Easy"
        },
        {
          id: 5,
          question: "A sound wave has a frequency of 200 Hz and travels in air with a speed of 340 m/s. Its wavelength is",
          options: ["0.59 m", "1.7 m", "68 m", "170 m"],
          correctAnswer: 1,
          explanation: "Using v = fλ, λ = v/f = 340/200 = 1.7 m",
          subject: "physics",
          difficulty: "Medium"
        }
      ]
    },
    chemistry: {
      id: "chemistry",
      name: "Chemistry",
      icon: "🧪",
      color: "from-green-500 to-emerald-600",
      totalQuestions: 45,
      totalMarks: 180,
      questions: [
        {
          id: 1,
          question: "What is the oxidation state of sulfur in H₂SO₄?",
          options: ["+2", "+4", "+6", "+8"],
          correctAnswer: 2,
          explanation: "In H₂SO₄, H is +1 and O is -2. 2(+1) + S + 4(-2) = 0 → S = +6",
          subject: "chemistry",
          difficulty: "Easy"
        },
        {
          id: 2,
          question: "How many moles of O₂ are required to completely combust 2 moles of C₂H₆?",
          options: ["3.5 moles", "7 moles", "4 moles", "2 moles"],
          correctAnswer: 1,
          explanation: "2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O. For 2 moles of C₂H₆, 7 moles of O₂ are needed",
          subject: "chemistry",
          difficulty: "Medium"
        },
        {
          id: 3,
          question: "What is the pH of a 0.1 M HCl solution?",
          options: ["0", "1", "7", "13"],
          correctAnswer: 1,
          explanation: "HCl is a strong acid. [H⁺] = 0.1 M = 10⁻¹. pH = -log[H⁺] = 1",
          subject: "chemistry",
          difficulty: "Easy"
        },
        {
          id: 4,
          question: "Which of the following has the highest electronegativity?",
          options: ["N", "O", "F", "Cl"],
          correctAnswer: 2,
          explanation: "Electronegativity increases from left to right in a period. F is the most electronegative element.",
          subject: "chemistry",
          difficulty: "Easy"
        },
        {
          id: 5,
          question: "In SN2 reaction mechanism, the stereochemistry is",
          options: ["Retention of configuration", "Inversion of configuration", "Racemization", "No change"],
          correctAnswer: 1,
          explanation: "SN2 mechanism involves backside attack leading to inversion of configuration (Walden inversion).",
          subject: "chemistry",
          difficulty: "Hard"
        }
      ]
    },
    botany: {
      id: "botany",
      name: "Botany",
      icon: "🌿",
      color: "from-emerald-500 to-teal-600",
      totalQuestions: 45,
      totalMarks: 180,
      questions: [
        {
          id: 1,
          question: "In photosynthesis, which pigment is primarily responsible for absorbing light?",
          options: ["Xanthophyll", "Chlorophyll", "Carotenoid", "Anthocyanin"],
          correctAnswer: 1,
          explanation: "Chlorophyll is the primary pigment that absorbs light energy, mainly in the blue and red wavelengths.",
          subject: "botany",
          difficulty: "Medium"
        },
        {
          id: 2,
          question: "The site of photosynthesis in plant cells is:",
          options: ["Mitochondria", "Chloroplast", "Nucleus", "Vacuole"],
          correctAnswer: 1,
          explanation: "Chloroplasts contain chlorophyll and are the site of photosynthesis.",
          subject: "botany",
          difficulty: "Easy"
        },
        {
          id: 3,
          question: "Which tissue is responsible for transport of water in plants?",
          options: ["Phloem", "Xylem", "Epidermis", "Cambium"],
          correctAnswer: 1,
          explanation: "Xylem transports water and minerals from roots to leaves.",
          subject: "botany",
          difficulty: "Easy"
        },
        {
          id: 4,
          question: "Stomata are primarily responsible for:",
          options: ["Photosynthesis", "Transpiration and gas exchange", "Support", "Storage"],
          correctAnswer: 1,
          explanation: "Stomata regulate transpiration and gas exchange.",
          subject: "botany",
          difficulty: "Medium"
        },
        {
          id: 5,
          question: "Which hormone promotes cell elongation in plants?",
          options: ["Auxin", "Gibberellin", "Cytokinin", "Abscisic acid"],
          correctAnswer: 0,
          explanation: "Auxin promotes cell elongation and growth.",
          subject: "botany",
          difficulty: "Medium"
        }
      ]
    },
    zoology: {
      id: "zoology",
      name: "Zoology",
      icon: "🦴",
      color: "from-amber-500 to-orange-600",
      totalQuestions: 45,
      totalMarks: 180,
      questions: [
        {
          id: 1,
          question: "Which organelle is known as the powerhouse of the cell?",
          options: ["Nucleus", "Mitochondria", "Golgi apparatus", "Ribosome"],
          correctAnswer: 1,
          explanation: "Mitochondria is the powerhouse of the cell as it produces ATP through cellular respiration.",
          subject: "zoology",
          difficulty: "Easy"
        },
        {
          id: 2,
          question: "How many chromosomes do humans have?",
          options: ["23", "46", "92", "48"],
          correctAnswer: 1,
          explanation: "Humans have 23 pairs (46 total) of chromosomes.",
          subject: "zoology",
          difficulty: "Easy"
        },
        {
          id: 3,
          question: "What is the primary function of the enzyme amylase?",
          options: ["Break down fats", "Break down proteins", "Break down carbohydrates", "Break down nucleic acids"],
          correctAnswer: 2,
          explanation: "Amylase breaks down starch and carbohydrates into sugars.",
          subject: "zoology",
          difficulty: "Easy"
        },
        {
          id: 4,
          question: "The structural and functional unit of the kidney is:",
          options: ["Neuron", "Nephron", "Alveolus", "Glomerulus"],
          correctAnswer: 1,
          explanation: "Nephron is the functional unit of the kidney.",
          subject: "zoology",
          difficulty: "Medium"
        },
        {
          id: 5,
          question: "The process by which one species evolves into two or more different species is called",
          options: ["Adaptation", "Speciation", "Mutation", "Natural selection"],
          correctAnswer: 1,
          explanation: "Speciation is the evolutionary process by which new species arise.",
          subject: "zoology",
          difficulty: "Medium"
        }
      ]
    }
  };

  const subjectData = subjectsData[subjectId] || subjectsData.physics;
  let questions = subjectData.questions;

  // Filter questions by difficulty
  if (difficulty !== "All") {
    questions = questions.filter((q) => q.difficulty === difficulty);
  }

  // Initialize selected answers
  useEffect(() => {
    if (selectedAnswers.length === 0) {
      setSelectedAnswers(new Array(questions.length).fill(null));
    }
  }, [questions.length]);

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

  const handleBookmark = () => {
    const newBookmarked = new Set(bookmarkedQuestions);
    if (newBookmarked.has(currentQuestionIndex)) {
      newBookmarked.delete(currentQuestionIndex);
    } else {
      newBookmarked.add(currentQuestionIndex);
    }
    setBookmarkedQuestions(newBookmarked);
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setShowAnswer(false);
  };

  const handleSubmitTest = () => {
    setTestSubmitted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    selectedAnswers.forEach((answer, index) => {
      if (answer === null) {
        unanswered++;
      } else if (answer === questions[index].correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const rawScore = correct * 4 - incorrect * 1;
    return {
      correct,
      incorrect,
      unanswered,
      rawScore,
      percentage: ((rawScore / (questions.length * 4)) * 100).toFixed(1)
    };
  };

  const currentQuestion = questions[currentQuestionIndex];
  const score = calculateScore();

  if (testSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center"
          >
            <div className="text-6xl mb-4">
              {score.rawScore >= (questions.length * 4) * 0.7 ? "🎉" : "📊"}
            </div>

            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Practice Completed!</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">{subjectData.name}</p>

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
                <p className="text-slate-600 dark:text-slate-400 text-sm">Score</p>
                <p className="text-3xl font-bold text-sky-600 dark:text-sky-400">{score.rawScore}</p>
              </motion.div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 rounded-xl border border-orange-200 dark:border-orange-500/30">
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Accuracy</p>
              <p className="text-5xl font-bold text-slate-900 dark:text-white">{score.percentage}%</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-4">
                {parseFloat(score.percentage) >= 70
                  ? "🎯 Excellent! Keep practicing more topics."
                  : parseFloat(score.percentage) >= 50
                  ? "👍 Good attempt! Review weak areas."
                  : "📚 Need more practice. Study concepts."}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/student/neet")}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-lg text-white font-semibold transition-all"
            >
              Back to Dashboard →
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className={`bg-gradient-to-r ${subjectData.color} fixed top-0 left-0 right-0 z-50 border-b border-white/10`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{subjectData.icon}</span>
            <div>
              <h1 className="text-xl font-bold text-white">{subjectData.name}</h1>
              <p className="text-sm text-white/80">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value as any);
                setCurrentQuestionIndex(0);
                setSelectedAnswers([]);
                setShowAnswer(false);
              }}
              className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-4">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm"
            >
              {/* Question Header */}
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-slate-500 dark:text-slate-400 text-xs mb-1">Question {currentQuestionIndex + 1}</p>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 leading-snug">{currentQuestion.question}</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  currentQuestion.difficulty === "Easy"
                    ? "bg-emerald-100 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                    : currentQuestion.difficulty === "Medium"
                    ? "bg-amber-100 dark:bg-amber-500/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30"
                    : "bg-red-100 dark:bg-red-500/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/30"
                }`}>
                  {currentQuestion.difficulty}
                </span>
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
                        {showCorrect && <span className="ml-auto text-xs">✓</span>}
                        {showIncorrect && <span className="ml-auto text-xs">✗</span>}
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
                  className="ml-auto px-4 py-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all shadow-sm"
                >
                  Submit Practice
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
                  const isBookmarked = bookmarkedQuestions.has(index);

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJumpToQuestion(index)}
                      className={`w-7 h-7 rounded-md inline-flex items-center justify-center text-xs font-bold transition-all border relative ${
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
                      {isBookmarked && <div className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full"></div>}
                    </motion.button>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-4 space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-lg p-3">
                  <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Answered</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedAnswers.filter((a) => a !== null).length}/{questions.length}
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-500/10 rounded-lg p-3">
                  <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Marked</p>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{markedForReview.size}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-500/10 rounded-lg p-3">
                  <p className="text-slate-600 dark:text-slate-400 text-xs mb-1">Bookmarked</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{bookmarkedQuestions.size}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
