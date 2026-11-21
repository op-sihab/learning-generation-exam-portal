"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Users, Layers } from "lucide-react";
import { Course } from "@/types";
import { CourseArtwork } from "./CourseArtwork";
import { toBanglaNum } from "@/utils/format";

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  priority?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled = false,
  priority = false
}) => {
  const totalChapters = course.subjects.reduce(
    (sum, s) => sum + s.chapters.length,
    0
  );

  return (
    <article className="group rounded-2xl bg-[#0C0F16] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] overflow-hidden hover:border-blue-500/45 transition-all duration-200 flex flex-col justify-between">
      <div>
        <Link href={`/courses/${course.id}`} className="block">
          <CourseArtwork
            variant={course.artwork}
            subtitle={course.sub}
            priority={priority}
          />
        </Link>

        <div className="px-5 pt-4 pb-5 space-y-3">
          {/* Unboxed metadata row */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
            <div className="inline-flex items-center gap-1.5 min-w-0 truncate tabular-nums">
              <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{toBanglaNum(course.subjects.length)}টি বিষয়</span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span>{toBanglaNum(totalChapters)}টি অধ্যায়</span>
            </div>

            {isEnrolled && (
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold shrink-0 whitespace-nowrap">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>সক্রিয় ব্যাচ</span>
              </span>
            )}
          </div>

          <Link href={`/courses/${course.id}`} className="block">
            <h3 className="text-[17px] font-bold text-slate-50 group-hover:text-blue-400 transition-colors leading-snug">
              {course.name}
            </h3>
          </Link>

          <p className="text-xs sm:text-[13px] text-slate-400 line-clamp-2 leading-relaxed">
            {course.desc}
          </p>

          {/* Quiet subject list line */}
          {course.subjects.length > 0 && (
            <div className="pt-1 text-[11px] text-slate-500 truncate">
              {course.subjects.map((s) => s.name).join(" · ")}
            </div>
          )}
        </div>
      </div>

      {/* Footer Strip */}
      <div className="px-5 py-3.5 border-t border-white/[0.06] bg-[#090C12] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 text-xs text-slate-400 truncate">
          <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-slate-300 font-medium truncate">
            {course.instructor}
          </span>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <span className="font-mono tabular-nums text-slate-400 shrink-0">
            {toBanglaNum(course.enrolledCount)}+
          </span>
        </div>

        <Link
          href={`/courses/${course.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap shrink-0 transition-colors"
        >
          <span>সিলেবাস</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
};
