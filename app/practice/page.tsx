"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  savePracticeProgress,
  getPracticeProgress,
  clearPracticeProgress,
  PracticeProgress
} from "@/lib/testStorage";

// Sample question banks
const catQuestions = [
  {
    id: 1,
    question: "A train travels from A to B at 60 km/hr and returns at 40 km/hr. What is the average speed for the entire journey?",
    options: ["48 km/hr", "50 km/hr", "52 km/hr", "45 km/hr"],
    answer: "48 km/hr",
    explanation: "Average speed = 2×60×40/(60+40) = 4800/100 = 48 km/hr. For equal distances, average speed is the harmonic mean."
  },
  {
    id: 2,
    question: "If the ratio of the ages of A and B is 3:5 and the sum of their ages is 64 years, what is B's age?",
    options: ["24 years", "40 years", "32 years", "36 years"],
    answer: "40 years",
    explanation: "Let ages be 3x and 5x. So 3x + 5x = 64, x = 8. B's age = 5×8 = 40 years."
  },
  {
    id: 3,
    question: "Find the next number in the series: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    answer: "42",
    explanation: "The pattern is n(n+1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, 6×7=42."
  },
  {
    id: 4,
    question: "A shopkeeper marks up his goods by 40% and then offers a discount of 20%. What is his profit percentage?",
    options: ["12%", "15%", "18%", "20%"],
    answer: "12%",
    explanation: "Let CP = 100. MP = 140. SP after 20% discount = 140 × 0.8 = 112. Profit = 12%."
  },
  {
    id: 5,
    question: "In how many ways can 5 boys and 3 girls be seated in a row such that no two girls sit together?",
    options: ["14400", "7200", "3600", "2400"],
    answer: "14400",
    explanation: "First arrange 5 boys in 5! ways. Then place 3 girls in 6 gaps in 6P3 ways. Total = 120 × 120 = 14400."
  },
  {
    id: 6,
    question: "The compound interest on Rs. 8000 at 10% per annum for 2 years is:",
    options: ["Rs. 1600", "Rs. 1680", "Rs. 1700", "Rs. 1720"],
    answer: "Rs. 1680",
    explanation: "CI = P[(1+r/100)^n - 1] = 8000[(1.1)² - 1] = 8000 × 0.21 = Rs. 1680."
  },
  {
    id: 7,
    question: "Choose the word most similar in meaning to 'EPHEMERAL':",
    options: ["Eternal", "Transient", "Permanent", "Lasting"],
    answer: "Transient",
    explanation: "Ephemeral means lasting for a very short time, same as transient."
  },
  {
    id: 8,
    question: "A pipe can fill a tank in 12 hours. Due to a leak, it takes 15 hours. How long will the leak take to empty a full tank?",
    options: ["60 hours", "45 hours", "50 hours", "55 hours"],
    answer: "60 hours",
    explanation: "Pipe fills 1/12 per hour. With leak, net rate = 1/15 per hour. Leak rate = 1/12 - 1/15 = (5-4)/60 = 1/60. So leak empties tank in 60 hours."
  },
  {
    id: 9,
    question: "If log₁₀2 = 0.301, find the number of digits in 2⁶⁴:",
    options: ["19", "20", "21", "22"],
    answer: "20",
    explanation: "Number of digits = [64 × 0.301] + 1 = [19.264] + 1 = 19 + 1 = 20."
  },
  {
    id: 10,
    question: "The probability that A speaks truth is 3/5 and that of B is 4/7. What is the probability that they contradict each other?",
    options: ["13/35", "17/35", "22/35", "18/35"],
    answer: "17/35",
    explanation: "P(contradict) = P(A true, B false) + P(A false, B true) = (3/5)(3/7) + (2/5)(4/7) = 9/35 + 8/35 = 17/35."
  },
  {
    id: 11,
    question: "Which of the following is the correct passive form of: 'They are building a new bridge.'?",
    options: ["A new bridge is built by them.", "A new bridge is being built by them.", "A new bridge was being built.", "A new bridge has been built."],
    answer: "A new bridge is being built by them.",
    explanation: "Present continuous passive: is/are + being + past participle."
  },
  {
    id: 12,
    question: "A and B invest in a business in the ratio 3:4. If 5% of the total profit goes to charity and A's share is Rs. 855, find the total profit.",
    options: ["Rs. 2000", "Rs. 2100", "Rs. 2200", "Rs. 2400"],
    answer: "Rs. 2100",
    explanation: "Let total profit = P. After charity, distributable = 0.95P. A's share = 3/7 × 0.95P = 855. P = 2100."
  },
  {
    id: 13,
    question: "Find the odd one out: Lion, Tiger, Leopard, Bear, Cheetah",
    options: ["Lion", "Tiger", "Bear", "Cheetah"],
    answer: "Bear",
    explanation: "All except Bear are members of the cat family (Felidae)."
  },
  {
    id: 14,
    question: "If CLOUD is coded as DMPVE, how is RAIN coded?",
    options: ["SBJO", "SBJM", "RBJN", "TCKP"],
    answer: "SBJO",
    explanation: "Each letter is shifted by +1. R→S, A→B, I→J, N→O."
  },
  {
    id: 15,
    question: "A man rows upstream at 8 km/hr and downstream at 12 km/hr. Find the speed of the stream.",
    options: ["2 km/hr", "3 km/hr", "4 km/hr", "5 km/hr"],
    answer: "2 km/hr",
    explanation: "Speed of stream = (downstream - upstream)/2 = (12-8)/2 = 2 km/hr."
  },
  {
    id: 16,
    question: "What is the LCM of 12, 18, and 24?",
    options: ["72", "96", "108", "144"],
    answer: "72",
    explanation: "LCM(12,18,24) = 72. Prime factorization: 12=2²×3, 18=2×3², 24=2³×3. LCM = 2³×3² = 72."
  },
  {
    id: 17,
    question: "A cylinder has radius 7 cm and height 14 cm. Find its curved surface area.",
    options: ["308 cm²", "616 cm²", "924 cm²", "462 cm²"],
    answer: "616 cm²",
    explanation: "CSA = 2πrh = 2 × 22/7 × 7 × 14 = 616 cm²."
  },
  {
    id: 18,
    question: "Choose the correct meaning of the idiom 'To burn the midnight oil':",
    options: ["To waste resources", "To work late at night", "To create problems", "To travel at night"],
    answer: "To work late at night",
    explanation: "This idiom means to study or work late into the night."
  },
  {
    id: 19,
    question: "In a class of 40 students, 25 play cricket and 20 play football. If 10 play both, how many play neither?",
    options: ["5", "10", "15", "0"],
    answer: "5",
    explanation: "Using set theory: n(C∪F) = 25 + 20 - 10 = 35. Neither = 40 - 35 = 5."
  },
  {
    id: 20,
    question: "A car depreciates by 10% every year. If its current value is Rs. 4,05,000, what was it 2 years ago?",
    options: ["Rs. 5,00,000", "Rs. 4,50,000", "Rs. 4,95,000", "Rs. 5,50,000"],
    answer: "Rs. 5,00,000",
    explanation: "Original × 0.9² = 4,05,000. Original = 4,05,000/0.81 = Rs. 5,00,000."
  },
  {
    id: 21,
    question: "If 2x + 3y = 12 and 3x + 2y = 13, find x + y:",
    options: ["4", "5", "6", "7"],
    answer: "5",
    explanation: "Adding both equations: 5x + 5y = 25, so x + y = 5."
  },
  {
    id: 22,
    question: "The angle of elevation of a tower from a point 100m away is 45°. Find the height of the tower.",
    options: ["100 m", "50 m", "75 m", "150 m"],
    answer: "100 m",
    explanation: "tan 45° = height/100. Since tan 45° = 1, height = 100 m."
  },
  {
    id: 23,
    question: "Choose the correctly spelled word:",
    options: ["Accomodation", "Accommodation", "Acomodation", "Acommodation"],
    answer: "Accommodation",
    explanation: "Accommodation is spelled with double 'c' and double 'm'."
  },
  {
    id: 24,
    question: "A cone has radius 6 cm and slant height 10 cm. Find its total surface area.",
    options: ["96π cm²", "72π cm²", "84π cm²", "108π cm²"],
    answer: "96π cm²",
    explanation: "TSA = πr(l+r) = π×6×(10+6) = 96π cm²."
  },
  {
    id: 25,
    question: "If the selling price is doubled, the profit triples. Find the profit percentage.",
    options: ["100%", "50%", "66.67%", "75%"],
    answer: "100%",
    explanation: "Let CP = x, SP = y, Profit = y-x. New: 2y - x = 3(y-x). Solving: y = 2x. Profit% = 100%."
  },
  {
    id: 26,
    question: "What is the remainder when 17²³ is divided by 16?",
    options: ["0", "1", "15", "8"],
    answer: "1",
    explanation: "17 ≡ 1 (mod 16), so 17²³ ≡ 1²³ ≡ 1 (mod 16)."
  },
  {
    id: 27,
    question: "A rectangle has perimeter 40 cm and area 96 cm². Find its length.",
    options: ["12 cm", "14 cm", "16 cm", "8 cm"],
    answer: "12 cm",
    explanation: "l + b = 20, lb = 96. Solving: l = 12 cm, b = 8 cm."
  },
  {
    id: 28,
    question: "Choose the antonym of 'VERBOSE':",
    options: ["Wordy", "Concise", "Lengthy", "Elaborate"],
    answer: "Concise",
    explanation: "Verbose means using more words than needed. Concise is the opposite."
  },
  {
    id: 29,
    question: "A sum becomes Rs. 1100 in 2 years and Rs. 1200 in 3 years at simple interest. Find the principal.",
    options: ["Rs. 800", "Rs. 900", "Rs. 1000", "Rs. 850"],
    answer: "Rs. 900",
    explanation: "SI for 1 year = 1200 - 1100 = 100. SI for 2 years = 200. Principal = 1100 - 200 = 900."
  },
  {
    id: 30,
    question: "In a race of 1000m, A beats B by 100m. In a race of 800m, by how much will A beat B?",
    options: ["80 m", "90 m", "100 m", "75 m"],
    answer: "80 m",
    explanation: "When A runs 1000m, B runs 900m. Ratio = 10:9. For 800m by A, B runs 720m. Margin = 80m."
  },
  {
    id: 31,
    question: "Find the value of √(12 + √12 + √12 + ...)",
    options: ["3", "4", "5", "6"],
    answer: "4",
    explanation: "Let x = √(12 + x). x² = 12 + x. x² - x - 12 = 0. x = 4 (positive root)."
  },
  {
    id: 32,
    question: "A statement followed by two assumptions: Statement: 'Please do not park in front of the gate.' Assumption I: There is a gate. Assumption II: People may park there.",
    options: ["Only I is implicit", "Only II is implicit", "Both are implicit", "Neither is implicit"],
    answer: "Both are implicit",
    explanation: "The statement assumes both the existence of a gate and the possibility of parking."
  },
  {
    id: 33,
    question: "If sin θ = 3/5, find the value of tan θ:",
    options: ["3/4", "4/3", "5/4", "4/5"],
    answer: "3/4",
    explanation: "sin θ = 3/5 means opposite = 3, hypotenuse = 5. Adjacent = 4. tan θ = 3/4."
  },
  {
    id: 34,
    question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
    options: ["0°", "7.5°", "15°", "22.5°"],
    answer: "7.5°",
    explanation: "At 3:15, minute hand at 90°, hour hand at 90° + 7.5° = 97.5°. Angle = 7.5°."
  },
  {
    id: 35,
    question: "Complete the analogy: Book : Author :: Statue : ?",
    options: ["Mason", "Sculptor", "Painter", "Architect"],
    answer: "Sculptor",
    explanation: "A book is created by an author; a statue is created by a sculptor."
  },
  {
    id: 36,
    question: "The HCF of two numbers is 12 and their LCM is 144. If one number is 48, find the other.",
    options: ["36", "24", "72", "96"],
    answer: "36",
    explanation: "HCF × LCM = Product of numbers. 12 × 144 = 48 × x. x = 36."
  },
  {
    id: 37,
    question: "A mixture contains milk and water in ratio 5:3. How much water must be added to 40 liters of mixture to make ratio 1:1?",
    options: ["5 L", "8 L", "10 L", "12 L"],
    answer: "10 L",
    explanation: "Milk = 25L, Water = 15L. For 1:1, need 25L water. Add 25-15 = 10L."
  },
  {
    id: 38,
    question: "Choose the sentence with correct subject-verb agreement:",
    options: ["The team are playing well.", "The committee have decided.", "Neither of the boys are guilty.", "Each of the students has a book."],
    answer: "Each of the students has a book.",
    explanation: "'Each' takes a singular verb."
  },
  {
    id: 39,
    question: "If a:b = 2:3, b:c = 4:5, and c:d = 6:7, find a:d:",
    options: ["16:35", "8:35", "12:35", "14:35"],
    answer: "16:35",
    explanation: "a:b:c:d = 16:24:30:35. So a:d = 16:35."
  },
  {
    id: 40,
    question: "A sphere has volume 36π cm³. Find its surface area.",
    options: ["24π cm²", "36π cm²", "48π cm²", "72π cm²"],
    answer: "36π cm²",
    explanation: "V = 4/3πr³ = 36π. r³ = 27, r = 3. SA = 4πr² = 36π cm²."
  },
  {
    id: 41,
    question: "If x² + 1/x² = 7, find the value of x + 1/x:",
    options: ["2", "3", "4", "5"],
    answer: "3",
    explanation: "(x + 1/x)² = x² + 2 + 1/x² = 7 + 2 = 9. So x + 1/x = 3."
  },
  {
    id: 42,
    question: "A man invests Rs. 5000 at 8% per annum. After how many years will it become Rs. 5832?",
    options: ["2 years", "3 years", "4 years", "5 years"],
    answer: "2 years",
    explanation: "5000 × (1.08)ⁿ = 5832. (1.08)ⁿ = 1.1664 = (1.08)². n = 2."
  },
  {
    id: 43,
    question: "Choose the word that best completes: 'The manager was known for his _____ approach to problem-solving.'",
    options: ["pragmatic", "dogmatic", "erratic", "frantic"],
    answer: "pragmatic",
    explanation: "Pragmatic means practical and sensible, suitable for problem-solving."
  },
  {
    id: 44,
    question: "Two dice are thrown. What is the probability of getting a sum of 7?",
    options: ["1/6", "5/36", "1/12", "7/36"],
    answer: "1/6",
    explanation: "Favorable outcomes: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) = 6. Probability = 6/36 = 1/6."
  },
  {
    id: 45,
    question: "If the cost price of 15 items equals the selling price of 12 items, find the profit percentage.",
    options: ["20%", "25%", "30%", "33.33%"],
    answer: "25%",
    explanation: "15 CP = 12 SP. SP/CP = 15/12 = 1.25. Profit = 25%."
  },
  {
    id: 46,
    question: "Find the missing term: 3, 8, 15, 24, 35, ?",
    options: ["46", "48", "50", "52"],
    answer: "48",
    explanation: "Differences: 5, 7, 9, 11, 13. Next term = 35 + 13 = 48."
  },
  {
    id: 47,
    question: "A boat covers 24 km upstream in 6 hours and 24 km downstream in 4 hours. Find boat's speed in still water.",
    options: ["4 km/hr", "5 km/hr", "6 km/hr", "7 km/hr"],
    answer: "5 km/hr",
    explanation: "Upstream speed = 4 km/hr, Downstream = 6 km/hr. Boat speed = (4+6)/2 = 5 km/hr."
  },
  {
    id: 48,
    question: "Which word is most nearly opposite in meaning to 'BENEVOLENT'?",
    options: ["Kind", "Generous", "Malevolent", "Charitable"],
    answer: "Malevolent",
    explanation: "Benevolent means well-meaning and kind. Malevolent means wishing harm."
  },
  {
    id: 49,
    question: "A can complete a work in 10 days and B in 15 days. In how many days will they complete it together?",
    options: ["5 days", "6 days", "7 days", "8 days"],
    answer: "6 days",
    explanation: "Combined rate = 1/10 + 1/15 = 5/30 = 1/6. Time = 6 days."
  },
  {
    id: 50,
    question: "The area of a rhombus with diagonals 16 cm and 12 cm is:",
    options: ["96 cm²", "48 cm²", "192 cm²", "72 cm²"],
    answer: "96 cm²",
    explanation: "Area = (1/2) × d₁ × d₂ = (1/2) × 16 × 12 = 96 cm²."
  }
];

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
  const [selectedExam, setSelectedExam] = useState<"CAT" | "NEET" | null>(null);
  const [questions, setQuestions] = useState<typeof catQuestions>([]);
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

  const handleExamSelect = (exam: "CAT" | "NEET") => {
    setSelectedExam(exam);
    setShowAnswers({});
    setSelectedOptions({});
    
    // Shuffle and pick 50 questions
    const questionBank = exam === "CAT" ? catQuestions : neetQuestions;
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 50));
  };

  const toggleAnswer = (questionId: number) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleOptionSelect = (questionId: number, option: string) => {
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
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Practice Mode</h1>
          <p className="text-gray-400 mb-12 text-lg">Choose your exam to start practicing with random questions</p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {/* CAT Option */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExamSelect("CAT")}
              className="w-64 p-8 bg-gradient-to-br from-orange-500/20 to-red-500/10 rounded-2xl border border-orange-500/30 hover:border-orange-500/60 transition-all group"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                📊
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">CAT</h3>
              <p className="text-orange-300 text-sm">Quantitative, Verbal & Logical Reasoning</p>
            </motion.button>

            {/* NEET Option */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExamSelect("NEET")}
              className="w-64 p-8 bg-gradient-to-br from-green-500/20 to-teal-500/10 rounded-2xl border border-green-500/30 hover:border-green-500/60 transition-all group"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                🔬
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">NEET</h3>
              <p className="text-green-300 text-sm">Physics, Chemistry & Biology</p>
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Questions display
  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sticky top-20 bg-background/80 backdrop-blur-lg py-4 z-10 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button
            onClick={resetPractice}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{selectedExam} Practice</h1>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg ${selectedExam === "CAT" ? "bg-orange-500/20 text-orange-300" : "bg-green-500/20 text-green-300"}`}>
          {selectedExam}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((q, index) => (
          <>
            <motion.div
              key={q.id}
              ref={index === 2 ? thirdQuestionRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="bg-gradient-to-br from-surface to-elevated rounded-xl p-6 border border-white/10"
            >
            {/* Question */}
            <div className="flex gap-4 mb-4">
              <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                selectedExam === "CAT" ? "bg-orange-500/20 text-orange-300" : "bg-green-500/20 text-green-300"
              }`}>
                {index + 1}
              </span>
              <p className="text-white text-lg">{q.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-2 ml-12 mb-4">
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
                    onClick={() => !showAnswers[q.id] && handleOptionSelect(q.id, option)}
                    className={optionClass}
                  >
                    <span className="mr-3 text-gray-500">{String.fromCharCode(65 + optIndex)}.</span>
                    {option}
                    {showingAnswer && isCorrect && <span className="ml-2">✓</span>}
                  </div>
                );
              })}
            </div>

            {/* Show Answer Button */}
            <div className="ml-12">
              <button
                onClick={() => toggleAnswer(q.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showAnswers[q.id]
                    ? "bg-white/10 text-gray-300"
                    : selectedExam === "CAT"
                    ? "bg-orange-500/20 text-orange-300 hover:bg-orange-500/30"
                    : "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                }`}
              >
                {showAnswers[q.id] ? "Hide Answer" : "Show Answer"}
              </button>

              {/* Explanation */}
              {showAnswers[q.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-4 rounded-lg bg-black/30 border border-accent/20"
                >
                  <p className="text-sm text-gray-300">
                    <span className="text-accent font-medium">Explanation: </span>
                    {q.explanation}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
          </>
        ))}
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
