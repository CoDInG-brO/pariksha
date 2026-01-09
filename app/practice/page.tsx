"use client";
import { motion } from "framer-motion";
import JeeIcon from '@/components/icons/JeeIcon';
import NeetIcon from '@/components/icons/NeetIcon';
import { useState, useEffect, useRef } from "react";
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

// Sample question banks
const jeePracticeQuestions = jeeQuestionBank.map((question) => ({
  id: question.id,
  question: question.question,
  options: question.options,
  answer: question.options[question.correctAnswer],
  explanation: question.explanation,
}));

const neetQuestions = [
  {
    id: 1,
    question: "Which organelle is known as the 'powerhouse of the cell'?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
    answer: "Mitochondria",
    explanation: "Mitochondria produce ATP through cellular respiration, providing energy for cellular activities."
  },
  {
    id: 2,
    question: "The pH of human blood is approximately:",
    options: ["6.4", "7.0", "7.4", "8.4"],
    answer: "7.4",
    explanation: "Human blood is slightly alkaline with a pH of 7.35-7.45. This is maintained by buffer systems."
  },
  {
    id: 3,
    question: "Which vitamin is synthesized by bacteria in the human intestine?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
    answer: "Vitamin K",
    explanation: "Vitamin K is synthesized by gut bacteria and is essential for blood clotting."
  },
  {
    id: 4,
    question: "The structural and functional unit of the kidney is:",
    options: ["Neuron", "Nephron", "Glomerulus", "Bowman's capsule"],
    answer: "Nephron",
    explanation: "Each kidney contains about 1 million nephrons that filter blood and produce urine."
  },
  {
    id: 5,
    question: "Which of the following is NOT a function of the liver?",
    options: ["Bile production", "Glycogen storage", "Insulin production", "Detoxification"],
    answer: "Insulin production",
    explanation: "Insulin is produced by beta cells of the pancreas, not the liver."
  },
  {
    id: 6,
    question: "The chemical formula of glucose is:",
    options: ["C₆H₁₂O₆", "C₁₂H₂₂O₁₁", "C₆H₁₀O₅", "C₅H₁₀O₅"],
    answer: "C₆H₁₂O₆",
    explanation: "Glucose is a monosaccharide with the molecular formula C₆H₁₂O₆."
  },
  {
    id: 7,
    question: "Which blood group is known as the universal donor?",
    options: ["A", "B", "AB", "O"],
    answer: "O",
    explanation: "Type O blood has no A or B antigens, so it can be donated to any blood group."
  },
  {
    id: 8,
    question: "The longest bone in the human body is:",
    options: ["Humerus", "Tibia", "Femur", "Fibula"],
    answer: "Femur",
    explanation: "The femur (thigh bone) is the longest and strongest bone in the human body."
  },
  {
    id: 9,
    question: "Photosynthesis occurs in which part of the plant cell?",
    options: ["Mitochondria", "Chloroplast", "Nucleus", "Vacuole"],
    answer: "Chloroplast",
    explanation: "Chloroplasts contain chlorophyll and are the site of photosynthesis in plant cells."
  },
  {
    id: 10,
    question: "The gas released during photosynthesis is:",
    options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
    answer: "Oxygen",
    explanation: "During photosynthesis, water molecules are split and oxygen is released as a byproduct."
  },
  {
    id: 11,
    question: "Which of the following is a vector quantity?",
    options: ["Speed", "Mass", "Temperature", "Velocity"],
    answer: "Velocity",
    explanation: "Velocity has both magnitude and direction, making it a vector quantity."
  },
  {
    id: 12,
    question: "The SI unit of electric current is:",
    options: ["Volt", "Ohm", "Ampere", "Watt"],
    answer: "Ampere",
    explanation: "Ampere (A) is the SI base unit for electric current."
  },
  {
    id: 13,
    question: "Newton's first law of motion is also known as:",
    options: ["Law of acceleration", "Law of inertia", "Law of action-reaction", "Law of conservation"],
    answer: "Law of inertia",
    explanation: "Newton's first law states that an object remains at rest or in uniform motion unless acted upon by an external force."
  },
  {
    id: 14,
    question: "The chemical name of baking soda is:",
    options: ["Sodium carbonate", "Sodium bicarbonate", "Sodium chloride", "Sodium hydroxide"],
    answer: "Sodium bicarbonate",
    explanation: "Baking soda is NaHCO₃ (sodium bicarbonate or sodium hydrogen carbonate)."
  },
  {
    id: 15,
    question: "Which type of mirror is used in car headlights?",
    options: ["Plane mirror", "Concave mirror", "Convex mirror", "Cylindrical mirror"],
    answer: "Concave mirror",
    explanation: "Concave mirrors converge light rays and produce a powerful parallel beam for headlights."
  },
  {
    id: 16,
    question: "The number of chromosomes in a human somatic cell is:",
    options: ["23", "44", "46", "48"],
    answer: "46",
    explanation: "Human somatic cells are diploid (2n) with 46 chromosomes - 22 pairs of autosomes and 1 pair of sex chromosomes."
  },
  {
    id: 17,
    question: "Which hormone regulates blood sugar levels?",
    options: ["Thyroxine", "Adrenaline", "Insulin", "Cortisol"],
    answer: "Insulin",
    explanation: "Insulin, produced by the pancreas, lowers blood glucose by facilitating cellular uptake."
  },
  {
    id: 18,
    question: "The process by which plants lose water through leaves is called:",
    options: ["Transpiration", "Respiration", "Photosynthesis", "Guttation"],
    answer: "Transpiration",
    explanation: "Transpiration is the evaporation of water from leaf surfaces through stomata."
  },
  {
    id: 19,
    question: "Which element has the atomic number 6?",
    options: ["Nitrogen", "Carbon", "Oxygen", "Boron"],
    answer: "Carbon",
    explanation: "Carbon has 6 protons, giving it atomic number 6."
  },
  {
    id: 20,
    question: "The acceleration due to gravity on Earth's surface is approximately:",
    options: ["8.9 m/s²", "9.8 m/s²", "10.8 m/s²", "11.8 m/s²"],
    answer: "9.8 m/s²",
    explanation: "The standard value of g on Earth's surface is 9.8 m/s² or approximately 10 m/s²."
  },
  {
    id: 21,
    question: "DNA replication is described as:",
    options: ["Conservative", "Dispersive", "Semi-conservative", "Non-conservative"],
    answer: "Semi-conservative",
    explanation: "In semi-conservative replication, each new DNA molecule contains one original and one new strand."
  },
  {
    id: 22,
    question: "Which of the following is an example of a monocot plant?",
    options: ["Mango", "Rose", "Wheat", "Pea"],
    answer: "Wheat",
    explanation: "Wheat is a monocot with parallel leaf venation, fibrous roots, and flower parts in multiples of 3."
  },
  {
    id: 23,
    question: "The unit of frequency is:",
    options: ["Second", "Hertz", "Watt", "Newton"],
    answer: "Hertz",
    explanation: "Hertz (Hz) is the SI unit of frequency, equal to one cycle per second."
  },
  {
    id: 24,
    question: "Which acid is present in the human stomach?",
    options: ["Sulphuric acid", "Hydrochloric acid", "Nitric acid", "Acetic acid"],
    answer: "Hydrochloric acid",
    explanation: "The stomach secretes HCl to aid digestion and kill pathogens."
  },
  {
    id: 25,
    question: "The process of conversion of sugar into alcohol is called:",
    options: ["Photosynthesis", "Fermentation", "Respiration", "Oxidation"],
    answer: "Fermentation",
    explanation: "Fermentation is an anaerobic process where yeast converts sugar to alcohol and CO₂."
  },
  {
    id: 26,
    question: "Ohm's law states that:",
    options: ["V = I/R", "V = IR", "V = I + R", "V = I - R"],
    answer: "V = IR",
    explanation: "Ohm's law: Voltage equals current times resistance (V = IR)."
  },
  {
    id: 27,
    question: "Which part of the brain controls balance and coordination?",
    options: ["Cerebrum", "Cerebellum", "Medulla", "Pons"],
    answer: "Cerebellum",
    explanation: "The cerebellum coordinates voluntary movements, balance, and posture."
  },
  {
    id: 28,
    question: "The chemical formula of water is:",
    options: ["H₂O", "H₂O₂", "HO₂", "H₃O"],
    answer: "H₂O",
    explanation: "Water consists of two hydrogen atoms and one oxygen atom."
  },
  {
    id: 29,
    question: "Which of the following is NOT a greenhouse gas?",
    options: ["Carbon dioxide", "Methane", "Nitrogen", "Water vapor"],
    answer: "Nitrogen",
    explanation: "Nitrogen (N₂) is not a greenhouse gas. CO₂, CH₄, and H₂O vapor trap heat."
  },
  {
    id: 30,
    question: "The smallest unit of life is:",
    options: ["Atom", "Molecule", "Cell", "Tissue"],
    answer: "Cell",
    explanation: "The cell is the basic structural and functional unit of all living organisms."
  },
  {
    id: 31,
    question: "Which lens is used to correct myopia (short-sightedness)?",
    options: ["Convex lens", "Concave lens", "Bifocal lens", "Cylindrical lens"],
    answer: "Concave lens",
    explanation: "Concave (diverging) lenses correct myopia by diverging light rays before they enter the eye."
  },
  {
    id: 32,
    question: "The molar mass of NaCl is:",
    options: ["40 g/mol", "58.5 g/mol", "75 g/mol", "100 g/mol"],
    answer: "58.5 g/mol",
    explanation: "NaCl: Na (23) + Cl (35.5) = 58.5 g/mol."
  },
  {
    id: 33,
    question: "Which tissue provides support and flexibility in the body?",
    options: ["Epithelial tissue", "Cartilage", "Nervous tissue", "Muscle tissue"],
    answer: "Cartilage",
    explanation: "Cartilage is a flexible connective tissue that provides support and cushioning."
  },
  {
    id: 34,
    question: "The phenomenon of splitting of white light into its component colors is called:",
    options: ["Reflection", "Refraction", "Dispersion", "Diffraction"],
    answer: "Dispersion",
    explanation: "Dispersion separates white light into the visible spectrum (VIBGYOR) due to different wavelengths."
  },
  {
    id: 35,
    question: "Which enzyme breaks down starch in the mouth?",
    options: ["Pepsin", "Lipase", "Amylase", "Trypsin"],
    answer: "Amylase",
    explanation: "Salivary amylase in the mouth begins the breakdown of starch into maltose."
  },
  {
    id: 36,
    question: "The atomic number of an element is determined by:",
    options: ["Number of neutrons", "Number of protons", "Number of electrons", "Mass number"],
    answer: "Number of protons",
    explanation: "Atomic number = number of protons in the nucleus, which defines the element."
  },
  {
    id: 37,
    question: "Which of the following is a renewable source of energy?",
    options: ["Coal", "Petroleum", "Natural gas", "Solar energy"],
    answer: "Solar energy",
    explanation: "Solar energy is renewable as it comes from the sun and is continuously available."
  },
  {
    id: 38,
    question: "The number of ATP molecules produced in glycolysis is:",
    options: ["2", "4", "36", "38"],
    answer: "2",
    explanation: "Glycolysis produces a net gain of 2 ATP molecules from one glucose molecule."
  },
  {
    id: 39,
    question: "Which gas is used for artificial ripening of fruits?",
    options: ["Oxygen", "Carbon dioxide", "Ethylene", "Nitrogen"],
    answer: "Ethylene",
    explanation: "Ethylene is a plant hormone that promotes fruit ripening."
  },
  {
    id: 40,
    question: "The unit of electric resistance is:",
    options: ["Ampere", "Volt", "Ohm", "Watt"],
    answer: "Ohm",
    explanation: "Ohm (Ω) is the SI unit of electrical resistance."
  },
  {
    id: 41,
    question: "Which blood cells are responsible for immunity?",
    options: ["Red blood cells", "White blood cells", "Platelets", "Plasma"],
    answer: "White blood cells",
    explanation: "White blood cells (leukocytes) are part of the immune system and fight infections."
  },
  {
    id: 42,
    question: "The speed of light in vacuum is approximately:",
    options: ["3 × 10⁶ m/s", "3 × 10⁷ m/s", "3 × 10⁸ m/s", "3 × 10⁹ m/s"],
    answer: "3 × 10⁸ m/s",
    explanation: "The speed of light in vacuum is approximately 3 × 10⁸ m/s (299,792,458 m/s)."
  },
  {
    id: 43,
    question: "Which part of the flower develops into a fruit?",
    options: ["Sepal", "Petal", "Ovary", "Stamen"],
    answer: "Ovary",
    explanation: "After fertilization, the ovary develops into the fruit containing seeds."
  },
  {
    id: 44,
    question: "The process of removing impurities from petroleum is called:",
    options: ["Distillation", "Refining", "Cracking", "Oxidation"],
    answer: "Refining",
    explanation: "Petroleum refining separates crude oil into various useful products through fractional distillation."
  },
  {
    id: 45,
    question: "Which vitamin deficiency causes night blindness?",
    options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"],
    answer: "Vitamin A",
    explanation: "Vitamin A is essential for the production of rhodopsin, the visual pigment in rod cells."
  },
  {
    id: 46,
    question: "The formula for kinetic energy is:",
    options: ["KE = mv", "KE = ½mv²", "KE = mv²", "KE = ½mv"],
    answer: "KE = ½mv²",
    explanation: "Kinetic energy equals half the mass times velocity squared."
  },
  {
    id: 47,
    question: "Which of the following is NOT a part of the central nervous system?",
    options: ["Brain", "Spinal cord", "Cranial nerves", "Cerebellum"],
    answer: "Cranial nerves",
    explanation: "Cranial nerves are part of the peripheral nervous system, not the CNS."
  },
  {
    id: 48,
    question: "The valency of carbon is:",
    options: ["2", "3", "4", "5"],
    answer: "4",
    explanation: "Carbon has 4 valence electrons and forms 4 covalent bonds."
  },
  {
    id: 49,
    question: "Which gland is known as the 'master gland'?",
    options: ["Thyroid", "Adrenal", "Pituitary", "Pancreas"],
    answer: "Pituitary",
    explanation: "The pituitary gland controls other endocrine glands through its hormones."
  },
  {
    id: 50,
    question: "The force of attraction between two masses is called:",
    options: ["Electromagnetic force", "Nuclear force", "Gravitational force", "Frictional force"],
    answer: "Gravitational force",
    explanation: "Gravitational force is the attractive force between any two masses in the universe."
  }
];

