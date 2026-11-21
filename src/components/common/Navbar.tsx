"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, LogIn, User as UserIcon, Wrench } from "lucide-react";
import { usePortal } from "@/context/PortalContext";
import { BrandLogo } from "./BrandLogo";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { activeUser, openAuthModal } = usePortal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin =
    activeUser.role === "admin" || activeUser.role === "instructor";

  const navLinks = [
    { label: "হোম", href: "/" },
    { label: "কোর্স", href: "/courses" },
    { label: "পরীক্ষা", href: "/exams" },
    { label: "লিডারবোর্ড", href: "/leaderboard" },
    { label: "অ্যানালিটিক্স", href: "/analytics" }
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#06070B]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single-line Brand Wordmark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 whitespace-nowrap group"
          >
            <BrandLogo
              size={32}
              className="transition-transform duration-150 group-hover:scale-[1.04]"
            />
            <span className="font-bold text-[15px] sm:text-base tracking-tight text-slate-50">
              Learning Generation
            </span>
          </Link>

          {/* Zone 2: Clean Single-line Typography Nav */}
          <nav
            aria-label="প্রধান নেভিগেশন"
            className="hidden md:flex items-center gap-7"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                    active
                      ? "text-white font-semibold"
                      : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-underline"
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-500 rounded-full"
                    />
                  )}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/studio"
                className={`relative py-5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive("/studio")
                    ? "text-white font-semibold"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                স্টুডিও
                {isActive("/studio") && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-blue-500 rounded-full"
                  />
                )}
              </Link>
            )}
          </nav>

          {/* Zone 3: Single Primary Account Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/profile"
              className="inline-flex items-center justify-center sm:justify-start gap-2.5 w-9 sm:w-auto h-9 sm:pl-1.5 sm:pr-3.5 rounded-xl border border-white/[0.09] bg-[#0C0F16] hover:bg-[#131824] hover:border-white/[0.18] transition-colors shrink-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
              aria-label="প্রোফাইল"
            >
              {activeUser.photo ? (
                <img
                  src={activeUser.photo}
                  alt={activeUser.name}
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-lg object-cover"
                />
              ) : (
                <span className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/25 text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {activeUser.name.charAt(0)}
                </span>
              )}
              <span className="hidden sm:inline text-xs font-semibold text-slate-200 truncate max-w-[104px] whitespace-nowrap">
                {activeUser.name}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden w-9 h-9 rounded-xl border border-white/[0.09] bg-[#0C0F16] text-slate-300 hover:bg-[#131824] flex items-center justify-center transition-colors"
              aria-label={mobileMenuOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-white/[0.07] bg-[#0C0F16] px-4 py-3.5 space-y-1 shadow-2xl"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-blue-500/15 text-blue-300 font-semibold border border-blue-500/25"
                      : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                href="/studio"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive("/studio")
                    ? "bg-blue-500/15 text-blue-300 font-semibold border border-blue-500/25"
                    : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <Wrench className="w-4 h-4" />
                <span>ইনস্ট্রাক্টর স্টুডিও</span>
              </Link>
            )}

            <div className="pt-3 mt-2.5 border-t border-white/[0.07] flex items-center justify-between gap-2">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>প্রোফাইল ও সেটিংস</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>অ্যাকাউন্ট সুইচ</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
