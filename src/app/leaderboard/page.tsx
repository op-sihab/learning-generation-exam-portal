"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LeaderboardView } from "@/components/leaderboard/LeaderboardView";
import { Trophy } from "lucide-react";

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const examId = searchParams.get("examId") || undefined;

  return <LeaderboardView initialExamId={examId} />;
}

export default function LeaderboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <Suspense
        fallback={
          <div className="p-12 text-center">
            <Trophy className="w-8 h-8 text-amber-500 mx-auto animate-pulse mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              মেরিট লিস্ট ও লিডারবোর্ড লোড হচ্ছে...
            </p>
          </div>
        }
      >
        <LeaderboardContent />
      </Suspense>
    </div>
  );
}
