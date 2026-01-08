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
    biology: {
      id: "biology",
      name: "Biology",
      icon: "🧬",
      color: "from-orange-500 to-red-600",
      totalQuestions: 90,
      totalMarks: 360,
      questions: [
        {
          id: 1,
          question: "Which organelle is known as the powerhouse of the cell?",
          options: ["Nucleus", "Mitochondria", "Golgi apparatus", "Ribosome"],
          correctAnswer: 1,
          explanation: "Mitochondria is the powerhouse of the cell as it produces ATP through cellular respiration.",
          subject: "biology",
          difficulty: "Easy"
        },
        {
          id: 2,
          question: "How many chromosomes do humans have?",
          options: ["23", "46", "92", "48"],
          correctAnswer: 1,
          explanation: "Humans have 23 pairs (46 total) of chromosomes - 22 pairs of autosomes and 1 pair of sex chromosomes.",
          subject: "biology",
          difficulty: "Easy"
        },
        {
          id: 3,
          question: "What is the primary function of the enzyme amylase?",
          options: ["Break down fats", "Break down proteins", "Break down carbohydrates", "Break down nucleic acids"],
          correctAnswer: 2,
          explanation: "Amylase is an enzyme that breaks down starch and other carbohydrates into glucose.",
          subject: "biology",
          difficulty: "Easy"
        },
        {
          id: 4,
          question: "In photosynthesis, which pigment is primarily responsible for absorbing light?",
          options: ["Xanthophyll", "Chlorophyll", "Carotenoid", "Anthocyanin"],
          correctAnswer: 1,
          explanation: "Chlorophyll is the primary pigment that absorbs light energy, mainly in the blue and red wavelengths.",
          subject: "biology",
          difficulty: "Medium"
        },
        {
          id: 5,
          question: "The process by which one species evolves into two or more different species is called",
          options: ["Adaptation", "Speciation", "Mutation", "Natural selection"],
          correctAnswer: 1,
          explanation: "Speciation is the evolutionary process by which new species arise. It can occur through various mechanisms like geographic isolation.",
          subject: "biology",
          difficulty: "Medium"
        }
      ]
    }
  };

  const subjectData = subjectsData[subjectId] || subjectsData.biology;
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
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-12 border border-white/10 text-center"
          >
            <div className="text-6xl mb-4">
              {score.rawScore >= (questions.length * 4) * 0.7 ? "🎉" : "📊"}
            </div>

            <h2 className="text-4xl font-bold text-white mb-2">Practice Complete!</h2>
            <p className="text-gray-400 text-lg mb-8">{subjectData.name} Questions</p>

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
                <p className="text-gray-400 text-sm">Score</p>
                <p className="text-3xl font-bold text-blue-400">{score.rawScore}</p>
              </motion.div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
              <p className="text-gray-400 text-sm mb-2">Accuracy</p>
              <p className="text-5xl font-bold text-white">{score.percentage}%</p>
              <p className="text-gray-400 text-sm mt-4">
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
              onClick={() => router.push("/neet")}
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
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
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
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 transition-all"
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-28 pb-6">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10"
            >
              {/* Question Header */}
              <div className="mb-8 flex items-start justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-4">Question {currentQuestionIndex + 1}</p>
                  <h2 className="text-2xl font-bold text-white">{currentQuestion.question}</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  currentQuestion.difficulty === "Easy"
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : currentQuestion.difficulty === "Medium"
                    ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}>
                  {currentQuestion.difficulty}
                </span>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
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
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
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
                  className="mb-8 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg"
                >
                  <p className="text-orange-200 text-sm">
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
                  className="px-6 py-2 bg-orange-500/20 border border-orange-500/50 hover:bg-orange-500/30 rounded-lg text-orange-300 font-semibold transition-all"
                >
                  {showAnswer ? "Hide" : "Show"} Answer
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMarkForReview}
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    markedForReview.has(currentQuestionIndex)
                      ? "bg-yellow-500/20 border border-yellow-500 text-yellow-300"
                      : "bg-white/10 border border-white/20 hover:bg-white/20 text-white"
                  }`}
                >
                  {markedForReview.has(currentQuestionIndex) ? "⭐ Marked" : "Mark for Review"} 
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmark}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    bookmarkedQuestions.has(currentQuestionIndex)
                      ? "bg-purple-500/30 border border-purple-500 text-purple-300"
                      : "bg-white/10 border border-white/20 hover:bg-white/20 text-white"
                  }`}
                >
                  {bookmarkedQuestions.has(currentQuestionIndex) ? "🔖 Bookmarked" : "Bookmark"}
                </motion.button>
              </div>

              {/* Navigation */}
              <div className="flex gap-3 mt-8 pt-8 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all"
                >
                  ← Previous
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all"
                >
                  Next →
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitTest}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-lg text-white font-bold transition-all"
                >
                  Submit Practice
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold mb-4">Questions</h3>
              <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
                {questions.map((_, index) => {
                  const answered = selectedAnswers[index] !== null;
                  const isCurrent = index === currentQuestionIndex;
                  const isMarked = markedForReview.has(index);
                  const isBookmarked = bookmarkedQuestions.has(index);

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJumpToQuestion(index)}
                      className={`aspect-square rounded-lg font-bold text-sm transition-all border-2 relative ${
                        isCurrent
                          ? "bg-orange-500 border-orange-500 text-white"
                          : answered
                          ? "bg-green-500/30 border-green-500 text-green-300"
                          : isMarked
                          ? "bg-yellow-500/30 border-yellow-500 text-yellow-300"
                          : "bg-white/10 border-white/20 text-gray-400 hover:bg-white/20"
                      }`}
                    >
                      {index + 1}
                      {isBookmarked && <div className="absolute top-0 right-0 w-2 h-2 bg-purple-400 rounded-full"></div>}
                    </motion.button>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
                <div>
                  <p className="text-gray-400 text-xs">Answered</p>
                  <p className="text-2xl font-bold text-green-400">
                    {selectedAnswers.filter((a) => a !== null).length}/{questions.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Marked</p>
                  <p className="text-2xl font-bold text-yellow-400">{markedForReview.size}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Bookmarked</p>
                  <p className="text-2xl font-bold text-purple-400">{bookmarkedQuestions.size}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
