import { Exam, ActiveAttempt } from "../types";

export const BANGLA_DIGITS = [
  "০",
  "১",
  "২",
  "৩",
  "৪",
  "৫",
  "৬",
  "৭",
  "৮",
  "৯"
];

export const BANGLA_LETTERS = [
  "ক",
  "খ",
  "গ",
  "ঘ",
  "ঙ",
  "চ",
  "ছ",
  "জ"
];

export function getOptionLetter(index: number): string {
  return BANGLA_LETTERS[index] || String(index + 1);
}

export function getExamTotalMarks(exam: Exam): number {
  const defaultMark = exam.marks || 1;
  const total = exam.questions.reduce((sum, q) => {
    return sum + (typeof q.marks === "number" && q.marks > 0 ? q.marks : defaultMark);
  }, 0);
  return Math.round(total * 100) / 100;
}

export function toBanglaNum(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/\d/g, (d) => BANGLA_DIGITS[Number(d)] ?? d);
}

export function formatTimer(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hrs = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  if (hrs > 0) {
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function formatDurationBangla(seconds: number): string {
  const safe = Math.max(1, Math.round(seconds));
  if (safe < 60) return `${toBanglaNum(safe)} সেকেন্ড`;
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  if (secs === 0) return `${toBanglaNum(mins)} মিনিট`;
  return `${toBanglaNum(mins)} মি. ${toBanglaNum(secs)} সে.`;
}

export function formatDateBangla(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return iso;
  }
}

export function formatDateTimeBangla(iso: string): string {
  try {
    return new Date(iso).toLocaleString("bn-BD", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return iso;
  }
}

export function getGreetingBangla(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "শুভ সকাল";
  if (h >= 12 && h < 16) return "শুভ দুপুর";
  if (h >= 16 && h < 19) return "শুভ সন্ধ্যা";
  return "শুভ রাত্রি";
}

export interface ExamStatusInfo {
  status: "in_progress" | "upcoming" | "ended" | "active";
  label: string;
  tone: "purple" | "amber" | "slate" | "emerald";
}

export function getExamStatus(exam: Exam, activeAttempt: ActiveAttempt | null): ExamStatusInfo {
  if (activeAttempt && activeAttempt.examId === exam.id) {
    return {
      status: "in_progress",
      label: "চলমান সেশন",
      tone: "purple"
    };
  }
  const now = Date.now();
  const start = exam.startTime ? new Date(exam.startTime).getTime() : null;
  const end = exam.endTime ? new Date(exam.endTime).getTime() : null;

  if (start && !Number.isNaN(start) && now < start) {
    return {
      status: "upcoming",
      label: "আসন্ন পরীক্ষা",
      tone: "amber"
    };
  }
  if (end && !Number.isNaN(end) && now > end) {
    return {
      status: "ended",
      label: "সমাপ্ত",
      tone: "slate"
    };
  }
  return {
    status: "active",
    label: "লাইভ",
    tone: "emerald"
  };
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function getCountdownParts(targetISO: string): CountdownParts | null {
  const diff = new Date(targetISO).getTime() - Date.now();
  if (Number.isNaN(diff) || diff <= 0) return null;
  const totalSecs = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSecs / 86400),
    hours: Math.floor((totalSecs % 86400) / 3600),
    minutes: Math.floor((totalSecs % 3600) / 60),
    seconds: totalSecs % 60
  };
}

export function resizeProfileImage(file: File, maxSize = 360): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }
        ctx.drawImage(img, sx, sy, side, side, 0, 0, maxSize, maxSize);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => reject(new Error("ছবি লোড করা যায়নি"));
      img.src = String(e.target?.result || "");
    };
    reader.onerror = () => reject(new Error("ফাইল পড়া যায়নি"));
    reader.readAsDataURL(file);
  });
}

export function resizeQuestionImage(
  file: File,
  maxWidth = 960,
  maxHeight = 720
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(1, maxWidth / width, maxHeight / height);
        width = Math.max(1, Math.round(width * ratio));
        height = Math.max(1, Math.round(height * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.86));
      };
      img.onerror = () => reject(new Error("প্রশ্নের ছবি লোড করা যায়নি"));
      img.src = String(e.target?.result || "");
    };
    reader.onerror = () => reject(new Error("ফাইল পড়া যায়নি"));
    reader.readAsDataURL(file);
  });
}

export function downloadJson(filename: string, data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
