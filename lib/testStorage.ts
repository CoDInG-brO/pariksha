// Types for test storage
export interface TestAttempt {
  id: string;
  examType: "JEE" | "NEET";
  timestamp: string;
  timeSpent: number; // in seconds
  totalQuestions: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  rawScore: number;
  maxScore: number;
  percentage: string;
  estimatedPercentile: number;
  questions: SavedQuestion[];
  selectedAnswers: (number | null)[];
}

export interface SavedQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  section?: string;
  subject?: string;
}

const STORAGE_KEY = "iyotaprep_test_attempts";

// Get all test attempts from localStorage
export function getTestAttempts(): TestAttempt[] {
  if (typeof window === "undefined") return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading test attempts:", error);
    return [];
  }
}

// Save a new test attempt
export function saveTestAttempt(attempt: Omit<TestAttempt, "id" | "timestamp">): TestAttempt {
  const attempts = getTestAttempts();
  
  const newAttempt: TestAttempt = {
    ...attempt,
    id: `${attempt.examType.toLowerCase()}_${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  
  attempts.unshift(newAttempt); // Add to beginning (most recent first)
  
  // Keep only last 50 attempts to prevent storage overflow
  const trimmedAttempts = attempts.slice(0, 50);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedAttempts));
  } catch (error) {
    console.error("Error saving test attempt:", error);
  }
  
  return newAttempt;
}

// Get a specific test attempt by ID
export function getTestAttemptById(id: string): TestAttempt | null {
  const attempts = getTestAttempts();
  return attempts.find(a => a.id === id) || null;
}

// Get attempts filtered by exam type
export function getAttemptsByExamType(examType: "JEE" | "NEET"): TestAttempt[] {
  const attempts = getTestAttempts();
  return attempts.filter(a => a.examType === examType);
}

// Delete a test attempt
export function deleteTestAttempt(id: string): void {
  const attempts = getTestAttempts();
  const filtered = attempts.filter(a => a.id !== id);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting test attempt:", error);
  }
}

// Clear all attempts
export function clearAllAttempts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing attempts:", error);
  }
}

// Format timestamp for display
export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Format time spent
export function formatTimeSpent(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

// Practice Mode Progress Types and Functions
const PRACTICE_KEY = "iyotaprep_practice_progress";

export interface PracticeProgress {
  examType: "JEE" | "NEET";
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: number[];
  correctAnswers: number;
  timestamp: string;
}

export function savePracticeProgress(progress: Omit<PracticeProgress, "timestamp">): void {
  try {
    const data: PracticeProgress = {
      ...progress,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(PRACTICE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving practice progress:", error);
  }
}

export function getPracticeProgress(): PracticeProgress | null {
  if (typeof window === "undefined") return null;
  
  try {
    const data = localStorage.getItem(PRACTICE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading practice progress:", error);
    return null;
  }
}

export function clearPracticeProgress(): void {
  try {
    localStorage.removeItem(PRACTICE_KEY);
  } catch (error) {
    console.error("Error clearing practice progress:", error);
  }
}

