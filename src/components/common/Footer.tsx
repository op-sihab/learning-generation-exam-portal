"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Heart, Sparkles, BookOpen } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 transition-colors mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-base">
                Learning Generation
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              একটি আধুনিক ও উচ্চমান সম্পন্ন অনলাইন CBT মডেল টেস্ট ও মূল্যায়ন প্ল্যাটফর্ম। SSC,
              HSC এবং বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থীদের জন্য নিখুঁত সময়ানুবর্তিতা, নির্ভুল
              অ্যানালিটিক্স ও ব্যাখ্যাসহ সম্পূর্ণ প্রস্তুতি।
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>অ্যান্টি-চিট সিকিউরড মোড</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LaTeX ও mhchem সমীকরণ সমর্থন</span>
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              কুইক নেভিগেশন
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  হোম ড্যাশবোর্ড
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-blue-600 transition-colors">
                  ব্যাচ ও বিষয়ভিত্তিক অধ্যায়
                </Link>
              </li>
              <li>
                <Link href="/exams" className="hover:text-blue-600 transition-colors">
                  সকল পরীক্ষা ও প্র্যাকটিস
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-blue-600 transition-colors">
                  লাইভ মেরিট লিডারবোর্ড
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-blue-600 transition-colors">
                  অ্যানালিটিক্স ও ভুল খাতা
                </Link>
              </li>
            </ul>
          </div>

          {/* Batches info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              সক্রিয় ব্যাচসমূহ
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>SSC 26/27 Premium Batch</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                <span>ACS COMPACT GST 2025</span>
              </li>
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>SUST-RU-BUP Special Varsity</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 Learning Generation Exam Portal. সর্বস্বত্ব সংরক্ষিত।
          </div>
          <div className="flex items-center gap-1">
            <span>নির্মিত</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" />
            <span>দ্বারা শিক্ষার্থী ও ইনস্ট্রাক্টরদের সুবিধার জন্য</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
