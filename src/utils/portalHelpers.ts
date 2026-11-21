import { Exam, ExamResult, LeaderboardEntry } from "../types";

export interface PortalSummaryStats {
  total: number;
  avg: number;
  best: number;
  mins: number;
}

export interface GradeInfo {
  grade: "A+" | "A" | "B" | "C";
  remark: string;
}

export interface RankedLeaderboardRow {
  key: string;
  userName: string;
  batch: string;
  score: number;
  total: number;
  accuracy: number;
  timeSpentSeconds: number;
  examsCount: number;
  isCurrentUser: boolean;
}

export function computePortalStats(history: ExamResult[]): PortalSummaryStats {
  const total = history.length;
  if (total === 0) return { total: 0, avg: 0, best: 0, mins: 0 };
  const sumAcc = history.reduce((acc, item) => acc + item.accuracy, 0);
  const best = Math.max(...history.map((item) => item.accuracy));
  const totalSeconds = history.reduce((acc, item) => acc + item.timeSpentSeconds, 0);
  return {
    total,
    avg: Math.round(sumAcc / total),
    best: Math.round(best),
    mins: Math.max(1, Math.round(totalSeconds / 60))
  };
}

export function getBestScoreByExam(history: ExamResult[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of history) {
    const prev = map.get(item.examId);
    if (prev === undefined || item.score > prev) {
      map.set(item.examId, item.score);
    }
  }
  return map;
}

export function getLatestResultIdByExam(history: ExamResult[]): Map<string, string> {
  const map = new Map<string, string>();
  const latestTimestamp = new Map<string, number>();

  for (const item of history) {
    const ts = new Date(item.dateISO).getTime() || 0;
    const prevTs = latestTimestamp.get(item.examId);
    if (prevTs === undefined || ts >= prevTs) {
      latestTimestamp.set(item.examId, ts);
      map.set(item.examId, item.id);
    }
  }
  return map;
}

export function filterExams(
  exams: Exam[],
  options: {
    search?: string;
    subject?: string;
    type?: "all" | "cbt" | "drill" | "practice";
    onlyPublished?: boolean;
  }
): Exam[] {
  const query = (options.search || "").trim().toLowerCase();
  const subject = options.subject || "all";
  const type = options.type || "all";
  const onlyPublished = options.onlyPublished ?? false;

  return exams.filter((exam) => {
    if (onlyPublished && !exam.published) return false;
    if (subject !== "all" && exam.subject !== subject) return false;

    if (type !== "all") {
      const normalizedType = (exam.type || "").toLowerCase();
      if (
        type === "cbt" &&
        !normalizedType.includes("cbt") &&
        !normalizedType.includes("model") &&
        !normalizedType.includes("live")
      ) {
        return false;
      }
      if (type === "drill" && !normalizedType.includes("drill")) {
        return false;
      }
      if (
        type === "practice" &&
        !normalizedType.includes("practice") &&
        !normalizedType.includes("drill")
      ) {
        return false;
      }
    }

    if (query) {
      return (
        exam.name.toLowerCase().includes(query) ||
        (exam.subject || "").toLowerCase().includes(query) ||
        (exam.chapter || "").toLowerCase().includes(query)
      );
    }

    return true;
  });
}

export function getGradeInfo(accuracy: number): GradeInfo {
  if (accuracy >= 85) {
    return { grade: "A+", remark: "অসাধারণ পারফরম্যান্স! আপনি মেধার শীর্ষে।" };
  }
  if (accuracy >= 70) {
    return { grade: "A", remark: "খুব ভালো প্রস্তুতি, আরও একধাপ এগিয়ে যান।" };
  }
  if (accuracy >= 55) {
    return { grade: "B", remark: "ভালো চেষ্টা, ভুল উত্তরগুলো পুনরায় পর্যালোচনা করুন।" };
  }
  return { grade: "C", remark: "অধ্যায়টি পুনরায় পড়ে আবার মডেল টেস্ট অনুশীলন করুন।" };
}

