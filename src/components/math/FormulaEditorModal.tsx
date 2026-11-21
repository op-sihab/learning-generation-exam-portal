"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  Sigma,
  Copy,
  Eraser,
  CircleAlert,
  CircleCheck,
  X,
  Plus
} from "lucide-react";
import { renderLatex } from "@/utils/math";

export interface SnippetItem {
  label: string;
  latex: string;
}

export interface SnippetGroup {
  group: string;
  items: SnippetItem[];
}

export const MATH_SNIPPETS: SnippetGroup[] = [
	{
		group: "মৌলিক ও বীজগণিত",
		items: [
			{
				label: "ভগ্নাংশ",
				latex: "\\frac{a}{b}"
			},
			{
				label: "বর্গমূল",
				latex: "\\sqrt{x}"
			},
			{
				label: "n-তম মূল",
				latex: "\\sqrt[n]{x}"
			},
			{
				label: "ঘাত (Power)",
				latex: "x^{2}"
			},
			{
				label: "সাবস্ক্রিপ্ট",
				latex: "a_{n}"
			},
			{
				label: "দ্বিঘাত সূত্র",
				latex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}"
			},
			{
				label: "প্লাস-মাইনাস",
				latex: "\\pm"
			},
			{
				label: "গুণ চিহ্ন",
				latex: "\\times"
			},
			{
				label: "অসমতা ≤",
				latex: "\\leq"
			},
			{
				label: "অসমতা ≥",
				latex: "\\geq"
			},
			{
				label: "অসমান ≠",
				latex: "\\neq"
			},
			{
				label: "প্রায় সমান ≈",
				latex: "\\approx"
			}
		]
	},
	{
		group: "ক্যালকুলাস, ত্রিকোণমিতি ও ম্যাট্রিক্স",
		items: [
			{
				label: "সমাকলন (Integral)",
				latex: "\\int_{a}^{b} f(x)\\,dx"
			},
			{
				label: "সমষ্টি (Sum)",
				latex: "\\sum_{i=1}^{n} x_i"
			},
			{
				label: "সীমা (Limit)",
				latex: "\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1"
			},
			{
				label: "অন্তরীকরণ",
				latex: "\\frac{d}{dx}(\\ln(\\sin x)) = \\cot x"
			},
			{
				label: "sin θ",
				latex: "\\sin\\theta"
			},
			{
				label: "cos θ",
				latex: "\\cos\\theta"
			},
			{
				label: "tan θ",
				latex: "\\tan\\theta"
			},
			{
				label: "অসীম ∞",
				latex: "\\infty"
			},
			{
				label: "২×২ ম্যাট্রিক্স",
				latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}"
			},
			{
				label: "নির্ণায়ক",
				latex: "\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc"
			}
		]
	},
	{
		group: "গ্রিক বর্ণমালা",
		items: [
			{
				label: "α",
				latex: "\\alpha"
			},
			{
				label: "β",
				latex: "\\beta"
			},
			{
				label: "γ",
				latex: "\\gamma"
			},
			{
				label: "θ",
				latex: "\\theta"
			},
			{
				label: "π",
				latex: "\\pi"
			},
			{
				label: "Δ",
				latex: "\\Delta"
			},
			{
				label: "λ",
				latex: "\\lambda"
			},
			{
				label: "μ",
				latex: "\\mu"
			},
			{
				label: "σ",
				latex: "\\sigma"
			},
			{
				label: "ω",
				latex: "\\omega"
			},
			{
				label: "Ω",
				latex: "\\Omega"
			},
			{
				label: "φ",
				latex: "\\phi"
			}
		]
	}
];

