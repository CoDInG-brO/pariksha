/**
 * Percentile Calculation System for JEE and NEET Exams
 * This module calculates realistic percentiles based on score distributions
 */

interface PercentileResult {
  score: number;
  percentage: number;
  percentile: number;
  rank: number;
  totalCandidates: number;
  scoreDistribution: ScoreBreakdown;
  interpretation: string;
}

interface ScoreBreakdown {
  excellent: number; // 90+
  veryGood: number; // 75-89
  good: number; // 60-74
  average: number; // 50-59
  needsWork: number; // Below 50
}

/**
 * JEE Percentile Calculation
 * JEE (Main) Scoring: +4 for correct, -1 for wrong, 0 for unanswered
 * Total: 75 questions, 3 subjects
 * Max Score: 300
 */
export function calculateJEEPercentile(score: number): PercentileResult {
  const totalCandidates = 900000; // Approximate JEE Main takers per session
  
  const scoreRanges = [
    { minScore: 270, maxScore: 300, percentage: 0.5 },
    { minScore: 250, maxScore: 269, percentage: 1.5 },
    { minScore: 220, maxScore: 249, percentage: 3.5 },
    { minScore: 200, maxScore: 219, percentage: 7 },
    { minScore: 180, maxScore: 199, percentage: 15 },
    { minScore: 150, maxScore: 179, percentage: 30 },
    { minScore: 120, maxScore: 149, percentage: 50 },
    { minScore: 90, maxScore: 119, percentage: 70 },
    { minScore: 60, maxScore: 89, percentage: 85 },
    { minScore: 0, maxScore: 59, percentage: 100 }
  ];

  let percentile = 100;
  for (const range of scoreRanges) {
    if (score >= range.minScore && score <= range.maxScore) {
      percentile = range.percentage;
      break;
    }
  }

  const rank = Math.round((percentile / 100) * totalCandidates);
  const percentage = Math.round((score / 300) * 100);

  // Calculate score distribution
  const scoreDistribution: ScoreBreakdown = {
    excellent: percentage >= 90 ? percentage : 0,
    veryGood: percentage >= 75 && percentage < 90 ? percentage : 0,
    good: percentage >= 60 && percentage < 75 ? percentage : 0,
    average: percentage >= 50 && percentage < 60 ? percentage : 0,
    needsWork: percentage < 50 ? percentage : 0
  };

  const interpretation = getJEEInterpretation(percentile, score);

  return {
    score,
    percentage,
    percentile,
    rank,
    totalCandidates,
    scoreDistribution,
    interpretation
  };
}

/**
 * NEET Percentile Calculation
 * NEET Scoring: +4 for correct, -1 for wrong, 0 for unanswered
 * Total: 180 questions
 * Max Score: 720
 */
export function calculateNEETPercentile(score: number): PercentileResult {
  // Realistic NEET score distribution
  const totalCandidates = 1600000; // Approximate NEET takers per year

  // Score distribution percentages (cumulative)
  const scoreRanges = [
    { minScore: 680, maxScore: 720, percentage: 0.5 },
    { minScore: 650, maxScore: 679, percentage: 1.5 },
    { minScore: 620, maxScore: 649, percentage: 3.5 },
    { minScore: 600, maxScore: 619, percentage: 6 },
    { minScore: 580, maxScore: 599, percentage: 10 },
    { minScore: 560, maxScore: 579, percentage: 15 },
    { minScore: 540, maxScore: 559, percentage: 22 },
    { minScore: 520, maxScore: 539, percentage: 30 },
    { minScore: 500, maxScore: 519, percentage: 40 },
    { minScore: 450, maxScore: 499, percentage: 60 },
    { minScore: 400, maxScore: 449, percentage: 75 },
    { minScore: 0, maxScore: 399, percentage: 100 }
  ];

  let percentile = 0;
  for (const range of scoreRanges) {
    if (score >= range.minScore && score <= range.maxScore) {
      percentile = range.percentage;
      break;
    }
  }

  const rank = Math.round((percentile / 100) * totalCandidates);
  const percentage = Math.round((score / 720) * 100);

  // Calculate score distribution
  const scoreDistribution: ScoreBreakdown = {
    excellent: percentage >= 90 ? percentage : 0,
    veryGood: percentage >= 75 && percentage < 90 ? percentage : 0,
    good: percentage >= 60 && percentage < 75 ? percentage : 0,
    average: percentage >= 50 && percentage < 60 ? percentage : 0,
    needsWork: percentage < 50 ? percentage : 0
  };

  const interpretation = getNEETInterpretation(percentile, score);

  return {
    score,
    percentage,
    percentile,
    rank,
    totalCandidates,
    scoreDistribution,
    interpretation
  };
}

/**
 * JEE-specific interpretation
 */
function getJEEInterpretation(percentile: number, score: number): string {
  if (percentile <= 1) {
    return `🏆 Phenomenal! Score ${score}/300 keeps you in contention for IIT Bombay/Delhi core branches.`;
  } else if (percentile <= 5) {
    return `⭐ Excellent! Top 5% - IIT Bombay/Delhi for dual degrees or IIT Madras/Kharagpur for core.`;
  } else if (percentile <= 10) {
    return `💪 Great job! Top 10% - IIT Roorkee, IIT BHU and top NIT CSE are realistic targets.`;
  } else if (percentile <= 25) {
    return `✅ Solid score. NIT Trichy/Warangal/Surathkal branches or IIITs are well within reach.`;
  } else if (percentile <= 50) {
    return `📈 Average performance. Focus on improving accuracy for preferred NIT/IIIT branches.`;
  } else if (percentile <= 75) {
    return `⚠️ Needs work. Strengthen fundamentals and retake mocks to break into the top 25%.`;
  } else {
    return `❌ Restart with chapter-wise drills and revise NCERT thoroughly to climb the percentile ladder.`;
  }
}