export function computeLeaderboardRows(
  selectedExamId: string,
  seededPeers: LeaderboardEntry[],
  history: ExamResult[],
  currentUserName: string
): RankedLeaderboardRow[] {
  if (selectedExamId === "all") {
    const map = new Map<
      string,
      {
        userName: string;
        batch: string;
        score: number;
        total: number;
        accSum: number;
        count: number;
        timeSpentSeconds: number;
        isCurrentUser: boolean;
      }
    >();

    seededPeers.forEach((p) => {
      const cur = map.get(p.userName) || {
        userName: p.userName,
        batch: p.batch,
        score: 0,
        total: 0,
        accSum: 0,
        count: 0,
        timeSpentSeconds: 0,
        isCurrentUser: false
      };
      cur.score = Math.round((cur.score + p.score) * 100) / 100;
      cur.total = Math.round((cur.total + p.total) * 100) / 100;
      cur.accSum += p.accuracy;
      cur.count += 1;
      cur.timeSpentSeconds += p.timeSpentSeconds;
      map.set(p.userName, cur);
    });

    history.forEach((h) => {
      const name = h.userName || currentUserName;
      const cur = map.get(name) || {
        userName: name,
        batch: "আপনার অ্যাকাউন্ট",
        score: 0,
        total: 0,
        accSum: 0,
        count: 0,
        timeSpentSeconds: 0,
        isCurrentUser: name === currentUserName
      };
      cur.score = Math.round((cur.score + h.score) * 100) / 100;
      cur.total = Math.round((cur.total + h.total) * 100) / 100;
      cur.accSum += h.accuracy;
      cur.count += 1;
      cur.timeSpentSeconds += h.timeSpentSeconds;
      cur.isCurrentUser = name === currentUserName;
      map.set(name, cur);
    });

    return Array.from(map.values())
      .map((item) => ({
        key: item.userName,
        userName: item.userName,
        batch: item.batch,
        score: Math.round(item.score * 100) / 100,
        total: item.total,
        accuracy: Math.round(item.accSum / Math.max(1, item.count)),
        timeSpentSeconds: item.timeSpentSeconds,
        examsCount: item.count,
        isCurrentUser: item.isCurrentUser
      }))
      .sort(
        (a, b) =>
          b.score - a.score ||
          b.accuracy - a.accuracy ||
          a.timeSpentSeconds - b.timeSpentSeconds
      );
  }

  const map = new Map<string, RankedLeaderboardRow>();

  seededPeers
    .filter((p) => p.examId === selectedExamId)
    .forEach((p) => {
      map.set(p.userName, {
        key: p.id,
        userName: p.userName,
        batch: p.batch,
        score: p.score,
        total: p.total,
        accuracy: p.accuracy,
        timeSpentSeconds: p.timeSpentSeconds,
        examsCount: 1,
        isCurrentUser: false
      });
    });

  history
    .filter((h) => h.examId === selectedExamId)
    .forEach((h) => {
      const name = h.userName || currentUserName;
      const existing = map.get(name);
      if (
        !existing ||
        h.score > existing.score ||
        (h.score === existing.score && h.accuracy > existing.accuracy) ||
        (h.score === existing.score &&
          h.accuracy === existing.accuracy &&
          h.timeSpentSeconds < existing.timeSpentSeconds)
      ) {
        map.set(name, {
          key: h.id,
          userName: name,
          batch: "আপনার স্কোর",
          score: h.score,
          total: h.total,
          accuracy: h.accuracy,
          timeSpentSeconds: h.timeSpentSeconds,
          examsCount: 1,
          isCurrentUser: name === currentUserName
        });
      }
    });

  return Array.from(map.values()).sort(
    (a, b) =>
      b.score - a.score ||
      b.accuracy - a.accuracy ||
      a.timeSpentSeconds - b.timeSpentSeconds
  );
}

export function computePercentile(rankIndex: number, totalParticipants: number): number {
  if (rankIndex < 0 || totalParticipants <= 0) return 0;
  if (totalParticipants === 1) return 100;
  return Math.max(1, Math.round(((totalParticipants - rankIndex) / totalParticipants) * 100));
}