export const PHYSICS_SNIPPETS: SnippetGroup[] = [{
	group: "ভেক্টর ও বলবিদ্যা",
	items: [
		{
			label: "ভেক্টর F",
			latex: "\\vec{F}"
		},
		{
			label: "একক ভেক্টর",
			latex: "\\hat{i}, \\hat{j}, \\hat{k}"
		},
		{
			label: "ভেক্টর মান",
			latex: "|\\vec{A}| = \\sqrt{A_x^2 + A_y^2}"
		},
		{
			label: "নিউটনের ২য় সূত্র",
			latex: "F = ma"
		},
		{
			label: "বেগের সমীকরণ",
			latex: "v = u + at"
		},
		{
			label: "সরণ সমীকরণ",
			latex: "s = ut + \\frac{1}{2}at^2"
		},
		{
			label: "বেগ-সরণ",
			latex: "v^2 = u^2 + 2as"
		},
		{
			label: "মহাকর্ষ বল",
			latex: "F = G\\frac{m_1 m_2}{r^2}"
		},
		{
			label: "গতিশক্তি",
			latex: "E_k = \\frac{1}{2}mv^2"
		},
		{
			label: "ভর-শক্তি",
			latex: "E = mc^2"
		}
	]
}, {
	group: "তরঙ্গ, তড়িৎ ও SI একক",
	items: [
		{
			label: "তরঙ্গ বেগ",
			latex: "v = f\\lambda"
		},
		{
			label: "ওহমের সূত্র",
			latex: "V = IR"
		},
		{
			label: "বলের ঘাত",
			latex: "J = F\\Delta t = \\Delta p"
		},
		{
			label: "ত্বরণের একক",
			latex: "\\text{m/s}^2"
		},
		{
			label: "ভরবেগ একক",
			latex: "\\text{kg}\\cdot\\text{m/s}"
		},
		{
			label: "মাত্রা [MLT⁻¹]",
			latex: "[MLT^{-1}]"
		},
		{
			label: "আলোর বেগ",
			latex: "3 \\times 10^{8}\\text{ m/s}"
		},
		{
			label: "অ্যাভোগাড্রো সংখ্যা",
			latex: "6.022 \\times 10^{23}"
		},
		{
			label: "তড়িৎ ভেদ্যতা",
			latex: "\\varepsilon_0"
		},
		{
			label: "ঘনত্ব ρ",
			latex: "\\rho = \\frac{m}{V}"
		}
	]
}];

export const CHEMISTRY_SNIPPETS: SnippetGroup[] = [{
	group: "রাসায়নিক সংকেত ও আয়ন",
	items: [
		{
			label: "পানি (H₂O)",
			latex: "\\ce{H2O}"
		},
		{
			label: "সালফিউরিক এসিড",
			latex: "\\ce{H2SO4}"
		},
		{
			label: "অ্যামোনিয়াম ক্লোরাইড",
			latex: "\\ce{NH4Cl}"
		},
		{
			label: "সোডিয়াম আয়ন",
			latex: "\\ce{Na+}"
		},
		{
			label: "ক্যালসিয়াম আয়ন",
			latex: "\\ce{Ca^{2+}}"
		},
		{
			label: "সালফেট আয়ন",
			latex: "\\ce{SO4^{2-}}"
		},
		{
			label: "অ্যামোনিয়াম আয়ন",
			latex: "\\ce{NH4+}"
		},
		{
			label: "ক্লোরাইড আয়ন",
			latex: "\\ce{Cl-}"
		},
		{
			label: "হাইড্রোক্সাইড",
			latex: "\\ce{OH-}"
		},
		{
			label: "আইসোটোপ",
			latex: "\\ce{^{235}_{92}U}"
		}
	]
}, {
	group: "রাসায়নিক বিক্রিয়া ও তীর চিহ্ন",
	items: [
		{
			label: "পানি গঠন বিক্রিয়া",
			latex: "\\ce{2H2 + O2 -> 2H2O}"
		},
		{
			label: "উভমুখী বিক্রিয়া",
			latex: "\\ce{N2 + 3H2 <=> 2NH3}"
		},
		{
			label: "প্রশমন বিক্রিয়া",
			latex: "\\ce{HCl + NaOH -> NaCl + H2O}"
		},
		{
			label: "তাপীয় বিয়োজন",
			latex: "\\ce{CaCO3 ->[\\Delta] CaO + CO2 ^}"
		},
		{
			label: "অধঃক্ষেপণ",
			latex: "\\ce{Ag+ + Cl- -> AgCl v}"
		},
		{
			label: "একমুখী তীর →",
			latex: "\\ce{->}"
		},
		{
			label: "উভমুখী তীর ⇌",
			latex: "\\ce{<=>}"
		},
		{
			label: "দ্বিবন্ধন (=)",
			latex: "\\ce{CH2=CH2}"
		},
		{
			label: "ত্রিবন্ধন (≡)",
			latex: "\\ce{HC#CH}"
		},
		{
			label: "pH সূত্র",
			latex: "\\text{pH} = -\\log[\\ce{H+}]"
		}
	]
}];

export interface FormulaEditorModalProps {
  open: boolean;
  targetLabel?: string;
  initialLatex?: string;
  onInsert: (formatted: string) => void;
  onClose: () => void;
}

