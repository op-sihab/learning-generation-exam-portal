"use client";

import React, { useState, useMemo } from "react";
import {
  Trophy,
  Medal,
  Clock,
  Search,
  UserCheck,
  TrendingUp,
  Award
} from "lucide-react";
import { Exam, LeaderboardEntry } from "@/types";
import { usePortal } from "@/context/PortalContext";
import { toBanglaNum, formatDurationBangla } from "@/utils/format";
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
  const [search, setSearch] = useState("");

  const seededPeers: LeaderboardEntry[] = SEEDED_LEADERBOARD;
  const currentUserName = activeUser.name;

  const rankedRows = useMemo(() => {
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
        cur.score += p.score;
        cur.total += p.total;
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
          isCurrentUser: item.isCurrentUser
        }))
        .sort(
          (a, b) =>
            b.score - a.score ||
            b.accuracy - a.accuracy ||
            a.timeSpentSeconds - b.timeSpentSeconds
        );
    }

    const map = new Map<
      string,
      {
        key: string;
        userName: string;
        batch: string;
        score: number;
        total: number;
        accuracy: number;
        timeSpentSeconds: number;
        isCurrentUser: boolean;
      }
    >();

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
  }, [selectedExamId, seededPeers, history, currentUserName]);

  const visibleRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rankedRows;
    return rankedRows.filter(
      (r) =>
        r.userName.toLowerCase().includes(q) ||
        r.batch.toLowerCase().includes(q)
    );
  }, [rankedRows, search]);

  const topThree = rankedRows.slice(0, 3);
  const myRankIdx = rankedRows.findIndex((r) => r.isCurrentUser);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-500" />
            <span>মেরিট লিস্ট ও লিডারবোর্ড</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            সর্বোচ্চ নম্বর, সঠিকতা এবং কম সময়ে উত্তর দেওয়ার ভিত্তিতে মেধা তালিকা
            নির্ধারিত হয়।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-blue-500 shadow-xs"
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
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="শিক্ষার্থী বা ব্যাচ খুঁজুন..."
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-9 pr-3.5 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 shadow-xs w-48 sm:w-56"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length >= 3 && !search && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Silver #2 */}
          <div className="order-2 sm:order-1 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-center flex flex-col items-center justify-between shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center mb-2 font-bold text-lg">
              🥈 #২
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {topThree[1].userName}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{topThree[1].batch}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">স্কোর</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {toBanglaNum(topThree[1].score)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">সঠিকতা</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {toBanglaNum(topThree[1].accuracy)}%
                </span>
              </div>
            </div>
          </div>

          {/* Gold #1 */}
          <div className="order-1 sm:order-2 rounded-3xl bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-400 dark:border-amber-600 p-6 text-center flex flex-col items-center justify-between shadow-lg scale-105 z-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-2 font-bold text-xl shadow-md shadow-amber-500/30">
              👑 #১
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg">
                {topThree[0].userName}
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
                {topThree[0].batch}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200 dark:border-amber-800/80 w-full flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">শীর্ষ স্কোর</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-base tabular-nums">
                  {toBanglaNum(topThree[0].score)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">সঠিকতা</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base tabular-nums">
                  {toBanglaNum(topThree[0].accuracy)}%
                </span>
              </div>
            </div>
          </div>

          {/* Bronze #3 */}
          <div className="order-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 text-center flex flex-col items-center justify-between shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-2 font-bold text-lg">
              🥉 #৩
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                {topThree[2].userName}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{topThree[2].batch}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 w-full flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">স্কোর</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {toBanglaNum(topThree[2].score)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">সঠিকতা</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {toBanglaNum(topThree[2].accuracy)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Rank Callout if in list */}
      {myRankIdx !== -1 && (
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
              #{toBanglaNum(myRankIdx + 1)}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span>{currentUserName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold">
                  আপনি
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                আপনার বর্তমান অবস্থান মেধা তালিকার {toBanglaNum(myRankIdx + 1)}-তম স্থানে
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono font-bold tabular-nums">
            <span className="text-slate-900 dark:text-slate-100 text-sm">
              স্কোর: {toBanglaNum(rankedRows[myRankIdx].score)}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              সঠিকতা: {toBanglaNum(rankedRows[myRankIdx].accuracy)}%
            </span>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 text-center w-16">র‍্যাংক</th>
                <th className="py-3 px-4">শিক্ষার্থী</th>
                <th className="py-3 px-4 hidden sm:table-cell">ব্যাচ / কোর্স</th>
                <th className="py-3 px-4 text-center">স্কোর</th>
                <th className="py-3 px-4 text-center">সঠিকতা</th>
                <th className="py-3 px-4 text-center hidden md:table-cell">ব্যয়িত সময়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {visibleRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    কোনো ফলাফল পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                visibleRows.map((row, idx) => {
                  const rank = idx + 1;
                  const isCurrent = row.isCurrentUser;

                  return (
                    <tr
                      key={row.key || idx}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isCurrent
                          ? "bg-blue-50/70 dark:bg-blue-950/40 font-semibold"
                          : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-bold font-mono">
                        {rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-white font-bold text-xs">
                            ১
                          </span>
                        ) : rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs">
                            ২
                          </span>
                        ) : rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs">
                            ৩
                          </span>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">
                            #{toBanglaNum(rank)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-bold shrink-0">
                          {row.userName.charAt(0)}
                        </div>
                        <span className="truncate">{row.userName}</span>
                        {isCurrent && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            আপনি
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell truncate">
                        {row.batch}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold font-mono text-sm text-slate-900 dark:text-slate-100 tabular-nums">
                        {toBanglaNum(row.score)}
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold font-mono tabular-nums">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                            row.accuracy >= 80
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                              : row.accuracy >= 60
                              ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400"
                              : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {toBanglaNum(row.accuracy)}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center text-slate-500 dark:text-slate-400 hidden md:table-cell tabular-nums">
                        {formatDurationBangla(row.timeSpentSeconds)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
