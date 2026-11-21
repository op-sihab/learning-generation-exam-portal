"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  Target,
  Clock,
  TrendingUp,
  Search,
  ArrowUpRight,
  BookOpen
} from "lucide-react";
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
  const [modeFilter, setModeFilter] = useState<"all" | "live" | "practice">("all");

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
    const totalQuestions = history.reduce((acc, r) => acc + r.questions.length, 0);
    return {
      total: history.length,
      avgAcc: Math.round(sumAcc / history.length),
      bestAcc: Math.round(bestAcc),
      totalMins: Math.max(1, Math.round(totalSecs / 60)),
      totalQuestions,
      avgSecsPerQ: totalQuestions > 0 ? Math.round(totalSecs / totalQuestions) : 0
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

  const trendData = useMemo(() => {
    return [...history].slice(0, 8).reverse();
  }, [history]);

  const activityDays = useMemo(() => {
    const countsByDay = new Map<string, number>();
    history.forEach((r) => {
      const key = new Date(r.dateISO).toISOString().slice(0, 10);
      countsByDay.set(key, (countsByDay.get(key) || 0) + 1);
    });
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5);
      const key = d.toISOString().slice(0, 10);
      days.push({
        key,
        label: toBanglaNum(d.getDate()),
        count: countsByDay.get(key) || 0
      });
    }
    return days;
  }, [history]);

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

  const chartW = 540;
  const chartH = 180;
  const padX = 28;
  const points = trendData.map((r, i) => {
    return {
      x:
        trendData.length === 1
          ? chartW / 2
          : padX + (i / (trendData.length - 1)) * 484,
      y: 160 - (Math.min(100, Math.max(0, r.accuracy)) / 100) * 140,
      r
    };
  });

  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPath =
    points.length > 1
      ? `M ${points[0].x} 160 ` +
        points.map((p) => `L ${p.x} ${p.y}`).join(" ") +
        ` L ${points[points.length - 1].x} 160 Z`
      : "";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>ফলাফল বিশ্লেষণ ও ইতিহাস</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            বিষয়ভিত্তিক দক্ষতা, সঠিকতার গ্রাফ, সময় ব্যবস্থাপনা এবং সকল পূর্ববর্তী
            উত্তরপত্র এক জায়গায়।
          </p>
        </div>

        {onGoExams ? (
          <button
            type="button"
            onClick={onGoExams}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <span>নতুন পরীক্ষা দিন</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        ) : (
          <Link
            href="/exams"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <span>নতুন পরীক্ষা দিন</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>মোট পরীক্ষা সম্পন্ন</span>
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-2">
            {toBanglaNum(summary.total)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
            মোট {toBanglaNum(summary.totalQuestions)}টি প্রশ্ন সমাধান
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>গড় সঠিকতা</span>
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-2">
            {toBanglaNum(summary.avgAcc)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
            সর্বোচ্চ: {toBanglaNum(summary.bestAcc)}%
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>গড় গতি</span>
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-slate-900 dark:text-slate-100 mt-2">
            {toBanglaNum(summary.avgSecsPerQ)} সে.
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
            প্রতি প্রশ্নে • মোট {toBanglaNum(summary.totalMins)} মিনিট
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>ধারাবাহিক স্ট্রিক</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono tabular-nums text-amber-500 mt-2">
            {toBanglaNum(streakCount)} দিন
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            প্রতিদিন অন্তত ১টি কুইজ সম্পন্ন করুন
          </div>
        </div>
      </div>

      {/* Accuracy Trend & Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SVG Trend Chart */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                সঠিকতার অগ্রগতি (সর্বশেষ ৮ পরীক্ষা)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                প্রতিটি পরীক্ষার শতাংশ (%) অনুযায়ী পারফরম্যান্স ট্রেন্ড
              </p>
            </div>
          </div>

          {trendData.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-sm text-slate-400 dark:text-slate-500">
              চার্ট দেখতে অন্তত ১টি পরীক্ষা সম্পন্ন করুন।
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-48">
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = 160 - (val / 100) * 140;
                  return (
                    <g key={val}>
                      <line
                        x1={padX}
                        y1={y}
                        x2={512}
                        y2={y}
                        stroke="currentColor"
                        strokeDasharray="3 3"
                        className="text-slate-200 dark:text-slate-800"
                      />
                      <text
                        x={4}
                        y={y + 3}
                        fontSize="10"
                        className="fill-slate-400 dark:fill-slate-500 font-mono"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {areaPath && (
                  <path
                    d={areaPath}
                    className="fill-blue-600/10 dark:fill-blue-400/15"
                  />
                )}

                {points.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polyline}
                    className="text-blue-600 dark:text-blue-400"
                  />
                )}

                {points.map((p, idx) => (
                  <g key={`${p.r.id}_${idx}`}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r="5"
                      className="fill-white dark:fill-slate-900 stroke-blue-600 dark:stroke-blue-400"
                      strokeWidth="2.5"
                    />
                    <text
                      x={p.x}
                      y={p.y - 10}
                      textAnchor="middle"
                      fontSize="10"
                      className="fill-slate-700 dark:fill-slate-300 font-mono font-bold"
                    >
                      {p.r.accuracy}%
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>

        {/* Subject-Wise Mastery & 14-Day Activity */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between gap-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              বিষয়ভিত্তিক দক্ষতা
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              কোন বিষয়ে প্রস্তুতি শক্তিশালী এবং কোথায় আরও মনোযোগ প্রয়োজন
            </p>

            {subjectStats.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                কোনো বিষয়ভিত্তিক ডেটা নেই।
              </div>
            ) : (
              <div className="space-y-3.5">
                {subjectStats.map((s) => (
                  <div key={s.subject}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {s.subject}
                      </span>
                      <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
                        {toBanglaNum(s.avgAccuracy)}% • {toBanglaNum(s.attempts)}টি পরীক্ষা
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          s.avgAccuracy >= 75
                            ? "bg-emerald-500"
                            : s.avgAccuracy >= 55
                            ? "bg-blue-600"
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

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                বিগত ১৪ দিনের অনুশীলন সক্রিয়তা
              </span>
              <span className="text-slate-400 dark:text-slate-500">
                প্রতিদিনের পরীক্ষা
              </span>
            </div>
            <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
              {activityDays.map((day) => (
                <div
                  key={day.key}
                  title={`${day.key}: ${day.count}টি পরীক্ষা`}
                  className={`h-9 rounded-lg flex flex-col items-center justify-center text-[11px] font-mono tabular-nums border ${
                    day.count >= 2
                      ? "bg-blue-600 text-white border-blue-600 font-bold"
                      : day.count === 1
                      ? "bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800 font-semibold"
                      : "bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border-slate-200/60 dark:border-slate-800"
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
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            পরীক্ষার পূর্ণ ইতিহাস ({toBanglaNum(filteredHistory.length)})
          </h2>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="পরীক্ষা খুঁজুন..."
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              {[
                { id: "all", label: "সব" },
                { id: "live", label: "লাইভ" },
                { id: "practice", label: "প্র্যাকটিস" }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setModeFilter(t.id as "all" | "live" | "practice")}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    modeFilter === t.id
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500 dark:text-slate-400">
            কোনো পরীক্ষার ইতিহাস পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/70 dark:bg-slate-800/40">
                  <th className="py-3 px-5">পরীক্ষা ও বিষয়</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4 text-right">স্কোর</th>
                  <th className="py-3 px-4 text-right">সঠিকতা</th>
                  <th className="py-3 px-4 text-right">সময়</th>
                  <th className="py-3 px-5 text-right">উত্তরপত্র</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.subject} • {item.mode === "live" ? "লাইভ" : "প্র্যাকটিস"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formatDateBangla(item.dateISO)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {toBanglaNum(item.score)} / {toBanglaNum(item.total)}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums whitespace-nowrap">
                      <span
                        className={
                          item.accuracy >= 70
                            ? "text-emerald-600 dark:text-emerald-400"
                            : item.accuracy >= 50
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {toBanglaNum(item.accuracy)}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-xs text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                      {formatDurationBangla(item.timeSpentSeconds)}
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      {onViewResult ? (
                        <button
                          type="button"
                          onClick={() => onViewResult(item)}
                          className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          রিভিউ দেখুন →
                        </button>
                      ) : (
                        <Link
                          href={`/results/${item.id}`}
                          className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          রিভিউ দেখুন →
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
