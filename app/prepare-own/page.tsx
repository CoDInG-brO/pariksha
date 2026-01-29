"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type JsonQuestion = {
  id: number;
  subject: string;
  topic: string;
  subtopic: string;
  difficultyClass: number;
  type: string;
  question: string;
  options?: string[];
  answer: string;
};

export default function PrepareOwn() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedSubtopics, setSelectedSubtopics] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [duration, setDuration] = useState(90);
  const [questionCount, setQuestionCount] = useState(30);
  const [generatedQuestions, setGeneratedQuestions] = useState<JsonQuestion[]>([]);
  const [generationNote, setGenerationNote] = useState<string | null>(null);
  const [paperFormat, setPaperFormat] = useState<"auto" | "JEE" | "NEET">("auto");

  const classes = [6, 7, 8, 9, 10, 11, 12];
  const subjects = ["Physics", "Chemistry", "Maths", "Zoology", "Botany"];
  const questionTypes = ["MCQ", "Numerical", "Assertion-Reason", "Match the Following", "Case Based"];

  const jsonQuestionBank: JsonQuestion[] = [
    {
      id: 1,
      subject: "Physics",
      topic: "Mechanics",
      subtopic: "Motion",
      difficultyClass: 10,
      type: "MCQ",
      question: "A body starts from rest and moves with constant acceleration of 2 m/s². Distance covered in 5 s is:",
      options: ["10 m", "20 m", "25 m", "30 m"],
      answer: "25 m",
    },
    {
      id: 2,
      subject: "Physics",
      topic: "Optics",
      subtopic: "Ray Optics",
      difficultyClass: 11,
      type: "Numerical",
      question: "A lens forms a real image 30 cm from it for an object 15 cm away. Find focal length (in cm).",
      answer: "10",
    },
    {
      id: 3,
      subject: "Chemistry",
      topic: "Atomic Structure",
      subtopic: "Bohr Model",
      difficultyClass: 9,
      type: "MCQ",
      question: "In Bohr model, angular momentum is quantized as:",
      options: ["nħ", "(n+1)ħ", "n²ħ", "ħ/2"],
      answer: "nħ",
    },
    {
      id: 4,
      subject: "Chemistry",
      topic: "Organic Chemistry",
      subtopic: "Functional Groups",
      difficultyClass: 12,
      type: "Assertion-Reason",
      question: "Assertion: Alcohols are more polar than ethers. Reason: Alcohols can form hydrogen bonds.",
      answer: "Both A and R are true and R is the correct explanation",
    },
    {
      id: 5,
      subject: "Maths",
      topic: "Calculus",
      subtopic: "Differentiation",
      difficultyClass: 11,
      type: "MCQ",
      question: "Derivative of sin(x) is:",
      options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
      answer: "cos(x)",
    },
    {
      id: 6,
      subject: "Maths",
      topic: "Algebra",
      subtopic: "Quadratic",
      difficultyClass: 8,
      type: "MCQ",
      question: "Roots of x² - 5x + 6 = 0 are:",
      options: ["1,6", "2,3", "-2,-3", "-1,6"],
      answer: "2,3",
    },
    {
      id: 7,
      subject: "Zoology",
      topic: "Human Physiology",
      subtopic: "Digestion",
      difficultyClass: 12,
      type: "MCQ",
      question: "Bile is produced by:",
      options: ["Pancreas", "Liver", "Stomach", "Small intestine"],
      answer: "Liver",
    },
    {
      id: 8,
      subject: "Botany",
      topic: "Plant Physiology",
      subtopic: "Photosynthesis",
      difficultyClass: 11,
      type: "Case Based",
      question: "Case: A plant kept in dark shows reduced starch. Which process is affected?",
      answer: "Photosynthesis",
    },
    {
      id: 9,
      subject: "Botany",
      topic: "Morphology",
      subtopic: "Leaf",
      difficultyClass: 7,
      type: "MCQ",
      question: "Leaves primarily carry out:",
      options: ["Respiration", "Photosynthesis", "Transpiration", "All of these"],
      answer: "All of these",
    },
    {
      id: 10,
      subject: "Zoology",
      topic: "Genetics",
      subtopic: "Mendelian",
      difficultyClass: 10,
      type: "MCQ",
      question: "Mendel’s first law is the law of:",
      options: ["Segregation", "Independent assortment", "Dominance", "Linkage"],
      answer: "Segregation",
    },
  ];

  const topicBank: Record<string, string[]> = {
    Physics: ["Mechanics", "Thermodynamics", "Optics", "Electromagnetism", "Modern Physics"],
    Chemistry: ["Atomic Structure", "Chemical Bonding", "Thermodynamics", "Organic Chemistry", "Equilibrium"],
    Maths: ["Algebra", "Calculus", "Trigonometry", "Coordinate Geometry", "Probability"],
    Zoology: ["Human Physiology", "Genetics", "Evolution", "Animal Kingdom", "Ecology"],
    Botany: ["Cell Biology", "Plant Physiology", "Genetics", "Ecology", "Morphology"],
  };

  const subtopicBank: Record<string, string[]> = {
    Mechanics: ["Motion", "Laws of Motion", "Work & Energy", "Circular Motion"],
    Thermodynamics: ["Heat Transfer", "Laws", "Kinetic Theory"],
    Optics: ["Ray Optics", "Wave Optics"],
    Electromagnetism: ["Electrostatics", "Current Electricity", "Magnetism"],
    "Modern Physics": ["Atoms", "Nuclei", "Semiconductors"],
    "Atomic Structure": ["Quantum Numbers", "Bohr Model"],
    "Chemical Bonding": ["Hybridization", "VSEPR", "Molecular Orbitals"],
    "Organic Chemistry": ["Hydrocarbons", "Functional Groups", "Mechanisms"],
    Equilibrium: ["Chemical", "Ionic"],
    Algebra: ["Quadratic", "Sequences & Series", "Matrices"],
    Calculus: ["Limits", "Differentiation", "Integration"],
    Trigonometry: ["Identities", "Equations"],
    "Coordinate Geometry": ["Straight Lines", "Circles", "Conics"],
    Probability: ["Basics", "Conditional"],
    "Human Physiology": ["Digestion", "Circulation"],
    Genetics: ["Mendelian", "Molecular"],
    Evolution: ["Natural Selection", "Speciation"],
    "Animal Kingdom": ["Invertebrates", "Vertebrates"],
    Ecology: ["Ecosystem", "Population"],
    "Cell Biology": ["Cell Cycle", "Cell Organelles"],
    "Plant Physiology": ["Photosynthesis", "Respiration"],
    Morphology: ["Root", "Stem", "Leaf"],
  };

  const difficultyLabel = (value: number | null) => {
    if (!value) return "Select class";
    if (value <= 8) return "Foundation";
    if (value <= 10) return "Intermediate";
    return "Competitive";
  };

  const availableTopics = selectedSubjects.flatMap((s) => topicBank[s] || []);
  const availableSubtopics = selectedTopics.flatMap((t) => subtopicBank[t] || []);
  const allTopicsSelected = availableTopics.length > 0 && selectedTopics.length === availableTopics.length;
  const allSubtopicsSelected = availableSubtopics.length > 0 && selectedSubtopics.length === availableSubtopics.length;

  const resolvedFormat = useMemo<"JEE" | "NEET">(() => {
    if (paperFormat !== "auto") return paperFormat;
    const hasMaths = selectedSubjects.includes("Maths");
    const hasBio = selectedSubjects.includes("Zoology") || selectedSubjects.includes("Botany");
    if (hasMaths && !hasBio) return "JEE";
    if (hasBio && !hasMaths) return "NEET";
    return "JEE";
  }, [paperFormat, selectedSubjects]);

  const paperSections = resolvedFormat === "JEE"
    ? ["Physics", "Chemistry", "Maths"]
    : ["Physics", "Chemistry", "Zoology", "Botany"];

  const filteredBank = useMemo(() => {
    return jsonQuestionBank.filter((q) => {
      if (selectedClass && q.difficultyClass > selectedClass) return false;
      if (selectedSubjects.length && !selectedSubjects.includes(q.subject)) return false;
      if (selectedTopics.length && !selectedTopics.includes(q.topic)) return false;
      if (selectedSubtopics.length && !selectedSubtopics.includes(q.subtopic)) return false;
      if (selectedTypes.length && !selectedTypes.includes(q.type)) return false;
      return true;
    });
  }, [jsonQuestionBank, selectedClass, selectedSubjects, selectedTopics, selectedSubtopics, selectedTypes]);

  const handleGeneratePaper = () => {
    if (!filteredBank.length) {
      setGenerationNote("No questions found for the selected filters.");
      setGeneratedQuestions([]);
      return;
    }
    setGenerationNote(null);
    const shuffled = [...filteredBank].sort(() => Math.random() - 0.5);
    const count = Math.min(questionCount, shuffled.length);
    setGeneratedQuestions(shuffled.slice(0, count));
  };

  return (
    <div className="pt-2 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors text-lg"
              aria-label="Back"
            >
              ←
            </button>
            <h1 className="text-base font-semibold text-slate-900 dark:text-slate-100">Prepare My Own Question Paper</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-xs mt-1">Create custom question papers for your preparation</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Class & Difficulty</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {classes.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedClass(grade)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                      selectedClass === grade
                        ? "bg-sky-100 dark:bg-sky-500/20 border-sky-500 dark:border-sky-500 text-sky-700 dark:text-sky-300"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    Class {grade}
                  </button>
                ))}
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">Difficulty: <span className="text-slate-900 dark:text-white font-semibold">{difficultyLabel(selectedClass)}</span></p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Select Subjects</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map((subject) => {
                  const active = selectedSubjects.includes(subject);
                  return (
                    <button
                      key={subject}
                      onClick={() => {
                        setSelectedSubjects((prev) =>
                          prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
                        );
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                        active
                          ? "bg-sky-100 dark:bg-sky-500/20 border-sky-500 dark:border-sky-500 text-sky-700 dark:text-sky-300"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {subject}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Topics & Subtopics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Topics</p>
                  <div className="mb-2 flex gap-2">
                    <button
                      onClick={() => setSelectedTopics(allTopicsSelected ? [] : availableTopics)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {allTopicsSelected ? "Clear All" : "Select All"}
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableTopics.length === 0 && (
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Select subjects first</p>
                    )}
                    {availableTopics.map((topic) => {
                      const active = selectedTopics.includes(topic);
                      return (
                        <button
                          key={topic}
                          onClick={() => {
                            setSelectedTopics((prev) =>
                              prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
                            );
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                            active
                              ? "bg-sky-100 dark:bg-sky-500/20 border-sky-500 dark:border-sky-500 text-sky-700 dark:text-sky-300"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Subtopics</p>
                  <div className="mb-2 flex gap-2">
                    <button
                      onClick={() => setSelectedSubtopics(allSubtopicsSelected ? [] : availableSubtopics)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {allSubtopicsSelected ? "Clear All" : "Select All"}
                    </button>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableSubtopics.length === 0 && (
                      <p className="text-slate-500 dark:text-slate-400 text-xs">Select topics first</p>
                    )}
                    {availableSubtopics.map((subtopic) => {
                      const active = selectedSubtopics.includes(subtopic);
                      return (
                        <button
                          key={subtopic}
                          onClick={() => {
                            setSelectedSubtopics((prev) =>
                              prev.includes(subtopic) ? prev.filter((s) => s !== subtopic) : [...prev, subtopic]
                            );
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                            active
                              ? "bg-sky-100 dark:bg-sky-500/20 border-sky-500 dark:border-sky-500 text-sky-700 dark:text-sky-300"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          {subtopic}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Question Types</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {questionTypes.map((type) => {
                  const active = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedTypes((prev) =>
                          prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                        );
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${
                        active
                          ? "bg-sky-100 dark:bg-sky-500/20 border-sky-500 dark:border-sky-500 text-sky-700 dark:text-sky-300"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Duration & Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Time Limit (minutes)</p>
                  <input
                    type="number"
                    min={30}
                    max={180}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Number of Questions</p>
                  <input
                    type="number"
                    min={10}
                    max={90}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={handleGeneratePaper}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm hover:shadow-md transition-all"
                >
                  Generate Paper
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400 text-sm">Paper Format:</span>
                  {(["auto", "JEE", "NEET"] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setPaperFormat(format)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                        paperFormat === format
                          ? "bg-sky-100 dark:bg-sky-500/20 border-sky-500 dark:border-sky-500 text-sky-700 dark:text-sky-300"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-slate-500 dark:text-slate-400 text-xs mt-3">
                Sections: {paperSections.join(" • ")}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Generated Paper</h2>
              {generationNote && (
                <p className="text-xs text-red-600 dark:text-red-400 mb-3">{generationNote}</p>
              )}
              <div className="space-y-3 max-h-[420px] overflow-y-auto">
                {generatedQuestions.length === 0 && !generationNote && (
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Generate to preview questions</p>
                )}
                {generatedQuestions.map((q, index) => (
                  <div key={q.id} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Q{index + 1} · {q.subject} · {q.type}</p>
                    <p className="text-sm text-slate-900 dark:text-white leading-snug mb-2">{q.question}</p>
                    {q.options && (
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                        {q.options.map((opt) => (
                          <span key={opt} className="bg-slate-100 dark:bg-slate-700 rounded px-2 py-1">{opt}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {generatedQuestions.length > 0 && (
                <button
                  onClick={() => router.push("/student/take-test")}
                  className="mt-4 w-full px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm hover:shadow-md transition-all"
                >
                  Start Test
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
