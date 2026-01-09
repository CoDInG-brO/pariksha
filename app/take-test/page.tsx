
"use client";
import { useState } from "react";
import { motion } from "framer-motion";

interface AnswerRecord {
  questionIndex: number;
  isCorrect: boolean;
}

const questions = [
  {
    id: 1,
    question: "What does ACID stand for in databases?",
    category: "Database",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Accuracy, Control, Integrity, Data",
      "None",
      "All"
    ],
    correctAnswer: 0,
    explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability. These are key properties that guarantee reliable database transactions."
  },
  {
    id: 2,
    question: "Which HTTP status code means Unauthorized?",
    category: "Web Development",
    options: ["200", "401", "403", "500"],
    correctAnswer: 1,
    explanation: "401 Unauthorized indicates that authentication is required or has failed. The client must provide valid credentials."
  },
  {
    id: 3,
    question: "What is the time complexity of binary search?",
    category: "Algorithms",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search has O(log n) time complexity because it divides the search space in half with each iteration."
  },
  {
    id: 4,
    question: "Which data structure uses LIFO (Last In First Out)?",
    category: "Data Structures",
    options: ["Queue", "Stack", "Array", "Tree"],
    correctAnswer: 1,
    explanation: "Stack uses LIFO principle where the last element inserted is the first one to be removed."
  },
  {
    id: 5,
    question: "What does REST stand for?",
    category: "Web Development",
    options: [
      "Representational State Transfer",
      "Remote Execution Service Technology",
      "Reliable Service Transfer",
      "Resource Exchange System Technology"
    ],
    correctAnswer: 0,
    explanation: "REST stands for Representational State Transfer, an architectural style for designing networked applications."
  }
];

