"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/[0.07] bg-[#080A10] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-11">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <BrandLogo size={28} />
              <span className="font-bold text-slate-100 text-sm tracking-tight">
                Learning Generation
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              SSC, HSC ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার জন্য অধ্যায়ভিত্তিক CBT মডেল টেস্ট,
              গাণিতিক ও রাসায়নিক সমীকরণসহ ব্যাখ্যা এবং নির্ভুল পারফরম্যান্স বিশ্লেষণ।
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200">নেভিগেশন</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link
                  href="/courses"
                  className="hover:text-blue-400 transition-colors"
                >
                  কোর্স ও সিলেবাস
                </Link>
              </li>
              <li>
                <Link
                  href="/exams"
                  className="hover:text-blue-400 transition-colors"
                >
                  মডেল টেস্ট ও প্র্যাকটিস
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="hover:text-blue-400 transition-colors"
                >
                  মেরিট লিডারবোর্ড
                </Link>
              </li>
              <li>
                <Link
                  href="/analytics"
                  className="hover:text-blue-400 transition-colors"
                >
                  ফলাফল বিশ্লেষণ
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200">
              প্রস্তুতি প্রোগ্রাম
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>SSC 26/27 Science Premium Batch</li>
              <li>ACS Compact GST Admission 2025</li>
              <li>SUST · RU · BUP Varsity Special</li>
            </ul>
          </div>
        </div>

        <div className="mt-9 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>© ২০২৬ Learning Generation. সর্বস্বত্ব সংরক্ষিত।</span>
          <span>সিকিউর CBT মূল্যায়ন ও KaTeX ব্যাখ্যা সাপোর্ট</span>
        </div>
      </div>
    </footer>
  );
};
