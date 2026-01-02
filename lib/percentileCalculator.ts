/**
 * Percentile Calculation System for CAT and NEET Exams
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
 * CAT Percentile Calculation
 * CAT Scoring: +3 for correct, -1 for wrong, 0 for unanswered
 * Total: 66 questions, 3 sections
 * Max Score: 198
 */
export function calculateCATPercentile(score: number): PercentileResult {
  // Realistic CAT score distribution (based on actual exam patterns)
  const totalCandidates = 200000; // Approximate CAT takers per year
  
  // Score distribution percentages (cumulative)
  const scoreRanges = [
    { minScore: 180, maxScore: 198, percentage: 1 },
    { minScore: 160, maxScore: 179, percentage: 5 },
    { minScore: 140, maxScore: 159, percentage: 15 },
    { minScore: 120, maxScore: 139, percentage: 30 },
    { minScore: 100, maxScore: 119, percentage: 50 },
    { minScore: 80, maxScore: 99, percentage: 65 },
    { minScore: 60, maxScore: 79, percentage: 75 },
    { minScore: 40, maxScore: 59, percentage: 85 },
    { minScore: 20, maxScore: 39, percentage: 92 },
    { minScore: 0, maxScore: 19, percentage: 100 }
  ];

  let percentile = 0;
  for (const range of scoreRanges) {
    if (score >= range.minScore && score <= range.maxScore) {
      percentile = range.percentage;
      break;
    }
  }

  const rank = Math.round((percentile / 100) * totalCandidates);
  const percentage = Math.round((score / 198) * 100);

  // Calculate score distribution
  const scoreDistribution: ScoreBreakdown = {
    excellent: percentage >= 90 ? percentage : 0,
    veryGood: percentage >= 75 && percentage < 90 ? percentage : 0,
    good: percentage >= 60 && percentage < 75 ? percentage : 0,
    average: percentage >= 50 && percentage < 60 ? percentage : 0,
    needsWork: percentage < 50 ? percentage : 0
  };

  const interpretation = getCATInterpretation(percentile, score);

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
 * CAT-specific interpretation
 */
function getCATInterpretation(percentile: number, score: number): string {
  if (percentile >= 99) {
    return `🏆 Outstanding performance! Score ${score}/198 puts you in the top 1% - IIM A, B, C quota secured.`;
  } else if (percentile >= 95) {
    return `⭐ Excellent! Top 5% performance. Strong contender for IIM ABCs with additional criteria.`;
  } else if (percentile >= 90) {
    return `💪 Very good! Top 10% - IIM A, B, C shortlist likely.`;
  } else if (percentile >= 75) {
    return `✅ Good score! Top 25% - IIM L, I, K and other top B-schools likely.`;
  } else if (percentile >= 50) {
    return `📈 Average performance. Top 50% - Consider applying to newer IIMs and tier-2 B-schools.`;
  } else if (percentile >= 25) {
    return `⚠️ Below average. Consider retaking. Focus on weak areas.`;
  } else {
    return `❌ Significant improvement needed. Review concepts and retake.`;
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
 * Calculate section-wise percentile for CAT
 */
export function calculateCATSectionPercentile(
  sectionName: string,
  score: number,
  maxScore: number
): PercentileResult {
  // Each section has 22 questions, max 66 marks
  const percentage = Math.round((score / maxScore) * 100);
  
  // Approximate distribution for individual sections
  const sectionPercentiles: Record<string, number[]> = {
    "Quantitative": [88, 75, 60, 45, 30],
    "DI-LR": [85, 70, 55, 40, 25],
    "Verbal": [90, 78, 65, 50, 35]
  };

  const breakpoints = sectionPercentiles[sectionName] || [85, 70, 55, 40, 25];
  let percentile = 100;

  if (percentage >= breakpoints[0]) percentile = 5;
  else if (percentage >= breakpoints[1]) percentile = 25;
  else if (percentage >= breakpoints[2]) percentile = 50;
  else if (percentage >= breakpoints[3]) percentile = 75;
  else percentile = 90;

  return {
    score,
    percentage,
    percentile,
    rank: 0,
    totalCandidates: 0,
    scoreDistribution: {
      excellent: percentage >= 80 ? percentage : 0,
      veryGood: percentage >= 60 ? percentage : 0,
      good: percentage >= 40 ? percentage : 0,
      average: percentage >= 20 ? percentage : 0,
      needsWork: percentage
    },
    interpretation: `Section performance: ${percentage}% - ${percentile}th percentile in this section`
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
 * Estimate college based on CAT percentile
 */
export function estimateIIMCategory(percentile: number): string[] {
  if (percentile >= 99.5) {
    return ["IIM A", "IIM B", "IIM C"];
  } else if (percentile >= 99) {
    return ["IIM A", "IIM B", "IIM C", "IIM L"];
  } else if (percentile >= 98) {
    return ["IIM B", "IIM C", "IIM L", "IIM I"];
  } else if (percentile >= 95) {
    return ["IIM C", "IIM L", "IIM I", "IIM K"];
  } else if (percentile >= 90) {
    return ["IIM L", "IIM I", "IIM K", "IIM U"];
  } else if (percentile >= 75) {
    return ["New IIMs", "Other Top B-schools"];
  } else {
    return ["Tier-2 B-schools", "Consider retaking"];
  }
}
