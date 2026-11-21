"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { CourseArtwork } from "@/components/course/CourseArtwork";
import { ExamCard } from "@/components/exam/ExamCard";
import { toBanglaNum } from "@/utils/format";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { courses, exams } = usePortal();

  const courseId = params?.courseId as string;
  const course = useMemo(() => {
    return courses.find((c) => c.id === courseId);
  }, [courses, courseId]);

  // Find exams associated with this course or its subject
  const relatedExams = useMemo(() => {
    if (!course) return [];
    return exams.filter((e) => {
      if (e.courseId === course.id) return true;
      return course.subjects.some(
        (s) => s.name.toLowerCase() === e.subject.toLowerCase()
      );
    });
  }, [exams, course]);

  if (!course) {
    return (
      <div className="py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          কোর্সটি পাওয়া যায়নি
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          অনুরোধকৃত কোর্সটি অপসারিত হয়েছে অথবা লিংকটি ভুল।
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          সকল কোর্সে ফিরে যান
        </Link>
      </div>
    );
  }

  const totalChapters = course.subjects.reduce(
    (sum, s) => sum + s.chapters.length,
    0
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Back button */}
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          সকল কোর্সে ফিরুন
        </Link>
      </div>

      {/* Hero Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="relative">
          <CourseArtwork
            variant={course.artwork}
            title={course.name}
            subtitle={course.sub}
          />
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">বিষয় সংখ্যা</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {toBanglaNum(course.subjects.length)} টি
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">অধ্যায় / টপিক</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {toBanglaNum(totalChapters)} টি
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">সম্পর্কিত পরীক্ষা</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {toBanglaNum(relatedExams.length)} টি
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">শিক্ষার্থী</div>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {toBanglaNum(course.enrolledCount)} জন
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {course.desc && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            কোর্স পরিচিতি
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {course.desc}
          </p>
        </div>
      )}

      {/* Subjects & Chapters Breakdown */}
      {course.subjects && course.subjects.length > 0 && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            সিলেবাস ও বিষয়ভিত্তিক অধ্যায়সমূহ
          </h2>

          <div className="space-y-6">
            {course.subjects.map((sub, sIdx) => (
              <div
                key={sub.id || sIdx}
                className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                      {toBanglaNum(sIdx + 1)}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">
                      {sub.name}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {toBanglaNum(sub.chapters.length)} টি অধ্যায়
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                  {sub.chapters.map((ch, cIdx) => (
                    <div
                      key={cIdx}
                      className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{ch}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Exams */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            এই কোর্সের মডেল টেস্ট ও পরীক্ষা
          </h2>
          <Link
            href="/exams"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
          >
            সকল পরীক্ষা দেখুন
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {relatedExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedExams.map((exam) => (
              <ExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              বর্তমানে এই কোর্সের জন্য আলাদা কোনো লাইভ পরীক্ষা নির্ধারিত নেই।
            </p>
            <Link
              href="/exams"
              className="mt-3 inline-block px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
            >
              অন্যান্য পরীক্ষা দেখুন
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