export const FormulaEditorModal: React.FC<FormulaEditorModalProps> = ({
  open,
  targetLabel = "প্রশ্ন",
  initialLatex = "",
  onInsert,
  onClose
}) => {
  const [category, setCategory] = useState<"math" | "physics" | "chemistry">("math");
  const [latex, setLatex] = useState(initialLatex);
  const [displayMode, setDisplayMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const preview = useMemo(() => renderLatex(latex, displayMode), [latex, displayMode]);

  if (!open) return null;

  const activeGroups =
    category === "math"
      ? MATH_SNIPPETS
      : category === "physics"
      ? PHYSICS_SNIPPETS
      : CHEMISTRY_SNIPPETS;

  const insertSnippet = (snippet: string) => {
    const el = textareaRef.current;
    if (!el) {
      setLatex((prev) => (prev ? `${prev} ${snippet}` : snippet));
      return;
    }
    const start = el.selectionStart ?? latex.length;
    const end = el.selectionEnd ?? latex.length;
    const before = latex.slice(0, start);
    const after = latex.slice(end);
    const spacer = before && !before.endsWith(" ") && !before.endsWith("{") ? " " : "";
    const next = `${before}${spacer}${snippet}${after}`;
    setLatex(next);
    window.requestAnimationFrame(() => {
      el.focus();
      const caret = start + spacer.length + snippet.length;
      el.setSelectionRange(caret, caret);
    });
  };

  const formattedOutput = latex.trim()
    ? displayMode
      ? `$$${latex.trim()}$$`
      : `$${latex.trim()}$`
    : "";

  const handleConfirmInsert = () => {
    if (!formattedOutput) return;
    onInsert(formattedOutput);
    onClose();
  };

  const handleCopy = async () => {
    if (!formattedOutput) return;
    try {
      await navigator.clipboard.writeText(formattedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-[#0C0F16] border border-white/[0.10] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-blue-500/15 border border-blue-500/25 text-blue-400">
              <Sigma className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">
                ফর্মুলা এডিটর ও সিম্বল কিবোর্ড
              </h3>
              <p className="text-xs text-slate-400">
                {targetLabel}-এ KaTeX এবং mhchem ফর্মুলা যুক্ত করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Nav */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-2.5 bg-[#111622] border-b border-white/[0.08]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setCategory("math")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                category === "math"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              গণিত ও সাধারণ
            </button>
            <button
              type="button"
              onClick={() => setCategory("physics")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                category === "physics"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              পদার্থবিজ্ঞান
            </button>
            <button
              type="button"
              onClick={() => setCategory("chemistry")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                category === "chemistry"
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-white/[0.06]"
              }`}
            >
              রসায়ন (mhchem)
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={displayMode}
              onChange={(e) => setDisplayMode(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>ডিসপ্লে মোড ($$...$$)</span>
          </label>
        </div>

        {/* Snippets Palette */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-56 border-b border-white/[0.08]">
          {activeGroups.map((grp) => (
            <div key={grp.group}>
              <div className="text-[11px] font-semibold text-slate-400 mb-2">
                {grp.group}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {grp.items.map((it) => (
                  <button
                    key={it.label}
                    type="button"
                    onClick={() => insertSnippet(it.latex)}
                    title={it.latex}
                    className="px-2.5 py-1.5 rounded-lg border border-white/[0.08] bg-[#131824] hover:border-blue-500/60 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
                  >
                    <span>{it.label}</span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {it.latex.length > 15 ? it.latex.slice(0, 15) + "…" : it.latex}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Editor Textarea */}
        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                LaTeX ইনপুট কোড
              </label>
              <button
                type="button"
                onClick={() => setLatex("")}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>ক্লিয়ার</span>
              </button>
            </div>
            <textarea
              ref={textareaRef}
              rows={3}
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              placeholder="এখানে LaTeX কোড টাইপ করুন অথবা উপরের বাটনগুলোতে ক্লিক করুন..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-white/[0.10] bg-[#131824] text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-300">
                লাইভ প্রিভিউ
              </span>
              {preview.valid ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                  <CircleCheck className="w-3.5 h-3.5" />
                  <span>বৈধ LaTeX সিনট্যাক্স</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] text-rose-400">
                  <CircleAlert className="w-3.5 h-3.5" />
                  <span>{preview.error || "সিনট্যাক্স ত্রুটি"}</span>
                </span>
              )}
            </div>
            <div className="min-h-16 p-4 rounded-xl border border-white/[0.08] bg-[#06070B] flex items-center justify-center text-center overflow-x-auto">
              {latex.trim() ? (
                <div
                  className="math-text-root text-base sm:text-lg text-slate-100"
                  dangerouslySetInnerHTML={{ __html: preview.html }}
                />
              ) : (
                <span className="text-xs text-slate-500 italic">
                  ফর্মুলা লিখলে এখানে প্রিভিউ দেখা যাবে
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#111622] border-t border-white/[0.08]">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!latex.trim()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-white/[0.10] bg-[#131824] text-xs font-semibold text-slate-200 hover:border-white/[0.20] disabled:opacity-40 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "কপি হয়েছে!" : "কোড কপি করুন"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:bg-white/[0.06] transition-colors"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleConfirmInsert}
              disabled={!latex.trim() || !preview.valid}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ফর্মুলা ইনসার্ট করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
