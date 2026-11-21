"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";

export default function AnalyticsPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <AnalyticsView
        onViewResult={(result) => router.push(`/results/${result.id}`)}
        onGoExams={() => router.push("/exams")}
      />
    </div>
  );
}
