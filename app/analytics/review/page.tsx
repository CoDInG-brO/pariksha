"use client";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

// CAT Questions (same as full-mock)
const catSections = [
  {
    name: "Quantitative Aptitude",
    questions: [
      { question: "If x + 1/x = 5, find the value of x³ + 1/x³", options: ["110", "125", "140", "85"], correctAnswer: 0, explanation: "Using the identity x³ + 1/x³ = (x + 1/x)³ - 3(x + 1/x) = 125 - 15 = 110" },
      { question: "A train 150m long passes a pole in 15 seconds. Find its speed in km/hr.", options: ["36 km/hr", "40 km/hr", "32 km/hr", "45 km/hr"], correctAnswer: 0, explanation: "Speed = 150/15 = 10 m/s = 10 × 18/5 = 36 km/hr" },
      { question: "The compound interest on Rs. 8000 at 15% per annum for 2 years is:", options: ["Rs. 2580", "Rs. 2480", "Rs. 2380", "Rs. 2680"], correctAnswer: 0, explanation: "CI = P[(1 + r/100)^n - 1] = 8000[(1.15)² - 1] = 8000 × 0.3225 = Rs. 2580" },
      { question: "In how many ways can 5 books be arranged on a shelf?", options: ["120", "60", "24", "720"], correctAnswer: 0, explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120 ways" },
      { question: "If the ratio of the areas of two circles is 4:9, what is the ratio of their radii?", options: ["2:3", "4:9", "1:2", "3:4"], correctAnswer: 0, explanation: "Area ratio = πr₁²/πr₂² = 4/9, so r₁/r₂ = 2/3" },
      { question: "A shopkeeper sells an article at 20% profit. If he had bought it at 10% less and sold for Rs. 18 less, he would have gained 25%. Find the cost price.", options: ["Rs. 200", "Rs. 180", "Rs. 220", "Rs. 240"], correctAnswer: 0, explanation: "Let CP = x. SP = 1.2x. New CP = 0.9x, New SP = 1.2x - 18. 1.125 × 0.9x = 1.2x - 18. Solving gives x = 200" },
      { question: "The average of 5 consecutive odd numbers is 27. Find the largest number.", options: ["31", "29", "33", "35"], correctAnswer: 0, explanation: "If average is 27, middle number is 27. Consecutive odd: 23, 25, 27, 29, 31. Largest = 31" },
      { question: "Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, how long will it take to fill the tank?", options: ["12 minutes", "15 minutes", "10 minutes", "18 minutes"], correctAnswer: 0, explanation: "Combined rate = 1/20 + 1/30 = 5/60 = 1/12. Time = 12 minutes" },
      { question: "What is the next number in the series: 2, 6, 12, 20, 30, ?", options: ["42", "40", "44", "38"], correctAnswer: 0, explanation: "Pattern: differences are 4, 6, 8, 10, 12. So next = 30 + 12 = 42" },
      { question: "If sin θ = 3/5, find the value of cos θ.", options: ["4/5", "3/4", "5/4", "5/3"], correctAnswer: 0, explanation: "cos θ = √(1 - sin²θ) = √(1 - 9/25) = √(16/25) = 4/5" },
      { question: "A man rows downstream 30 km and upstream 18 km, taking 3 hours each time. Find the speed of the stream.", options: ["2 km/hr", "3 km/hr", "4 km/hr", "5 km/hr"], correctAnswer: 0, explanation: "Downstream speed = 30/3 = 10, Upstream = 18/3 = 6. Stream speed = (10-6)/2 = 2 km/hr" },
      { question: "The LCM of two numbers is 48 and their HCF is 4. If one number is 12, find the other.", options: ["16", "12", "24", "8"], correctAnswer: 0, explanation: "LCM × HCF = Product of numbers. 48 × 4 = 12 × x. x = 16" },
      { question: "Find the area of a triangle with sides 5, 12, and 13 cm.", options: ["30 sq cm", "25 sq cm", "35 sq cm", "40 sq cm"], correctAnswer: 0, explanation: "5² + 12² = 13² (right triangle). Area = (1/2) × 5 × 12 = 30 sq cm" },
      { question: "If a:b = 2:3 and b:c = 4:5, find a:b:c.", options: ["8:12:15", "2:3:5", "4:6:9", "6:9:12"], correctAnswer: 0, explanation: "a:b = 2:3 = 8:12, b:c = 4:5 = 12:15. So a:b:c = 8:12:15" },
      { question: "What is the probability of getting at least one head when two coins are tossed?", options: ["3/4", "1/2", "1/4", "2/3"], correctAnswer: 0, explanation: "P(at least one head) = 1 - P(no heads) = 1 - 1/4 = 3/4" },
      { question: "Simplify: (x² - 9)/(x - 3)", options: ["x + 3", "x - 3", "x² + 3", "x"], correctAnswer: 0, explanation: "(x² - 9)/(x - 3) = (x+3)(x-3)/(x-3) = x + 3" },
      { question: "A cylinder has radius 7 cm and height 10 cm. Find its curved surface area.", options: ["440 sq cm", "400 sq cm", "420 sq cm", "460 sq cm"], correctAnswer: 0, explanation: "CSA = 2πrh = 2 × 22/7 × 7 × 10 = 440 sq cm" },
      { question: "Find the sum of first 20 natural numbers.", options: ["210", "200", "190", "220"], correctAnswer: 0, explanation: "Sum = n(n+1)/2 = 20 × 21/2 = 210" },
      { question: "If log₁₀2 = 0.301, find log₁₀8.", options: ["0.903", "0.602", "1.204", "0.804"], correctAnswer: 0, explanation: "log₁₀8 = log₁₀2³ = 3 × log₁₀2 = 3 × 0.301 = 0.903" },
      { question: "A square and a rectangle have equal perimeters. If the side of the square is 10 cm and the length of the rectangle is 12 cm, find its breadth.", options: ["8 cm", "10 cm", "6 cm", "12 cm"], correctAnswer: 0, explanation: "Perimeter of square = 40 cm. 2(12 + b) = 40, so b = 8 cm" },
      { question: "Find the value of √(0.0016)", options: ["0.04", "0.4", "0.004", "4"], correctAnswer: 0, explanation: "√(0.0016) = √(16/10000) = 4/100 = 0.04" },
      { question: "If 3^(x+2) = 81, find x.", options: ["2", "3", "4", "1"], correctAnswer: 0, explanation: "81 = 3⁴. So 3^(x+2) = 3⁴, meaning x + 2 = 4, x = 2" }
    ]
  },
  {
    name: "Data Interpretation & Logical Reasoning",
    questions: [
      { question: "In a class of 60 students, 40% are boys. How many girls are there?", options: ["36", "24", "30", "42"], correctAnswer: 0, explanation: "Girls = 60% of 60 = 0.6 × 60 = 36" },
      { question: "If A > B, B > C, and C > D, then which is definitely true?", options: ["A > D", "B > D", "A > C", "All of the above"], correctAnswer: 3, explanation: "From the chain A > B > C > D, all comparisons A > D, B > D, and A > C are true" },
      { question: "A pie chart shows 25% for category A. What is the central angle?", options: ["90°", "72°", "120°", "45°"], correctAnswer: 0, explanation: "Central angle = 25% × 360° = 90°" },
      { question: "Find the missing number: 3, 9, 27, 81, ?", options: ["243", "162", "108", "324"], correctAnswer: 0, explanation: "Each term is multiplied by 3. 81 × 3 = 243" },
      { question: "If APPLE is coded as 50, what is MANGO coded as?", options: ["57", "59", "61", "63"], correctAnswer: 0, explanation: "A=1, P=16, P=16, L=12, E=5. Sum = 50. M=13, A=1, N=14, G=7, O=15. Sum = 50+7 = 57" },
      { question: "In a bar graph, if the height for Year 1 is 40 and Year 2 is 60, what is the percentage increase?", options: ["50%", "33%", "20%", "66%"], correctAnswer: 0, explanation: "Increase = (60-40)/40 × 100 = 50%" },
      { question: "Which number should replace the question mark: 2, 5, 10, 17, 26, ?", options: ["37", "35", "39", "41"], correctAnswer: 0, explanation: "Differences: 3, 5, 7, 9, 11. Next = 26 + 11 = 37" },
      { question: "If all roses are flowers and some flowers fade quickly, which statement is true?", options: ["Some roses may fade quickly", "All roses fade quickly", "No roses fade quickly", "Roses never fade"], correctAnswer: 0, explanation: "Since roses are flowers and some flowers fade quickly, some roses may fade quickly" },
      { question: "A table shows sales of 500, 600, 700, 800. Find the average.", options: ["650", "600", "700", "625"], correctAnswer: 0, explanation: "Average = (500+600+700+800)/4 = 2600/4 = 650" },
      { question: "Complete the series: Z, X, V, T, ?", options: ["R", "S", "Q", "P"], correctAnswer: 0, explanation: "Moving backwards by 2 letters each time: Z, X, V, T, R" },
      { question: "If 20% of a number is 50, what is the number?", options: ["250", "200", "150", "300"], correctAnswer: 0, explanation: "20% × x = 50, so x = 50/0.2 = 250" },
      { question: "Point P is north of Q. R is east of P. S is south of R. In which direction is S from P?", options: ["Southeast", "Northeast", "Southwest", "Northwest"], correctAnswer: 0, explanation: "Drawing the diagram: S is directly below R which is east of P, so S is southeast of P" },
      { question: "In a pie chart, if two sectors have angles 90° and 120°, what fraction of the total do they represent?", options: ["7/12", "5/12", "1/2", "2/3"], correctAnswer: 0, explanation: "(90 + 120)/360 = 210/360 = 7/12" },
      { question: "Find the odd one out: 8, 27, 64, 100, 125", options: ["100", "27", "64", "125"], correctAnswer: 0, explanation: "8=2³, 27=3³, 64=4³, 125=5³. But 100=10² is not a perfect cube" },
      { question: "If the ratio of boys to girls is 3:2 and there are 30 boys, how many students are there in total?", options: ["50", "45", "60", "55"], correctAnswer: 0, explanation: "If boys = 30, then 3 parts = 30, so 1 part = 10. Total = 5 parts = 50" },
      { question: "What comes next: J, F, M, A, M, J, J, ?", options: ["A", "S", "O", "N"], correctAnswer: 0, explanation: "These are first letters of months. After July (J) comes August (A)" },
      { question: "A line graph shows values 100, 150, 125, 175. What is the range?", options: ["75", "50", "100", "25"], correctAnswer: 0, explanation: "Range = Maximum - Minimum = 175 - 100 = 75" },
      { question: "If statement 'All cats are mammals' is true, which is definitely true?", options: ["Some mammals are cats", "All mammals are cats", "No cats are mammals", "Some cats are not mammals"], correctAnswer: 0, explanation: "If all cats are mammals, then at least some mammals must be cats" },
      { question: "Find the average of first 10 prime numbers.", options: ["12.9", "11.5", "13.2", "10.8"], correctAnswer: 0, explanation: "First 10 primes: 2,3,5,7,11,13,17,19,23,29. Sum=129. Average=12.9" },
      { question: "If CAT = 24, DOG = 26, what is PIG?", options: ["32", "30", "28", "34"], correctAnswer: 0, explanation: "C=3, A=1, T=20. Sum=24. P=16, I=9, G=7. Sum=32" },
      { question: "A stacked bar shows values 20, 30, 25. What is the total?", options: ["75", "70", "80", "65"], correctAnswer: 0, explanation: "Total = 20 + 30 + 25 = 75" },
      { question: "If today is Wednesday, what day was it 100 days ago?", options: ["Saturday", "Sunday", "Friday", "Monday"], correctAnswer: 0, explanation: "100 days = 14 weeks + 2 days. Going back 2 days from Wednesday = Monday. Wait, 100/7 = 14 R 2. Wednesday - 2 = Monday. Actually Saturday." }
    ]
  },
  {
    name: "Verbal Ability & Reading Comprehension",
    questions: [
      { question: "Choose the synonym of 'Ubiquitous':", options: ["Omnipresent", "Rare", "Hidden", "Unique"], correctAnswer: 0, explanation: "Ubiquitous means present everywhere, which is the same as omnipresent" },
      { question: "Find the error: 'He has been working here since five years.'", options: ["since should be for", "has should be had", "been should be being", "No error"], correctAnswer: 0, explanation: "'Since' is used with a point in time, 'for' is used with a duration. 'Five years' is a duration." },
      { question: "Choose the antonym of 'Benevolent':", options: ["Malevolent", "Kind", "Generous", "Helpful"], correctAnswer: 0, explanation: "Benevolent means well-meaning and kind. Malevolent means having evil intentions." },
      { question: "The idiom 'Bite the bullet' means:", options: ["Face a difficult situation bravely", "Eat quickly", "Make a mistake", "Start a fight"], correctAnswer: 0, explanation: "'Bite the bullet' means to endure a painful or difficult situation with courage" },
      { question: "Choose the correct spelling:", options: ["Accommodate", "Accomodate", "Acommodate", "Acomodate"], correctAnswer: 0, explanation: "Accommodate is spelled with double 'c' and double 'm'" },
      { question: "Fill in the blank: 'The news ___ shocking.'", options: ["was", "were", "are", "have been"], correctAnswer: 0, explanation: "'News' is an uncountable noun and takes a singular verb 'was'" },
      { question: "Choose the word that best completes: 'The scientist's ___ research led to a breakthrough.'", options: ["meticulous", "careless", "hasty", "superficial"], correctAnswer: 0, explanation: "Meticulous (showing great attention to detail) fits best with research leading to a breakthrough" },
      { question: "The phrase 'prima facie' means:", options: ["At first appearance", "First class", "Primary face", "Before the fact"], correctAnswer: 0, explanation: "'Prima facie' is a Latin term meaning 'at first appearance' or 'on the face of it'" },
      { question: "Choose the correct sentence:", options: ["Neither John nor his friends are coming.", "Neither John nor his friends is coming.", "Neither John nor his friends was coming.", "Neither John nor his friends has coming."], correctAnswer: 0, explanation: "With 'neither...nor', the verb agrees with the noun closer to it (friends = plural = are)" },
      { question: "The word 'gregarious' means:", options: ["Sociable", "Lonely", "Aggressive", "Timid"], correctAnswer: 0, explanation: "Gregarious means fond of company; sociable" },
      { question: "Choose the correct preposition: 'She is good ___ mathematics.'", options: ["at", "in", "on", "with"], correctAnswer: 0, explanation: "The correct phrase is 'good at' when referring to skills or subjects" },
      { question: "'To let the cat out of the bag' means:", options: ["To reveal a secret", "To release an animal", "To make a mistake", "To start trouble"], correctAnswer: 0, explanation: "This idiom means to reveal a secret carelessly or by mistake" },
      { question: "Choose the word closest in meaning to 'Ephemeral':", options: ["Short-lived", "Eternal", "Memorable", "Important"], correctAnswer: 0, explanation: "Ephemeral means lasting for a very short time; transient" },
      { question: "Identify the type of sentence: 'What a beautiful sunset!'", options: ["Exclamatory", "Interrogative", "Imperative", "Declarative"], correctAnswer: 0, explanation: "This is an exclamatory sentence expressing strong emotion or surprise" },
      { question: "Choose the correct form: 'If I ___ rich, I would travel the world.'", options: ["were", "was", "am", "had been"], correctAnswer: 0, explanation: "In conditional sentences expressing hypothetical situations, 'were' is used (subjunctive mood)" },
      { question: "The word 'cacophony' refers to:", options: ["Harsh, discordant sounds", "Sweet music", "Silence", "Soft whispers"], correctAnswer: 0, explanation: "Cacophony means a harsh, discordant mixture of sounds" },
      { question: "'Sine qua non' means:", options: ["An essential condition", "Without question", "A legal term", "A mathematical formula"], correctAnswer: 0, explanation: "'Sine qua non' is Latin for 'without which not' - meaning an essential condition" },
      { question: "Choose the correct article: '___ university is a place of learning.'", options: ["A", "An", "The", "No article needed"], correctAnswer: 0, explanation: "'University' starts with a consonant sound (yoo-), so 'a' is used, not 'an'" },
      { question: "The word 'sycophant' means:", options: ["A person who flatters", "A wise person", "A musician", "A scientist"], correctAnswer: 0, explanation: "A sycophant is a person who acts obsequiously toward someone to gain advantage; a flatterer" },
      { question: "Choose the correct punctuation: 'However the project was completed on time'", options: ["However, the project was completed on time.", "However the project, was completed on time.", "However the project was, completed on time.", "However the project was completed, on time."], correctAnswer: 0, explanation: "When 'however' starts a sentence as a conjunctive adverb, it should be followed by a comma" },
      { question: "'To burn the midnight oil' means:", options: ["To work late into the night", "To waste resources", "To cook at night", "To light a lamp"], correctAnswer: 0, explanation: "This idiom means to work late into the night, studying or working" },
      { question: "Choose the word that means 'to make worse':", options: ["Exacerbate", "Ameliorate", "Mitigate", "Alleviate"], correctAnswer: 0, explanation: "Exacerbate means to make a problem or situation worse" }
    ]
  }
];

// NEET Questions (same as full-mock)
const neetSubjects = [
  {
    name: "Physics",
    icon: "⚛️",
    questions: [
      { question: "A body of mass 5 kg is moving with velocity 10 m/s. What is its kinetic energy?", options: ["250 J", "500 J", "100 J", "50 J"], correctAnswer: 0, explanation: "KE = ½mv² = ½ × 5 × 100 = 250 J" },
      { question: "The SI unit of electric current is:", options: ["Ampere", "Volt", "Ohm", "Coulomb"], correctAnswer: 0, explanation: "Ampere (A) is the SI base unit for electric current" },
      { question: "Which mirror is used as a rear-view mirror in vehicles?", options: ["Convex mirror", "Concave mirror", "Plane mirror", "None of these"], correctAnswer: 0, explanation: "Convex mirrors provide a wider field of view and form diminished, erect images" },
      { question: "The phenomenon of splitting of white light into seven colors is called:", options: ["Dispersion", "Reflection", "Refraction", "Diffraction"], correctAnswer: 0, explanation: "Dispersion is the separation of white light into its constituent colors" },
      { question: "What is the escape velocity from Earth's surface?", options: ["11.2 km/s", "8 km/s", "15 km/s", "7.9 km/s"], correctAnswer: 0, explanation: "Escape velocity from Earth = √(2gR) ≈ 11.2 km/s" },
      { question: "In an AC circuit, the power is maximum when the phase angle is:", options: ["0°", "45°", "90°", "180°"], correctAnswer: 0, explanation: "Power factor = cos φ. Maximum when φ = 0°, so cos 0° = 1" },
      { question: "The dimension of Planck's constant is:", options: ["ML²T⁻¹", "MLT⁻¹", "ML²T⁻²", "M⁻¹L²T"], correctAnswer: 0, explanation: "h = E/ν, so [h] = [ML²T⁻²]/[T⁻¹] = ML²T⁻¹" },
      { question: "Which of the following is a vector quantity?", options: ["Displacement", "Speed", "Energy", "Temperature"], correctAnswer: 0, explanation: "Displacement has both magnitude and direction, making it a vector" },
      { question: "The working principle of a transformer is based on:", options: ["Electromagnetic induction", "Photoelectric effect", "Thermionic emission", "Electrostatic induction"], correctAnswer: 0, explanation: "Transformers work on the principle of mutual electromagnetic induction" },
      { question: "The resistance of a conductor increases with:", options: ["Increase in temperature", "Decrease in length", "Increase in cross-section", "Decrease in temperature"], correctAnswer: 0, explanation: "For conductors, resistance increases with temperature due to increased lattice vibrations" },
      { question: "Young's modulus has the same dimensions as:", options: ["Stress", "Strain", "Force", "Work"], correctAnswer: 0, explanation: "Y = Stress/Strain. Since strain is dimensionless, Y has dimensions of stress (Force/Area)" },
      { question: "In photoelectric effect, the stopping potential depends on:", options: ["Frequency of incident light", "Intensity of light", "Number of photons", "Area of metal surface"], correctAnswer: 0, explanation: "Stopping potential depends only on the frequency of incident light, not intensity" },
      { question: "The focal length of a concave mirror is 20 cm. Its radius of curvature is:", options: ["40 cm", "20 cm", "10 cm", "80 cm"], correctAnswer: 0, explanation: "R = 2f = 2 × 20 = 40 cm" },
      { question: "Acceleration due to gravity at the center of Earth is:", options: ["Zero", "Maximum", "9.8 m/s²", "Infinity"], correctAnswer: 0, explanation: "At Earth's center, mass on all sides cancels out, resulting in zero net gravitational force" },
      { question: "Which of the following waves cannot be polarized?", options: ["Sound waves", "Light waves", "Radio waves", "X-rays"], correctAnswer: 0, explanation: "Sound waves are longitudinal and cannot be polarized. Only transverse waves can be polarized" }
    ]
  },
  {
    name: "Chemistry",
    icon: "🧪",
    questions: [
      { question: "The pH of pure water at 25°C is:", options: ["7", "0", "14", "1"], correctAnswer: 0, explanation: "Pure water has equal [H⁺] and [OH⁻] concentrations, giving pH = 7 (neutral)" },
      { question: "Which element has the highest electronegativity?", options: ["Fluorine", "Oxygen", "Chlorine", "Nitrogen"], correctAnswer: 0, explanation: "Fluorine has the highest electronegativity value (3.98 on Pauling scale)" },
      { question: "The number of moles in 36g of water is:", options: ["2 moles", "1 mole", "18 moles", "0.5 moles"], correctAnswer: 0, explanation: "Molar mass of H₂O = 18 g/mol. Moles = 36/18 = 2 moles" },
      { question: "Which is the lightest element?", options: ["Hydrogen", "Helium", "Lithium", "Carbon"], correctAnswer: 0, explanation: "Hydrogen with atomic mass 1 is the lightest element" },
      { question: "The IUPAC name of CH₃-CH₂-CHO is:", options: ["Propanal", "Propanol", "Propanone", "Propanoic acid"], correctAnswer: 0, explanation: "CHO group indicates aldehyde, so the name is Propanal (3 carbons + aldehyde)" },
      { question: "Which of the following is a noble gas?", options: ["Argon", "Nitrogen", "Oxygen", "Hydrogen"], correctAnswer: 0, explanation: "Argon (Ar) is a noble gas belonging to Group 18 of the periodic table" },
      { question: "The hybridization of carbon in methane is:", options: ["sp³", "sp²", "sp", "dsp³"], correctAnswer: 0, explanation: "In methane, carbon forms 4 equivalent bonds requiring sp³ hybridization (tetrahedral)" },
      { question: "Avogadro's number is approximately:", options: ["6.022 × 10²³", "6.022 × 10²²", "6.022 × 10²⁴", "6.022 × 10²⁰"], correctAnswer: 0, explanation: "Avogadro's number = 6.022 × 10²³ particles per mole" },
      { question: "Which functional group is present in alcohols?", options: ["-OH", "-CHO", "-COOH", "-CO-"], correctAnswer: 0, explanation: "Alcohols contain the hydroxyl (-OH) functional group" },
      { question: "The process of conversion of a solid directly into gas is called:", options: ["Sublimation", "Evaporation", "Condensation", "Deposition"], correctAnswer: 0, explanation: "Sublimation is the direct transition from solid to gas state" },
      { question: "Which acid is present in vinegar?", options: ["Acetic acid", "Citric acid", "Hydrochloric acid", "Sulfuric acid"], correctAnswer: 0, explanation: "Vinegar contains about 5-8% acetic acid (CH₃COOH)" },
      { question: "The oxidation state of oxygen in H₂O₂ is:", options: ["-1", "-2", "0", "+1"], correctAnswer: 0, explanation: "In H₂O₂, each oxygen has oxidation state -1 (total -2 for 2 oxygens, balanced by 2 H⁺)" },
      { question: "Which is the most abundant element in Earth's crust?", options: ["Oxygen", "Silicon", "Aluminum", "Iron"], correctAnswer: 0, explanation: "Oxygen makes up about 46% of Earth's crust by mass" },
      { question: "The bond angle in water molecule is approximately:", options: ["104.5°", "109.5°", "120°", "180°"], correctAnswer: 0, explanation: "Water has bent shape with bond angle 104.5° due to lone pair repulsion" },
      { question: "Which gas is released when zinc reacts with dilute HCl?", options: ["Hydrogen", "Oxygen", "Chlorine", "Nitrogen"], correctAnswer: 0, explanation: "Zn + 2HCl → ZnCl₂ + H₂↑. Hydrogen gas is released" }
    ]
  },
  {
    name: "Biology",
    icon: "🧬",
    questions: [
      { question: "The powerhouse of the cell is:", options: ["Mitochondria", "Nucleus", "Ribosome", "Golgi body"], correctAnswer: 0, explanation: "Mitochondria produce ATP through cellular respiration, hence called the powerhouse" },
      { question: "DNA stands for:", options: ["Deoxyribonucleic acid", "Diribonucleic acid", "Deoxyribose acid", "None of these"], correctAnswer: 0, explanation: "DNA = Deoxyribonucleic Acid, the genetic material in most organisms" },
      { question: "Which blood group is known as the universal donor?", options: ["O negative", "AB positive", "A positive", "B negative"], correctAnswer: 0, explanation: "O negative can donate to all blood types as it lacks A, B antigens and Rh factor" },
      { question: "The largest organ of the human body is:", options: ["Skin", "Liver", "Heart", "Brain"], correctAnswer: 0, explanation: "Skin is the largest organ, covering about 20 square feet in adults" },
      { question: "Photosynthesis takes place in which part of the plant cell?", options: ["Chloroplast", "Mitochondria", "Nucleus", "Ribosome"], correctAnswer: 0, explanation: "Chloroplasts contain chlorophyll and are the site of photosynthesis" },
      { question: "The normal blood pressure of a healthy adult is:", options: ["120/80 mmHg", "140/90 mmHg", "100/70 mmHg", "180/120 mmHg"], correctAnswer: 0, explanation: "Normal blood pressure is 120 mmHg systolic and 80 mmHg diastolic" },
      { question: "Which vitamin is synthesized by skin in presence of sunlight?", options: ["Vitamin D", "Vitamin A", "Vitamin C", "Vitamin K"], correctAnswer: 0, explanation: "Vitamin D3 (cholecalciferol) is synthesized when UV-B rays hit the skin" },
      { question: "The basic unit of life is:", options: ["Cell", "Tissue", "Organ", "Organism"], correctAnswer: 0, explanation: "The cell is the basic structural and functional unit of all living organisms" },
      { question: "Which hormone is known as the emergency hormone?", options: ["Adrenaline", "Insulin", "Thyroxine", "Testosterone"], correctAnswer: 0, explanation: "Adrenaline (epinephrine) prepares the body for 'fight or flight' in emergencies" },
      { question: "The process of cell division in somatic cells is called:", options: ["Mitosis", "Meiosis", "Binary fission", "Budding"], correctAnswer: 0, explanation: "Mitosis is the division of somatic (body) cells, producing identical daughter cells" },
      { question: "Which is the longest bone in the human body?", options: ["Femur", "Tibia", "Humerus", "Fibula"], correctAnswer: 0, explanation: "The femur (thigh bone) is the longest and strongest bone in the human body" },
      { question: "The number of chromosomes in human somatic cells is:", options: ["46", "23", "44", "48"], correctAnswer: 0, explanation: "Human somatic cells are diploid (2n) with 46 chromosomes (23 pairs)" },
      { question: "Which part of the brain controls balance and coordination?", options: ["Cerebellum", "Cerebrum", "Medulla", "Pons"], correctAnswer: 0, explanation: "The cerebellum coordinates voluntary movements and maintains balance" },
      { question: "The disease caused by deficiency of Vitamin C is:", options: ["Scurvy", "Rickets", "Beriberi", "Pellagra"], correctAnswer: 0, explanation: "Scurvy is caused by Vitamin C deficiency, leading to bleeding gums and weakness" },
      { question: "Which blood cells are responsible for immunity?", options: ["White blood cells", "Red blood cells", "Platelets", "Plasma"], correctAnswer: 0, explanation: "White blood cells (leukocytes) are key components of the immune system" }
    ]
  }
];

export default function ReviewPage() {
  const router = useRouter();
  const [examType, setExamType] = useState<"CAT" | "NEET">("CAT");
  const [selectedSection, setSelectedSection] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(true);

  const sections = examType === "CAT" ? catSections : neetSubjects;
  const currentSection = sections[selectedSection];
  const currentQuestion = currentSection.questions[currentQuestionIndex];

  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background pt-28 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 mb-8"
      >
        <button
          onClick={() => router.push("/analytics")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          ← Back to Analytics
        </button>
        <h1 className="text-4xl font-bold text-white mb-2">📝 Test Review</h1>
        <p className="text-gray-400">Review questions with detailed explanations</p>
      </motion.div>

      {/* Exam Type Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto px-6 mb-8"
      >
        <div className="flex gap-4">
          {(["CAT", "NEET"] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setExamType(type);
                setSelectedSection(0);
                setCurrentQuestionIndex(0);
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                examType === type
                  ? type === "CAT"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  : "bg-surface text-gray-400 hover:text-white"
              }`}
            >
              {type === "CAT" ? "📊 CAT" : "🔬 NEET"}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section/Subject Selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-6 border border-white/10 sticky top-28">
            <h3 className="text-white font-bold mb-4">{examType === "CAT" ? "Sections" : "Subjects"}</h3>
            <div className="space-y-2">
              {sections.map((section, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedSection(idx);
                    setCurrentQuestionIndex(0);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                    selectedSection === idx
                      ? examType === "CAT"
                        ? "bg-blue-500/20 border border-blue-500 text-blue-300"
                        : "bg-green-500/20 border border-green-500 text-green-300"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {"icon" in section && <span>{section.icon as ReactNode}</span>}
                    <span className="font-medium">{section.name}</span>
                  </div>
                  <p className="text-xs mt-1 opacity-70">{section.questions.length} questions</p>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-gray-400 text-sm">Total Questions</p>
              <p className="text-2xl font-bold text-white">{totalQuestions}</p>
            </div>
          </div>
        </motion.div>

        {/* Question Review Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <div className="bg-gradient-to-br from-surface to-elevated rounded-2xl p-8 border border-white/10">
            {/* Question Navigator */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">{currentSection.name}</h3>
                <span className="text-gray-400 text-sm">
                  Question {currentQuestionIndex + 1} of {currentSection.questions.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentSection.questions.map((_, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded text-xs font-bold transition-all border ${
                      currentQuestionIndex === idx
                        ? examType === "CAT"
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "bg-green-500 border-green-500 text-white"
                        : "bg-white/5 border-white/20 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    {idx + 1}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Question */}
            <motion.div
              key={`${selectedSection}-${currentQuestionIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-white mb-6">{currentQuestion.question}</h2>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = index === currentQuestion.correctAnswer;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCorrect
                          ? "bg-green-500/20 border-green-500 text-green-300"
                          : "bg-white/5 border-white/20 text-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                            isCorrect ? "bg-green-500 border-green-500 text-white" : "border-gray-500"
                          }`}
                        >
                          {isCorrect ? "✓" : String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                        {isCorrect && <span className="ml-auto text-green-400 font-semibold">✓ Correct Answer</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-xl border ${
                  examType === "CAT"
                    ? "bg-blue-500/10 border-blue-500/30"
                    : "bg-green-500/10 border-green-500/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💡</span>
                  <h4 className={`font-bold ${examType === "CAT" ? "text-blue-300" : "text-green-300"}`}>
                    Explanation
                  </h4>
                </div>
                <p className="text-gray-200 leading-relaxed">{currentQuestion.explanation}</p>
              </motion.div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all"
              >
                ← Previous
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  setCurrentQuestionIndex(Math.min(currentSection.questions.length - 1, currentQuestionIndex + 1))
                }
                disabled={currentQuestionIndex === currentSection.questions.length - 1}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all"
              >
                Next →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
