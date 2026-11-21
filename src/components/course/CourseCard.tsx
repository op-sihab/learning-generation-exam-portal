"use client";

import React from "react";
import Link from "next/link";
import { Users, BookOpen, ArrowRight, CheckCircle2 } from "lucide-react";
import { Course } from "@/types";
import { CourseArtwork } from "./CourseArtwork";
import { toBanglaNum } from "@/utils/format";

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled = false
}) => {
  const totalChapters = course.subjects.reduce(
    (sum, s) => sum + s.chapters.length,
    0
  );

  return (
    <article className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700/70 transition-all flex flex-col justify-between">
      <div>
        <CourseArtwork
          variant={course.artwork}
          title={course.name}
          subtitle={course.sub}
        />

        <div className="p-6 space-y-3.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              <span>{toBanglaNum(course.subjects.length)}টি বিষয়</span>
              <span className="text-slate-400">•</span>
              <span>{toBanglaNum(totalChapters)}টি অধ্যায়</span>
            </span>

            {isEnrolled && (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>এনরোল্ড</span>
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {course.name}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {course.desc}
          </p>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="truncate font-medium text-slate-600 dark:text-slate-400">
              মেন্টর: <span className="text-slate-800 dark:text-slate-200 font-semibold">{course.instructor}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 font-medium">
              <Users className="w-3.5 h-3.5" />
              <span>{toBanglaNum(course.enrolledCount)}+ শিক্ষার্থী</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-1">
        <Link
          href={`/courses/${course.id}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all group-hover:bg-blue-600 group-hover:text-white"
        >
          <span>বিষয় ও সিলেবাস দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
};