export default function TakeTest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerClick = (index: number) => {
    if (!showAnswer) {
      setSelectedAnswer(index);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const answerRecord: AnswerRecord = {
        questionIndex: currentQuestionIndex,
        isCorrect: selectedAnswer === currentQuestion.correctAnswer
      };
      setAnswers([...answers, answerRecord]);
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handleSubmitExam = () => {
    if (selectedAnswer !== null) {
      const answerRecord: AnswerRecord = {
        questionIndex: currentQuestionIndex,
        isCorrect: selectedAnswer === currentQuestion.correctAnswer
      };
      setAnswers([...answers, answerRecord]);
    }
    setShowResults(true);
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background">
      {/* Progress Bar */}
      <div className="sticky top-20 z-40 bg-surface/80 backdrop-blur border-b border-white/10 px-5 py-3">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">Progress</span>
            <span className="text-xs font-semibold text-accent">{currentQuestionIndex + 1} / {questions.length}</span>
          </div>
          <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-5 py-6">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Question Card */}
          <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10 shadow-2xl">
            <div className="mb-4">
              <span className="inline-block px-2.5 py-1 rounded-full bg-accent/20 text-accent text-[11px] font-semibold mb-3">
                {currentQuestion.category}
              </span>
              <h2 className="text-xl font-semibold text-white leading-snug">{currentQuestion.question}</h2>
            </div>

            {/* Options */}
            <div className="space-y-2.5 mb-6">
              {currentQuestion.options.map((option, index) => {
                let bgColor = "bg-black/20 border-white/10 hover:border-accent/50";
                let icon = "";
                
                if (selectedAnswer !== null) {
                  if (index === currentQuestion.correctAnswer && (showAnswer || isCorrect)) {
                    bgColor = "bg-green-500/20 border-green-500 hover:border-green-500";
                    icon = "✓";
                  } else if (index === selectedAnswer && !isCorrect) {
                    bgColor = "bg-red-500/20 border-red-500 hover:border-red-500";
                    icon = "✕";
                  }
                }

                return (
                  <motion.button
                    key={index}
                    whileHover={{ x: selectedAnswer === null ? 4 : 0 }}
                    onClick={() => handleAnswerClick(index)}
                    disabled={showAnswer}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 ${selectedAnswer === index ? (isCorrect ? 'option--correct' : 'option--incorrect') : (showAnswer && index === currentQuestion.correctAnswer ? 'option--correct' : 'bg-black/20 border-white/10 hover:border-accent/50')} ${selectedAnswer === null ? "cursor-pointer" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-semibold text-xs ${
                        selectedAnswer === index
                          ? isCorrect
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-red-500 border-red-500 text-white"
                          : "border-white/30 text-gray-400"
                      }`}>
                        {selectedAnswer === index ? (
                          isCorrect ? (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6 6L18 18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M6 18L18 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )
                        ) : (
                          String.fromCharCode(65 + index)
                        )}
                      </div>

                      <span className="text-white text-sm leading-snug">{option}</span>

                      {/* right-side icons when showing answer */}
                      <div className="ml-auto flex items-center gap-2">
                        {showAnswer && index === currentQuestion.correctAnswer && (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}

                        {selectedAnswer === index && selectedAnswer !== currentQuestion.correctAnswer && (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 6L18 18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 18L18 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Answer Section */}
            {selectedAnswer !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {!showAnswer && (
                  <button
                    onClick={handleShowAnswer}
                    aria-pressed={showAnswer}
                    className={`w-full py-2.5 px-4 rounded-xl text-white font-semibold transition-all duration-200 btn-toggle green`}
                  >
                    <span className="inline-flex items-center justify-center gap-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.9 12s3.6-6 9.1-6 9.1 6 9.1 6-3.6 6-9.1 6S2.9 12 2.9 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{isCorrect ? "Show Explanation" : "Show Answer"}</span>
                    </span>
                  </button>
                )}

                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`p-5 rounded-xl border-2 ${
                      isCorrect
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    <p className="text-sm text-gray-300 mb-2.5">
                      <strong className="text-white">Your Answer:</strong> {currentQuestion.options[selectedAnswer]}
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-gray-300 mb-2.5">
                        <strong className="text-white">Correct Answer:</strong> {currentQuestion.options[currentQuestion.correctAnswer]}
                      </p>
                    )}
                    <p className="text-sm text-gray-300 mb-3">
                      <strong className="text-white">Explanation:</strong> {currentQuestion.explanation}
                    </p>
                    <p className={`text-sm font-semibold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                      {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3 mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-5 py-2.5 bg-surface border-2 border-white/10 hover:border-white/20 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            ← Previous
          </button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitExam}
              disabled={selectedAnswer === null}
              className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-green-500/20"
            >
              Submit Exam →
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className="px-6 py-2.5 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 rounded-xl text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-accent/20"
            >
              Next →
            </button>
          )}
        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10 max-w-md w-full shadow-2xl relative"
          >
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setShowAnswer(false);
                setAnswers([]);
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-white text-2xl transition-colors duration-200"
            >
              ✕
            </button>

            {(() => {
              const percentage = Math.round((answers.filter(a => a.isCorrect).length / questions.length) * 100);
              let emoji = "";
              let message = "";
              let textColor = "";
              let bgGradient = "";

              if (percentage >= 80) {
                emoji = "❤️";
                message = "Outstanding! You've demonstrated excellent knowledge!";
                textColor = "text-green-400";
                bgGradient = "from-green-500/20 to-transparent";
              } else if (percentage >= 50) {
                emoji = "😊";
                message = "Good job! You're on the right track. Keep practicing!";
                textColor = "text-yellow-400";
                bgGradient = "from-yellow-500/20 to-transparent";
              } else {
                emoji = "😞";
                message = "Work hard for success! Don't give up, practice makes perfect!";
                textColor = "text-red-400";
                bgGradient = "from-red-500/20 to-transparent";
              }

              return (
                <>
                  <div className={`bg-gradient-to-r ${bgGradient} rounded-xl p-6 mb-6 text-center`}>
                    <div className="text-6xl mb-4">{emoji}</div>
                    <h3 className="text-3xl font-bold text-white mb-2">Exam Completed!</h3>
                    <div className="text-5xl font-bold text-accent mb-3">
                      {percentage}%
                    </div>
                    <p className="text-gray-300">
                      You got <strong className="text-white">{answers.filter(a => a.isCorrect).length}</strong> out of <strong className="text-white">{questions.length}</strong> questions correct
                    </p>
                  </div>
                  <p className={`text-center font-semibold mb-8 text-lg ${textColor}`}>
                    {message}
                  </p>
                </>
              );
            })()}

            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setShowAnswer(false);
                setAnswers([]);
              }}
              className="w-full py-3 px-4 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 rounded-xl text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-accent/20"
            >
              Retake Exam
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