export default function Practice() {
  const [selectedExam, setSelectedExam] = useState<"JEE" | "NEET" | null>(null);
  const [questions, setQuestions] = useState<typeof jeePracticeQuestions>([]);
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [savedProgress, setSavedProgress] = useState<PracticeProgress | null>(null);
  const thirdQuestionRef = useRef<HTMLDivElement>(null);

  // Load saved progress on mount
  useEffect(() => {
    const progress = getPracticeProgress();
    setSavedProgress(progress);
  }, []);

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
    setShowAnswers({});
    setSelectedOptions({});
    
    // Shuffle and pick 50 questions
    const questionBank = exam === "JEE" ? jeePracticeQuestions : neetQuestions;
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 50));
  };

  const toggleAnswer = (questionId: number) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleOptionSelect = (questionId: number, option: string, correctAnswer: string) => {
    // Only play sound if this question hasn't been answered yet
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
    setSelectedExam(null);
    setQuestions([]);
    setShowAnswers({});
    setSelectedOptions({});
    clearPracticeProgress();
    setSavedProgress(null);
  };

  // Exam selection screen
  if (!selectedExam) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-25">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-3">Practice Mode</h1>
          <p className="text-gray-400 mb-8 text-base">Choose your exam to start practicing with random questions</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* JEE Option */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExamSelect("JEE")}
              aria-label="Start JEE Practice"
              className="w-56 p-5 bg-surface rounded-2xl border border-orange-300/20 hover:shadow-lg hover:-translate-y-1 transition-all transform-gpu group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-105 transition-transform">
                {/* SVG icon */}
                <JeeIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-0.5">JEE</h3>
              <p className="text-gray-300 text-sm">Physics, Chemistry & Mathematics</p>
            </motion.button>

            {/* NEET Option */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExamSelect("NEET")}
              aria-label="Start NEET Practice"
              className="w-56 p-5 bg-surface rounded-2xl border border-green-300/20 hover:shadow-lg hover:-translate-y-1 transition-all transform-gpu group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:scale-105 transition-transform">
                {/* SVG icon */}
                <NeetIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-0.5">NEET</h3>
              <p className="text-gray-300 text-sm">Physics, Chemistry & Biology</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Questions display
  return (
    <div className="max-w-4xl mx-auto pb-8 pt-[6.5rem] px-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sticky top-20 bg-background/80 backdrop-blur-lg py-3 z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={resetPractice}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">{selectedExam} Practice</h1>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg text-sm ${selectedExam === "JEE" ? "bg-orange-500/20 text-orange-300" : "bg-green-500/20 text-green-300"}`}>
          {selectedExam}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((q, index) => (
          <>
            <motion.div
              key={q.id}
              ref={index === 2 ? thirdQuestionRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="bg-surface rounded-xl p-4 border border-white/10"
            >
            {/* Question */}
            <div className="flex gap-3 mb-3">
              <span className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                selectedExam === "JEE" ? "bg-orange-500/20 text-orange-300" : "bg-green-500/20 text-green-300"
              }`}>
                {index + 1}
              </span>
              <p className="text-white text-base leading-snug">{q.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-1.5 ml-10 mb-3">
              {q.options.map((option, optIndex) => {
                const isSelected = selectedOptions[q.id] === option;
                const showingAnswer = showAnswers[q.id];
                const isCorrect = option === q.answer;
                
                let optionClass = "p-3 rounded-lg border cursor-pointer transition-all ";
                
                if (showingAnswer) {
                  if (isCorrect) {
                    optionClass += "bg-green-500/20 border-green-500/50 text-green-300";
                  } else if (isSelected && !isCorrect) {
                    optionClass += "bg-red-500/20 border-red-500/50 text-red-300";
                  } else {
                    optionClass += "bg-black/30 border-white/10 text-gray-400";
                  }
                } else {
                  optionClass += isSelected 
                    ? "bg-accent/20 border-accent/50 text-white" 
                    : "bg-black/30 border-white/10 text-gray-300 hover:bg-white/5 hover:border-white/20";
                }

                return (
                  <div
                    key={optIndex}
                    onClick={() => !showAnswers[q.id] && handleOptionSelect(q.id, option, q.answer)}
                    role="button"
                    aria-pressed={isSelected}
                    className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${isSelected ? 'option--selected' : ''} ${(showingAnswer && isCorrect) || (!showingAnswer && isSelected && isCorrect) ? 'option--correct' : ''} ${(showingAnswer && isSelected && !isCorrect) || (!showingAnswer && isSelected && !isCorrect) ? 'option--incorrect' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${isSelected ? 'bg-white/5' : 'bg-transparent text-gray-400'}`}>
                      {String.fromCharCode(65 + optIndex)}
                    </div>
                    <div className="flex-1 text-white text-sm leading-snug">{option}</div>

                    {/* Inline icons - show immediately on selection */}
                    <div className="w-6 h-6 flex items-center justify-center">
                      { (isSelected && !isCorrect) && (
                        <svg className="option__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 6L18 18" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M6 18L18 6" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}

                      { ((isCorrect && showingAnswer) || (!showingAnswer && isSelected && isCorrect)) && (
                        <svg className="option__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show Answer Button & Action Buttons */}
            <div className="ml-10 flex gap-2.5 flex-wrap">
              <button
                onClick={() => toggleAnswer(q.id)}
                aria-pressed={showAnswers[q.id]}
                className={showAnswers[q.id] ? 'btn-gradient-gray' : 'btn-gradient-pink'}
                style={{padding: '0.4rem 0.9rem'}}
              >
                <span className="inline-flex items-center gap-2">
                  {showAnswers[q.id] ? (
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
                  <span>{showAnswers[q.id] ? 'Hide Answer' : 'Show Answer'}</span>
                </span>
              </button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-gradient-yellow"
                style={{padding: '0.4rem 0.9rem'}}
              >
                <span className="inline-flex items-center gap-2">
                  <span>{showAnswers[q.id] ? 'Hide Answer' : 'Show Answer'}</span>
                </span>
              </motion.button>
            </div>

            {/* Explanation */}
            {showAnswers[q.id] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 p-3 rounded-lg bg-black/30 border border-accent/20"
              >
                <p className="text-sm text-gray-300">
                  <span className="text-accent font-medium">Explanation: </span>
                  {q.explanation}
                </p>
              </motion.div>
            )}
          </motion.div>
          </>
        ))}
      </div>

      {/* Submit Practice Button */}
      <div className="mt-8 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="btn-gradient-orange-lg"
        >
          Submit Practice
        </motion.button>
      </div>

      {/* Fixed Back to Top Button - shows after scrolling past 3rd question */}
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
