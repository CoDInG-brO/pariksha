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
  section: string;
}

interface SectionConfig {
  id: string;
  name: string;
  icon: string;
  color: string;
  questions: Question[];
}

export default function CATSectionTest() {
  const params = useParams();
  const router = useRouter();
  const sectionId = params.section as string;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(40 * 60); // 40 minutes in seconds
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());

  // Sample questions for each section
  const sectionsData: Record<string, SectionConfig> = {
    quant: {
      id: "quant",
      name: "Quantitative Aptitude",
      icon: "🔢",
      color: "from-blue-500 to-blue-600",
      questions: [
        {
          id: 1,
          question: "If 2x + 3 = 11, what is the value of x?",
          options: ["2", "3", "4", "5"],
          correctAnswer: 2,
          explanation: "2x + 3 = 11 → 2x = 8 → x = 4",
          section: "quant"
        },
        {
          id: 2,
          question: "What is the area of a circle with radius 5?",
          options: ["25π", "50π", "10π", "75π"],
          correctAnswer: 0,
          explanation: "Area = πr² = π(5)² = 25π",
          section: "quant"
        },
        {
          id: 3,
          question: "If the ratio of boys to girls is 3:2 and there are 30 boys, how many girls are there?",
          options: ["15", "20", "25", "30"],
          correctAnswer: 1,
          explanation: "3:2 ratio means for every 3 boys, there are 2 girls. 30/3 × 2 = 20 girls",
          section: "quant"
        },
        {
          id: 4,
          question: "What is 15% of 200?",
          options: ["20", "25", "30", "35"],
          correctAnswer: 2,
          explanation: "15% of 200 = 0.15 × 200 = 30",
          section: "quant"
        },
        {
          id: 5,
          question: "If a number is multiplied by 3 and then 5 is added, the result is 26. What is the number?",
          options: ["5", "6", "7", "8"],
          correctAnswer: 2,
          explanation: "3x + 5 = 26 → 3x = 21 → x = 7",
          section: "quant"
        },
        {
          id: 6,
          question: "A train travels 360 km in 4 hours. What is its speed in km/hr?",
          options: ["80", "90", "100", "85"],
          correctAnswer: 1,
          explanation: "Speed = Distance/Time = 360/4 = 90 km/hr",
          section: "quant"
        },
        {
          id: 7,
          question: "If the compound interest on ₹1000 for 2 years at 10% p.a. is:",
          options: ["₹200", "₹210", "₹220", "₹230"],
          correctAnswer: 1,
          explanation: "CI = P(1+r/100)^n - P = 1000(1.1)² - 1000 = 1210 - 1000 = ₹210",
          section: "quant"
        },
        {
          id: 8,
          question: "The average of 5 consecutive odd numbers is 25. Find the largest number.",
          options: ["27", "29", "31", "33"],
          correctAnswer: 1,
          explanation: "If average is 25, middle number is 25. Consecutive odd: 21, 23, 25, 27, 29. Largest = 29",
          section: "quant"
        },
        {
          id: 9,
          question: "A shopkeeper sells an item at 20% profit. If the cost price is ₹500, what is the selling price?",
          options: ["₹550", "₹600", "₹650", "₹700"],
          correctAnswer: 1,
          explanation: "SP = CP × (1 + Profit%) = 500 × 1.2 = ₹600",
          section: "quant"
        },
        {
          id: 10,
          question: "What is the HCF of 24 and 36?",
          options: ["6", "8", "12", "18"],
          correctAnswer: 2,
          explanation: "24 = 2³ × 3, 36 = 2² × 3². HCF = 2² × 3 = 12",
          section: "quant"
        }
      ]
    },
    dilr: {
      id: "dilr",
      name: "Data Interpretation & Logical Reasoning",
      icon: "📊",
      color: "from-purple-500 to-purple-600",
      questions: [
        {
          id: 1,
          question: "In a logical sequence 2, 4, 8, 16, ?, what comes next?",
          options: ["24", "32", "40", "48"],
          correctAnswer: 1,
          explanation: "Each number is doubled: 2→4→8→16→32",
          section: "dilr"
        },
        {
          id: 2,
          question: "If A > B, B > C, and C > D, which of the following is true?",
          options: ["D > A", "A > D", "B < D", "C > A"],
          correctAnswer: 1,
          explanation: "From the given conditions: A > B > C > D, therefore A > D",
          section: "dilr"
        },
        {
          id: 3,
          question: "In a group of 100 students, 60 play cricket, 50 play football. How many play both if 20 play neither?",
          options: ["10", "20", "30", "40"],
          correctAnswer: 2,
          explanation: "Students playing at least one sport = 100 - 20 = 80. Using inclusion-exclusion: 60 + 50 - x = 80 → x = 30",
          section: "dilr"
        },
        {
          id: 4,
          question: "What is the next number in the series: 1, 1, 2, 3, 5, 8, ?, 21?",
          options: ["11", "12", "13", "14"],
          correctAnswer: 2,
          explanation: "Fibonacci series: each number is the sum of the previous two. 5 + 8 = 13",
          section: "dilr"
        },
        {
          id: 5,
          question: "If 5 workers can complete a job in 12 days, how many days will 3 workers take?",
          options: ["15", "18", "20", "24"],
          correctAnswer: 2,
          explanation: "Total work = 5 × 12 = 60 worker-days. For 3 workers: 60 ÷ 3 = 20 days",
          section: "dilr"
        },
        {
          id: 6,
          question: "If all roses are flowers and some flowers fade quickly, which statement must be true?",
          options: ["All roses fade quickly", "Some roses fade quickly", "No roses fade quickly", "Cannot be determined"],
          correctAnswer: 3,
          explanation: "We only know roses are flowers and SOME flowers fade. We cannot determine if roses are among those that fade.",
          section: "dilr"
        },
        {
          id: 7,
          question: "In a row of children, Ravi is 7th from the left and 12th from the right. How many children are in the row?",
          options: ["17", "18", "19", "20"],
          correctAnswer: 1,
          explanation: "Total = Position from left + Position from right - 1 = 7 + 12 - 1 = 18",
          section: "dilr"
        },
        {
          id: 8,
          question: "Complete the pattern: B, D, G, K, ?",
          options: ["N", "O", "P", "Q"],
          correctAnswer: 2,
          explanation: "Differences between letters: +2, +3, +4, +5. K + 5 = P",
          section: "dilr"
        },
        {
          id: 9,
          question: "A cube is painted red on all sides and cut into 27 smaller cubes. How many small cubes have exactly 2 painted faces?",
          options: ["6", "8", "12", "16"],
          correctAnswer: 2,
          explanation: "Cubes with 2 painted faces are on the edges (not corners). Each edge has 1 such cube, and a cube has 12 edges = 12 cubes",
          section: "dilr"
        },
        {
          id: 10,
          question: "If COMPUTER is coded as RFUVQNPC, how is PRINTER coded?",
          options: ["QSJOUFQ", "SFUOJSQ", "QSJOUFS", "SFUOQSJ"],
          correctAnswer: 2,
          explanation: "Each letter is shifted: +1, -1, +1, -1... Pattern applied to PRINTER gives QSJOUFS",
          section: "dilr"
        }
      ]
    },
    verbal: {
      id: "verbal",
      name: "Verbal Ability & Reading Comprehension",
      icon: "📖",
      color: "from-orange-500 to-orange-600",
      questions: [
        {
          id: 1,
          question: "Choose the word that is most similar in meaning to 'Benevolent'",
          options: ["Malicious", "Kind-hearted", "Indifferent", "Aggressive"],
          correctAnswer: 1,
          explanation: "Benevolent means kind and generous. Kind-hearted is the best synonym.",
          section: "verbal"
        },
        {
          id: 2,
          question: "Identify the error in the sentence: 'Neither of the boys are coming to the party.'",
          options: ["No error", "'Neither' should be 'Either'", "'are' should be 'is'", "'coming' should be 'came'"],
          correctAnswer: 2,
          explanation: "'Neither' is singular, so it should be followed by 'is' not 'are'.",
          section: "verbal"
        },
        {
          id: 3,
          question: "What does the idiom 'Break the ice' mean?",
          options: ["To freeze water", "To initiate conversation", "To damage something", "To refuse to talk"],
          correctAnswer: 1,
          explanation: "'Break the ice' means to initiate a conversation or ease tension in a social situation.",
          section: "verbal"
        },
        {
          id: 4,
          question: "Fill in the blank: 'She is _____ to mathematics than her brother.'",
          options: ["more talented", "talented", "most talented", "talenteder"],
          correctAnswer: 0,
          explanation: "When comparing two people, use 'more + adjective'. 'More talented' is correct.",
          section: "verbal"
        },
        {
          id: 5,
          question: "Choose the best option to complete: 'Although he was tired, _____ he continued working.'",
          options: ["but", "and", "yet", "nor"],
          correctAnswer: 2,
          explanation: "'Yet' works best to show contrast. 'Although' already sets up the contrast, so 'but' would be redundant.",
          section: "verbal"
        },
        {
          id: 6,
          question: "Choose the word opposite in meaning to 'Ephemeral'",
          options: ["Transient", "Permanent", "Fleeting", "Brief"],
          correctAnswer: 1,
          explanation: "Ephemeral means short-lived. Permanent is the opposite.",
          section: "verbal"
        },
        {
          id: 7,
          question: "Which sentence is grammatically correct?",
          options: ["He don't know nothing", "He doesn't know anything", "He don't know anything", "He doesn't know nothing"],
          correctAnswer: 1,
          explanation: "'He doesn't know anything' is correct. 'Doesn't' for third person singular, 'anything' avoids double negative.",
          section: "verbal"
        },
        {
          id: 8,
          question: "What does 'Burning the midnight oil' mean?",
          options: ["Wasting resources", "Working late into the night", "Starting a fire", "Being very angry"],
          correctAnswer: 1,
          explanation: "'Burning the midnight oil' means working or studying late into the night.",
          section: "verbal"
        },
        {
          id: 9,
          question: "Fill in the blank: 'The committee _____ divided in their opinion.'",
          options: ["is", "are", "was", "were"],
          correctAnswer: 3,
          explanation: "When committee members are acting individually (divided opinion), use plural verb 'were'.",
          section: "verbal"
        },
        {
          id: 10,
          question: "Choose the correctly spelled word:",
          options: ["Accomodate", "Accommodate", "Acommodate", "Acomodate"],
          correctAnswer: 1,
          explanation: "'Accommodate' is correct with double 'c' and double 'm'.",
          section: "verbal"
        }
      ]
    }
  };

  const sectionData = sectionsData[sectionId] || sectionsData.quant;
  const questions = sectionData.questions;

  // Initialize selected answers
  useEffect(() => {
    if (selectedAnswers.length === 0) {
      setSelectedAnswers(new Array(questions.length).fill(null));
    }
  }, []);

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
  }, [testSubmitted]);

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

    const rawScore = correct * 3 - incorrect * 1;
    return {
      correct,
      incorrect,
      unanswered,
      rawScore,
      percentage: ((rawScore / (questions.length * 3)) * 100).toFixed(1)
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
              {score.rawScore >= (questions.length * 3) * 0.7 ? "🎉" : "📊"}
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
              <p className="text-gray-400 text-sm mt-4">
                {parseFloat(score.percentage) >= 70
                  ? "🎯 Excellent performance! Keep practicing."
                  : parseFloat(score.percentage) >= 50
                  ? "👍 Good attempt! Focus on weak areas."
                  : "📚 Need more practice. Review concepts."}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/cat")}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-semibold transition-all"
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
              {/* Question */}
              <div className="mb-8">
                <p className="text-gray-400 text-sm mb-4">Question {currentQuestionIndex + 1}</p>
                <h2 className="text-2xl font-bold text-white">{currentQuestion.question}</h2>
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
                  className="px-6 py-2 bg-blue-500/20 border border-blue-500/50 hover:bg-blue-500/30 rounded-lg text-blue-300 font-semibold transition-all"
                >
                  {showAnswer ? "Hide" : "Show"} Answer
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleMarkForReview}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    markedForReview.has(currentQuestionIndex)
                      ? "bg-yellow-500/30 border border-yellow-500 text-yellow-300"
                      : "bg-white/10 border border-white/20 hover:bg-white/20 text-white"
                  }`}
                >
                  {markedForReview.has(currentQuestionIndex) ? "⭐ Marked" : "Mark for Review"}
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
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg text-white font-bold transition-all"
                >
                  Submit Test
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

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJumpToQuestion(index)}
                      className={`aspect-square rounded-lg font-bold text-sm transition-all border-2 ${
                        isCurrent
                          ? "bg-blue-500 border-blue-500 text-white"
                          : answered
                          ? "bg-green-500/30 border-green-500 text-green-300"
                          : isMarked
                          ? "bg-yellow-500/30 border-yellow-500 text-yellow-300"
                          : "bg-white/10 border-white/20 text-gray-400 hover:bg-white/20"
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
                  <p className="text-2xl font-bold text-green-400">
                    {selectedAnswers.filter((a) => a !== null).length}/{questions.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Marked</p>
                  <p className="text-2xl font-bold text-yellow-400">{markedForReview.size}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
