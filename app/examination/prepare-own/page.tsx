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
    <div className="min-h-screen pt-32 pb-12 px-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <button
            onClick={() => router.back()}
            className="mb-4 text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-white mb-3">Prepare My Own Question Paper</h1>
          <p className="text-gray-400 text-lg">Create custom question papers for your preparation</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-surface rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Class & Difficulty</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {classes.map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setSelectedClass(grade)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedClass === grade
                        ? "bg-gradient-to-r from-accent to-blue-600 text-white"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    Class {grade}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                <div>
                  <p className="text-xs text-gray-400">Difficulty Level</p>
                  <p className="text-white font-semibold">{difficultyLabel(selectedClass)}</p>
                </div>
                <span className="text-xs text-gray-400">Based on class selection</span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Subjects</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() =>
                      setSelectedSubjects((prev) =>
                        prev.includes(subject)
                          ? prev.filter((s) => s !== subject)
                          : [...prev, subject]
                      )
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedSubjects.includes(subject)
                        ? "bg-accent/20 border border-accent/40 text-accent"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-2">Topics</h2>
              <p className="text-xs text-gray-400 mb-4">Quick add: select all topics per subject.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedSubjects.map((subject) => (
                  <button
                    key={`all-${subject}`}
                    onClick={() => {
                      const subjectTopics = topicBank[subject] || [];
                      setSelectedTopics((prev) => Array.from(new Set([...prev, ...subjectTopics])));
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                  >
                    All {subject}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() =>
                      setSelectedTopics((prev) =>
                        prev.includes(topic)
                          ? prev.filter((t) => t !== topic)
                          : [...prev, topic]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedTopics.includes(topic)
                        ? "bg-accent/20 border border-accent/40 text-accent"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
                {!availableTopics.length && (
                  <p className="text-sm text-gray-400">Select subjects to view topics.</p>
                )}
              </div>
            </div>

            <div className="bg-surface rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-2">Subtopics</h2>
              <p className="text-xs text-gray-400 mb-4">Quick add: select all subtopics for chosen topics.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedTopics.length > 0 && (
                  <button
                    onClick={() => {
                      const allSubs = selectedTopics.flatMap((topic) => subtopicBank[topic] || []);
                      setSelectedSubtopics((prev) => Array.from(new Set([...prev, ...allSubs])));
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                  >
                    All Subtopics
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSubtopics.map((subtopic) => (
                  <button
                    key={subtopic}
                    onClick={() =>
                      setSelectedSubtopics((prev) =>
                        prev.includes(subtopic)
                          ? prev.filter((t) => t !== subtopic)
                          : [...prev, subtopic]
                      )
                    }
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedSubtopics.includes(subtopic)
                        ? "bg-accent/20 border border-accent/40 text-accent"
                        : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {subtopic}
                  </button>
                ))}
                {!availableSubtopics.length && (
                  <p className="text-sm text-gray-400">Select topics to view subtopics.</p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-surface rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Time</h2>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Duration</span>
                <span className="text-white font-semibold">{duration} mins</span>
              </div>
              <input
                type="range"
                min={30}
                max={180}
                step={10}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="mt-4 w-full accent-accent"
              />
              <div className="mt-3 flex justify-between text-xs text-gray-400">
                <span>30m</span>
                <span>180m</span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Question Types</h2>
              <div className="space-y-2">
                {questionTypes.map((type) => (
                  <label key={type} className="flex items-center gap-3 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() =>
                        setSelectedTypes((prev) =>
                          prev.includes(type)
                            ? prev.filter((t) => t !== type)
                            : [...prev, type]
                        )
                      }
                      className="accent-accent"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-surface rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Paper Format</h2>
              <div className="flex items-center gap-3">
                <select
                  value={paperFormat}
                  onChange={(e) => setPaperFormat(e.target.value as "auto" | "JEE" | "NEET")}
                  className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-gray-200"
                >
                  <option value="auto">Auto</option>
                  <option value="JEE">JEE</option>
                  <option value="NEET">NEET</option>
                </select>
              </div>
              <p className="mt-2 text-xs text-gray-400">Auto picks JEE for Maths, NEET for Bio.</p>
            </div>

            <div className="bg-surface rounded-2xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Questions</h2>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Questions</span>
                <span className="text-white font-semibold">{questionCount}</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="mt-4 w-full accent-accent"
              />
              <div className="mt-3 flex justify-between text-xs text-gray-400">
                <span>10</span>
                <span>100</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGeneratePaper}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-blue-600 text-white font-semibold"
            >
              Generate Paper
            </motion.button>
          </motion.div>
        </div>

        {generationNote && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200"
          >
            {generationNote}
          </motion.div>
        )}

        {generatedQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-surface rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{resolvedFormat} Style Paper</h2>
                <p className="text-xs text-gray-400">Duration: {duration} mins • {generatedQuestions.length} questions</p>
              </div>
              <span className="text-xs text-gray-400">Class {selectedClass ?? "-"}</span>
            </div>

            <div className="space-y-6">
              {paperSections.map((section) => {
                const sectionQuestions = generatedQuestions.filter((q) => q.subject === section);
                if (sectionQuestions.length === 0) return null;
                return (
                  <div key={section} className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">{section}</h3>
                    <ol className="space-y-3 text-sm text-gray-200 list-decimal list-inside">
                      {sectionQuestions.map((q, index) => (
                        <li key={q.id} className="space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <span>{q.question}</span>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap">{q.type}</span>
                          </div>
                          {q.options && q.options.length > 0 && (
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                              {q.options.map((opt) => (
                                <li key={`${q.id}-${opt}`} className="rounded-lg border border-white/10 bg-black/20 px-2 py-1">
                                  {opt}
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className="text-[10px] text-gray-500">
                            Topic: {q.topic} • Subtopic: {q.subtopic}
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
