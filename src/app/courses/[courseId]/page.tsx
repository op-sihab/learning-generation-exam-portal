"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, ArrowRight } from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { CourseArtwork } from "@/components/course/CourseArtwork";
import { ExamCard } from "@/components/exam/ExamCard";
import { SubjectIcon } from "@/components/common/SubjectIcon";
import { toBanglaNum } from "@/utils/format";

export default function CourseDetailPage() {
  const params = useParams();
  const {
    courses,
    exams,
    activeAttempt,
    history,
    bestScoreByExam,
    latestResultByExam
  } = usePortal();

  const courseId = params?.courseId as string;
  const course = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courses, courseId]
  );

  const relatedExams = useMemo(() => {
    if (!course) return [];
    return exams.filter((e) => {
      if (e.courseId === course.id) return true;
      return course.subjects.some(
        (s) => s.name.toLowerCase() === e.subject.toLowerCase()
      );
    });
  }, [exams, course]);

  const completedExamIds = useMemo(
    () => new Set(history.map((h) => h.examId)),
    [history]
  );

  if (!course) {
    return (
      <div className="py-16 text-center space-y-3">
        <BookOpen className="w-10 h-10 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-100">
          কোর্সটি পাওয়া যায়নি
        </h2>
        <p className="text-sm text-slate-400">
          অনুরোধকৃত কোর্সটি অপসারিত হয়েছে অথবা লিংকটি সঠিক নয়।
        </p>
        <div className="pt-2">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>সকল কোর্সে ফিরে যান</span>
          </Link>
        </div>
      </div>
    );
  }

  const totalChapters = course.subjects.reduce(
    (sum, s) => sum + s.chapters.length,
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>সকল কোর্সে ফিরুন</span>
        </Link>
      </div>

      {/* Course Overview Header */}
      <section className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden">
        <CourseArtwork variant={course.artwork} subtitle={course.sub} hero />

        <div className="p-6 sm:p-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 leading-snug">
              {course.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              {course.desc}
            </p>
            <div className="text-xs text-slate-400 pt-1">
              মেন্টর:{" "}
              <span className="font-semibold text-slate-200">
                {course.instructor}
              </span>
            </div>
          </div>
        </div>

        {/* Hairline 4-Stat Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.07] border-t border-white/[0.07]">
          <div className="p-4 sm:p-5 bg-[#090C12]">
            <div className="text-xs text-slate-400">বিষয়</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-100 mt-0.5">
              {toBanglaNum(course.subjects.length)}টি
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#090C12]">
            <div className="text-xs text-slate-400">অধ্যায় ও টপিক</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-100 mt-0.5">
              {toBanglaNum(totalChapters)}টি
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#090C12]">
            <div className="text-xs text-slate-400">সম্পর্কিত পরীক্ষা</div>
            <div className="text-lg font-bold font-mono tabular-nums text-slate-100 mt-0.5">
              {toBanglaNum(relatedExams.length)}টি
            </div>
          </div>

          <div className="p-4 sm:p-5 bg-[#090C12]">
            <div className="text-xs text-slate-400">সক্রিয় শিক্ষার্থী</div>
            <div className="text-lg font-bold font-mono tabular-nums text-blue-400 mt-0.5">
              {toBanglaNum(course.enrolledCount)}+
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus Breakdown */}
      {course.subjects && course.subjects.length > 0 && (
        <section className="rounded-2xl bg-[#0C0F16] border border-white/[0.08] divide-y divide-white/[0.07]">
          <div className="p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-50">
              সিলেবাস ও বিষয়ভিত্তিক অধ্যায়সমূহ
            </h2>
          </div>

          {course.subjects.map((sub, sIdx) => (
            <div key={sub.id || sIdx} className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <SubjectIcon subject={sub.name} size="sm" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-100">
                    <span className="font-mono text-blue-400 mr-2 tabular-nums">
                      {toBanglaNum(sIdx + 1)}.
                    </span>
                    {sub.name}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-medium tabular-nums shrink-0">
                  {toBanglaNum(sub.chapters.length)}টি অধ্যায়
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {sub.chapters.map((ch, cIdx) => (
                  <div
                    key={cIdx}
                    className="px-3.5 py-2.5 rounded-xl bg-[#131824] border border-white/[0.07] text-xs sm:text-sm text-slate-200"
                  >
                    {ch}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Related Exams */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-50">
            এই কোর্সের মডেল টেস্টসমূহ
          </h2>
          <Link
            href="/exams"
            className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>সকল পরীক্ষা</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {relatedExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                course={course}
                activeAttempt={activeAttempt}
                hasCompleted={completedExamIds.has(exam.id)}
                bestScore={bestScoreByExam.get(exam.id)}
                latestResultId={latestResultByExam.get(exam.id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-white/[0.12] bg-[#0C0F16]">
            <p className="text-sm text-slate-400">
              বর্তমানে এই কোর্সের জন্য আলাদা কোনো পরীক্ষা নির্ধারিত নেই।
            </p>
            <Link
              href="/exams"
              className="mt-3 inline-block px-4 py-2 rounded-xl bg-[#131824] border border-white/[0.1] text-xs font-semibold text-slate-200 hover:bg-[#181F2E] transition-colors"
            >
              অন্যান্য পরীক্ষা দেখুন
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
