"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  Target,
  Clock,
  Flame,
  Search,
  ArrowUpRight,
  BookOpen,
  ChevronRight
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import { ExamResult } from "@/types";
import { usePortal } from "@/context/PortalContext";
import {
  toBanglaNum,
  formatDateBangla,
  formatDurationBangla
} from "@/utils/format";

export interface AnalyticsViewProps {
  history?: ExamResult[];
  streakCount?: number;
  onViewResult?: (result: ExamResult) => void;
  onGoExams?: () => void;
}

interface TrendPoint {
  idx: number;
  label: string;
  fullName: string;
  accuracy: number;
  score: number;
  total: number;
  dateLabel: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  history: propHistory,
  streakCount: propStreakCount,
  onViewResult,
  onGoExams
}) => {
  const { history: portalHistory, streak } = usePortal();
  const history = propHistory || portalHistory;
  const streakCount = propStreakCount ?? streak.count;

  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState<"all" | "live" | "practice">(
    "all"
  );
  const [nowMs] = useState(() => Date.now());

  const summary = useMemo(() => {
    if (history.length === 0) {
      return {
        total: 0,
        avgAcc: 0,
        bestAcc: 0,
        totalMins: 0,
        totalQuestions: 0,
        avgSecsPerQ: 0
      };
    }
    const sumAcc = history.reduce((acc, r) => acc + r.accuracy, 0);
    const bestAcc = Math.max(...history.map((r) => r.accuracy));
    const totalSecs = history.reduce((acc, r) => acc + r.timeSpentSeconds, 0);
    const totalQuestions = history.reduce(
      (acc, r) => acc + r.questions.length,
      0
    );
    return {
      total: history.length,
      avgAcc: Math.round(sumAcc / history.length),
      bestAcc: Math.round(bestAcc),
      totalMins: Math.max(1, Math.round(totalSecs / 60)),
      totalQuestions,
      avgSecsPerQ:
        totalQuestions > 0 ? Math.round(totalSecs / totalQuestions) : 0
    };
  }, [history]);

  const subjectStats = useMemo(() => {
    const map = new Map<
      string,
      {
        subject: string;
        attempts: number;
        totalAcc: number;
        correct: number;
        questions: number;
      }
    >();

    history.forEach((r) => {
      const key = r.subject || "সাধারণ";
      const cur = map.get(key) || {
        subject: key,
        attempts: 0,
        totalAcc: 0,
        correct: 0,
        questions: 0
      };
      cur.attempts += 1;
      cur.totalAcc += r.accuracy;
      cur.correct += r.correct;
      cur.questions += r.questions.length;
      map.set(key, cur);
    });

    return Array.from(map.values())
      .map((s) => ({
        ...s,
        avgAccuracy: Math.round(s.totalAcc / s.attempts)
      }))
      .sort((a, b) => b.avgAccuracy - a.avgAccuracy);
  }, [history]);

  const trendData = useMemo<TrendPoint[]>(() => {
    return [...history]
      .slice(0, 8)
      .reverse()
      .map((r, i) => ({
        idx: i + 1,
        label: `#${toBanglaNum(i + 1)}`,
        fullName: r.name,
        accuracy: Math.min(100, Math.max(0, Math.round(r.accuracy))),
        score: r.score,
        total: r.total,
        dateLabel: formatDateBangla(r.dateISO)
      }));
  }, [history]);

  const activityDays = useMemo(() => {
    const countsByDay = new Map<string, number>();
    history.forEach((r) => {
      const key = new Date(r.dateISO).toISOString().slice(0, 10);
      countsByDay.set(key, (countsByDay.get(key) || 0) + 1);
    });
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(nowMs - i * 864e5);
      const key = d.toISOString().slice(0, 10);
      days.push({
        key,
        label: toBanglaNum(d.getDate()),
        count: countsByDay.get(key) || 0
      });
    }
    return days;
  }, [history, nowMs]);

  const filteredHistory = useMemo(() => {
    const q = search.trim().toLowerCase();
    return history.filter((r) => {
      if (modeFilter !== "all" && r.mode !== modeFilter) return false;
      if (
        q &&
        !r.name.toLowerCase().includes(q) &&
        !r.subject.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [history, search, modeFilter]);

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <span className="w-10 h-10 rounded-xl bg-blue-500/12 border border-blue-500/25 flex items-center justify-center shrink-0 mt-0.5">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </span>
          <div>
            <p className="text-xs font-semibold text-blue-400">
              পারফরম্যান্স ইনসাইটস
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 leading-tight">
              ফলাফল বিশ্লেষণ ও ইতিহাস
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              বিষয়ভিত্তিক দক্ষতা, সঠিকতার অগ্রগতি, গতি এবং সকল পূর্ববর্তী উত্তরপত্র এক জায়গায়।
            </p>
          </div>
        </div>

        {onGoExams ? (
          <button
            type="button"
            onClick={onGoExams}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <span>নতুন পরীক্ষা দিন</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href="/exams"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
          >
            <span>নতুন পরীক্ষা দিন</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Unified 4-column Hairline KPI Strip */}
      <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-white/[0.07]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px">
          <div className="p-5 bg-[#0C0F16]">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400">
              <span>মোট পরীক্ষা সম্পন্ন</span>
              <span className="w-8 h-8 rounded-lg bg-blue-500/12 border border-blue-500/25 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-blue-400" />
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-50 mt-2">
              {toBanglaNum(summary.total)}
            </div>
            <div className="text-xs text-slate-400 mt-1 tabular-nums">
              {toBanglaNum(summary.totalQuestions)}টি প্রশ্ন সমাধান
            </div>
          </div>

          <div className="p-5 bg-[#0C0F16]">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400">
              <span>গড় সঠিকতা</span>
              <span className="w-8 h-8 rounded-lg bg-emerald-500/12 border border-emerald-500/25 flex items-center justify-center">
                <Target className="w-4 h-4 text-emerald-400" />
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-2">
              {toBanglaNum(summary.avgAcc)}%
            </div>
            <div className="text-xs text-slate-400 mt-1 tabular-nums">
              সর্বোচ্চ: {toBanglaNum(summary.bestAcc)}%
            </div>
          </div>

          <div className="p-5 bg-[#0C0F16]">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400">
              <span>গড় গতি</span>
              <span className="w-8 h-8 rounded-lg bg-indigo-500/12 border border-indigo-500/25 flex items-center justify-center">
                <Clock className="w-4 h-4 text-indigo-400" />
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-50 mt-2">
              {toBanglaNum(summary.avgSecsPerQ)} সে.
            </div>
            <div className="text-xs text-slate-400 mt-1 tabular-nums">
              প্রতি প্রশ্নে · মোট {toBanglaNum(summary.totalMins)} মিনিট
            </div>
          </div>

          <div className="p-5 bg-[#0C0F16]">
            <div className="flex items-center justify-between text-xs font-medium text-slate-400">
              <span>ধারাবাহিক স্ট্রিক</span>
              <span className="w-8 h-8 rounded-lg bg-amber-500/12 border border-amber-500/25 flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-400" />
              </span>
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-400 mt-2">
              {toBanglaNum(streakCount)} দিন
            </div>
            <div className="text-xs text-slate-400 mt-1">
              নিয়মিত দৈনিক অনুশীলন
            </div>
          </div>
        </div>
      </div>

      {/* Accuracy Trend Chart & Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-50">
              সঠিকতার অগ্রগতি (সর্বশেষ ৮ পরীক্ষা)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              প্রতিটি পরীক্ষার শতাংশ (%) অনুযায়ী পারফরম্যান্স ট্রেন্ড
            </p>
          </div>

          {trendData.length === 0 ? (
            <div className="h-56 flex items-center justify-center rounded-xl border border-dashed border-white/[0.1] text-sm text-slate-400">
              চার্ট দেখতে অন্তত ১টি পরীক্ষা সম্পন্ন করুন।
            </div>
          ) : (
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={trendData}
                  margin={{ top: 10, right: 12, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="accuracyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="rgba(255,255,255,0.06)"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#8B97AD", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: "#8B97AD", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const pt = payload[0].payload as TrendPoint;
                      return (
                        <div className="rounded-xl border border-white/[0.12] bg-[#131824] px-3.5 py-2.5 shadow-2xl text-xs max-w-[220px]">
                          <div className="font-semibold text-slate-100 line-clamp-1">
                            {pt.fullName}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {pt.dateLabel}
                          </div>
                          <div className="mt-2 pt-1.5 border-t border-white/[0.08] flex items-center justify-between gap-3 font-mono tabular-nums">
                            <span className="text-slate-300">
                              স্কোর: {toBanglaNum(pt.score)}/{toBanglaNum(pt.total)}
                            </span>
                            <span className="font-bold text-blue-400">
                              {toBanglaNum(pt.accuracy)}%
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#60A5FA"
                    strokeWidth={2.5}
                    fill="url(#accuracyFill)"
                    activeDot={{
                      r: 5,
                      fill: "#60A5FA",
                      stroke: "#0C0F16",
                      strokeWidth: 2
                    }}
                    dot={{
                      r: 3.5,
                      fill: "#0C0F16",
                      stroke: "#60A5FA",
                      strokeWidth: 2
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Subject-Wise Mastery & 14-Day Activity */}
        <div className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] p-6 flex flex-col justify-between gap-6">
          <div>
            <h2 className="text-base font-bold text-slate-50">
              বিষয়ভিত্তিক দক্ষতা
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 mb-5">
              কোন বিষয়ে প্রস্তুতি শক্তিশালী এবং কোথায় আরও মনোযোগ প্রয়োজন
            </p>

            {subjectStats.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">
                কোনো বিষয়ভিত্তিক ডেটা নেই।
              </div>
            ) : (
              <div className="space-y-4">
                {subjectStats.map((s) => (
                  <div key={s.subject}>
                    <div className="flex items-center justify-between text-xs mb-1.5 gap-2">
                      <span className="font-semibold text-slate-200 truncate">
                        {s.subject}
                      </span>
                      <span className="font-mono tabular-nums text-slate-400 shrink-0">
                        <strong className="text-slate-100 font-semibold">
                          {toBanglaNum(s.avgAccuracy)}%
                        </strong>{" "}
                        · {toBanglaNum(s.attempts)}টি পরীক্ষা
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          s.avgAccuracy >= 75
                            ? "bg-emerald-500"
                            : s.avgAccuracy >= 55
                            ? "bg-blue-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${s.avgAccuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-5 border-t border-white/[0.07]">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-semibold text-slate-300">
                বিগত ১৪ দিনের অনুশীলন সক্রিয়তা
              </span>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#131824] border border-white/[0.1]" />
                  ০
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-500/25 border border-blue-500/40" />
                  ১
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                  ২+
                </span>
              </div>
            </div>
            <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
              {activityDays.map((day) => (
                <div
                  key={day.key}
                  title={`${day.key}: ${day.count}টি পরীক্ষা`}
                  className={`h-9 rounded-lg flex items-center justify-center text-[11px] font-mono tabular-nums border transition-colors ${
                    day.count >= 2
                      ? "bg-blue-600 text-white border-blue-500 font-semibold"
                      : day.count === 1
                      ? "bg-blue-500/20 text-blue-300 border-blue-500/35 font-semibold"
                      : "bg-[#131824] text-slate-500 border-white/[0.06]"
                  }`}
                >
                  {day.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.07]">
          <h2 className="text-base font-bold text-slate-50">
            পরীক্ষার পূর্ণ ইতিহাস{" "}
            <span className="font-mono text-sm font-medium text-slate-400 tabular-nums">
              ({toBanglaNum(filteredHistory.length)})
            </span>
          </h2>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="পরীক্ষা বা বিষয় খুঁজুন..."
                className="w-full sm:w-52 rounded-xl border border-white/[0.1] bg-[#131824] pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#131824] border border-white/[0.06] text-xs font-medium">
              {[
                { id: "all", label: "সব" },
                { id: "live", label: "লাইভ" },
                { id: "practice", label: "প্র্যাকটিস" }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() =>
                    setModeFilter(t.id as "all" | "live" | "practice")
                  }
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    modeFilter === t.id
                      ? "bg-[#1C2436] text-white font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            কোনো পরীক্ষার ইতিহাস পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.07] text-[11px] font-semibold text-slate-400 bg-[#090C12]">
                  <th className="py-3.5 px-5">পরীক্ষা ও বিষয়</th>
                  <th className="py-3.5 px-4">তারিখ</th>
                  <th className="py-3.5 px-4 text-right">স্কোর</th>
                  <th className="py-3.5 px-4 text-right">সঠিকতা</th>
                  <th className="py-3.5 px-4 text-right hidden sm:table-cell">
                    সময়
                  </th>
                  <th className="py-3.5 px-5 text-right">উত্তরপত্র</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-100 text-sm">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.subject} ·{" "}
                        {item.mode === "live" ? "লাইভ" : "প্র্যাকটিস"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">
                      {formatDateBangla(item.dateISO)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-slate-100 whitespace-nowrap">
                      {toBanglaNum(item.score)} / {toBanglaNum(item.total)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums whitespace-nowrap">
                      <span
                        className={
                          item.accuracy >= 70
                            ? "text-emerald-400"
                            : item.accuracy >= 50
                            ? "text-blue-400"
                            : "text-rose-400"
                        }
                      >
                        {toBanglaNum(item.accuracy)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-xs text-slate-400 tabular-nums whitespace-nowrap hidden sm:table-cell">
                      {formatDurationBangla(item.timeSpentSeconds)}
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      {onViewResult ? (
                        <button
                          type="button"
                          onClick={() => onViewResult(item)}
                          className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300"
                        >
                          <span>রিভিউ</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <Link
                          href={`/results/${item.id}`}
                          className="inline-flex items-center gap-1 font-semibold text-blue-400 hover:text-blue-300"
                        >
                          <span>রিভিউ</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
