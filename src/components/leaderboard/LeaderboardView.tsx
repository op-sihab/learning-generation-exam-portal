"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Search,
  Clock,
  Target,
  Users,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { Exam, LeaderboardEntry } from "@/types";
import { usePortal } from "@/context/PortalContext";
import { toBanglaNum, formatDurationBangla } from "@/utils/format";
import {
  computeLeaderboardRows,
  computePercentile,
  RankedLeaderboardRow
} from "@/utils/portalHelpers";
import { SEEDED_LEADERBOARD } from "@/data/seedData";

export interface LeaderboardViewProps {
  exams?: Exam[];
  initialExamId?: string;
  onSelectExam?: (examId: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  exams: propExams,
  initialExamId
}) => {
  const { exams: portalExams, history, activeUser } = usePortal();
  const exams = propExams || portalExams;

  const [selectedExamId, setSelectedExamId] = useState<string>(
    initialExamId || "all"
  );
  const [batchFilter, setBatchFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const seededPeers: LeaderboardEntry[] = SEEDED_LEADERBOARD;
  const currentUserName = activeUser.name;

  const rankedRows = useMemo(
    () =>
      computeLeaderboardRows(
        selectedExamId,
        seededPeers,
        history,
        currentUserName
      ),
    [selectedExamId, seededPeers, history, currentUserName]
  );

  const availableBatches = useMemo(() => {
    const set = new Set<string>();
    rankedRows.forEach((r) => {
      if (r.batch && !r.isCurrentUser) set.add(r.batch);
    });
    return Array.from(set);
  }, [rankedRows]);

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rankedRows
      .map((row, index) => ({ ...row, rank: index + 1 }))
      .filter((r) => {
        if (batchFilter !== "all" && r.batch !== batchFilter) return false;
        if (
          q &&
          !r.userName.toLowerCase().includes(q) &&
          !r.batch.toLowerCase().includes(q)
        ) {
          return false;
        }
        return true;
      });
  }, [rankedRows, batchFilter, search]);

  const topThree = rankedRows.slice(0, 3);
  const myRankIdx = rankedRows.findIndex((r) => r.isCurrentUser);
  const myRow: RankedLeaderboardRow | null =
    myRankIdx !== -1 ? rankedRows[myRankIdx] : null;
  const rankAboveRow: RankedLeaderboardRow | null =
    myRankIdx > 0 ? rankedRows[myRankIdx - 1] : null;
  const pointsToNextRank =
    myRow && rankAboveRow
      ? Math.max(0.25, Math.round((rankAboveRow.score - myRow.score) * 100) / 100)
      : 0;
  const myPercentile = computePercentile(myRankIdx, rankedRows.length);

  const boardStats = useMemo(() => {
    if (rankedRows.length === 0) {
      return { participants: 0, avgAccuracy: 0, topScore: 0 };
    }
    const avgAcc = Math.round(
      rankedRows.reduce((s, r) => s + r.accuracy, 0) / rankedRows.length
    );
    return {
      participants: rankedRows.length,
      avgAccuracy: avgAcc,
      topScore: rankedRows[0].score
    };
  }, [rankedRows]);

  const selectedExamObj = useMemo(
    () => exams.find((e) => e.id === selectedExamId),
    [exams, selectedExamId]
  );

  return (
    <div className="space-y-8">
      {/* Arena Hero Header */}
      <section className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden">
        <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2.5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-500/12 border border-amber-500/25 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-amber-400" />
              </span>
              <div>
                <p className="text-xs font-semibold text-amber-400">
                  জাতীয় মেধা তালিকা
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 leading-tight">
                  মেরিট লিস্ট ও লিডারবোর্ড
                </h1>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-xl">
              {selectedExamObj
                ? `${selectedExamObj.name} — সর্বোচ্চ নম্বর, সঠিকতা ও দ্রুততম সময়ের ভিত্তিতে র‍্যাংকিং`
                : "সর্বোচ্চ নম্বর, সঠিকতা এবং কম সময়ে উত্তর দেওয়ার ভিত্তিতে সমন্বিত মেধাক্রম নির্ধারিত হয়।"}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <select
              value={selectedExamId}
              onChange={(e) => {
                setSelectedExamId(e.target.value);
                setBatchFilter("all");
              }}
              aria-label="পরীক্ষা নির্বাচন করুন"
              className="rounded-xl border border-white/[0.1] bg-[#131824] px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-100 focus:border-blue-500 min-w-[220px]"
            >
              <option value="all">সমন্বিত গ্লোবাল লিডারবোর্ড</option>
              {exams
                .filter((e) => e.published)
                .map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
            </select>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="শিক্ষার্থী বা ব্যাচ খুঁজুন..."
                aria-label="শিক্ষার্থী খুঁজুন"
                className="w-full sm:w-56 rounded-xl border border-white/[0.1] bg-[#131824] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Hairline 3-Stat Board Telemetry Strip */}
        <div className="grid grid-cols-3 gap-px bg-white/[0.07] border-t border-white/[0.07]">
          <div className="bg-[#090C12] px-5 py-3.5 flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-slate-400 block">অংশগ্রহণকারী</span>
              <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-slate-100">
                {toBanglaNum(boardStats.participants)} জন
              </span>
            </div>
            <Users className="w-4 h-4 text-slate-500 hidden sm:block" />
          </div>

          <div className="bg-[#090C12] px-5 py-3.5 flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-slate-400 block">শীর্ষ স্কোর</span>
              <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-amber-400">
                {toBanglaNum(boardStats.topScore)}
              </span>
            </div>
            <Crown className="w-4 h-4 text-amber-500/80 hidden sm:block" />
          </div>

          <div className="bg-[#090C12] px-5 py-3.5 flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-slate-400 block">গড় সঠিকতা</span>
              <span className="text-base sm:text-lg font-bold font-mono tabular-nums text-emerald-400">
                {toBanglaNum(boardStats.avgAccuracy)}%
              </span>
            </div>
            <Target className="w-4 h-4 text-emerald-500/80 hidden sm:block" />
          </div>
        </div>
      </section>

      {/* Architectural 3-Tier Olympic Podium */}
      {topThree.length >= 3 && !search && batchFilter === "all" && (
        <section
          aria-label="শীর্ষ তিন মেধাবী"
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:items-end"
        >
          {/* #2 Silver Runner-Up (Left on desktop) */}
          <div className="order-2 md:order-1 rounded-2xl bg-[#0C0F16] border border-slate-400/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07)] p-6 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="w-7 h-7 rounded-lg bg-slate-400/12 border border-slate-400/25 flex items-center justify-center">
                  <Medal className="w-4 h-4 text-slate-300" />
                </span>
                <span>দ্বিতীয় স্থান</span>
              </span>
              <span className="font-mono text-sm font-bold text-slate-300 tabular-nums">
                #০২
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#141A26] border border-slate-400/30 text-slate-100 flex items-center justify-center font-bold text-lg shrink-0">
                {topThree[1].userName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-50 text-base truncate">
                  {topThree[1].userName}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {topThree[1].batch}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/[0.07]">
              <div className="grid grid-cols-3 gap-2 text-xs tabular-nums">
                <div>
                  <span className="text-[11px] text-slate-400 block">স্কোর</span>
                  <span className="font-mono font-bold text-base text-slate-50">
                    {toBanglaNum(topThree[1].score)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">সঠিকতা</span>
                  <span className="font-mono font-bold text-base text-emerald-400">
                    {toBanglaNum(topThree[1].accuracy)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">সময়</span>
                  <span className="font-medium text-slate-300 block mt-0.5 truncate">
                    {formatDurationBangla(topThree[1].timeSpentSeconds)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
                <div
                  className="h-full rounded-full bg-slate-300"
                  style={{ width: `${topThree[1].accuracy}%` }}
                />
              </div>
            </div>
          </div>

          {/* #1 Gold Champion (Elevated Center Stage) */}
          <div className="order-1 md:order-2 rounded-2xl bg-gradient-to-b from-amber-500/[0.11] via-[#0E1118] to-[#0C0F16] border border-amber-500/40 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.22)] p-6 md:py-7 flex flex-col justify-between gap-6">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-300">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/35 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-400" />
                </span>
                <span>প্রথম স্থান · চ্যাম্পিয়ন</span>
              </span>
              <span className="font-mono text-sm font-bold text-amber-400 tabular-nums">
                #০১
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-extrabold text-xl shrink-0 shadow-lg shadow-amber-500/20">
                {topThree[0].userName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-white text-lg truncate">
                  {topThree[0].userName}
                </h3>
                <p className="text-xs text-amber-300/90 font-medium truncate mt-0.5">
                  {topThree[0].batch}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-amber-500/20">
              <div className="grid grid-cols-3 gap-2 text-xs tabular-nums">
                <div>
                  <span className="text-[11px] text-slate-400 block">শীর্ষ স্কোর</span>
                  <span className="font-mono font-bold text-xl text-white">
                    {toBanglaNum(topThree[0].score)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">সঠিকতা</span>
                  <span className="font-mono font-bold text-xl text-emerald-400">
                    {toBanglaNum(topThree[0].accuracy)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">সময়</span>
                  <span className="font-medium text-slate-200 block mt-1 truncate">
                    {formatDurationBangla(topThree[0].timeSpentSeconds)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
                  style={{ width: `${topThree[0].accuracy}%` }}
                />
              </div>
            </div>
          </div>

          {/* #3 Bronze Finisher (Right on desktop) */}
          <div className="order-3 rounded-2xl bg-[#0C0F16] border border-orange-500/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] p-6 flex flex-col justify-between gap-5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-orange-300">
                <span className="w-7 h-7 rounded-lg bg-orange-500/12 border border-orange-500/25 flex items-center justify-center">
                  <Award className="w-4 h-4 text-orange-400" />
                </span>
                <span>তৃতীয় স্থান</span>
              </span>
              <span className="font-mono text-sm font-bold text-orange-400/90 tabular-nums">
                #০৩
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/12 border border-orange-500/25 text-orange-300 flex items-center justify-center font-bold text-lg shrink-0">
                {topThree[2].userName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-50 text-base truncate">
                  {topThree[2].userName}
                </h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {topThree[2].batch}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/[0.07]">
              <div className="grid grid-cols-3 gap-2 text-xs tabular-nums">
                <div>
                  <span className="text-[11px] text-slate-400 block">স্কোর</span>
                  <span className="font-mono font-bold text-base text-slate-50">
                    {toBanglaNum(topThree[2].score)}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">সঠিকতা</span>
                  <span className="font-mono font-bold text-base text-emerald-400">
                    {toBanglaNum(topThree[2].accuracy)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">সময়</span>
                  <span className="font-medium text-slate-300 block mt-0.5 truncate">
                    {formatDurationBangla(topThree[2].timeSpentSeconds)}
                  </span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/[0.07] overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-400"
                  style={{ width: `${topThree[2].accuracy}%` }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Your Standing Spotlight Banner */}
      {myRow && (
        <section className="rounded-2xl bg-gradient-to-r from-blue-600/[0.14] via-[#0C0F16] to-[#0C0F16] border border-blue-500/30 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-mono font-bold text-base flex items-center justify-center shrink-0 shadow-md shadow-blue-600/25">
              #{toBanglaNum(myRankIdx + 1)}
            </div>
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-50">
                <span className="truncate">{currentUserName}</span>
                <span className="text-xs font-semibold text-blue-400 shrink-0">
                  (আপনার অবস্থান · শীর্ষ {toBanglaNum(100 - myPercentile + 1)}%)
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>
                  {myRankIdx === 0
                    ? "অভিনন্দন! আপনি বর্তমানে মেধা তালিকার শীর্ষ স্থানে রয়েছেন।"
                    : `পরবর্তী #${toBanglaNum(myRankIdx)} স্থানে উঠতে আরও মাত্র ${toBanglaNum(
                        pointsToNextRank
                      )} নম্বর প্রয়োজন`}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 shrink-0">
            <div className="flex items-center gap-5 text-xs font-mono tabular-nums">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">
                  মোট স্কোর
                </span>
                <span className="text-sm font-bold text-slate-50">
                  {toBanglaNum(myRow.score)} / {toBanglaNum(myRow.total)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">
                  সঠিকতা
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  {toBanglaNum(myRow.accuracy)}%
                </span>
              </div>
            </div>

            <Link
              href="/exams"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <span>র‍্যাংক বাড়ান</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* Full Merit Standings Table */}
      <section className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] overflow-hidden">
        {/* Table Toolbar with Segmented Batch Filter */}
        <div className="px-4 sm:px-5 py-4 border-b border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-100">
            পূর্ণ মেধা তালিকা{" "}
            <span className="font-mono text-xs text-slate-400 font-medium tabular-nums ml-1">
              ({toBanglaNum(visibleRows.length)})
            </span>
          </h2>

          {availableBatches.length > 1 && (
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#131824] border border-white/[0.06] overflow-x-auto no-scrollbar max-w-full text-[11px] sm:text-xs font-medium">
              <button
                type="button"
                onClick={() => setBatchFilter("all")}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  batchFilter === "all"
                    ? "bg-[#1C2436] text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                সব ব্যাচ
              </button>
              {availableBatches.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBatchFilter(b)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    batchFilter === b
                      ? "bg-[#1C2436] text-white font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#090C12] text-slate-400 text-[11px] font-semibold border-b border-white/[0.07]">
                <th className="py-3 px-2.5 sm:px-4 text-center w-12 sm:w-16">র‍্যাংক</th>
                <th className="py-3 px-2 sm:px-4">শিক্ষার্থী</th>
                <th className="py-3 px-4 hidden sm:table-cell">ব্যাচ / কোর্স</th>
                <th className="py-3 px-2.5 sm:px-4 text-right">স্কোর</th>
                <th className="py-3 px-2.5 sm:px-4 text-right sm:text-left sm:w-40">সঠিকতা</th>
                <th className="py-3 px-5 text-right hidden md:table-cell">
                  ব্যয়িত সময়
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-14 text-center text-sm text-slate-400"
                  >
                    কোনো ফলাফল পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => {
                  const rank = row.rank;
                  const isCurrent = row.isCurrentUser;

                  return (
                    <tr
                      key={row.key}
                      className={`hover:bg-white/[0.03] transition-colors ${
                        isCurrent ? "bg-blue-500/[0.08]" : ""
                      }`}
                    >
                      <td className="py-3 px-2.5 sm:px-4 text-center font-mono font-bold align-middle">
                        {rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs">
                            ১
                          </span>
                        ) : rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-400/15 border border-slate-400/30 text-slate-200 text-xs">
                            ২
                          </span>
                        ) : rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs">
                            ৩
                          </span>
                        ) : (
                          <span className="text-slate-400 tabular-nums">
                            #{toBanglaNum(rank)}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-2 sm:px-4 align-middle">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border flex items-center justify-center text-xs font-bold shrink-0 ${
                              isCurrent
                                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                                : "bg-[#131824] border-white/[0.08] text-slate-200"
                            }`}
                          >
                            {row.userName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-xs sm:text-sm text-slate-100 truncate flex items-center gap-1">
                              <span className="truncate">{row.userName}</span>
                              {isCurrent && (
                                <span className="text-[10px] sm:text-[11px] font-semibold text-blue-400 shrink-0">
                                  (আপনি)
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate sm:hidden mt-0.5">
                              {row.batch}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-400 hidden sm:table-cell align-middle">
                        <span className="block max-w-[200px] truncate">
                          {row.batch}
                        </span>
                      </td>

                      <td className="py-3 px-2.5 sm:px-4 text-right font-mono tabular-nums whitespace-nowrap align-middle">
                        <span className="font-bold text-xs sm:text-sm text-slate-50">
                          {toBanglaNum(row.score)}
                        </span>
                        <span className="text-slate-500 text-xs hidden sm:inline">
                          {" "}
                          / {toBanglaNum(row.total)}
                        </span>
                      </td>

                      <td className="py-3 px-2.5 sm:px-4 text-right sm:text-left align-middle">
                        <div className="inline-flex items-center justify-end sm:justify-start gap-2.5">
                          <div className="hidden sm:block w-16 h-1.5 rounded-full bg-white/[0.07] overflow-hidden shrink-0">
                            <div
                              className={`h-full rounded-full ${
                                row.accuracy >= 80
                                  ? "bg-emerald-400"
                                  : row.accuracy >= 60
                                  ? "bg-blue-400"
                                  : "bg-amber-400"
                              }`}
                              style={{ width: `${row.accuracy}%` }}
                            />
                          </div>
                          <span
                            className={`font-mono font-bold tabular-nums text-right ${
                              row.accuracy >= 80
                                ? "text-emerald-400"
                                : row.accuracy >= 60
                                ? "text-blue-400"
                                : "text-amber-400"
                            }`}
                          >
                            {toBanglaNum(row.accuracy)}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-5 text-right text-slate-400 hidden md:table-cell tabular-nums whitespace-nowrap align-middle">
                        <span className="inline-flex items-center justify-end gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formatDurationBangla(row.timeSpentSeconds)}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
