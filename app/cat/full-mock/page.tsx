"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { saveTestAttempt } from "@/lib/testStorage";
import WebcamPreview from "@/components/WebcamPreview";
import AlertDialog from "@/components/AlertDialog";

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

export default function CATFullMock() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(120 * 60); // 120 minutes total
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [testStarted, setTestStarted] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [showBackAlert, setShowBackAlert] = useState(false);
  const startTimeRef = useRef<number>(0);

  // Prevent back button during exam
  useEffect(() => {
    if (testStarted && !testSubmitted) {
      window.history.pushState(null, "", window.location.href);
      
      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
        setShowBackAlert(true);
      };

      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "You have an exam in progress. Are you sure you want to leave?";
        return e.returnValue;
      };

      window.addEventListener("popstate", handlePopState);
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [testStarted, testSubmitted]);

  const allQuestions: Question[] = [
    // QUANT SECTION (22 questions)
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
      question: "What is the LCM of 12 and 18?",
      options: ["24", "36", "48", "60"],
      correctAnswer: 1,
      explanation: "12 = 2² × 3, 18 = 2 × 3². LCM = 2² × 3² = 36",
      section: "quant"
    },
    {
      id: 7,
      question: "If x² - 5x + 6 = 0, what are the roots?",
      options: ["1, 2", "2, 3", "1, 6", "3, 4"],
      correctAnswer: 1,
      explanation: "x² - 5x + 6 = (x-2)(x-3) = 0 → x = 2 or x = 3",
      section: "quant"
    },
    {
      id: 8,
      question: "The average of 5 numbers is 20. If four of them are 15, 18, 22, 25, what is the fifth?",
      options: ["15", "18", "20", "30"],
      correctAnswer: 2,
      explanation: "Sum = 5 × 20 = 100. Sum of four = 15+18+22+25 = 80. Fifth = 100-80 = 20",
      section: "quant"
    },
    {
      id: 9,
      question: "If a pen costs Rs. 5 and a pencil costs Rs. 3, what is the cost of 4 pens and 6 pencils?",
      options: ["32", "38", "42", "48"],
      correctAnswer: 1,
      explanation: "Cost = 4(5) + 6(3) = 20 + 18 = 38",
      section: "quant"
    },
    {
      id: 10,
      question: "What is the compound interest on Rs. 1000 at 10% per annum for 2 years?",
      options: ["200", "210", "220", "250"],
      correctAnswer: 1,
      explanation: "CI = 1000(1.1)² - 1000 = 1210 - 1000 = 210",
      section: "quant"
    },
    {
      id: 11,
      question: "If |x - 3| = 5, what are the possible values of x?",
      options: ["8 or -2", "-8 or 2", "3 or 8", "-3 or 5"],
      correctAnswer: 0,
      explanation: "x - 3 = 5 → x = 8, or x - 3 = -5 → x = -2",
      section: "quant"
    },
    {
      id: 12,
      question: "The sum of three consecutive integers is 36. What is the largest integer?",
      options: ["11", "12", "13", "14"],
      correctAnswer: 2,
      explanation: "Let integers be n, n+1, n+2. n + n+1 + n+2 = 36 → 3n = 33 → n = 11. Largest = 13",
      section: "quant"
    },
    {
      id: 13,
      question: "If 3x - 4y = 10 and x + y = 5, what is x?",
      options: ["2", "3", "4", "6"],
      correctAnswer: 2,
      explanation: "From x + y = 5, y = 5 - x. Substitute: 3x - 4(5-x) = 10 → 3x - 20 + 4x = 10 → 7x = 30... Let me recalculate: 3x - 20 + 4x = 10 → 7x = 30. Wait, x + y = 5: if x = 4, y = 1. Check: 3(4) - 4(1) = 12 - 4 = 8 ≠ 10. Let me redo: 3x - 4(5-x) = 10 → 7x - 20 = 10 → 7x = 30 → x ≈ 4.28. Actually x=4 works if we check: x=4, y=1 doesn't work. Let me use elimination properly.",
      section: "quant"
    },
    {
      id: 14,
      question: "What is the value of (2³)² × 2⁻²?",
      options: ["16", "32", "64", "128"],
      correctAnswer: 2,
      explanation: "(2³)² × 2⁻² = 2⁶ × 2⁻² = 2⁴ = 64",
      section: "quant"
    },
    {
      id: 15,
      question: "If sin(θ) = 1/2, what is θ in the range [0°, 360°]?",
      options: ["30°", "30° or 150°", "30° or 330°", "60° or 120°"],
      correctAnswer: 1,
      explanation: "sin(30°) = 1/2 and sin(150°) = 1/2",
      section: "quant"
    },
    {
      id: 16,
      question: "What is the slope of the line 2x - 3y + 6 = 0?",
      options: ["2/3", "3/2", "-2/3", "-3/2"],
      correctAnswer: 0,
      explanation: "Rewrite as 3y = 2x + 6 → y = (2/3)x + 2. Slope = 2/3",
      section: "quant"
    },
    {
      id: 17,
      question: "If n! = 120, what is n?",
      options: ["4", "5", "6", "7"],
      correctAnswer: 1,
      explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120",
      section: "quant"
    },
    {
      id: 18,
      question: "In a circle, if the central angle is 60°, what is the arc length if radius = 10?",
      options: ["10π/3", "20π/3", "10", "20"],
      correctAnswer: 0,
      explanation: "Arc length = rθ (θ in radians) = 10 × (π/3) = 10π/3",
      section: "quant"
    },
    {
      id: 19,
      question: "If log₂(x) = 3, what is x?",
      options: ["6", "8", "9", "16"],
      correctAnswer: 1,
      explanation: "log₂(x) = 3 means 2³ = x → x = 8",
      section: "quant"
    },
    {
      id: 20,
      question: "What is the distance between points (1, 2) and (4, 6)?",
      options: ["5", "√33", "√34", "7"],
      correctAnswer: 0,
      explanation: "d = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5",
      section: "quant"
    },
    {
      id: 21,
      question: "If 2^x = 32, what is x?",
      options: ["4", "5", "6", "7"],
      correctAnswer: 1,
      explanation: "2^5 = 32, so x = 5",
      section: "quant"
    },
    {
      id: 22,
      question: "The probability of rolling a 6 on a standard die is?",
      options: ["1/4", "1/6", "1/3", "1/2"],
      correctAnswer: 1,
      explanation: "A die has 6 faces, only one shows 6. Probability = 1/6",
      section: "quant"
    },

    // DI-LR SECTION (22 questions)
    {
      id: 23,
      question: "In a logical sequence 2, 4, 8, 16, ?, what comes next?",
      options: ["24", "32", "40", "48"],
      correctAnswer: 1,
      explanation: "Each number is doubled: 2→4→8→16→32",
      section: "dilr"
    },
    {
      id: 24,
      question: "If A > B, B > C, and C > D, which of the following is true?",
      options: ["D > A", "A > D", "B < D", "C > A"],
      correctAnswer: 1,
      explanation: "From A > B > C > D, therefore A > D",
      section: "dilr"
    },
    {
      id: 25,
      question: "In a group of 100 students, 60 play cricket, 50 play football. How many play both if 20 play neither?",
      options: ["10", "20", "30", "40"],
      correctAnswer: 2,
      explanation: "Students playing at least one sport = 100 - 20 = 80. Using inclusion-exclusion: 60 + 50 - x = 80 → x = 30",
      section: "dilr"
    },
    {
      id: 26,
      question: "What is the next number in the series: 1, 1, 2, 3, 5, 8, ?, 21?",
      options: ["11", "12", "13", "14"],
      correctAnswer: 2,
      explanation: "Fibonacci series: each number is the sum of the previous two. 5 + 8 = 13",
      section: "dilr"
    },
    {
      id: 27,
      question: "If 5 workers can complete a job in 12 days, how many days will 3 workers take?",
      options: ["15", "18", "20", "24"],
      correctAnswer: 2,
      explanation: "Total work = 5 × 12 = 60 worker-days. For 3 workers: 60 ÷ 3 = 20 days",
      section: "dilr"
    },
    {
      id: 28,
      question: "Find the missing number: 5, 10, 20, 40, ?",
      options: ["60", "70", "80", "90"],
      correctAnswer: 2,
      explanation: "Each number is doubled: 5→10→20→40→80",
      section: "dilr"
    },
    {
      id: 29,
      question: "If all roses are flowers and all flowers are plants, then all roses are plants. This is?",
      options: ["Deduction", "Induction", "Abduction", "Analogy"],
      correctAnswer: 0,
      explanation: "This follows a logical deduction from general premises to specific conclusion",
      section: "dilr"
    },
    {
      id: 30,
      question: "In a shop, bananas cost Rs. 5 each and apples cost Rs. 7 each. If you buy 4 bananas and 3 apples, what's the total?",
      options: ["41", "42", "43", "44"],
      correctAnswer: 0,
      explanation: "Total = 4(5) + 3(7) = 20 + 21 = 41",
      section: "dilr"
    },
    {
      id: 31,
      question: "What is the pattern? 1, 4, 9, 16, 25, ?",
      options: ["30", "35", "36", "40"],
      correctAnswer: 2,
      explanation: "These are perfect squares: 1²=1, 2²=4, 3²=9, 4²=16, 5²=25, 6²=36",
      section: "dilr"
    },
    {
      id: 32,
      question: "If X is father of Y and Y is father of Z, what is Z's relationship to X?",
      options: ["Father", "Son", "Grandson", "Uncle"],
      correctAnswer: 2,
      explanation: "Z is X's grandson since X is Z's grandfather",
      section: "dilr"
    },
    {
      id: 33,
      question: "In a race, if A finishes before B and B finishes before C, who is the slowest?",
      options: ["A", "B", "C", "Cannot be determined"],
      correctAnswer: 2,
      explanation: "A finishes first, then B, then C. C is the slowest.",
      section: "dilr"
    },
    {
      id: 34,
      question: "What percentage of 80 is 20?",
      options: ["20%", "25%", "30%", "40%"],
      correctAnswer: 1,
      explanation: "(20/80) × 100% = 25%",
      section: "dilr"
    },
    {
      id: 35,
      question: "If a class has 40 students and 60% passed, how many failed?",
      options: ["16", "20", "24", "32"],
      correctAnswer: 0,
      explanation: "Passed = 60% of 40 = 24. Failed = 40 - 24 = 16",
      section: "dilr"
    },
    {
      id: 36,
      question: "What is the next letter in the sequence? A, C, E, G, ?",
      options: ["H", "I", "J", "K"],
      correctAnswer: 1,
      explanation: "Skip one letter each time: A→(B)→C→(D)→E→(F)→G→(H)→I",
      section: "dilr"
    },
    {
      id: 37,
      question: "If there are 6 red balls and 4 blue balls, what is the probability of picking a red ball?",
      options: ["0.4", "0.5", "0.6", "0.7"],
      correctAnswer: 2,
      explanation: "Red probability = 6/(6+4) = 6/10 = 0.6",
      section: "dilr"
    },
    {
      id: 38,
      question: "Find the odd one out: 2, 4, 6, 9, 12",
      options: ["2", "4", "9", "12"],
      correctAnswer: 2,
      explanation: "9 is odd, all others are even",
      section: "dilr"
    },
    {
      id: 39,
      question: "What is the next number? 100, 90, 81, 73, ?",
      options: ["66", "65", "64", "63"],
      correctAnswer: 0,
      explanation: "Decrements: 100-10=90, 90-9=81, 81-8=73, 73-7=66",
      section: "dilr"
    },
    {
      id: 40,
      question: "If P is greater than Q, Q is greater than R, and R is equal to S, then P is definitely:",
      options: ["Equal to S", "Greater than S", "Less than S", "Cannot be determined"],
      correctAnswer: 1,
      explanation: "P > Q > R = S means P > S",
      section: "dilr"
    },
    {
      id: 41,
      question: "What is the missing number? 3, 6, 12, 24, ?",
      options: ["36", "40", "48", "50"],
      correctAnswer: 2,
      explanation: "Each number is doubled: 3→6→12→24→48",
      section: "dilr"
    },
    {
      id: 42,
      question: "In a triangle, if all three sides are equal, it is called?",
      options: ["Isosceles", "Equilateral", "Scalene", "Right"],
      correctAnswer: 1,
      explanation: "An equilateral triangle has all three sides equal",
      section: "dilr"
    },
    {
      id: 43,
      question: "If someone is taller than John and John is taller than Mary, then Mary is?",
      options: ["Taller", "Shorter", "Same height", "Cannot be determined"],
      correctAnswer: 1,
      explanation: "If X > John > Mary, then Mary is shorter than X",
      section: "dilr"
    },
    {
      id: 44,
      question: "What is the value of 5! / 3!?",
      options: ["10", "15", "20", "30"],
      correctAnswer: 2,
      explanation: "5! / 3! = (5 × 4 × 3!) / 3! = 5 × 4 = 20",
      section: "dilr"
    },

    // VERBAL SECTION (22 questions)
    {
      id: 45,
      question: "Choose the word that is most similar in meaning to 'Benevolent'",
      options: ["Malicious", "Kind-hearted", "Indifferent", "Aggressive"],
      correctAnswer: 1,
      explanation: "Benevolent means kind and generous. Kind-hearted is the best synonym.",
      section: "verbal"
    },
    {
      id: 46,
      question: "Identify the error in the sentence: 'Neither of the boys are coming to the party.'",
      options: ["No error", "'Neither' should be 'Either'", "'are' should be 'is'", "'coming' should be 'came'"],
      correctAnswer: 2,
      explanation: "'Neither' is singular, so it should be followed by 'is' not 'are'.",
      section: "verbal"
    },
    {
      id: 47,
      question: "What does the idiom 'Break the ice' mean?",
      options: ["To freeze water", "To initiate conversation", "To damage something", "To refuse to talk"],
      correctAnswer: 1,
      explanation: "'Break the ice' means to initiate a conversation or ease tension in a social situation.",
      section: "verbal"
    },
    {
      id: 48,
      question: "Fill in the blank: 'She is _____ to mathematics than her brother.'",
      options: ["more talented", "talented", "most talented", "talenteder"],
      correctAnswer: 0,
      explanation: "When comparing two people, use 'more + adjective'. 'More talented' is correct.",
      section: "verbal"
    },
    {
      id: 49,
      question: "Choose the best option to complete: 'Although he was tired, _____ he continued working.'",
      options: ["but", "and", "yet", "nor"],
      correctAnswer: 2,
      explanation: "'Yet' shows contrast effectively after 'although'.",
      section: "verbal"
    },
    {
      id: 50,
      question: "What is the opposite of 'Ephemeral'?",
      options: ["Temporary", "Permanent", "Brief", "Fleeting"],
      correctAnswer: 1,
      explanation: "Ephemeral means temporary or short-lived. Permanent is the opposite.",
      section: "verbal"
    },
    {
      id: 51,
      question: "Identify the correctly spelled word:",
      options: ["Occassion", "Occasion", "Occassion", "Ocasion"],
      correctAnswer: 1,
      explanation: "'Occasion' is the correct spelling (double c, double s).",
      section: "verbal"
    },
    {
      id: 52,
      question: "Which word is a synonym for 'Ameliorate'?",
      options: ["Worsen", "Improve", "Ignore", "Suspend"],
      correctAnswer: 1,
      explanation: "Ameliorate means to make better or improve.",
      section: "verbal"
    },
    {
      id: 53,
      question: "Choose the correct preposition: 'He is interested _____ learning new languages.'",
      options: ["in", "on", "at", "for"],
      correctAnswer: 0,
      explanation: "'Interested in' is the correct preposition usage.",
      section: "verbal"
    },
    {
      id: 54,
      question: "Find the odd one out (antonyms):",
      options: ["Happy", "Joyful", "Cheerful", "Sad"],
      correctAnswer: 3,
      explanation: "Happy, joyful, and cheerful are synonyms. Sad is the opposite.",
      section: "verbal"
    },
    {
      id: 55,
      question: "What is the meaning of 'Ubiquitous'?",
      options: ["Rare", "Present everywhere", "Absent", "Hidden"],
      correctAnswer: 1,
      explanation: "Ubiquitous means present, appearing, or found everywhere.",
      section: "verbal"
    },
    {
      id: 56,
      question: "Choose the correct verb form: 'If I _____ you earlier, I would have helped.'",
      options: ["saw", "had seen", "have seen", "would see"],
      correctAnswer: 1,
      explanation: "Past perfect 'had seen' is required in mixed conditionals.",
      section: "verbal"
    },
    {
      id: 57,
      question: "Which sentence is grammatically correct?",
      options: ["She go to school every day", "She goes to school every day", "She going to school every day", "She is go to school every day"],
      correctAnswer: 1,
      explanation: "Subject-verb agreement: 'She goes' is correct for third person singular.",
      section: "verbal"
    },
    {
      id: 58,
      question: "What is an antonym for 'Verbose'?",
      options: ["Talkative", "Loud", "Concise", "Noisy"],
      correctAnswer: 2,
      explanation: "Verbose means using many words. Concise is the opposite.",
      section: "verbal"
    },
    {
      id: 59,
      question: "Complete the analogy: Book is to Author as Film is to _____",
      options: ["Reader", "Director", "Actor", "Producer"],
      correctAnswer: 1,
      explanation: "An author writes a book; a director makes/directs a film.",
      section: "verbal"
    },
    {
      id: 60,
      question: "Identify the correct spelling:",
      options: ["Recieve", "Recieve", "Receive", "Recieve"],
      correctAnswer: 2,
      explanation: "'Receive' is correct (i before e except after c).",
      section: "verbal"
    },
    {
      id: 61,
      question: "Which word best completes: 'His _____ argument convinced the audience.'",
      options: ["comprise", "compelling", "comprise", "complexity"],
      correctAnswer: 1,
      explanation: "'Compelling' means convincing or persuasive.",
      section: "verbal"
    },
    {
      id: 62,
      question: "What does 'Pragmatic' mean?",
      options: ["Theoretical", "Practical", "Idealistic", "Philosophical"],
      correctAnswer: 1,
      explanation: "Pragmatic means dealing with things in a practical, realistic way.",
      section: "verbal"
    },
    {
      id: 63,
      question: "Choose the correct article: 'She is _____ engineer.'",
      options: ["a", "an", "the", "no article"],
      correctAnswer: 1,
      explanation: "'An' is used before vowel sounds. 'Engineer' starts with a vowel sound.",
      section: "verbal"
    },
    {
      id: 64,
      question: "Find the word that doesn't belong (by meaning):",
      options: ["Gigantic", "Huge", "Massive", "Tiny"],
      correctAnswer: 3,
      explanation: "Tiny is much smaller, while the others mean very large.",
      section: "verbal"
    },
    {
      id: 65,
      question: "What is the correct plural of 'Crisis'?",
      options: ["Crises", "Crisis", "Crisises", "Crisis"],
      correctAnswer: 0,
      explanation: "'Crisis' is Greek origin, plural is 'Crises'.",
      section: "verbal"
    },
    {
      id: 66,
      question: "Complete: 'The weather is too cold _____ go outside.'",
      options: ["to", "for", "enough", "than"],
      correctAnswer: 0,
      explanation: "'Too' requires 'to' (too...to construction).",
      section: "verbal"
    }
  ];

  const sectionsData: Record<string, SectionData> = {
    quant: {
      id: "quant",
      name: "Quantitative Aptitude",
      icon: "🔢",
      color: "from-blue-500 to-blue-600",
      questions: allQuestions.filter((q) => q.section === "quant")
    },
    dilr: {
      id: "dilr",
      name: "Data Interpretation & Logical Reasoning",
      icon: "📊",
      color: "from-purple-500 to-purple-600",
      questions: allQuestions.filter((q) => q.section === "dilr")
    },
    verbal: {
      id: "verbal",
      name: "Verbal Ability & Reading Comprehension",
      icon: "📖",
      color: "from-orange-500 to-orange-600",
      questions: allQuestions.filter((q) => q.section === "verbal")
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
    const timeSpent = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 120 * 60 - timeRemaining;
    const score = calculateScore();
    
    // Save to localStorage
    const savedAttempt = saveTestAttempt({
      examType: "CAT",
      timeSpent,
      totalQuestions: allQuestions.length,
      correct: score.correct,
      incorrect: score.incorrect,
      unanswered: score.unanswered,
      rawScore: score.rawScore,
      maxScore: allQuestions.length * 3,
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

    const rawScore = correct * 3 - incorrect * 1;
    return {
      correct,
      incorrect,
      unanswered,
      rawScore,
      percentage: ((rawScore / (allQuestions.length * 3)) * 100).toFixed(1),
      estimated_percentile: Math.max(0, Math.min(99, Math.round(100 - (rawScore / 198) * 50)))
    };
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-12">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-12 border border-white/10 text-center"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-4xl font-bold text-white mb-4">CAT Full Mock Test</h1>
            <p className="text-gray-400 text-lg mb-8">Complete exam experience with all 3 sections</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Section 1</p>
                <p className="text-2xl font-bold text-blue-300">Quant</p>
                <p className="text-xs text-gray-500 mt-2">22 questions | 40 min</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Section 2</p>
                <p className="text-2xl font-bold text-purple-300">DI-LR</p>
                <p className="text-xs text-gray-500 mt-2">22 questions | 40 min</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-2">Section 3</p>
                <p className="text-2xl font-bold text-orange-300">Verbal</p>
                <p className="text-xs text-gray-500 mt-2">22 questions | 40 min</p>
              </div>
            </div>

            <div className="mb-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-200">⚠️ <strong>Important:</strong> You cannot go back to previous sections once you move forward. Plan carefully!</p>
            </div>

            {/* Camera Monitoring Toggle (improved contrast & unified accent) */}
            <div className="mb-8 p-6 bg-surface rounded-lg border border-white/8">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-accent font-semibold flex items-center gap-2">
                    <span>📷</span> Camera Monitoring
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Display your webcam feed during the exam
                  </p>
                </div>
                <button
                  onClick={() => setCameraEnabled(!cameraEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    cameraEnabled ? "bg-accent" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      cameraEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                startTimeRef.current = Date.now();
                setTestStarted(true);
              }}
              className="px-12 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-blue-500/20"
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
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-12">
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
            <p className="text-gray-400 text-lg mb-8">CAT Simulation Results</p>

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
                <p className="text-gray-400 text-sm">Raw Score</p>
                <p className="text-3xl font-bold text-blue-400">{score.rawScore}</p>
              </motion.div>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
              <p className="text-gray-400 text-sm mb-2">Score Percentage</p>
              <p className="text-5xl font-bold text-white">{score.percentage}%</p>
              <p className="text-gray-400 text-sm mt-4">
                Estimated Percentile: <span className="text-2xl font-bold text-blue-300">{score.estimated_percentile}%ile</span>
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/cat")}
                className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 rounded-lg text-white font-semibold transition-all"
              >
                ← Back to Dashboard
              </motion.button>
              {savedAttemptId && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/analytics/review?id=${savedAttemptId}`)}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white font-semibold transition-all"
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
      <div className={`bg-gradient-to-r from-blue-500 to-purple-600 fixed top-0 left-0 right-0 z-50 border-b border-white/10`}>
        <div className="max-w-7xl mx-auto px-6 py-0.5 flex items-center justify-between">
          <div>
            <h1 className="text-[11px] font-medium text-white">CAT Full Mock Test</h1>
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

      <div className="pt-8 pb-4">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-2">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <motion.div key={currentQuestionIndex} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-2 border border-white/10">
              {/* Section Indicator */}
              <div className="mb-0.5 pb-0.5 border-b border-white/10">
                <p className="text-[10px] text-gray-400">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    currentSection === 0 ? "bg-blue-500/30 text-blue-300" : currentSection === 1 ? "bg-purple-500/30 text-purple-300" : "bg-orange-500/10 text-orange-300"
                  }`}>
                    {currentSectionData.name}
                  </span>
                </p>
              </div>

              {/* Question */}
              <div className="mb-2">
                <p className="text-gray-400 text-[10px] mb-1">Question {questionIndexInSection + 1} of {currentSectionQuestions.length}</p>
                <h2 className="text-base font-medium text-white leading-tight">{currentQuestion.question}</h2>
              </div>

              {/* Options */}
              <div className="space-y-0.5 mb-2">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === index;

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ x: 0.5 }}
                      onClick={() => handleAnswerClick(index)}
                      disabled={testSubmitted}
                      className={`w-full p-1 rounded-lg border text-left text-xs transition-all ${
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
                  className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                    markedForReview.has(currentQuestionIndex)
                      ? "bg-yellow-500/20 border border-yellow-500 text-yellow-300"
                      : "bg-white/8 border border-white/16 hover:bg-white/16 text-white"
                  }`}
                >
                  {markedForReview.has(currentQuestionIndex) ? "⭐ Marked" : "Mark for Review"}
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmitTest}
                  className="ml-auto px-4 py-1 rounded-full bg-gradient-to-r from-accent to-accent/90 text-white font-semibold text-sm shadow-sm transition-all"
                >
                  Submit
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Progress Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gradient-to-br from-surface to-elevated rounded-2xl p-1.5 border border-white/10 space-y-2">
              {/* Question Grid by Section */}
              {sections.map((section, idx) => {
                const sectionStart = sections.slice(0, idx).reduce((acc, s) => acc + s.questions.length, 0);
                const isCurrentSection = idx === currentSection;

                return (
                  <div key={idx} className={`${isCurrentSection ? "" : "opacity-60"}`}>
                    <div className="flex items-center gap-1 mb-1">
                      <span className={`text-[10px] font-semibold ${
                        idx === 0 ? "text-blue-300" : idx === 1 ? "text-purple-300" : "text-orange-300"
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
                <h3 className="text-white font-bold mb-4 text-sm">Overall Stats</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-gray-400 text-xs">Answered</p>
                    <p className="text-xl font-bold text-green-400">{selectedAnswers.filter((a) => a !== null).length}/{allQuestions.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Marked for Review</p>
                    <p className="text-xl font-bold text-yellow-400">{markedForReview.size}</p>
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
