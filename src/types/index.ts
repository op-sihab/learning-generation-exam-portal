export type UserRole = "student" | "admin" | "instructor";

export interface User {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  targetBatch: string;
  dailyGoalExams: number;
  photo: string | null;
  createdAt: string;
}

export type QuestionType = "mcq" | "numerical" | "true_false";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  text: string;
  questionType?: QuestionType;
  options: string[];
  answer: number;
  explanation: string;
  difficulty?: QuestionDifficulty;
  topic?: string;
  subject?: string;
  chapter?: string;
  marks?: number;
  questionImages?: string[];
  formulas?: string[];
  formulaSource?: string;
}

export type ExamType =
  | "Model Test"
  | "Chapter Drill"
  | "Live Exam"
  | "Practice Drill"
  | "Final Model Test"
  | "MCQ"
  | "Quick Drill"
  | string;

export interface Exam {
  id: string;
  name: string;
  courseId: string;
  subject: string;
  chapter: string;
  type: ExamType;
  minutes: number;
  marks: number;
  negative: number;
  startTime: string;
  endTime: string;
  retakeAllowed: boolean;
  published: boolean;
  instructions: string[];
  questions: Question[];
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  chapters: string[];
}

export interface Course {
  id: string;
  name: string;
  sub: string;
  desc: string;
  artwork: "biology" | "chemistry" | "admission" | "math";
  instructor: string;
  enrolledCount: number;
  subjects: Subject[];
}

export interface Violation {
  type: "tab_switch" | "window_blur" | "fullscreen_exit";
  timestamp: number;
  message: string;
}

export interface ActiveAttempt {
  examId: string;
  mode: "live" | "practice";
  currentQuestionIndex: number;
  userAnswers: Record<number, number>;
  markedQuestions: Record<number, boolean>;
  questionTimes: Record<number, number>;
  examTimeRemaining: number;
  startedAt: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  name: string;
  subject: string;
  courseId: string;
  mode: "live" | "practice";
  userName: string;
  userEmail: string;
  score: number;
  total: number;
  correct: number;
  wrong: number;
  skip: number;
  accuracy: number;
  timeSpentSeconds: number;
  dateISO: string;
  answers: Record<number, number>;
  questionTimes: Record<number, number>;
  questions: Question[];
  violations?: Violation[];
  autoSubmitted?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  examId: string;
  userName: string;
  batch: string;
  score: number;
  total: number;
  correct: number;
  totalQuestions: number;
  accuracy: number;
  timeSpentSeconds: number;
}

export interface Notice {
  title: string;
  message: string;
  updatedAt: string;
}

export interface Maintenance {
  enabled: boolean;
  message: string;
  expectedTime: string;
  enabledAt: string;
}

export interface Streak {
  count: number;
  lastDate: string;
}

export type MathSegment =
  | { type: "text"; value: string }
  | { type: "math"; latex: string; displayMode: boolean };
