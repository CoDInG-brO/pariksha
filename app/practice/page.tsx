"use client";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import JeeIcon from '@/components/icons/JeeIcon';
import NeetIcon from '@/components/icons/NeetIcon';
import { useState, useEffect, useRef, useMemo } from "react";
import {
  savePracticeProgress,
  getPracticeProgress,
  clearPracticeProgress,
  PracticeProgress
} from "@/lib/testStorage";
import {
  playCorrectSound,
  playIncorrectSound,
  isSoundEnabled
} from "@/lib/sounds";
import { jeeQuestionBank } from "@/lib/jeeQuestionBank";
import { hintBank } from "@/lib/hintBank";

// Sample question banks
const jeePracticeQuestions = jeeQuestionBank.map((question) => ({
  id: question.id,
  section: question.section,
  topic: question.topic,
  subtopic: question.subtopic,
  question: question.question,
  options: question.options,
  answer: question.options[question.correctAnswer],
  explanation: question.explanation,
}));

const neetQuestions = [
  { id: 1, section: "physics" as const, topic: "Mechanics", subtopic: "Motion", question: "Which organelle is known as the 'powerhouse of the cell'?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"], answer: "Mitochondria", explanation: "Mitochondria produce ATP through cellular respiration, providing energy for cellular activities." },
  { id: 2, section: "chemistry" as const, topic: "Atomic Structure", subtopic: "Atoms", question: "The pH of human blood is approximately:", options: ["6.4", "7.0", "7.4", "8.4"], answer: "7.4", explanation: "Human blood is slightly alkaline with a pH of 7.35-7.45. This is maintained by buffer systems." },
  { id: 3, section: "biology" as const, topic: "Nutrition", subtopic: "Vitamins", question: "Which vitamin is synthesized by bacteria in the human intestine?", options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"], answer: "Vitamin K", explanation: "Vitamin K is synthesized by gut bacteria and is essential for blood clotting." },
  { id: 4, section: "biology" as const, topic: "Excretion", subtopic: "Kidney", question: "The structural and functional unit of the kidney is:", options: ["Neuron", "Nephron", "Glomerulus", "Bowman's capsule"], answer: "Nephron", explanation: "Each kidney contains about 1 million nephrons that filter blood and produce urine." },
  { id: 5, section: "biology" as const, topic: "Digestion", subtopic: "Liver", question: "Which of the following is NOT a function of the liver?", options: ["Bile production", "Glycogen storage", "Insulin production", "Detoxification"], answer: "Insulin production", explanation: "Insulin is produced by beta cells of the pancreas, not the liver." },
  { id: 6, section: "chemistry" as const, topic: "Organic Chemistry", subtopic: "Carbohydrates", question: "The chemical formula of glucose is:", options: ["C₆H₁₂O₆", "C₁₂H₂₂O₁₁", "C₆H₁₀O₅", "C₅H₁₀O₅"], answer: "C₆H₁₂O₆", explanation: "Glucose is a monosaccharide with the molecular formula C₆H₁₂O₆." },
  { id: 7, section: "biology" as const, topic: "Blood", subtopic: "Blood Groups", question: "Which blood group is known as the universal donor?", options: ["A", "B", "AB", "O"], answer: "O", explanation: "Type O blood has no A or B antigens, so it can be donated to any blood group." },
  { id: 8, section: "biology" as const, topic: "Skeletal System", subtopic: "Bones", question: "The longest bone in the human body is:", options: ["Humerus", "Tibia", "Femur", "Fibula"], answer: "Femur", explanation: "The femur (thigh bone) is the longest and strongest bone in the human body." },
  { id: 9, section: "biology" as const, topic: "Photosynthesis", subtopic: "Process", question: "Photosynthesis occurs in which part of the plant cell?", options: ["Mitochondria", "Chloroplast", "Nucleus", "Vacuole"], answer: "Chloroplast", explanation: "Chloroplasts contain chlorophyll and are the site of photosynthesis in plant cells." },
  { id: 10, section: "biology" as const, topic: "Photosynthesis", subtopic: "Products", question: "The gas released during photosynthesis is:", options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"], answer: "Oxygen", explanation: "During photosynthesis, water molecules are split and oxygen is released as a byproduct." },
];

export default function Practice() {
  const searchParams = useSearchParams();
  const [selectedExam, setSelectedExam] = useState<"JEE" | "NEET" | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjectFromSidebar, setSubjectFromSidebar] = useState<string | null>(null);
  const [practiceStep, setPracticeStep] = useState<"exam" | "subject" | "topic" | "subtopic" | "count" | "practice">("exam");
  
  const [topicInput, setTopicInput] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [subtopicInput, setSubtopicInput] = useState("");
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(15);
  
  const [questions, setQuestions] = useState<typeof jeePracticeQuestions>([]);
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [savedProgress, setSavedProgress] = useState<PracticeProgress | null>(null);
  const thirdQuestionRef = useRef<HTMLDivElement>(null);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [subtopicDropdownOpen, setSubtopicDropdownOpen] = useState(false);

  const normalizeSubject = (value: string | null) => {
    if (!value) return null;
    const normalized = value.toLowerCase();
    if (normalized === "physics") return "Physics";
    if (normalized === "chemistry") return "Chemistry";
    if (normalized === "zoology") return "Zoology";
    if (normalized === "botany") return "Botany";
    if (normalized === "maths" || normalized === "mathematics") return "Maths";
    return null;
  };

  const allowedExams = useMemo<("JEE" | "NEET")[]>(() => {
    if (!selectedSubject || selectedSubject === "Random") return ["JEE", "NEET"];
    if (selectedSubject === "Maths" || selectedSubject === "Mathematics") return ["JEE"];
    if (selectedSubject === "Zoology" || selectedSubject === "Botany") return ["NEET"];
    if (selectedSubject === "Physics" || selectedSubject === "Chemistry") return ["JEE", "NEET"];
    return ["JEE", "NEET"];
  }, [selectedSubject]);

  // Get subjects based on exam
  const getSubjects = () => {
    if (selectedExam === "JEE") return ["Physics", "Chemistry", "Maths"];
    return ["Physics", "Chemistry", "Zoology", "Botany"];
  };

  // Get all questions for current exam
  const getAllQuestions = () => {
    if (selectedExam === "JEE") return jeePracticeQuestions;
    return neetQuestions;
  };

  // Get available topics for selected subject
  const getAvailableTopics = useMemo(() => {
    if (!selectedSubject) return [];
    const allQuestions = getAllQuestions();
    const subjectMap: Record<string, string> = {
      "Physics": "physics",
      "Chemistry": "chemistry",
      "Maths": "mathematics",
      "Mathematics": "mathematics",
      "Zoology": "biology",
      "Botany": "biology"
    };
    const questionSubject = subjectMap[selectedSubject];
    const topics = new Set(allQuestions.filter(q => q.section === questionSubject).map(q => q.topic));
    return Array.from(topics).sort();
  }, [selectedSubject, selectedExam]);

  // Get available subtopics for selected topic
  const getAvailableSubtopics = useMemo(() => {
    if (!selectedSubject || selectedTopics.length === 0) return [];
    const allQuestions = getAllQuestions();
    const subjectMap: Record<string, string> = {
      "Physics": "physics",
      "Chemistry": "chemistry",
      "Maths": "mathematics",
      "Mathematics": "mathematics",
      "Zoology": "biology",
      "Botany": "biology"
    };
    const questionSubject = subjectMap[selectedSubject];
    const subtopics = new Set(
      allQuestions
        .filter(q => q.section === questionSubject && selectedTopics.includes(q.topic))
        .map(q => q.subtopic)
    );
    return Array.from(subtopics).sort();
  }, [selectedTopics, selectedSubject, selectedExam]);

  // Filter topics based on input
  const filteredTopics = getAvailableTopics.filter(topic =>
    topic.toLowerCase().includes(topicInput.toLowerCase())
  );

  // Filter subtopics based on input
  const filteredSubtopics = getAvailableSubtopics.filter(subtopic =>
    subtopic.toLowerCase().includes(subtopicInput.toLowerCase())
  );

  useEffect(() => {
    setSelectedSubtopics([]);
    setSubtopicInput("");
  }, [selectedTopics]);

  // Load saved progress on mount
  useEffect(() => {
    const progress = getPracticeProgress();
    setSavedProgress(progress);
  }, []);

  // Preselect subject from sidebar query param
  useEffect(() => {
    const subjectParam = normalizeSubject(searchParams.get("subject"));
    if (subjectParam) {
      setSelectedSubject(subjectParam);
      setSubjectFromSidebar(subjectParam);
      setSelectedExam(null);
      setPracticeStep("exam");
      setSelectedTopics([]);
      setSelectedSubtopics([]);
      setTopicInput("");
      setSubtopicInput("");
    } else {
      setSubjectFromSidebar(null);
    }
  }, [searchParams]);

  // Save progress whenever user answers a question
  useEffect(() => {
    if (selectedExam && questions.length > 0) {
      const answeredQuestions = Object.keys(selectedOptions).map(Number);
      const correctCount = Object.entries(selectedOptions).filter(([qId, option]) => {
        const question = questions.find(q => q.id === parseInt(qId));
        return question && question.answer === option;
      }).length;
      
      savePracticeProgress({
        examType: selectedExam,
        currentQuestionIndex: answeredQuestions.length > 0 ? Math.max(...answeredQuestions) : 0,
        totalQuestions: questions.length,
        answeredQuestions,
        correctAnswers: correctCount,
        questions: questions,
        selectedOptions: selectedOptions,
      });
    }
  }, [selectedOptions, selectedExam, questions]);

  // Show back to top button after scrolling past 3rd question
  useEffect(() => {
    const handleScroll = () => {
      if (thirdQuestionRef.current) {
        const rect = thirdQuestionRef.current.getBoundingClientRect();
        setShowBackToTop(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [questions]);

  const handleExamSelect = (exam: "JEE" | "NEET") => {
    setSelectedExam(exam);
    if (selectedSubject) {
      setPracticeStep("topic");
    } else {
      setPracticeStep("subject");
    }
    if (!selectedSubject) {
      setSelectedSubject(null);
    }
    setSelectedTopics([]);
    setSelectedSubtopics([]);
    setTopicInput("");
    setSubtopicInput("");
  };

  const handleRestorePractice = () => {
    if (savedProgress) {
      setSelectedExam(savedProgress.examType);
      setQuestions(savedProgress.questions as any);
      setSelectedOptions(savedProgress.selectedOptions);
      setPracticeStep("practice");
      // Scroll to the first unanswered question
      setTimeout(() => {
        const firstUnanswered = savedProgress.questions.find(q => !savedProgress.selectedOptions[q.id]);
        if (firstUnanswered) {
          document.getElementById(`question-${firstUnanswered.id}`)?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    if (subject === "Random") {
      // Skip to question count selection for Random
      setPracticeStep("count");
    } else {
      setPracticeStep("topic");
    }
    setSelectedTopics([]);
    setSelectedSubtopics([]);
    setTopicInput("");
    setSubtopicInput("");
  };

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const handleSubtopicToggle = (subtopic: string) => {
    setSelectedSubtopics(prev =>
      prev.includes(subtopic) ? prev.filter(s => s !== subtopic) : [...prev, subtopic]
    );
  };

  const handleStartPractice = () => {
    if (selectedExam && selectedSubject) {
      const allQuestions = getAllQuestions();
      
      let filteredQuestions = allQuestions;

      if (selectedSubject === "Random") {
        // For Random, use all questions from the selected exam
        filteredQuestions = allQuestions;
      } else if (selectedTopics.length > 0 && selectedSubtopics.length > 0) {
        // For specific subject/topic/subtopic selections
        const subjectMap: Record<string, string> = {
          "Physics": "physics",
          "Chemistry": "chemistry",
          "Maths": "mathematics",
          "Mathematics": "mathematics",
          "Zoology": "biology",
          "Botany": "biology"
        };
        const questionSubject = subjectMap[selectedSubject];

        filteredQuestions = allQuestions.filter(
          q => q.section === questionSubject && selectedTopics.includes(q.topic) && selectedSubtopics.includes(q.subtopic)
        );
      } else {
        // Safety check - shouldn't reach here if flow is correct
        return;
      }

      const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffled.slice(0, Math.min(questionCount, shuffled.length));
      
      setQuestions(selectedQuestions);
      setShowAnswers({});
      setShowHints({});
      setSelectedOptions({});
      setPracticeStep("practice");
    }
  };

  const toggleAnswer = (questionId: number) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const toggleHint = (questionId: number) => {
    setShowHints(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleOptionSelect = (questionId: number, option: string, correctAnswer: string) => {
    if (!selectedOptions[questionId] && isSoundEnabled()) {
      if (option === correctAnswer) {
        playCorrectSound();
      } else {
        playIncorrectSound();
      }
    }
    
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const resetPractice = () => {
    if (practiceStep === "practice") {
      setPracticeStep("count");
      setQuestions([]);
      setShowAnswers({});
      setSelectedOptions({});
      clearPracticeProgress();
    } else if (practiceStep === "count") {
      if (selectedSubject === "Random") {
        // For Random, go back to subject selection
        setPracticeStep("subject");
        setSelectedSubject(null);
      } else {
        // For regular subjects, go back to subtopic selection
        setPracticeStep("subtopic");
        setSelectedSubtopics([]);
        setSubtopicInput("");
      }
      setQuestionCount(15);
    } else if (practiceStep === "subtopic") {
      setPracticeStep("topic");
      setSelectedSubtopics([]);
      setTopicInput("");
      setSubtopicInput("");
    } else if (practiceStep === "topic") {
      if (subjectFromSidebar) {
        setPracticeStep("exam");
      } else {
        setPracticeStep("subject");
        setSelectedSubject(null);
      }
      setSelectedTopics([]);
      setSelectedSubtopics([]);
      setTopicInput("");
      setSubtopicInput("");
    } else if (practiceStep === "subject") {
      setPracticeStep("exam");
      setSelectedExam(null);
      setSelectedSubject(null);
      setSelectedTopics([]);
      setSelectedSubtopics([]);
      setTopicInput("");
      setSubtopicInput("");
      setQuestionCount(15);
      clearPracticeProgress();
      setSavedProgress(null);
    }
  };

  // Exam Selection
  if (practiceStep === "exam") {
    const hasActivePractice = savedProgress && 
      savedProgress.questions &&
      savedProgress.questions.length > 0 &&
      savedProgress.answeredQuestions.length > 0 && 
      savedProgress.answeredQuestions.length < savedProgress.totalQuestions;

    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-25">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-bold text-white mb-3">Practice Mode</h1>
          <p className="text-gray-400 mb-8 text-base">
            {selectedSubject
              ? `Choose your exam for ${selectedSubject}`
              : "Choose your exam to start practicing"}
          </p>
          
          {hasActivePractice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-400/30 rounded-2xl"
            >
              <p className="text-blue-300 mb-3 text-sm font-medium">You have an active {savedProgress.examType} practice session</p>
              <div className="flex justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRestorePractice}
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold text-sm transition-all"
                >
                  Continue ({savedProgress.answeredQuestions.length}/{savedProgress.totalQuestions})
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    clearPracticeProgress();
                    setSavedProgress(null);
                  }}
                  className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg font-semibold text-sm transition-all border border-red-500/30"
                >
                  Start New
                </motion.button>
              </div>
            </motion.div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {allowedExams.includes("JEE") && (
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                onClick={() => handleExamSelect("JEE")} aria-label="Start JEE Practice"
                className="w-56 p-5 bg-surface rounded-2xl border border-orange-300/20 hover:shadow-lg hover:-translate-y-1 transition-all transform-gpu group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-105 transition-transform">
                  <JeeIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-0.5">JEE</h3>
                <p className="text-gray-300 text-sm">
                  {selectedSubject && selectedSubject !== "Random" ? selectedSubject : "Physics, Chemistry & Mathematics"}
                </p>
              </motion.button>
            )}

            {allowedExams.includes("NEET") && (
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                onClick={() => handleExamSelect("NEET")} aria-label="Start NEET Practice"
                className="w-56 p-5 bg-surface rounded-2xl border border-green-300/20 hover:shadow-lg hover:-translate-y-1 transition-all transform-gpu group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-105 transition-transform">
                  <NeetIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-0.5">NEET</h3>
                <p className="text-gray-300 text-sm">
                  {selectedSubject && selectedSubject !== "Random" ? selectedSubject : "Physics, Chemistry, Zoology & Botany"}
                </p>
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Subject Selection
  if (practiceStep === "subject") {
    const subjects = getSubjects();
    const isJEE = selectedExam === "JEE";

    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-25 px-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <button onClick={resetPractice} className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-2">
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Select Subject</h1>
            <p className="text-gray-400">Choose a subject for {selectedExam} practice</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {subjects.map(subject => (
              <motion.button
                key={subject}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
                onClick={() => handleSubjectSelect(subject)}
                className="p-6 bg-surface rounded-xl border border-white/10 hover:border-accent/50 hover:bg-accent/10 transition-all text-center"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{subject}</h3>
                <p className="text-gray-400 text-sm">Practice {subject}</p>
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
              onClick={() => handleSubjectSelect("Random")}
              className="p-6 bg-surface rounded-xl border border-purple-300/20 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all text-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                🎲
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Random</h3>
              <p className="text-gray-400 text-sm">Mixed from all subjects</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Topic Selection with Typeahead
  if (practiceStep === "topic") {
    const allTopicsSelected = selectedTopics.length === getAvailableTopics.length && getAvailableTopics.length > 0;
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-25 px-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <button onClick={resetPractice} className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-2">
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Select Topic</h1>
            <p className="text-gray-400">Select a topic you want to practice today</p>
          </div>

          <div className="bg-surface rounded-2xl p-8 border border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search topics..."
                value={topicInput}
                onChange={(e) => {
                  setTopicInput(e.target.value);
                  setTopicDropdownOpen(true);
                }}
                onFocus={() => setTopicDropdownOpen(true)}
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:bg-black/40 transition-all"
              />
              
              {topicDropdownOpen && filteredTopics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-lg overflow-hidden z-50 max-h-64 overflow-y-auto"
                >
                  {filteredTopics.map(topic => (
                    <motion.button
                      key={topic}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                      onClick={() => {
                        handleTopicToggle(topic);
                        setTopicDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span>{topic}</span>
                        {selectedTopics.includes(topic) && <span className="text-accent">✓</span>}
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedTopics.map(topic => (
                <span key={topic} className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs">
                  {topic}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedTopics(allTopicsSelected ? [] : getAvailableTopics)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 transition-all"
              >
                {allTopicsSelected ? "Clear Topics" : "Select All Topics"}
              </button>
              <button
                onClick={() => setPracticeStep("subtopic")}
                disabled={selectedTopics.length === 0}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedTopics.length === 0
                    ? "bg-white/5 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-accent to-blue-600 text-white"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Subtopic Selection with Typeahead
  if (practiceStep === "subtopic") {
    const allSubtopicsSelected = selectedSubtopics.length === getAvailableSubtopics.length && getAvailableSubtopics.length > 0;
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-25 px-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <button onClick={resetPractice} className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-2">
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Select Subtopic</h1>
            <p className="text-gray-400">Select a sub topic you want to practice today</p>
          </div>

          <div className="bg-surface rounded-2xl p-8 border border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search subtopics..."
                value={subtopicInput}
                onChange={(e) => {
                  setSubtopicInput(e.target.value);
                  setSubtopicDropdownOpen(true);
                }}
                onFocus={() => setSubtopicDropdownOpen(true)}
                className="w-full px-4 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:bg-black/40 transition-all"
              />
              
              {subtopicDropdownOpen && filteredSubtopics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-lg overflow-hidden z-50 max-h-64 overflow-y-auto"
                >
                  {filteredSubtopics.map(subtopic => (
                    <motion.button
                      key={subtopic}
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                      onClick={() => {
                        handleSubtopicToggle(subtopic);
                        setSubtopicDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <span>{subtopic}</span>
                        {selectedSubtopics.includes(subtopic) && <span className="text-accent">✓</span>}
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedSubtopics.map(subtopic => (
                <span key={subtopic} className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs">
                  {subtopic}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedSubtopics(allSubtopicsSelected ? [] : getAvailableSubtopics)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-gray-200 hover:bg-white/10 transition-all"
              >
                {allSubtopicsSelected ? "Clear Subtopics" : "Select All Subtopics"}
              </button>
              <button
                onClick={() => setPracticeStep("count")}
                disabled={selectedSubtopics.length === 0}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedSubtopics.length === 0
                    ? "bg-white/5 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-accent to-blue-600 text-white"
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Question Count Selection
  if (practiceStep === "count") {
    const isRandom = selectedSubject === "Random";
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-25 px-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <button onClick={resetPractice} className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-2">
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-white mb-2">Number of Questions</h1>
            <p className="text-gray-400">
              {isRandom 
                ? "How many random questions from all subjects?" 
                : "How many questions do you want to practice?"}
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-8 border border-white/10 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Selected: <span className="text-accent">{questionCount}</span> questions</h2>
              <div className="space-y-4">
                <input
                  type="range"
                  min="10"
                  max="25"
                  step="1"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between gap-3">
                  {[10, 15, 20, 25].map(num => (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setQuestionCount(num)}
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                        questionCount === num
                          ? "bg-accent/20 border border-accent/50 text-accent"
                          : "bg-black/30 border border-white/10 text-gray-300 hover:border-white/20"
                      }`}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleStartPractice}
              className="w-full py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-accent to-blue-600 hover:from-accent/90 hover:to-blue-600/90 text-white transition-all"
            >
              Start Practice
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Practice Screen (displaying questions)
  const topicLabel = selectedTopics.length > 0 ? selectedTopics.join(", ") : "All Topics";
  const subtopicLabel = selectedSubtopics.length > 0 ? selectedSubtopics.join(", ") : "All Subtopics";

  return (
    <div className="max-w-4xl mx-auto pb-8 pt-[6.5rem] px-5">
      <div className="flex items-center justify-between mb-5 sticky top-20 bg-background/80 backdrop-blur-lg py-3 z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button onClick={resetPractice} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{selectedExam} - {selectedSubject} - {topicLabel}</h1>
            <p className="text-sm text-gray-400">{subtopicLabel}</p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-sm ${selectedExam === "JEE" ? "bg-orange-500/20 text-orange-300" : "bg-green-500/20 text-green-300"}`}>
          {questions.length} Questions
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, index) => (
          <motion.div
            id={`question-${q.id}`}
            key={q.id}
            ref={index === 2 ? thirdQuestionRef : null}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            className="bg-surface rounded-xl p-4 border border-white/10"
          >
            <div className="flex gap-3 mb-3">
              <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                selectedExam === "JEE" ? "bg-orange-500/20 text-orange-300" : "bg-green-500/20 text-green-300"
              }`}>
                {index + 1}
              </span>
              <p className="text-white text-base leading-snug">{q.question}</p>
            </div>

            <div className="space-y-1.5 ml-10 mb-3">
              {q.options.map((option, optIndex) => {
                const isSelected = selectedOptions[q.id] === option;
                const showingAnswer = showAnswers[q.id];
                const isCorrect = option === q.answer;
                
                return (
                  <div
                    key={optIndex}
                    onClick={() => !showAnswers[q.id] && handleOptionSelect(q.id, option, q.answer)}
                    role="button"
                    aria-pressed={isSelected}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                      showingAnswer
                        ? isCorrect
                          ? "bg-green-500/20 border-green-500/50 text-green-300"
                          : isSelected && !isCorrect
                          ? "bg-red-500/20 border-red-500/50 text-red-300"
                          : "bg-black/30 border-white/10 text-gray-400"
                        : isSelected
                        ? "bg-accent/20 border-accent/50 text-white"
                        : "bg-black/30 border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${isSelected ? 'bg-white/5' : 'bg-transparent text-gray-400'}`}>
                      {String.fromCharCode(65 + optIndex)}
                    </div>
                    <div className="flex-1 text-sm leading-snug">{option}</div>

                    {isSelected && !isCorrect && (
                      <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {((isCorrect && showingAnswer) || (!showingAnswer && isSelected && isCorrect)) && (
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="ml-10 flex gap-2.5">
              <button
                onClick={() => toggleHint(q.id)}
                aria-pressed={showHints[q.id]}
                className={showHints[q.id] ? 'btn-gradient-gray' : 'btn-gradient-pink'}
                style={{padding: '0.4rem 0.9rem'}}
              >
                <span className="inline-flex items-center gap-2">
                  {showHints[q.id] ? 'Hide Hint' : 'View Hint'}
                </span>
              </button>

              {selectedOptions[q.id] && (
                <button
                  onClick={() => toggleAnswer(q.id)}
                  aria-pressed={showAnswers[q.id]}
                  className={showAnswers[q.id] ? 'btn-gradient-gray' : 'btn-gradient-blue'}
                  style={{padding: '0.4rem 0.9rem'}}
                >
                  <span className="inline-flex items-center gap-2">
                    {showAnswers[q.id] ? 'Hide Solution' : 'View Solution'}
                  </span>
                </button>
              )}
            </div>

            {showHints[q.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 ml-10 p-3 rounded-lg bg-black/30 border border-blue-400/30"
              >
                <p className="text-sm text-gray-300">
                  <span className="text-blue-400 font-medium">Hint: </span>
                  {hintBank[q.id] || "Think about the key concepts related to this question."}
                </p>
              </motion.div>
            )}

            {showAnswers[q.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 ml-10 p-3 rounded-lg bg-black/30 border border-accent/20"
              >
                <p className="text-sm text-gray-300">
                  <span className="text-accent font-medium">Solution: </span>
                  {q.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 px-4 py-3 bg-gradient-to-r from-accent to-blue-600 hover:from-accent/90 hover:to-blue-600/90 rounded-lg text-white font-medium shadow-lg shadow-accent/30 transition-all flex items-center gap-2 z-50"
        >
          ↑ Back to Top
        </motion.button>
      )}
    </div>
  );
}
