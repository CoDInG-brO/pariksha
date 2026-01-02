"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  subject: string;
}

interface SubjectData {
  id: string;
  name: string;
  icon: string;
  color: string;
  questions: Question[];
}

export default function NEETFullMock() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180 * 60); // 180 minutes total
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [testStarted, setTestStarted] = useState(false);

  const allQuestions: Question[] = [
    // PHYSICS (15 questions)
    {
      id: 1,
      question: "If a car accelerates from 0 to 100 m/s in 10 seconds, what is its acceleration?",
      options: ["5 m/s²", "10 m/s²", "15 m/s²", "20 m/s²"],
      correctAnswer: 1,
      explanation: "Using a = (v - u) / t = (100 - 0) / 10 = 10 m/s²",
      subject: "physics"
    },
    {
      id: 2,
      question: "A ball is thrown vertically upward with a velocity of 20 m/s. Maximum height reached is (g = 10 m/s²)",
      options: ["10 m", "20 m", "30 m", "40 m"],
      correctAnswer: 1,
      explanation: "Using v² = u² - 2gh, at max height v = 0. 0 = 400 - 2(10)h → h = 20 m",
      subject: "physics"
    },
    {
      id: 3,
      question: "Two masses m₁ = 2 kg and m₂ = 3 kg connected by string over pulley. Acceleration of system (g = 10 m/s²)",
      options: ["1 m/s²", "2 m/s²", "3 m/s²", "4 m/s²"],
      correctAnswer: 1,
      explanation: "a = (m₂ - m₁)g / (m₁ + m₂) = (3 - 2) × 10 / 5 = 2 m/s²",
      subject: "physics"
    },
    {
      id: 4,
      question: "A resistor of 10 Ω connected to 100 V supply. Current flowing through it is",
      options: ["0.1 A", "1 A", "10 A", "100 A"],
      correctAnswer: 2,
      explanation: "Using Ohm's law: I = V/R = 100/10 = 10 A",
      subject: "physics"
    },
    {
      id: 5,
      question: "Sound wave frequency 200 Hz travels in air at 340 m/s. Its wavelength is",
      options: ["0.59 m", "1.7 m", "68 m", "170 m"],
      correctAnswer: 1,
      explanation: "Using v = fλ, λ = v/f = 340/200 = 1.7 m",
      subject: "physics"
    },
    {
      id: 6,
      question: "Young's modulus is defined as the ratio of",
      options: ["Stress to strain", "Strain to stress", "Force to area", "Area to force"],
      correctAnswer: 0,
      explanation: "Young's modulus (E) = Stress / Strain = (F/A) / (Δl/l)",
      subject: "physics"
    },
    {
      id: 7,
      question: "The SI unit of electric potential difference is",
      options: ["Ampere", "Ohm", "Volt", "Watt"],
      correctAnswer: 2,
      explanation: "Electric potential difference is measured in Volts (V). 1 V = 1 J/C",
      subject: "physics"
    },
    {
      id: 8,
      question: "Which of the following is a vector quantity?",
      options: ["Temperature", "Speed", "Displacement", "Time"],
      correctAnswer: 2,
      explanation: "Displacement has both magnitude and direction, making it a vector. Others are scalars.",
      subject: "physics"
    },
    {
      id: 9,
      question: "Boyle's Law states that at constant temperature, pressure and volume are",
      options: ["Directly proportional", "Inversely proportional", "Not related", "Equal"],
      correctAnswer: 1,
      explanation: "Boyle's Law: PV = constant at constant temperature. P ∝ 1/V",
      subject: "physics"
    },
    {
      id: 10,
      question: "The refractive index of a medium is defined as",
      options: ["Speed of light in vacuum / Speed in medium", "Speed in medium / Speed in vacuum", "Wavelength ratio", "Frequency ratio"],
      correctAnswer: 0,
      explanation: "Refractive index n = c/v where c is speed in vacuum and v is speed in medium",
      subject: "physics"
    },
    {
      id: 11,
      question: "At what temperature do Celsius and Fahrenheit scales give the same reading?",
      options: ["-40°", "0°", "40°", "100°"],
      correctAnswer: 0,
      explanation: "Using C = (F-32) × 5/9, when C = F: C = (C-32) × 5/9 → C = -40°",
      subject: "physics"
    },
    {
      id: 12,
      question: "The frequency of a vibrating string is independent of",
      options: ["Tension", "Length", "Amplitude", "Linear mass density"],
      correctAnswer: 2,
      explanation: "Frequency depends on length, tension, and linear mass density but NOT on amplitude.",
      subject: "physics"
    },
    {
      id: 13,
      question: "Which has the highest speed in vacuum?",
      options: ["Radio waves", "Visible light", "X-rays", "All travel at same speed"],
      correctAnswer: 3,
      explanation: "All electromagnetic waves travel at the same speed (c = 3 × 10⁸ m/s) in vacuum.",
      subject: "physics"
    },
    {
      id: 14,
      question: "The work done by gravity on an object moving horizontally is",
      options: ["Positive", "Negative", "Zero", "Depends on speed"],
      correctAnswer: 2,
      explanation: "Work = F · d · cos(θ). For horizontal motion, θ = 90°, so W = 0",
      subject: "physics"
    },
    {
      id: 15,
      question: "Angular velocity is related to linear velocity by the equation",
      options: ["v = ωr", "v = ω/r", "v = r/ω", "v = ω + r"],
      correctAnswer: 0,
      explanation: "Linear velocity v = ω × r, where ω is angular velocity and r is radius",
      subject: "physics"
    },

    // CHEMISTRY (15 questions)
    {
      id: 16,
      question: "What is the oxidation state of sulfur in H₂SO₄?",
      options: ["+2", "+4", "+6", "+8"],
      correctAnswer: 2,
      explanation: "In H₂SO₄: H is +1, O is -2. 2(+1) + S + 4(-2) = 0 → S = +6",
      subject: "chemistry"
    },
    {
      id: 17,
      question: "How many moles of O₂ needed to completely combust 2 moles of C₂H₆?",
      options: ["3.5 moles", "7 moles", "4 moles", "2 moles"],
      correctAnswer: 1,
      explanation: "2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O. For 2 moles C₂H₆, 7 moles O₂ needed",
      subject: "chemistry"
    },
    {
      id: 18,
      question: "What is the pH of a 0.1 M HCl solution?",
      options: ["0", "1", "7", "13"],
      correctAnswer: 1,
      explanation: "HCl is strong acid. [H⁺] = 0.1 M = 10⁻¹. pH = -log(10⁻¹) = 1",
      subject: "chemistry"
    },
    {
      id: 19,
      question: "Which has the highest electronegativity?",
      options: ["N", "O", "F", "Cl"],
      correctAnswer: 2,
      explanation: "Electronegativity increases left to right in a period. F is most electronegative.",
      subject: "chemistry"
    },
    {
      id: 20,
      question: "In SN2 reaction mechanism, stereochemistry is",
      options: ["Retention", "Inversion", "Racemization", "No change"],
      correctAnswer: 1,
      explanation: "SN2 involves backside attack leading to inversion of configuration (Walden).",
      subject: "chemistry"
    },
    {
      id: 21,
      question: "What is the hybridization of carbon in C₂H₄?",
      options: ["sp", "sp²", "sp³", "sp³d"],
      correctAnswer: 1,
      explanation: "Ethene has C=C double bond. Each carbon is sp² hybridized with 3 σ bonds.",
      subject: "chemistry"
    },
    {
      id: 22,
      question: "Which is NOT a characteristic of transition metals?",
      options: ["Variable oxidation states", "Colored compounds", "Paramagnetic", "Low ionization energy"],
      correctAnswer: 3,
      explanation: "Transition metals have high ionization energy. All others are characteristics.",
      subject: "chemistry"
    },
    {
      id: 23,
      question: "The rate of reaction is doubled when temperature increases by 10°C. Activation energy is approximately",
      options: ["50 kJ/mol", "53 kJ/mol", "100 kJ/mol", "200 kJ/mol"],
      correctAnswer: 1,
      explanation: "Using Arrhenius equation, when rate doubles with 10° increase, Ea ≈ 53 kJ/mol",
      subject: "chemistry"
    },
    {
      id: 24,
      question: "Which alkali metal has the highest ionization energy?",
      options: ["Li", "Na", "K", "Rb"],
      correctAnswer: 0,
      explanation: "Ionization energy decreases down a group. Li (smallest) has highest IE.",
      subject: "chemistry"
    },
    {
      id: 25,
      question: "IUPAC name of CH₃-CH(OH)-CH₃ is",
      options: ["1-propanol", "2-propanol", "Isopropanol", "Both B and C"],
      correctAnswer: 3,
      explanation: "It's 2-propanol (IUPAC) or isopropanol (common). Both names are correct.",
      subject: "chemistry"
    },
    {
      id: 26,
      question: "The most stable carbocation is",
      options: ["Primary", "Secondary", "Tertiary", "Methyl"],
      correctAnswer: 2,
      explanation: "Tertiary carbocation is most stable due to maximum hyperconjugation.",
      subject: "chemistry"
    },
    {
      id: 27,
      question: "Bond enthalpy is the energy required to",
      options: ["Form a bond", "Break a bond", "Ionize an atom", "Excite electrons"],
      correctAnswer: 1,
      explanation: "Bond enthalpy is the energy needed to break 1 mole of bonds in gaseous state.",
      subject: "chemistry"
    },
    {
      id: 28,
      question: "Which electronic configuration represents a transition metal?",
      options: ["[Ar]4s²", "[Ar]3d⁵4s²", "[Ne]3s²3p⁶", "[He]2s²2p⁶"],
      correctAnswer: 1,
      explanation: "Transition metals have incompletely filled d-orbitals. [Ar]3d⁵4s² is Mn.",
      subject: "chemistry"
    },
    {
      id: 29,
      question: "The solubility product constant (Ksp) expression for AgCl is",
      options: ["[Ag⁺][Cl⁻]", "[Ag⁺]²[Cl⁻]", "[Ag⁺][Cl⁻]²", "[Ag⁺]/[Cl⁻]"],
      correctAnswer: 0,
      explanation: "AgCl ⇌ Ag⁺ + Cl⁻. Ksp = [Ag⁺][Cl⁻]",
      subject: "chemistry"
    },
    {
      id: 30,
      question: "Which is a redox reaction?",
      options: ["HCl + NaOH → NaCl + H₂O", "AgNO₃ + NaCl → AgCl↓ + NaNO₃", "Fe + CuSO₄ → FeSO₄ + Cu", "All are redox"],
      correctAnswer: 2,
      explanation: "Fe loses 2e⁻ (oxidized), Cu²⁺ gains 2e⁻ (reduced). This is redox reaction.",
      subject: "chemistry"
    },

    // BIOLOGY (15 questions)
    {
      id: 31,
      question: "Which organelle is known as the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Golgi apparatus", "Ribosome"],
      correctAnswer: 1,
      explanation: "Mitochondria produces ATP through cellular respiration.",
      subject: "biology"
    },
    {
      id: 32,
      question: "How many chromosomes do humans have?",
      options: ["23", "46", "92", "48"],
      correctAnswer: 1,
      explanation: "Humans have 23 pairs (46 total): 22 autosomes + 1 sex chromosome pair.",
      subject: "biology"
    },
    {
      id: 33,
      question: "What is the primary function of amylase enzyme?",
      options: ["Break fats", "Break proteins", "Break carbohydrates", "Break nucleic acids"],
      correctAnswer: 2,
      explanation: "Amylase breaks down starch and carbohydrates into glucose.",
      subject: "biology"
    },
    {
      id: 34,
      question: "Which pigment primarily absorbs light in photosynthesis?",
      options: ["Xanthophyll", "Chlorophyll", "Carotenoid", "Anthocyanin"],
      correctAnswer: 1,
      explanation: "Chlorophyll absorbs blue and red wavelengths for photosynthesis.",
      subject: "biology"
    },
    {
      id: 35,
      question: "One species evolving into two or more species is called",
      options: ["Adaptation", "Speciation", "Mutation", "Natural selection"],
      correctAnswer: 1,
      explanation: "Speciation is the evolutionary process of new species formation.",
      subject: "biology"
    },
    {
      id: 36,
      question: "Which blood cells are responsible for immunity?",
      options: ["RBC", "WBC", "Platelets", "All"],
      correctAnswer: 1,
      explanation: "White blood cells (WBC) fight infections and provide immunity.",
      subject: "biology"
    },
    {
      id: 37,
      question: "The basic unit of heredity is",
      options: ["Chromosome", "Gene", "Nucleus", "DNA"],
      correctAnswer: 1,
      explanation: "Gene is the functional unit of heredity that controls traits.",
      subject: "biology"
    },
    {
      id: 38,
      question: "Photosynthesis occurs mainly in which part of leaf?",
      options: ["Epidermis", "Mesophyll", "Vascular bundle", "Stomata"],
      correctAnswer: 1,
      explanation: "Mesophyll (especially palisade cells) contains chloroplasts for photosynthesis.",
      subject: "biology"
    },
    {
      id: 39,
      question: "Which is the site of protein synthesis?",
      options: ["Nucleus", "Golgi", "Ribosome", "Mitochondria"],
      correctAnswer: 2,
      explanation: "Ribosomes are the protein synthesis factories of the cell.",
      subject: "biology"
    },
    {
      id: 40,
      question: "The pH of blood is approximately",
      options: ["6.8", "7.0", "7.4", "7.8"],
      correctAnswer: 2,
      explanation: "Normal blood pH is 7.35-7.45, approximately 7.4.",
      subject: "biology"
    },
    {
      id: 41,
      question: "Which hormone regulates blood glucose?",
      options: ["Thyroxine", "Insulin", "Adrenaline", "Glucagon"],
      correctAnswer: 1,
      explanation: "Insulin lowers blood glucose by promoting uptake in cells.",
      subject: "biology"
    },
    {
      id: 42,
      question: "The process by which water moves through cell membrane is",
      options: ["Osmosis", "Diffusion", "Active transport", "Endocytosis"],
      correctAnswer: 0,
      explanation: "Osmosis is the movement of water across semipermeable membrane.",
      subject: "biology"
    },
    {
      id: 43,
      question: "Which part of brain controls body temperature?",
      options: ["Cerebrum", "Hypothalamus", "Cerebellum", "Medulla"],
      correctAnswer: 1,
      explanation: "Hypothalamus regulates body temperature and homeostasis.",
      subject: "biology"
    },
    {
      id: 44,
      question: "The genetic code consists of",
      options: ["2 bases", "3 bases", "4 bases", "5 bases"],
      correctAnswer: 1,
      explanation: "Codons are triplets of 3 bases that code for amino acids.",
      subject: "biology"
    },
    {
      id: 45,
      question: "Which is NOT a function of the liver?",
      options: ["Detoxification", "Protein synthesis", "Oxygen storage", "Bile production"],
      correctAnswer: 2,
      explanation: "Liver stores glycogen (not oxygen). Oxygen is stored in lungs/RBCs.",
      subject: "biology"
    }
  ];

  const subjectsData: Record<string, SubjectData> = {
    physics: {
      id: "physics",
      name: "Physics",
      icon: "⚛️",
      color: "from-blue-500 to-cyan-600",
      questions: allQuestions.filter((q) => q.subject === "physics")
    },
    chemistry: {
      id: "chemistry",
      name: "Chemistry",
      icon: "🧪",
      color: "from-green-500 to-emerald-600",
      questions: allQuestions.filter((q) => q.subject === "chemistry")
    },
    biology: {
      id: "biology",
      name: "Biology",
      icon: "🧬",
      color: "from-orange-500 to-red-600",
      questions: allQuestions.filter((q) => q.subject === "biology")
    }
  };

  const [currentSubject, setCurrentSubject] = useState(0);
  const subjects = Object.values(subjectsData);
  const currentSubjectData = subjects[currentSubject];
  const currentSubjectQuestions = currentSubjectData.questions;
  const questionIndexInSubject = currentQuestionIndex - subjects.slice(0, currentSubject).reduce((acc, s) => acc + s.questions.length, 0);

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

  const calculateSubjectIndex = (questionIndex: number) => {
    let count = 0;
    for (let i = 0; i < subjects.length; i++) {
      if (questionIndex < count + subjects[i].questions.length) {
        return i;
      }
      count += subjects[i].questions.length;
    }
    return 0;
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      const newSubject = calculateSubjectIndex(newIndex);
      setCurrentSubject(newSubject);
      setCurrentQuestionIndex(newIndex);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      const newSubject = calculateSubjectIndex(newIndex);
      setCurrentSubject(newSubject);
      setCurrentQuestionIndex(newIndex);
      setShowAnswer(false);
    }
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
      } else if (answer === allQuestions[index].correctAnswer) {
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
      percentage: ((rawScore / (allQuestions.length * 4)) * 100).toFixed(1),
      estimated_percentile: Math.max(0, Math.min(99, Math.round(100 - (rawScore / 720) * 50)))
    };
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-12 border border-white/10 text-center"
          >
            <div className="text-6xl mb-4">🏥</div>
            <h1 className="text-4xl font-bold text-white mb-4">NEET Full Mock Test</h1>
            <p className="text-gray-400 text-lg mb-8">Complete exam experience with all 3 subjects</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Physics</p>
                <p className="text-2xl font-bold text-blue-300">15 Qs</p>
                <p className="text-xs text-gray-500 mt-2">60 marks | 60 min</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Chemistry</p>
                <p className="text-2xl font-bold text-green-300">15 Qs</p>
                <p className="text-xs text-gray-500 mt-2">60 marks | 60 min</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Biology</p>
                <p className="text-2xl font-bold text-orange-300">15 Qs</p>
                <p className="text-xs text-gray-500 mt-2">60 marks | 60 min</p>
              </div>
            </div>

            <div className="mb-12 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-200">⚠️ <strong>Important:</strong> 180 marks in 180 minutes. Manage time wisely across all subjects!</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTestStarted(true)}
              className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-orange-500/20"
            >
              Start Full Mock →
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = allQuestions[currentQuestionIndex];
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
              {parseFloat(score.percentage) >= 70 ? "🎉" : "📊"}
            </div>

            <h2 className="text-4xl font-bold text-white mb-2">Full Mock Completed!</h2>
            <p className="text-gray-400 text-lg mb-8">NEET Simulation Results</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
                <p className="text-gray-400 text-sm">Score</p>
                <p className="text-3xl font-bold text-blue-400">{score.rawScore}</p>
              </motion.div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
              <p className="text-gray-400 text-sm mb-2">Score Percentage</p>
              <p className="text-5xl font-bold text-white">{score.percentage}%</p>
              <p className="text-gray-400 text-sm mt-4">
                Estimated Percentile: <span className="text-2xl font-bold text-orange-300">{score.estimated_percentile}%ile</span>
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
      <div className={`bg-gradient-to-r from-orange-500 to-red-600 fixed top-0 left-0 right-0 z-50 border-b border-white/10`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">NEET Full Mock Test</h1>
            <p className="text-sm text-white/80">
              {currentSubjectData.name} • Question {questionIndexInSubject + 1}/{currentSubjectQuestions.length}
            </p>
          </div>

          <div className={`text-4xl font-bold font-mono px-6 py-2 rounded-lg ${
            timeRemaining <= 300 ? "bg-red-500/20 border border-red-500 text-red-400" : "bg-white/10 border border-white/20 text-white"
          }`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      <div className="pt-28 pb-6">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10">
              {/* Subject Indicator */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <p className="text-sm text-gray-400">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    currentSubject === 0 ? "bg-blue-500/30 text-blue-300" : currentSubject === 1 ? "bg-green-500/30 text-green-300" : "bg-orange-500/30 text-orange-300"
                  }`}>
                    {currentSubjectData.name}
                  </span>
                </p>
              </div>

              {/* Question */}
              <div className="mb-8">
                <p className="text-gray-400 text-sm mb-4">Question {questionIndexInSubject + 1} of {currentSubjectQuestions.length}</p>
                <h2 className="text-2xl font-bold text-white">{currentQuestion.question}</h2>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === index;

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ x: 4 }}
                      onClick={() => handleAnswerClick(index)}
                      disabled={testSubmitted}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? "bg-orange-500/20 border-orange-500 text-orange-300"
                          : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                          isSelected
                            ? "bg-orange-500 border-orange-500"
                            : "border-gray-500"
                        }`}>
                          {isSelected ? "✓" : String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
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
                  disabled={currentQuestionIndex === allQuestions.length - 1}
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
                  Submit Full Mock
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Progress Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10 space-y-6">
              {/* Question Grid by Subject */}
              {subjects.map((subject, idx) => {
                const subjectStart = subjects.slice(0, idx).reduce((acc, s) => acc + s.questions.length, 0);
                const isCurrentSubject = idx === currentSubject;

                return (
                  <div key={idx} className={`${isCurrentSubject ? "" : "opacity-60"}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{subject.icon}</span>
                      <span className={`text-sm font-semibold ${
                        idx === 0 ? "text-blue-300" : idx === 1 ? "text-green-300" : "text-orange-300"
                      }`}>
                        {subject.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {subject.questions.map((_, qIdx) => {
                        const globalIdx = subjectStart + qIdx;
                        const isCurrent = currentQuestionIndex === globalIdx;
                        const isAnswered = selectedAnswers[globalIdx] !== null;
                        const isMarked = markedForReview.has(globalIdx);

                        return (
                          <motion.button
                            key={qIdx}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setCurrentQuestionIndex(globalIdx);
                              setCurrentSubject(idx);
                              setShowAnswer(false);
                            }}
                            className={`aspect-square rounded text-xs font-bold transition-all border ${
                              isCurrent
                                ? "bg-orange-500 border-orange-500 text-white"
                                : isAnswered
                                ? "bg-green-500/30 border-green-500 text-green-300"
                                : isMarked
                                ? "bg-yellow-500/30 border-yellow-500 text-yellow-300"
                                : "bg-white/5 border-white/20 text-gray-500 hover:bg-white/10"
                            }`}
                          >
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
                <h3 className="text-white font-bold mb-4 text-sm">Overall Stats</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-gray-400 text-xs">Answered</p>
                    <p className="text-2xl font-bold text-green-400">{selectedAnswers.filter((a) => a !== null).length}/{allQuestions.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Marked for Review</p>
                    <p className="text-2xl font-bold text-yellow-400">{markedForReview.size}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
