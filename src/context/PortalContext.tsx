"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode
} from "react";
import {
  Course,
  Exam,
  ExamResult,
  User,
  ActiveAttempt,
  Notice,
  Maintenance,
  Streak,
  Violation
} from "../types";
import {
  DEFAULT_COURSES,
  DEFAULT_EXAMS,
  INITIAL_HISTORY,
  DEFAULT_USERS,
  DEFAULT_NOTICE,
  DEFAULT_MAINTENANCE
} from "../data/seedData";
import { playTone, SoundToneType } from "../utils/audio";

export const STORAGE_KEYS = {
  courses: "lg_v7_courses",
  exams: "lg_v7_exams",
  history: "lg_v7_history",
  users: "lg_v7_users",
  session: "lg_v7_session",
  attempt: "lg_v7_attempt",
  notice: "lg_v7_notice",
  maint: "lg_v7_maint",
  theme: "lg_v7_theme",
  sound: "lg_v7_sound",
  streak: "lg_v7_streak"
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export interface ExamSubmitPayload {
  answers: Record<number, number>;
  questionTimes: Record<number, number>;
  timeRemaining: number;
  violations?: Violation[];
  autoSubmitted?: boolean;
}

export interface PortalContextType {
  courses: Course[];
  exams: Exam[];
  history: ExamResult[];
  users: Record<string, User>;
  activeUser: User;
  activeAttempt: ActiveAttempt | null;
  notice: Notice;
  maintenance: Maintenance;
  maintBypass: boolean;
  setMaintBypass: (bypass: boolean) => void;
  darkMode: boolean;
  soundEnabled: boolean;
  streak: Streak;
  toastMsg: string | null;
  showToast: (msg: string) => void;
  playSound: (type: SoundToneType) => void;
  authModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginUser: (email: string, pass: string) => boolean;
  registerUser: (user: User) => void;
  logoutUser: () => void;
  updateProfile: (data: Partial<User>) => void;
  saveAttempt: (attempt: ActiveAttempt | null) => void;
  submitExam: (exam: Exam, mode: "live" | "practice", payload: ExamSubmitPayload) => ExamResult;
  saveCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  saveExam: (exam: Exam) => void;
  deleteExam: (id: string) => void;
  updateNotice: (notice: Notice) => void;
  updateMaintenance: (maint: Maintenance) => void;
  toggleDarkMode: () => void;
  toggleSound: () => void;
  resetAllData: () => void;
  stats: { total: number; avg: number; best: number; mins: number };
  bestScoreByExam: Map<string, number>;
  hasCompletedExam: (examId: string) => boolean;
  getBestScore: (examId: string) => number | undefined;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(() =>
    readStorage(STORAGE_KEYS.courses, DEFAULT_COURSES)
  );
  const [exams, setExams] = useState<Exam[]>(() =>
    readStorage(STORAGE_KEYS.exams, DEFAULT_EXAMS)
  );
  const [history, setHistory] = useState<ExamResult[]>(() =>
    readStorage(STORAGE_KEYS.history, INITIAL_HISTORY)
  );
  const [users, setUsers] = useState<Record<string, User>>(() =>
    readStorage(STORAGE_KEYS.users, DEFAULT_USERS)
  );
  const [activeUser, setActiveUser] = useState<User>(() => {
    const sessionEmail = readStorage<string | null>(STORAGE_KEYS.session, null);
    if (sessionEmail && users[sessionEmail]) return users[sessionEmail];
    return DEFAULT_USERS["demo@lg.com"] || Object.values(DEFAULT_USERS)[0];
  });
  const [activeAttempt, setActiveAttempt] = useState<ActiveAttempt | null>(() =>
    readStorage(STORAGE_KEYS.attempt, null)
  );
  const [notice, setNotice] = useState<Notice>(() =>
    readStorage(STORAGE_KEYS.notice, DEFAULT_NOTICE)
  );
  const [maintenance, setMaintenance] = useState<Maintenance>(() =>
    readStorage(STORAGE_KEYS.maint, DEFAULT_MAINTENANCE)
  );
  const [maintBypass, setMaintBypass] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() =>
    readStorage(STORAGE_KEYS.theme, false)
  );
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() =>
    readStorage(STORAGE_KEYS.sound, true)
  );
  const [streak, setStreak] = useState<Streak>(() =>
    readStorage(STORAGE_KEYS.streak, { count: 3, lastDate: "2026-11-19" })
  );

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.courses, JSON.stringify(courses));
    } catch {}
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.exams, JSON.stringify(exams));
    } catch {}
  }, [exams]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
    } catch {}
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
    } catch {}
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(activeUser.email));
    } catch {}
  }, [activeUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.notice, JSON.stringify(notice));
    } catch {}
  }, [notice]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.maint, JSON.stringify(maintenance));
    } catch {}
  }, [maintenance]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.theme, JSON.stringify(darkMode));
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", darkMode);
    }
  }, [darkMode]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.sound, JSON.stringify(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.streak, JSON.stringify(streak));
    } catch {}
  }, [streak]);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMsg) return;
    const t = window.setTimeout(() => setToastMsg(null), 3000);
    return () => window.clearTimeout(t);
  }, [toastMsg]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
  }, []);

  const playSound = useCallback(
    (type: SoundToneType) => {
      playTone(type, soundEnabled);
    },
    [soundEnabled]
  );

  const openAuthModal = useCallback(() => setAuthModalOpen(true), []);
  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  const loginUser = useCallback(
    (email: string, pass: string): boolean => {
      const user = users[email];
      if (!user) return false;
      if (user.password && user.password !== pass) return false;
      setActiveUser(user);
      showToast(`স্বাগতম, ${user.name}!`);
      return true;
    },
    [users, showToast]
  );

  const registerUser = useCallback(
    (user: User) => {
      setUsers((prev) => ({ ...prev, [user.email]: user }));
      setActiveUser(user);
      showToast(`রেজিস্ট্রেশন সফল হয়েছে! স্বাগতম, ${user.name}!`);
    },
    [showToast]
  );

  const logoutUser = useCallback(() => {
    const demo = DEFAULT_USERS["demo@lg.com"] || Object.values(users)[0];
    setActiveUser(demo);
    showToast("লগআউট সম্পন্ন হয়েছে।");
  }, [users, showToast]);

  const updateProfile = useCallback(
    (data: Partial<User>) => {
      setActiveUser((prev) => {
        const updated = { ...prev, ...data };
        setUsers((u) => ({ ...u, [updated.email]: updated }));
        return updated;
      });
      showToast("প্রোফাইল আপডেট করা হয়েছে!");
    },
    [showToast]
  );

  const saveAttempt = useCallback((attempt: ActiveAttempt | null) => {
    setActiveAttempt(attempt);
    if (attempt) {
      try {
        localStorage.setItem(STORAGE_KEYS.attempt, JSON.stringify(attempt));
      } catch {}
    } else {
      try {
        localStorage.removeItem(STORAGE_KEYS.attempt);
      } catch {}
    }
  }, []);

  const submitExam = useCallback(
    (
      exam: Exam,
      mode: "live" | "practice",
      payload: ExamSubmitPayload
    ): ExamResult => {
      let correct = 0;
      let wrong = 0;
      let skip = 0;
      let rawScore = 0;
      let totalMarksRaw = 0;
      const defaultMp = exam.marks || 1;
      const neg = mode === "live" ? exam.negative || 0 : 0;

      exam.questions.forEach((q, idx) => {
        const qMarks = typeof q.marks === "number" && q.marks > 0 ? q.marks : defaultMp;
        totalMarksRaw += qMarks;
        const chosen = payload.answers[idx];
        if (chosen === undefined) {
          skip += 1;
        } else if (chosen === q.answer) {
          correct += 1;
          rawScore += qMarks;
        } else {
          wrong += 1;
          rawScore -= neg;
        }
      });

      const finalScore = Math.max(0, Math.round(rawScore * 100) / 100);
      const totalMarks = Math.round(totalMarksRaw * 100) / 100;
      const accuracy = exam.questions.length
        ? Math.round((correct / exam.questions.length) * 100)
        : 0;
      const trackedSeconds = Object.values(payload.questionTimes).reduce(
        (a, b) => a + b,
        0
      );
      const fallbackSeconds = Math.max(5, exam.minutes * 60 - payload.timeRemaining);
      const timeSpentSeconds =
        trackedSeconds > 0 ? trackedSeconds : Math.max(5, fallbackSeconds);

      const result: ExamResult = {
        id: "res_" + Date.now(),
        examId: exam.id,
        name: exam.name,
        subject: exam.subject,
        courseId: exam.courseId,
        mode,
        userName: activeUser.name,
        userEmail: activeUser.email,
        score: finalScore,
        total: totalMarks,
        correct,
        wrong,
        skip,
        accuracy,
        timeSpentSeconds,
        dateISO: new Date().toISOString(),
        answers: { ...payload.answers },
        questionTimes: { ...payload.questionTimes },
        questions: exam.questions,
        violations: payload.violations,
        autoSubmitted: payload.autoSubmitted
      };

      setHistory((prev) => [result, ...prev]);

      const today = new Date().toDateString();
      setStreak((prev) => {
        if (prev.lastDate === today) return prev;
        const yesterday = new Date(Date.now() - 864e5).toDateString();
        return {
          count: prev.lastDate === yesterday ? prev.count + 1 : 1,
          lastDate: today
        };
      });

      saveAttempt(null);
      showToast("পরীক্ষা সফলভাবে জমা হয়েছে!");
      return result;
    },
    [activeUser, saveAttempt, showToast]
  );

  const saveCourse = useCallback(
    (course: Course) => {
      setCourses((prev) => {
        const idx = prev.findIndex((c) => c.id === course.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = course;
          return updated;
        }
        return [...prev, course];
      });
      showToast("কোর্স সংরক্ষণ করা হয়েছে!");
    },
    [showToast]
  );

  const deleteCourse = useCallback(
    (id: string) => {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      showToast("কোর্স মুছে ফেলা হয়েছে।");
    },
    [showToast]
  );

  const saveExam = useCallback(
    (exam: Exam) => {
      setExams((prev) => {
        const idx = prev.findIndex((e) => e.id === exam.id);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = exam;
          return updated;
        }
        return [exam, ...prev];
      });
      showToast("পরীক্ষা সংরক্ষণ করা হয়েছে!");
    },
    [showToast]
  );

  const deleteExam = useCallback(
    (id: string) => {
      setExams((prev) => prev.filter((e) => e.id !== id));
      showToast("পরীক্ষা মুছে ফেলা হয়েছে।");
    },
    [showToast]
  );

  const updateNoticeHandler = useCallback(
    (n: Notice) => {
      setNotice(n);
      showToast("নোটিশ আপডেট করা হয়েছে!");
    },
    [showToast]
  );

  const updateMaintenanceHandler = useCallback(
    (m: Maintenance) => {
      setMaintenance(m);
      showToast("মেইনটেন্যান্স মোড সেটিংস সংরক্ষিত!");
    },
    [showToast]
  );

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => !prev);
  }, []);

  const resetAllData = useCallback(() => {
    try {
      localStorage.clear();
    } catch {}
    setCourses(DEFAULT_COURSES);
    setExams(DEFAULT_EXAMS);
    setHistory(INITIAL_HISTORY);
    setUsers(DEFAULT_USERS);
    setActiveUser(DEFAULT_USERS["demo@lg.com"]);
    setActiveAttempt(null);
    setNotice(DEFAULT_NOTICE);
    setMaintenance(DEFAULT_MAINTENANCE);
    setMaintBypass(false);
    setDarkMode(false);
    setSoundEnabled(true);
    setStreak({ count: 1, lastDate: new Date().toDateString() });
    showToast("সকল ডেটা ডিফল্ট অবস্থায় রিসেট করা হয়েছে!");
  }, [showToast]);

  const stats = useMemo(() => {
    const total = history.length;
    if (total === 0) return { total: 0, avg: 0, best: 0, mins: 0 };
    return {
      total,
      avg: Math.round(history.reduce((s, r) => s + r.accuracy, 0) / total),
      best: Math.max(...history.map((r) => r.accuracy)),
      mins: Math.max(1, Math.round(history.reduce((s, r) => s + r.timeSpentSeconds, 0) / 60))
    };
  }, [history]);

  const bestScoreByExam = useMemo(() => {
    const map = new Map<string, number>();
    history.forEach((h) => {
      const prev = map.get(h.examId);
      if (prev === undefined || h.score > prev) {
        map.set(h.examId, h.score);
      }
    });
    return map;
  }, [history]);

  const hasCompletedExam = useCallback(
    (examId: string) => history.some((h) => h.examId === examId),
    [history]
  );

  const getBestScore = useCallback(
    (examId: string) => bestScoreByExam.get(examId),
    [bestScoreByExam]
  );

  return (
    <PortalContext.Provider
      value={{
        courses,
        exams,
        history,
        users,
        activeUser,
        activeAttempt,
        notice,
        maintenance,
        maintBypass,
        setMaintBypass,
        darkMode,
        soundEnabled,
        streak,
        toastMsg,
        showToast,
        playSound,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        loginUser,
        registerUser,
        logoutUser,
        updateProfile,
        saveAttempt,
        submitExam,
        saveCourse,
        deleteCourse,
        saveExam,
        deleteExam,
        updateNotice: updateNoticeHandler,
        updateMaintenance: updateMaintenanceHandler,
        toggleDarkMode,
        toggleSound,
        resetAllData,
        stats,
        bestScoreByExam,
        hasCompletedExam,
        getBestScore
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export function usePortal(): PortalContextType {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal must be used within a PortalProvider");
  }
  return context;
}
