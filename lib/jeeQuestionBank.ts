export type JEESubject = "physics" | "chemistry" | "mathematics";

export interface JEEQuestion {
  id: number;
  section: JEESubject;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const jeeQuestionBank: JEEQuestion[] = [
  // Physics
  {
    id: 1,
    section: "physics",
    question: "A 4 kg block is pulled by a horizontal 20 N force on a frictionless surface. What is its acceleration?",
    options: ["2.0 m/s^2", "3.0 m/s^2", "4.0 m/s^2", "5.0 m/s^2"],
    correctAnswer: 3,
    explanation: "Use F = ma, so a = 20 / 4 = 5.0 m/s^2."
  },
  {
    id: 2,
    section: "physics",
    question: "A 2 kg object moves at 10 m/s. What is its kinetic energy?",
    options: ["40 J", "50 J", "80 J", "100 J"],
    correctAnswer: 3,
    explanation: "KE = 1/2 mv^2 = 0.5 * 2 * 100 = 100 J."
  },
  {
    id: 3,
    section: "physics",
    question: "Two resistors of 3 ohm and 6 ohm are connected in series with a 12 V battery. What current flows through the circuit?",
    options: ["0.5 A", "1.0 A", "1.33 A", "2.0 A"],
    correctAnswer: 2,
    explanation: "Req = 9 ohm, so I = V / R = 12 / 9 = 1.33 A."
  },
  {
    id: 4,
    section: "physics",
    question: "Two resistors of 4 ohm and 12 ohm are connected in parallel across a 9 V source. What is the total current drawn?",
    options: ["1.5 A", "2.0 A", "2.5 A", "3.0 A"],
    correctAnswer: 3,
    explanation: "Req = (4*12)/(4+12) = 3 ohm, so I = 9 / 3 = 3 A."
  },
  {
    id: 5,
    section: "physics",
    question: "A projectile is launched at 20 m/s making 30 deg with the horizontal. What is the time of flight? (g = 10 m/s^2)",
    options: ["1 s", "2 s", "3 s", "4 s"],
    correctAnswer: 1,
    explanation: "T = (2u sin theta)/g = (40 * 0.5)/10 = 2 s."
  },
  {
    id: 6,
    section: "physics",
    question: "An object is placed 30 cm in front of a convex lens of focal length 15 cm. Where is the image formed?",
    options: ["15 cm", "30 cm", "45 cm", "60 cm"],
    correctAnswer: 1,
    explanation: "Lens formula 1/f = 1/v - 1/u so 1/15 = 1/v + 1/30, giving v = 30 cm (real image)."
  },
  {
    id: 7,
    section: "physics",
    question: "A 0.5 kg mass is attached to a spring with k = 200 N/m. What is the frequency of oscillation?",
    options: ["1.6 Hz", "3.2 Hz", "5.0 Hz", "6.4 Hz"],
    correctAnswer: 1,
    explanation: "f = (1/(2pi)) * sqrt(k/m) = (1/(2pi)) * sqrt(400) approx 3.2 Hz."
  },
  {
    id: 8,
    section: "physics",
    question: "A string 2 m long has a mass of 10 g and is under 40 N tension. What is the speed of a transverse wave on it?",
    options: ["40 m/s", "60 m/s", "80 m/s", "90 m/s"],
    correctAnswer: 3,
    explanation: "mu = 0.01/2 = 0.005 kg/m; v = sqrt(T/mu) = sqrt(40/0.005) approx 89 m/s."
  },
  {
    id: 9,
    section: "physics",
    question: "What is the magnetic field at the center of a circular loop of radius 0.20 m carrying 5 A? (mu0 = 4pi * 10^-7 T*m/A)",
    options: ["1.6 * 10^-5 T", "3.1 * 10^-5 T", "6.3 * 10^-5 T", "1.0 * 10^-4 T"],
    correctAnswer: 0,
    explanation: "B = mu0 I / (2R) = (4pi*10^-7 * 5)/(0.4) approx 1.6 * 10^-5 T."
  },
  {
    id: 10,
    section: "physics",
    question: "Capacitors of 6 uF and 3 uF are connected in series across 12 V. What is the charge on each capacitor?",
    options: ["12 uC", "18 uC", "24 uC", "36 uC"],
    correctAnswer: 2,
    explanation: "Ceq = (6*3)/(6+3) = 2 uF, so Q = Ceq * V = 24 uC. Series caps share the same charge."
  },
  {
    id: 11,
    section: "physics",
    question: "An ideal gas expands isothermally from 3 L to 6 L at 2 atm. What is the final pressure?",
    options: ["0.5 atm", "1 atm", "1.5 atm", "2 atm"],
    correctAnswer: 1,
    explanation: "Boyle's law: P1V1 = P2V2 so 2*3 = P2*6, which gives P2 = 1 atm."
  },
  {
    id: 12,
    section: "physics",
    question: "A car moving at 20 m/s brakes uniformly at 5 m/s^2. What distance does it take to stop?",
    options: ["20 m", "30 m", "40 m", "50 m"],
    correctAnswer: 2,
    explanation: "Use v^2 = u^2 + 2as so 0 = 400 - 10s, leading to s = 40 m."
  },
  {
    id: 13,
    section: "physics",
    question: "A simple pendulum has length 1 m (g = 10 m/s^2). What is its time period?",
    options: ["1.4 s", "2.0 s", "2.5 s", "3.1 s"],
    correctAnswer: 1,
    explanation: "T = 2pi * sqrt(l/g) = 2pi * sqrt(0.1) approx 2.0 s."
  },
  {
    id: 14,
    section: "physics",
    question: "A particle in SHM has amplitude 5 cm and maximum speed 1.5 m/s. What is its angular frequency?",
    options: ["10 rad/s", "15 rad/s", "30 rad/s", "45 rad/s"],
    correctAnswer: 2,
    explanation: "vmax = omega * A so omega = 1.5 / 0.05 = 30 rad/s."
  },
  {
    id: 15,
    section: "physics",
    question: "A radioactive sample has half-life 10 minutes. From 16 g, how much remains after 30 minutes?",
    options: ["2 g", "4 g", "6 g", "8 g"],
    correctAnswer: 0,
    explanation: "30 minutes equal 3 half-lives, so mass = 16 / 2^3 = 2 g."
  },
  {
    id: 16,
    section: "physics",
    question: "A long solenoid has 500 turns in 0.5 m and carries 3 A. What is the magnetic field inside?",
    options: ["1.9 * 10^-3 T", "2.8 * 10^-3 T", "3.8 * 10^-3 T", "4.8 * 10^-3 T"],
    correctAnswer: 2,
    explanation: "n = 1000 m^-1, B = mu0 n I = 4pi*10^-7 * 1000 * 3 approx 3.8 * 10^-3 T."
  },
  {
    id: 17,
    section: "physics",
    question: "A coil of 50 turns and area 0.02 m^2 lies in a field that changes from 0 to 0.3 T in 0.1 s. What emf is induced?",
    options: ["1.5 V", "3.0 V", "4.5 V", "6.0 V"],
    correctAnswer: 1,
    explanation: "emf = N A deltaB / delta t = 50 * 0.02 * 0.3 / 0.1 = 3 V."
  },
  {
    id: 18,
    section: "physics",
    question: "Two positive charges +4 uC and +1 uC are 0.30 m apart. What is the electrostatic force between them?",
    options: ["0.04 N", "0.2 N", "0.4 N", "0.8 N"],
    correctAnswer: 2,
    explanation: "F = k q1 q2 / r^2 = 9*10^9 * 4*10^-6 * 1*10^-6 / 0.09 approx 0.4 N."
  },
  {
    id: 19,
    section: "physics",
    question: "A metal plate of area 0.02 m^2 is 5 m below the water surface. What is the force due to water on the plate? (rho = 1000 kg/m^3, g = 10 m/s^2)",
    options: ["200 N", "400 N", "600 N", "1000 N"],
    correctAnswer: 3,
    explanation: "F = rho g h A = 1000 * 10 * 5 * 0.02 = 1000 N."
  },
  {
    id: 20,
    section: "physics",
    question: "An electron has momentum 3.0 * 10^-24 kg*m/s. What is its de Broglie wavelength? (h = 6.63 * 10^-34 J*s)",
    options: ["0.11 nm", "0.22 nm", "0.44 nm", "0.88 nm"],
    correctAnswer: 1,
    explanation: "lambda = h/p = 6.63*10^-34 / 3*10^-24 approx 2.2*10^-10 m = 0.22 nm."
  },

  // Chemistry
  {
    id: 21,
    section: "chemistry",
    question: "How many moles are present in 11 g of CO2? (Molar mass = 44 g/mol)",
    options: ["0.20 mol", "0.25 mol", "0.30 mol", "0.40 mol"],
    correctAnswer: 1,
    explanation: "n = mass / molar mass = 11 / 44 = 0.25 mol."
  },
  {
    id: 22,
    section: "chemistry",
    question: "What volume will 2 moles of an ideal gas occupy at STP (22.4 L/mol)?",
    options: ["11.2 L", "22.4 L", "33.6 L", "44.8 L"],
    correctAnswer: 3,
    explanation: "V = n * 22.4 = 2 * 22.4 = 44.8 L."
  },
  {
    id: 23,
    section: "chemistry",
    question: "For a reaction with DeltaH = -40 kJ and DeltaS = -50 J/mol*K at 500 K, what is DeltaG?",
    options: ["-65 kJ", "-15 kJ", "0 kJ", "+15 kJ"],
    correctAnswer: 1,
    explanation: "DeltaG = DeltaH - T*DeltaS = -40 kJ - 500*(-0.05 kJ/K) = -15 kJ."
  },
  {
    id: 24,
    section: "chemistry",
    question: "The rate constant of a second-order reaction has what units?",
    options: ["s^-1", "mol*L^-1*s^-1", "L*mol^-1*s^-1", "L^2*mol^-2*s^-1"],
    correctAnswer: 2,
    explanation: "For second order overall, k has units of L*mol^-1*s^-1."
  },
  {
    id: 25,
    section: "chemistry",
    question: "What is the pH of a 1.0 * 10^-4 M HCl solution?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 2,
    explanation: "Strong acid: pH = -log[H+] = 4."
  },
  {
    id: 26,
    section: "chemistry",
    question: "If Ksp of AgCl is 1.7 * 10^-10, what is the molar solubility in pure water?",
    options: ["4.1 * 10^-6 M", "1.3 * 10^-5 M", "2.5 * 10^-5 M", "4.1 * 10^-5 M"],
    correctAnswer: 1,
    explanation: "For AgCl, s^2 = Ksp so s = sqrt(1.7*10^-10) approx 1.3*10^-5 M."
  },
  {
    id: 27,
    section: "chemistry",
    question: "What is the oxidation state of Co in [Co(NH3)6]Cl3?",
    options: ["0", "+1", "+2", "+3"],
    correctAnswer: 3,
    explanation: "Complex is overall +3 to balance 3 Cl^-; NH3 is neutral, so Co is +3."
  },
  {
    id: 28,
    section: "chemistry",
    question: "What is the hybridization of each carbon atom in ethyne (C2H2)?",
    options: ["sp", "sp2", "sp3", "sp3d"],
    correctAnswer: 0,
    explanation: "Each carbon forms two sigma bonds and two pi bonds, so the hybridization is sp."
  },
  {
    id: 29,
    section: "chemistry",
    question: "What is the standard emf of the cell Zn | Zn2+ || Cu2+ | Cu? (EZn = -0.76 V, ECu = +0.34 V)",
    options: ["0.34 V", "0.76 V", "1.10 V", "1.40 V"],
    correctAnswer: 2,
    explanation: "Ecell = Ecathode - Eanode = 0.34 - (-0.76) = 1.10 V."
  },
  {
    id: 30,
    section: "chemistry",
    question: "Oxidation of ethanol with acidified K2Cr2O7 gives which major product?",
    options: ["Methanol", "Ethanal", "Acetic acid", "Acetone"],
    correctAnswer: 2,
    explanation: "Primary alcohol oxidizes to aldehyde and then to carboxylic acid (acetic acid)."
  },
  {
    id: 31,
    section: "chemistry",
    question: "Caprolactam is the monomer used to form which polymer?",
    options: ["Nylon-6", "Teflon", "Bakelite", "PVC"],
    correctAnswer: 0,
    explanation: "Caprolactam polymerizes to form Nylon-6."
  },
  {
    id: 32,
    section: "chemistry",
    question: "Which amino acid lacks a chiral carbon atom?",
    options: ["Alanine", "Valine", "Glycine", "Serine"],
    correctAnswer: 2,
    explanation: "Glycine has -H as its side chain, so the alpha carbon is achiral."
  },
  {
    id: 33,
    section: "chemistry",
    question: "Arrange B, C, N, O in increasing order of first ionization enthalpy.",
    options: ["B < C < N < O", "B < O < C < N", "B < C < O < N", "C < B < O < N"],
    correctAnswer: 2,
    explanation: "Due to half-filled stability, order is B < C < O < N."
  },
  {
    id: 34,
    section: "chemistry",
    question: "Which type of adsorption is dominated by van der Waals interactions?",
    options: ["Chemisorption", "Physisorption", "Ion exchange", "Catalytic adsorption"],
    correctAnswer: 1,
    explanation: "Physisorption arises from weak van der Waals forces."
  },
  {
    id: 35,
    section: "chemistry",
    question: "Which is a colligative property?",
    options: ["Refractive index", "Surface tension", "Depression in freezing point", "Viscosity"],
    correctAnswer: 2,
    explanation: "Colligative properties depend on solute particle number; DeltaTf is one such property."
  },
  {
    id: 36,
    section: "chemistry",
    question: "A first-order reaction has a half-life of 30 minutes. What is its rate constant?",
    options: ["0.010 min^-1", "0.019 min^-1", "0.023 min^-1", "0.030 min^-1"],
    correctAnswer: 2,
    explanation: "k = 0.693 / t1/2 = 0.693 / 30 approx 0.023 min^-1."
  },
  {
    id: 37,
    section: "chemistry",
    question: "A weak acid (Ka = 1.0 * 10^-5) at 0.10 M concentration has [H+] approximately equal to?",
    options: ["1.0 * 10^-2 M", "1.0 * 10^-3 M", "1.0 * 10^-4 M", "1.0 * 10^-5 M"],
    correctAnswer: 1,
    explanation: "[H+] approx sqrt(Ka * C) = sqrt(1*10^-6) = 1*10^-3 M."
  },
  {
    id: 38,
    section: "chemistry",
    question: "Which reagent distinguishes aldehydes from ketones in aqueous solution?",
    options: ["Fehling's solution", "Grignard reagent", "Lindlar catalyst", "H2/Pd"],
    correctAnswer: 0,
    explanation: "Fehling's (or Tollen's) test is positive for aldehydes but not for ketones."
  },
  {
    id: 39,
    section: "chemistry",
    question: "What is the coordination number of Na+ in a rock salt (NaCl) structure?",
    options: ["4", "6", "8", "12"],
    correctAnswer: 1,
    explanation: "NaCl adopts octahedral coordination; CN of both ions is 6."
  },
  {
    id: 40,
    section: "chemistry",
    question: "In electrolytic refining of copper, which electrode is pure copper deposited on?",
    options: ["Anode", "Cathode", "Both electrodes", "In solution"],
    correctAnswer: 1,
    explanation: "Pure copper plates at the cathode while the impure slab is the anode."
  },

  // Mathematics
  {
    id: 41,
    section: "mathematics",
    question: "What is the derivative of x^3 evaluated at x = 2?",
    options: ["6", "8", "12", "18"],
    correctAnswer: 2,
    explanation: "d/dx (x^3) = 3x^2 so 3*4 = 12."
  },
  {
    id: 42,
    section: "mathematics",
    question: "Evaluate ∫0^2 3x^2 dx.",
    options: ["6", "8", "10", "12"],
    correctAnswer: 1,
    explanation: "Integral = x^3 from 0 to 2 = 8."
  },
  {
    id: 43,
    section: "mathematics",
    question: "lim (x→0) (sin x)/x equals?",
    options: ["0", "1", "∞", "Does not exist"],
    correctAnswer: 1,
    explanation: "Standard limit: sin x / x tends to 1 as x approaches 0."
  },
  {
    id: 44,
    section: "mathematics",
    question: "What is the probability of getting a sum of 9 when two dice are rolled?",
    options: ["1/6", "1/9", "1/12", "1/18"],
    correctAnswer: 1,
    explanation: "Favorable pairs (3,6),(4,5),(5,4),(6,3) give 4/36 = 1/9."
  },
  {
    id: 45,
    section: "mathematics",
    question: "The determinant of [[2,3],[1,4]] equals?",
    options: ["2", "5", "6", "8"],
    correctAnswer: 1,
    explanation: "ad - bc = 2*4 - 3*1 = 5."
  },
  {
    id: 46,
    section: "mathematics",
    question: "Find the dot product of (2, -1, 3) and (1, 4, 2).",
    options: ["2", "4", "6", "8"],
    correctAnswer: 1,
    explanation: "(2)(1) + (-1)(4) + (3)(2) = 2 - 4 + 6 = 4."
  },
  {
    id: 47,
    section: "mathematics",
    question: "What is the modulus of the complex number 3 - 4i?",
    options: ["3", "4", "5", "7"],
    correctAnswer: 2,
    explanation: "|z| = sqrt(3^2 + (-4)^2) = 5."
  },
  {
    id: 48,
    section: "mathematics",
    question: "Equation of the circle with center (1, -2) and radius 3 is?",
    options: ["x^2 + y^2 = 9", "(x+1)^2 + (y-2)^2 = 9", "(x-1)^2 + (y+2)^2 = 9", "(x-3)^2 + (y+1)^2 = 9"],
    correctAnswer: 2,
    explanation: "Standard form (x - h)^2 + (y - k)^2 = r^2 leads to (x-1)^2 + (y+2)^2 = 9."
  },
  {
    id: 49,
    section: "mathematics",
    question: "Sum of the first four terms of a GP with a = 2 and r = 3 is?",
    options: ["20", "40", "80", "162"],
    correctAnswer: 2,
    explanation: "S4 = a(1 - r^4)/(1 - r) = 2(1 - 81)/(1 - 3) = 80."
  },
  {
    id: 50,
    section: "mathematics",
    question: "Evaluate 10C4.",
    options: ["120", "180", "210", "252"],
    correctAnswer: 2,
    explanation: "10C4 = 10!/(4!6!) = 210."
  },
  {
    id: 51,
    section: "mathematics",
    question: "Compute the integral from 0 to pi/2 of cos x dx.",
    options: ["0", "1", "2", "pi/2"],
    correctAnswer: 1,
    explanation: "Integral equals sin x evaluated between 0 and pi/2, which is 1."
  },
  {
    id: 52,
    section: "mathematics",
    question: "Solve dy/dx = 3x^2.",
    options: ["y = x^3 + C", "y = x^2 + C", "y = 3x + C", "y = 3x^2 + C"],
    correctAnswer: 0,
    explanation: "Integrate: y = ∫3x^2 dx = x^3 + C."
  },
  {
    id: 53,
    section: "mathematics",
    question: "How many distinct permutations are possible for the word LEVEL?",
    options: ["12", "24", "30", "60"],
    correctAnswer: 2,
    explanation: "5!/(2!2!) = 120/4 = 30 arrangements."
  },
  {
    id: 54,
    section: "mathematics",
    question: "Evaluate tan^2 45 deg - sec^2 30 deg.",
    options: ["-1/3", "0", "1/3", "1"],
    correctAnswer: 0,
    explanation: "tan45 = 1 so tan^2 = 1; sec30 = 2/sqrt(3) so sec^2 = 4/3, giving 1 - 4/3 = -1/3."
  },
  {
    id: 55,
    section: "mathematics",
    question: "Slope of the line joining (1, 2) and (3, 7) is?",
    options: ["2", "5/2", "3", "7/3"],
    correctAnswer: 1,
    explanation: "m = (7 - 2)/(3 - 1) = 5/2."
  },
  {
    id: 56,
    section: "mathematics",
    question: "Find the inverse of f(x) = 2x + 3.",
    options: ["(x + 3)/2", "(x - 3)/2", "2x - 3", "-2x + 3"],
    correctAnswer: 1,
    explanation: "Set y = 2x + 3, giving x = (y - 3)/2, so f^{-1}(x) = (x - 3)/2."
  },
  {
    id: 57,
    section: "mathematics",
    question: "Evaluate the sum Σ_{k=1}^{5} k.",
    options: ["10", "12", "14", "15"],
    correctAnswer: 3,
    explanation: "Sum of first five natural numbers = 15."
  },
  {
    id: 58,
    section: "mathematics",
    question: "Solve the inequality 2x - 5 > 7.",
    options: ["x > 5", "x > 6", "x > 7", "x > 8"],
    correctAnswer: 1,
    explanation: "2x > 12 implies x > 6."
  },
  {
    id: 59,
    section: "mathematics",
    question: "Roots of x^2 - 5x + 6 = 0 are?",
    options: ["1 and 6", "2 and 3", "3 and 4", "2 and 4"],
    correctAnswer: 1,
    explanation: "Factor (x - 2)(x - 3) = 0 to get roots 2 and 3."
  },
  {
    id: 60,
    section: "mathematics",
    question: "Probability of drawing an ace from a standard 52-card deck is?",
    options: ["1/52", "1/26", "1/13", "1/4"],
    correctAnswer: 2,
    explanation: "There are four aces, so 4/52 = 1/13."
  }
];