/**
 * NEET-specific interpretation
 */
function getNEETInterpretation(percentile: number, score: number): string {
  if (percentile >= 99) {
    return `🏆 Outstanding! Score ${score}/720 is in the top 1% - AIIMS and top medical colleges secured.`;
  } else if (percentile >= 98) {
    return `⭐ Excellent performance! Top 2% - Strong chance at AIIMS and government medical colleges.`;
  } else if (percentile >= 95) {
    return `💪 Very good! Top 5% - AIIMS/Government medical college likely.`;
  } else if (percentile >= 90) {
    return `✅ Good score! Top 10% - Government medical college admission expected.`;
  } else if (percentile >= 75) {
    return `📈 Decent performance. Top 25% - Consider private medical colleges.`;
  } else if (percentile >= 50) {
    return `⚠️ Average score. Focus on Biology (50% of exam) and Biology could improve your score significantly.`;
  } else {
    return `❌ Significant preparation needed. Revisit NCERT and take more mocks.`;
  }
}

/**
 * Calculate subject-wise percentile for JEE
 */
export function calculateJEESectionPercentile(
  subjectName: string,
  score: number,
  maxScore: number
): PercentileResult {
  const percentage = Math.round((score / maxScore) * 100);
  
  const subjectPercentiles: Record<string, number[]> = {
    "Physics": [85, 70, 55, 40, 25],
    "Chemistry": [88, 72, 58, 45, 30],
    "Mathematics": [82, 65, 50, 35, 20]
  };

  const breakpoints = subjectPercentiles[subjectName] || [85, 70, 55, 40, 25];
  let percentile = 100;

  if (percentage >= breakpoints[0]) percentile = 5;
  else if (percentage >= breakpoints[1]) percentile = 20;
  else if (percentage >= breakpoints[2]) percentile = 40;
  else if (percentage >= breakpoints[3]) percentile = 65;
  else percentile = 85;

  return {
    score,
    percentage,
    percentile,
    rank: 0,
    totalCandidates: 0,
    scoreDistribution: {
      excellent: percentage >= 80 ? percentage : 0,
      veryGood: percentage >= 65 ? percentage : 0,
      good: percentage >= 45 ? percentage : 0,
      average: percentage >= 30 ? percentage : 0,
      needsWork: percentage
    },
    interpretation: `${subjectName} performance: ${percentage}% accuracy`
  };
}

/**
 * Calculate subject-wise percentile for NEET
 */
export function calculateNEETSubjectPercentile(
  subjectName: string,
  score: number,
  totalQuestions: number
): PercentileResult {
  const maxScore = totalQuestions * 4; // 4 marks per correct answer
  const percentage = Math.round((score / maxScore) * 100);

  // Subject-wise distributions
  const subjectBenchmarks: Record<string, number> = {
    "Physics": 0.25,
    "Chemistry": 0.25,
    "Biology": 0.5
  };

  // Calculate percentile based on subject importance and score
  let percentile = 50;
  if (percentage >= 90) percentile = 5;
  else if (percentage >= 80) percentile = 15;
  else if (percentage >= 70) percentile = 30;
  else if (percentage >= 60) percentile = 50;
  else if (percentage >= 50) percentile = 70;
  else percentile = 90;

  return {
    score,
    percentage,
    percentile,
    rank: 0,
    totalCandidates: 0,
    scoreDistribution: {
      excellent: percentage >= 85 ? percentage : 0,
      veryGood: percentage >= 70 ? percentage : 0,
      good: percentage >= 55 ? percentage : 0,
      average: percentage >= 40 ? percentage : 0,
      needsWork: percentage
    },
    interpretation: `${subjectName} performance: ${percentage}% accuracy`
  };
}

/**
 * Estimate college based on NEET score
 */
export function estimateCollegeCategory(percentile: number): string[] {
  if (percentile >= 99) {
    return ["AIIMS", "Top Government Medical Colleges", "Premium Private Colleges"];
  } else if (percentile >= 95) {
    return ["Government Medical Colleges", "Premium Private Colleges"];
  } else if (percentile >= 90) {
    return ["Government Medical Colleges", "Private Medical Colleges"];
  } else if (percentile >= 75) {
    return ["Private Medical Colleges", "Government Seats (Lower Rank)"];
  } else if (percentile >= 50) {
    return ["Deemed Universities", "Private Colleges"];
  } else {
    return ["Consider retaking or pursuing other healthcare fields"];
  }
}

/**
 * Estimate colleges based on JEE percentile
 */
export function estimateIITCategory(percentile: number): string[] {
  if (percentile <= 1) {
    return ["IIT Bombay", "IIT Delhi", "IIT Madras"];
  } else if (percentile <= 3) {
    return ["IIT Kharagpur", "IIT Kanpur", "IIT Roorkee"];
  } else if (percentile <= 5) {
    return ["IIT BHU", "IIT Guwahati", "IIT Hyderabad"];
  } else if (percentile <= 10) {
    return ["NIT Trichy", "NIT Warangal", "NIT Surathkal"];
  } else if (percentile <= 25) {
    return ["Top IIITs", "State Level GFTIs"];
  } else if (percentile <= 50) {
    return ["Mid-tier NITs", "Private Universities (CSE/IT)"];
  } else {
    return ["Consider JoSAA counseling for newer IIITs", "Retake with focused prep"];
  }
}
